import { useId } from "react";
import {
  type AvatarConfig,
  SKIN_OPTIONS,
  HAIR_OPTIONS,
  HAT_OPTIONS,
  TOP_OPTIONS,
  BOTTOMS_OPTIONS,
} from "@/lib/avatar";
import { cn } from "@/lib/utils";

interface Props {
  avatar: AvatarConfig;
  size?: number;       // pixel width
  compact?: boolean;   // head & shoulders only (square)
  className?: string;
}

function lookup<T extends { id: string }>(list: T[], id: string): T {
  return list.find((o) => o.id === id) ?? list[0];
}

// Approximate +brightness/-brightness shading by hex math.
function shade(hex: string, percent: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  let r = (n >> 16) & 0xff;
  let g = (n >> 8) & 0xff;
  let b = n & 0xff;
  r = Math.min(255, Math.max(0, Math.round(r + 255 * percent)));
  g = Math.min(255, Math.max(0, Math.round(g + 255 * percent)));
  b = Math.min(255, Math.max(0, Math.round(b + 255 * percent)));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

/**
 * Modular SVG avatar. Layered: bottoms → top → head → expression → hair → hat.
 * viewBox is 240×280 (full body) or 240×200 cropped (compact).
 */
export function PlayerAvatar({ avatar, size = 200, compact = false, className }: Props) {
  const uid = useId().replace(/[:]/g, "");
  const skin = lookup(SKIN_OPTIONS, avatar.skin);
  const hair = lookup(HAIR_OPTIONS, avatar.hair);
  const hat  = lookup(HAT_OPTIONS,  avatar.hat);
  const top  = lookup(TOP_OPTIONS,  avatar.top);
  const bot  = lookup(BOTTOMS_OPTIONS, avatar.bottoms);

  const skinDark  = shade(skin.color, -0.15);
  const skinLight = shade(skin.color, 0.08);
  const topDark   = shade(top.color, -0.20);
  const topLight  = shade(top.color, 0.12);
  const botDark   = shade(bot.color, -0.20);

  const viewBox = compact ? "0 0 240 200" : "0 0 240 280";
  const aspect = compact ? 200 / 240 : 280 / 240;

  return (
    <svg
      viewBox={viewBox}
      width={size}
      height={size * aspect}
      className={cn("select-none", className)}
      aria-label="Player avatar"
    >
      <defs>
        <linearGradient id={`skin-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={skinLight} />
          <stop offset="65%" stopColor={skin.color} />
          <stop offset="100%" stopColor={skinDark} />
        </linearGradient>
        <linearGradient id={`top-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={topLight} />
          <stop offset="60%" stopColor={top.color} />
          <stop offset="100%" stopColor={topDark} />
        </linearGradient>
        <linearGradient id={`bot-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={bot.color} />
          <stop offset="100%" stopColor={botDark} />
        </linearGradient>
      </defs>

      {/* ── Bottoms ── */}
      {!compact && <Bottoms id={avatar.bottoms} fill={`url(#bot-${uid})`} stroke={botDark} />}

      {/* ── Top / shirt ── */}
      <Top id={avatar.top} fill={`url(#top-${uid})`} stroke={topDark} />

      {/* Custom jersey label */}
      {avatar.topLabel && (
        <g transform="translate(120 165)">
          <text
            x={0}
            y={0}
            textAnchor="middle"
            fontFamily="system-ui, ui-sans-serif, sans-serif"
            fontWeight={800}
            fontSize={22}
            fill="#fff"
            stroke="rgba(0,0,0,0.35)"
            strokeWidth={0.6}
            style={{ paintOrder: "stroke" }}
            lengthAdjust="spacingAndGlyphs"
            textLength={Math.min(120, avatar.topLabel.length * 14)}
          >
            {avatar.topLabel}
          </text>
        </g>
      )}

      {/* ── Neck ── */}
      <rect x={108} y={120} width={24} height={18} rx={6} fill={skinDark} />

      {/* ── Head ── */}
      <ellipse cx={120} cy={80} rx={48} ry={52} fill={`url(#skin-${uid})`} />
      {/* Subtle cheek shading */}
      <ellipse cx={92}  cy={94} rx={9} ry={5} fill={skinDark} opacity={0.35} />
      <ellipse cx={148} cy={94} rx={9} ry={5} fill={skinDark} opacity={0.35} />

      {/* ── Ears ── (only show if hair allows) */}
      {(avatar.hair === "bald" || avatar.hair === "short" || avatar.hair === "ponytail") && (
        <>
          <ellipse cx={70}  cy={84} rx={8} ry={11} fill={skinDark} />
          <ellipse cx={170} cy={84} rx={8} ry={11} fill={skinDark} />
        </>
      )}

      {/* ── Expression ── */}
      <Expression id={avatar.expression} />

      {/* ── Hair ── (drawn after head so it overlaps the top of the skull) */}
      {hair.color && <Hair id={avatar.hair} color={hair.color} />}

      {/* ── Hat ── */}
      {hat.color && <Hat id={avatar.hat} color={hat.color} />}
    </svg>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function Bottoms({ id, fill, stroke }: { id: AvatarConfig["bottoms"]; fill: string; stroke: string }) {
  // Two leg shapes anchored under the torso.
  if (id === "shorts") {
    return (
      <g>
        <rect x={70}  y={210} width={40} height={48} rx={10} fill={fill} stroke={stroke} strokeWidth={1.5} />
        <rect x={130} y={210} width={40} height={48} rx={10} fill={fill} stroke={stroke} strokeWidth={1.5} />
      </g>
    );
  }
  return (
    <g>
      <rect x={70}  y={210} width={40} height={70} rx={10} fill={fill} stroke={stroke} strokeWidth={1.5} />
      <rect x={130} y={210} width={40} height={70} rx={10} fill={fill} stroke={stroke} strokeWidth={1.5} />
      {id === "slacks" && (
        <>
          <line x1={90}  y1={215} x2={90}  y2={278} stroke={stroke} strokeWidth={1} opacity={0.5} />
          <line x1={150} y1={215} x2={150} y2={278} stroke={stroke} strokeWidth={1} opacity={0.5} />
        </>
      )}
      {id === "sweats" && (
        <>
          <rect x={70}  y={264} width={40} height={14} rx={4} fill={stroke} opacity={0.6} />
          <rect x={130} y={264} width={40} height={14} rx={4} fill={stroke} opacity={0.6} />
        </>
      )}
    </g>
  );
}

function Top({ id, fill, stroke }: { id: AvatarConfig["top"]; fill: string; stroke: string }) {
  // Trapezoidal torso from neck to waist with rounded shoulders.
  // Anchor: shoulders at y=140, waist at y=215.
  const torsoPath = "M60 215 L70 145 Q80 130 105 130 L135 130 Q160 130 170 145 L180 215 Z";

  return (
    <g>
      {/* Hood for hoodie behind the torso */}
      {id === "hoodie" && (
        <path
          d="M55 150 Q120 95 185 150 L175 165 Q120 130 65 165 Z"
          fill={fill}
          stroke={stroke}
          strokeWidth={1.5}
        />
      )}
      <path d={torsoPath} fill={fill} stroke={stroke} strokeWidth={2} />

      {/* Variant details */}
      {id === "suit" && (
        <>
          {/* White shirt + V */}
          <path d="M105 130 L120 175 L135 130 Z" fill="#f3f4f6" />
          {/* Lapels */}
          <path d="M105 130 L80 215 L120 175 Z" fill={stroke} opacity={0.55} />
          <path d="M135 130 L160 215 L120 175 Z" fill={stroke} opacity={0.55} />
          {/* Bow tie */}
          <circle cx={120} cy={138} r={4} fill="#0b0b14" />
        </>
      )}
      {id === "jersey" && (
        <>
          <rect x={70}  y={155} width={20} height={55} fill="#fff" opacity={0.85} />
          <rect x={150} y={155} width={20} height={55} fill="#fff" opacity={0.85} />
        </>
      )}
      {id === "racing" && (
        <>
          <rect x={114} y={130} width={12} height={85} fill="#0b0b14" />
          <rect x={94}  y={130} width={6}  height={85} fill="#0b0b14" />
          <rect x={140} y={130} width={6}  height={85} fill="#0b0b14" />
        </>
      )}
      {id === "hoodie" && (
        <>
          {/* Drawstrings */}
          <line x1={114} y1={140} x2={112} y2={170} stroke="#fff" strokeWidth={2} opacity={0.7} />
          <line x1={126} y1={140} x2={128} y2={170} stroke="#fff" strokeWidth={2} opacity={0.7} />
          {/* Pocket */}
          <rect x={88} y={180} width={64} height={22} rx={4} fill={stroke} opacity={0.4} />
        </>
      )}
    </g>
  );
}

function Expression({ id }: { id: AvatarConfig["expression"] }) {
  // Eyes baseline y=80, mouth y=105.
  switch (id) {
    case "smile":
      return (
        <g>
          <circle cx={102} cy={80} r={4} fill="#0b0b14" />
          <circle cx={138} cy={80} r={4} fill="#0b0b14" />
          <path d="M100 102 Q120 118 140 102" stroke="#0b0b14" strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
      );
    case "smirk":
      return (
        <g>
          <circle cx={102} cy={80} r={4} fill="#0b0b14" />
          <circle cx={138} cy={80} r={4} fill="#0b0b14" />
          <path d="M100 108 Q122 100 140 100" stroke="#0b0b14" strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
      );
    case "shades":
      return (
        <g>
          <rect x={86} y={70} width={68} height={16} rx={6} fill="#0b0b14" />
          {/* Bridge */}
          <line x1={120} y1={78} x2={120} y2={78} stroke="#0b0b14" strokeWidth={4} />
          {/* Shine */}
          <rect x={92} y={73} width={10} height={3} rx={1} fill="#fff" opacity={0.4} />
          <rect x={138} y={73} width={10} height={3} rx={1} fill="#fff" opacity={0.4} />
          <path d="M100 105 Q120 110 140 105" stroke="#0b0b14" strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
      );
    case "monocle":
      return (
        <g>
          <circle cx={102} cy={80} r={3} fill="#0b0b14" />
          <circle cx={138} cy={80} r={3} fill="#0b0b14" />
          <circle cx={138} cy={80} r={11} fill="none" stroke="#fbbf24" strokeWidth={2.5} />
          <line x1={148} y1={88} x2={156} y2={120} stroke="#fbbf24" strokeWidth={1.5} />
          <path d="M100 105 Q120 113 140 105" stroke="#0b0b14" strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
      );
    case "wink":
      return (
        <g>
          <path d="M96 80 L108 80" stroke="#0b0b14" strokeWidth={3} strokeLinecap="round" />
          <circle cx={138} cy={80} r={4} fill="#0b0b14" />
          <path d="M100 102 Q120 116 140 102" stroke="#0b0b14" strokeWidth={3} strokeLinecap="round" fill="none" />
        </g>
      );
  }
}

function Hair({ id, color }: { id: AvatarConfig["hair"]; color: string }) {
  const dark = shade(color, -0.2);
  switch (id) {
    case "bald":
      return null;
    case "short":
      return (
        <g>
          <path d="M72 78 Q72 28 120 28 Q168 28 168 78 Q168 60 120 56 Q72 60 72 78 Z" fill={color} />
          <path d="M72 78 Q120 50 168 78" fill="none" stroke={dark} strokeWidth={1} opacity={0.6} />
        </g>
      );
    case "long":
      return (
        <g>
          <path d="M72 90 Q72 26 120 26 Q168 26 168 90 L168 160 L150 160 L150 80 Q120 60 90 80 L90 160 L72 160 Z" fill={color} />
          {/* Bangs */}
          <path d="M88 60 Q120 78 152 60 Q140 78 120 78 Q100 78 88 60 Z" fill={dark} opacity={0.85} />
        </g>
      );
    case "curly":
      return (
        <g fill={color}>
          <circle cx={86}  cy={48} r={14} />
          <circle cx={108} cy={36} r={15} />
          <circle cx={132} cy={36} r={15} />
          <circle cx={154} cy={48} r={14} />
          <circle cx={72}  cy={66} r={13} />
          <circle cx={168} cy={66} r={13} />
          <circle cx={120} cy={32} r={14} />
        </g>
      );
    case "mohawk":
      return (
        <g>
          <path d="M108 16 L132 16 L138 60 L102 60 Z" fill={color} />
          <path d="M108 16 L132 16 L130 36 L110 36 Z" fill={dark} opacity={0.6} />
        </g>
      );
    case "ponytail":
      return (
        <g>
          {/* Cap */}
          <path d="M74 76 Q74 30 120 30 Q166 30 166 76 Q166 60 120 56 Q74 60 74 76 Z" fill={color} />
          {/* Bun + tail behind head */}
          <ellipse cx={170} cy={70} rx={12} ry={14} fill={color} />
          <path d="M178 76 Q200 110 188 150 L172 150 Q186 110 170 80 Z" fill={color} />
          <path d="M180 80 Q198 110 188 148" fill="none" stroke={dark} strokeWidth={1} opacity={0.6} />
        </g>
      );
  }
}

function Hat({ id, color }: { id: AvatarConfig["hat"]; color: string }) {
  const dark = shade(color, -0.25);
  switch (id) {
    case "none":
      return null;
    case "cap":
      return (
        <g>
          <path d="M74 50 Q74 18 120 18 Q166 18 166 50 L166 56 L74 56 Z" fill={color} stroke={dark} strokeWidth={1} />
          <path d="M166 50 L210 60 L210 70 L166 60 Z" fill={dark} />
          <circle cx={120} cy={32} r={5} fill="#fff" opacity={0.85} />
        </g>
      );
    case "beanie":
      return (
        <g>
          <path d="M68 56 Q68 12 120 12 Q172 12 172 56 L172 64 L68 64 Z" fill={color} stroke={dark} strokeWidth={1} />
          <rect x={64} y={58} width={112} height={14} rx={3} fill={dark} />
          <circle cx={120} cy={10} r={6} fill={color} stroke={dark} strokeWidth={1} />
        </g>
      );
    case "tophat":
      return (
        <g>
          <rect x={86} y={-12} width={68} height={50} rx={2} fill={color} />
          <rect x={70} y={36} width={100} height={10} rx={2} fill={color} stroke={dark} strokeWidth={1} />
          <rect x={86} y={20} width={68} height={6} fill="#dc2626" />
        </g>
      );
    case "crown":
      return (
        <g>
          <path d="M76 52 L76 24 L98 38 L120 16 L142 38 L164 24 L164 52 Z" fill={color} stroke="#92400e" strokeWidth={1.5} />
          <rect x={76} y={52} width={88} height={8} fill={color} stroke="#92400e" strokeWidth={1} />
          <circle cx={98}  cy={42} r={3} fill="#dc2626" />
          <circle cx={120} cy={28} r={3} fill="#10b981" />
          <circle cx={142} cy={42} r={3} fill="#3b82f6" />
        </g>
      );
  }
}
