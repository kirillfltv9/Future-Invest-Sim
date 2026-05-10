import { useEffect, useRef } from "react";
import {
  ACHIEVEMENTS,
  unlockAchievement,
  type Achievement,
  type AchievementId,
} from "./achievements";
import type { PlayerHolding, RoomState, LeaderboardEntry, PlayerView } from "./multiplayerSocket";

interface Args {
  room: RoomState | null;
  you: PlayerView | null;
  myPlayerId: string | null;
  startingCash: number;
  onUnlock: (a: Achievement) => void;
}

interface RoundHoldingTrack {
  ticker: string;
  rounds: number;
}

/** Watches game state for achievement triggers and fires onUnlock once each. */
export function useAchievementDetector({
  room, you, myPlayerId, startingCash, onUnlock,
}: Args): void {
  const tradeCountRef = useRef(0);
  const lastHoldingsRef = useRef<Map<string, number>>(new Map());
  const heldRoundsRef = useRef<Map<string, RoundHoldingTrack>>(new Map());
  const lastRoundRef = useRef<number>(-1);
  const lastPricesRef = useRef<Map<string, number>>(new Map());
  const myLastRankRef = useRef<number | null>(null);
  const finalizedRef = useRef(false);

  // Track trade count by detecting holdings shares changes
  useEffect(() => {
    if (!you) return;
    const newMap = new Map<string, number>();
    you.holdings.forEach((h) => newMap.set(h.ticker, h.shares));

    let didTrade = false;
    // any change vs last snapshot?
    const old = lastHoldingsRef.current;
    if (old.size !== newMap.size) didTrade = true;
    if (!didTrade) {
      for (const [t, s] of newMap) {
        if (old.get(t) !== s) { didTrade = true; break; }
      }
    }

    if (didTrade) {
      tradeCountRef.current += 1;
      if (tradeCountRef.current === 1) {
        fire("first_trade", onUnlock);
      }

      // Buy the dip — if a stock previously dropped 20%+ and is now in our holdings new/larger
      if (room) {
        for (const h of you.holdings) {
          const prevShares = old.get(h.ticker) ?? 0;
          if (h.shares > prevShares) {
            const tick = room.prices.find((p) => p.ticker === h.ticker);
            if (tick && tick.changePercent <= -20) {
              fire("buy_the_dip", onUnlock);
            }
          }
        }
      }
    }

    lastHoldingsRef.current = newMap;
  }, [you, room, onUnlock]);

  // Diversified — owning 5+ unique stocks
  useEffect(() => {
    if (!you) return;
    const unique = you.holdings.filter((h) => h.shares > 0).length;
    if (unique >= 5) fire("diversified", onUnlock);
  }, [you, onUnlock]);

  // First Million / Rags to Riches — total value
  useEffect(() => {
    if (!room || !myPlayerId) return;
    const me = room.leaderboard.find((e) => e.playerId === myPlayerId);
    if (!me) return;
    if (me.totalValue >= 1_000_000) fire("first_million", onUnlock);
    if (startingCash > 0 && me.totalValue >= startingCash * 2) fire("rags_to_riches", onUnlock);
  }, [room, myPlayerId, startingCash, onUnlock]);

  // Diamond Hands — same stock held 3+ rounds
  useEffect(() => {
    if (!room || !you) return;
    if (room.currentRound === lastRoundRef.current) return; // only on round transitions
    lastRoundRef.current = room.currentRound;

    const heldNow = new Set(you.holdings.filter((h) => h.shares > 0).map((h) => h.ticker));
    // Increment for tickers still held
    for (const t of heldNow) {
      const cur = heldRoundsRef.current.get(t) ?? { ticker: t, rounds: 0 };
      cur.rounds += 1;
      heldRoundsRef.current.set(t, cur);
      if (cur.rounds >= 3) fire("diamond_hands", onUnlock);
    }
    // Drop tickers no longer held
    for (const t of Array.from(heldRoundsRef.current.keys())) {
      if (!heldNow.has(t)) heldRoundsRef.current.delete(t);
    }
  }, [room, you, onUnlock]);

  // Comeback Kid — rank improvement of 3+
  useEffect(() => {
    if (!room || !myPlayerId) return;
    const me = room.leaderboard.find((e) => e.playerId === myPlayerId);
    if (!me) return;
    const prev = myLastRankRef.current;
    if (prev !== null && prev - me.rank >= 3) {
      fire("comeback_kid", onUnlock);
    }
    myLastRankRef.current = me.rank;
  }, [room, myPlayerId, onUnlock]);

  // Top Trader — finished in 1st
  useEffect(() => {
    if (!room || !myPlayerId) return;
    if (room.status !== "finished") return;
    if (finalizedRef.current) return;
    const sorted = [...room.leaderboard].sort((a: LeaderboardEntry, b: LeaderboardEntry) => b.totalValue - a.totalValue);
    if (sorted[0]?.playerId === myPlayerId) {
      fire("top_trader", onUnlock);
    }
    finalizedRef.current = true;
  }, [room, myPlayerId, onUnlock]);

  // Track last prices (so future detectors can use it)
  useEffect(() => {
    if (!room) return;
    const m = new Map<string, number>();
    room.prices.forEach((p) => m.set(p.ticker, p.price));
    lastPricesRef.current = m;
  }, [room]);
}

function fire(id: AchievementId, onUnlock: (a: Achievement) => void): void {
  if (unlockAchievement(id)) {
    onUnlock(ACHIEVEMENTS[id]);
  }
}

// Helpful re-exports for consumers of this hook
export type { Achievement, PlayerHolding };
