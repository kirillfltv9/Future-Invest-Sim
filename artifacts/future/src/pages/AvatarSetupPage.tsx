import { useMemo } from "react";
import { Redirect, useLocation } from "wouter";
import { AvatarBuilder } from "@/components/AvatarBuilder";
import {
  getMultiplayerIntent,
  setMultiplayerIntent,
} from "@/lib/multiplayerSocket";
import { loadStoredAvatar, saveStoredAvatar, type AvatarConfig } from "@/lib/avatar";

export function AvatarSetupPage() {
  const [, setLocation] = useLocation();
  const intent = useMemo(() => getMultiplayerIntent(), []);

  // Guard: if there's no pending intent, redirect synchronously (no blank frame).
  if (!intent) return <Redirect to="/setup" />;

  const initial = loadStoredAvatar();

  const onConfirm = (avatar: AvatarConfig) => {
    saveStoredAvatar(avatar);
    setMultiplayerIntent({ ...intent, avatar });
    setLocation("/multiplayer");
  };

  return (
    <AvatarBuilder
      initialAvatar={initial}
      playerName={intent.playerName}
      onConfirm={onConfirm}
      confirmLabel={intent.mode === "host" ? "Save & Create Room" : "Save & Join Game"}
    />
  );
}
