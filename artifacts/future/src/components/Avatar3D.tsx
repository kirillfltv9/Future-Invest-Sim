import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Text, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import {
  type AvatarConfig,
  SKIN_OPTIONS, HAIR_OPTIONS, HAT_OPTIONS, TOP_OPTIONS, BOTTOMS_OPTIONS, SHOES_OPTIONS,
} from "@/lib/avatar";

interface Props {
  avatar: AvatarConfig;
  size?: number;       // pixel width / height
  interactive?: boolean; // allow drag to rotate
  autoRotate?: boolean;
  className?: string;
}

function lookup<T extends { id: string }>(opts: T[], id: string): T {
  return opts.find((o) => o.id === id) ?? opts[0];
}

function shade(hex: string, amount: number): string {
  const c = new THREE.Color(hex);
  c.offsetHSL(0, 0, amount);
  return `#${c.getHexString()}`;
}

/** 3D avatar built from primitives, mirroring the same outfit options as the
 *  2D PlayerAvatar so customizations look identical in palette and silhouette. */
export function Avatar3D({
  avatar, size = 320, interactive = true, autoRotate = true, className,
}: Props) {
  return (
    <div
      className={className}
      style={{ width: size, height: size, touchAction: "none" }}
    >
      <Canvas
        shadows={false}
        dpr={[1, 2]}
        camera={{ position: [0, 1.4, 4.2], fov: 32 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lights */}
        <ambientLight intensity={0.55} />
        <directionalLight position={[3, 5, 4]} intensity={1.1} color="#fff8e6" />
        <directionalLight position={[-4, 2, -2]} intensity={0.45} color="#7c9cff" />
        <pointLight position={[0, -2, 3]} intensity={0.35} color="#ffd5a8" />

        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0} floatIntensity={0.35}>
            <Character avatar={avatar} />
          </Float>
          <ContactShadows
            position={[0, -1.65, 0]}
            opacity={0.45}
            scale={5}
            blur={2.4}
            far={3}
            color="#000000"
          />
        </Suspense>

        {interactive && (
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            autoRotate={autoRotate}
            autoRotateSpeed={1.6}
            minPolarAngle={Math.PI / 2.6}
            maxPolarAngle={Math.PI / 1.7}
          />
        )}
      </Canvas>
    </div>
  );
}

function Character({ avatar }: { avatar: AvatarConfig }) {
  const skin    = lookup(SKIN_OPTIONS, avatar.skin);
  const hair    = lookup(HAIR_OPTIONS, avatar.hair);
  const hat     = lookup(HAT_OPTIONS,  avatar.hat);
  const top     = lookup(TOP_OPTIONS,  avatar.top);
  const bottoms = lookup(BOTTOMS_OPTIONS, avatar.bottoms);
  const shoes   = lookup(SHOES_OPTIONS, avatar.shoes);

  const skinDark  = shade(skin.color, -0.12);
  const topDark   = shade(top.color,  -0.18);

  return (
    <group position={[0, -1.0, 0]}>
      {/* ── Legs ─────────────────────────────────────────────────────── */}
      <Legs id={avatar.bottoms} color={bottoms.color} darkColor={shade(bottoms.color, -0.18)} />

      {/* ── Shoes ────────────────────────────────────────────────────── */}
      <Shoes id={avatar.shoes} color={shoes.color} skinColor={skin.color} bottomsId={avatar.bottoms} />

      {/* ── Torso / top ──────────────────────────────────────────────── */}
      <Torso id={avatar.top} color={top.color} darkColor={topDark} label={avatar.topLabel} />

      {/* ── Arms ─────────────────────────────────────────────────────── */}
      <Arms topColor={top.color} skinColor={skin.color} skinDark={skinDark} topId={avatar.top} />

      {/* ── Neck ─────────────────────────────────────────────────────── */}
      <mesh position={[0, 1.55, 0]}>
        <cylinderGeometry args={[0.22, 0.26, 0.22, 24]} />
        <meshStandardMaterial color={skinDark} roughness={0.7} />
      </mesh>

      {/* ── Head ─────────────────────────────────────────────────────── */}
      <mesh position={[0, 1.95, 0]} castShadow>
        <sphereGeometry args={[0.55, 48, 48]} />
        <meshStandardMaterial color={skin.color} roughness={0.55} metalness={0.05} />
      </mesh>

      {/* Ears */}
      <mesh position={[-0.55, 1.95, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={skinDark} roughness={0.7} />
      </mesh>
      <mesh position={[0.55, 1.95, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={skinDark} roughness={0.7} />
      </mesh>

      {/* ── Face: eyes + mouth (expression) ──────────────────────────── */}
      <Face id={avatar.expression} />

      {/* ── Hair ─────────────────────────────────────────────────────── */}
      <Hair id={avatar.hair} color={hair.color ?? "#000000"} />

      {/* ── Hat ──────────────────────────────────────────────────────── */}
      <Hat id={avatar.hat} color={hat.color ?? "#000000"} />
    </group>
  );
}

// ─── Legs ─────────────────────────────────────────────────────────────────

function Legs({ id, color, darkColor }: { id: AvatarConfig["bottoms"]; color: string; darkColor: string }) {
  const isShorts = id === "shorts";
  const height = isShorts ? 0.55 : 1.1;
  const yCenter = -0.7 + (1.1 - height) / 2;

  return (
    <group>
      {/* Hips/waistband */}
      <mesh position={[0, -0.15, 0]}>
        <boxGeometry args={[0.95, 0.18, 0.55]} />
        <meshStandardMaterial color={darkColor} roughness={0.8} />
      </mesh>
      <mesh position={[-0.24, yCenter, 0]}>
        <cylinderGeometry args={[0.2, 0.18, height, 24]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
      <mesh position={[0.24, yCenter, 0]}>
        <cylinderGeometry args={[0.2, 0.18, height, 24]} />
        <meshStandardMaterial color={color} roughness={0.85} />
      </mesh>
    </group>
  );
}

// ─── Shoes ────────────────────────────────────────────────────────────────

function Shoes({
  id, color, skinColor, bottomsId,
}: {
  id: AvatarConfig["shoes"]; color: string; skinColor: string; bottomsId: AvatarConfig["bottoms"];
}) {
  const isShorts = bottomsId === "shorts";
  const calfY = -0.7;

  // For shorts, render skin-colored calves between the shorts hem and the shoe top.
  const calves = isShorts ? (
    <>
      <mesh position={[-0.24, calfY, 0]}>
        <cylinderGeometry args={[0.16, 0.15, 0.5, 20]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.24, calfY, 0]}>
        <cylinderGeometry args={[0.16, 0.15, 0.5, 20]} />
        <meshStandardMaterial color={skinColor} roughness={0.7} />
      </mesh>
    </>
  ) : null;

  if (id === "barefoot") {
    return (
      <group>
        {calves}
        {/* Bare feet */}
        {[-0.24, 0.24].map((x) => (
          <mesh key={x} position={[x, -1.45, 0.12]}>
            <boxGeometry args={[0.32, 0.18, 0.5]} />
            <meshStandardMaterial color={skinColor} roughness={0.7} />
          </mesh>
        ))}
      </group>
    );
  }

  if (id === "boots") {
    return (
      <group>
        {calves}
        {[-0.24, 0.24].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            {/* Tall shaft */}
            <mesh position={[0, -1.0, 0]}>
              <cylinderGeometry args={[0.21, 0.21, 0.55, 24]} />
              <meshStandardMaterial color={color} roughness={0.5} metalness={0.15} />
            </mesh>
            {/* Toe box */}
            <mesh position={[0, -1.43, 0.14]}>
              <boxGeometry args={[0.36, 0.22, 0.55]} />
              <meshStandardMaterial color={color} roughness={0.5} metalness={0.15} />
            </mesh>
            {/* Sole */}
            <mesh position={[0, -1.55, 0.14]}>
              <boxGeometry args={[0.38, 0.06, 0.58]} />
              <meshStandardMaterial color="#0f0f0f" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (id === "heels") {
    return (
      <group>
        {calves}
        {[-0.24, 0.24].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            <mesh position={[0, -1.43, 0.18]}>
              <boxGeometry args={[0.3, 0.16, 0.55]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Heel spike */}
            <mesh position={[0, -1.6, -0.05]}>
              <cylinderGeometry args={[0.04, 0.04, 0.25, 12]} />
              <meshStandardMaterial color={color} roughness={0.3} metalness={0.2} />
            </mesh>
            {/* Sole */}
            <mesh position={[0, -1.52, 0.18]}>
              <boxGeometry args={[0.32, 0.04, 0.58]} />
              <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  if (id === "sandals") {
    return (
      <group>
        {calves}
        {[-0.24, 0.24].map((x) => (
          <group key={x} position={[x, 0, 0]}>
            {/* Foot (skin) */}
            <mesh position={[0, -1.43, 0.12]}>
              <boxGeometry args={[0.3, 0.16, 0.5]} />
              <meshStandardMaterial color={skinColor} roughness={0.7} />
            </mesh>
            {/* Sole */}
            <mesh position={[0, -1.53, 0.12]}>
              <boxGeometry args={[0.34, 0.05, 0.54]} />
              <meshStandardMaterial color={color} roughness={0.7} />
            </mesh>
            {/* Strap across top */}
            <mesh position={[0, -1.36, 0.12]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.32, 0.05, 0.18]} />
              <meshStandardMaterial color={color} roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>
    );
  }

  // sneakers (default)
  return (
    <group>
      {calves}
      {[-0.24, 0.24].map((x) => (
        <group key={x} position={[x, 0, 0]}>
          <mesh position={[0, -1.43, 0.16]}>
            <boxGeometry args={[0.36, 0.22, 0.6]} />
            <meshStandardMaterial color={color} roughness={0.6} />
          </mesh>
          {/* Toe cap */}
          <mesh position={[0, -1.43, 0.42]}>
            <boxGeometry args={[0.34, 0.2, 0.1]} />
            <meshStandardMaterial color="#dc2626" roughness={0.6} />
          </mesh>
          {/* Sole */}
          <mesh position={[0, -1.55, 0.16]}>
            <boxGeometry args={[0.4, 0.06, 0.62]} />
            <meshStandardMaterial color="#1f2937" roughness={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Torso ────────────────────────────────────────────────────────────────

function Torso({
  id, color, darkColor, label,
}: {
  id: AvatarConfig["top"]; color: string; darkColor: string; label: string;
}) {
  // Slightly different torso shape per top
  const isSuit = id === "suit";
  const isHoodie = id === "hoodie";
  const torsoWidth = isHoodie ? 1.25 : 1.15;
  const torsoDepth = 0.6;

  return (
    <group>
      {/* Main torso */}
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[torsoWidth, 1.4, torsoDepth]} />
        <meshStandardMaterial color={color} roughness={0.8} metalness={isSuit ? 0.15 : 0} />
      </mesh>

      {/* Suit collar/lapels */}
      {isSuit && (
        <>
          <mesh position={[-0.18, 1.25, 0.31]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.18, 0.5, 0.04]} />
            <meshStandardMaterial color={darkColor} />
          </mesh>
          <mesh position={[0.18, 1.25, 0.31]} rotation={[0, 0, -0.3]}>
            <boxGeometry args={[0.18, 0.5, 0.04]} />
            <meshStandardMaterial color={darkColor} />
          </mesh>
          {/* White shirt */}
          <mesh position={[0, 1.2, 0.31]}>
            <boxGeometry args={[0.2, 0.4, 0.02]} />
            <meshStandardMaterial color="#f5f5f5" />
          </mesh>
          {/* Tie */}
          <mesh position={[0, 0.95, 0.32]}>
            <boxGeometry args={[0.12, 0.7, 0.02]} />
            <meshStandardMaterial color="#dc2626" />
          </mesh>
        </>
      )}

      {/* Hoodie hood */}
      {isHoodie && (
        <mesh position={[0, 1.6, -0.15]}>
          <sphereGeometry args={[0.6, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.6]} />
          <meshStandardMaterial color={darkColor} roughness={0.85} />
        </mesh>
      )}

      {/* Jersey label across chest */}
      {label && (
        <Text
          position={[0, 0.85, torsoDepth / 2 + 0.01]}
          fontSize={0.22}
          color="#ffffff"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.012}
          outlineColor="#000000"
          maxWidth={1.0}
        >
          {label}
        </Text>
      )}

      {/* Racing stripes for racing top */}
      {id === "racing" && (
        <>
          <mesh position={[-0.18, 0.65, 0.31]}>
            <boxGeometry args={[0.08, 1.4, 0.02]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          <mesh position={[0.18, 0.65, 0.31]}>
            <boxGeometry args={[0.08, 1.4, 0.02]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
        </>
      )}
    </group>
  );
}

// ─── Arms ─────────────────────────────────────────────────────────────────

function Arms({
  topColor, skinColor, skinDark, topId,
}: {
  topColor: string; skinColor: string; skinDark: string; topId: AvatarConfig["top"];
}) {
  // Sleeve length per top
  const sleeveLen = topId === "tee" || topId === "jersey" ? 0.4 : 1.0;
  const armLen = 1.1;
  const handLen = armLen - sleeveLen;
  const sleeveY = 0.85 - sleeveLen / 2;
  const handY  = 0.85 - sleeveLen - handLen / 2;

  return (
    <group>
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.7, 0, 0]}>
          {/* Sleeve */}
          <mesh position={[0, sleeveY, 0]}>
            <cylinderGeometry args={[0.16, 0.15, sleeveLen, 20]} />
            <meshStandardMaterial color={topColor} roughness={0.8} />
          </mesh>
          {/* Forearm/skin */}
          <mesh position={[0, handY, 0]}>
            <cylinderGeometry args={[0.13, 0.12, handLen, 20]} />
            <meshStandardMaterial color={skinColor} roughness={0.7} />
          </mesh>
          {/* Hand */}
          <mesh position={[0, handY - handLen / 2 - 0.07, 0]}>
            <sphereGeometry args={[0.15, 20, 20]} />
            <meshStandardMaterial color={skinDark} roughness={0.7} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ─── Face ─────────────────────────────────────────────────────────────────

function Face({ id }: { id: AvatarConfig["expression"] }) {
  const eyeZ = 0.5;
  const eyeY = 2.05;
  const mouthY = 1.78;

  const renderEyes = () => {
    if (id === "shades") {
      return (
        <>
          {/* Sunglasses bar */}
          <mesh position={[0, eyeY, eyeZ + 0.02]}>
            <boxGeometry args={[0.65, 0.22, 0.05]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.2} metalness={0.5} />
          </mesh>
          {/* Bridge */}
          <mesh position={[0, eyeY, eyeZ + 0.04]}>
            <boxGeometry args={[0.7, 0.04, 0.02]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </>
      );
    }
    if (id === "monocle") {
      return (
        <>
          {/* Left eye */}
          <mesh position={[-0.18, eyeY, eyeZ]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          {/* Monocle ring */}
          <mesh position={[0.18, eyeY, eyeZ + 0.01]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.13, 0.025, 12, 24]} />
            <meshStandardMaterial color="#fbbf24" metalness={0.7} roughness={0.25} />
          </mesh>
          {/* Eye behind monocle */}
          <mesh position={[0.18, eyeY, eyeZ]}>
            <sphereGeometry args={[0.05, 16, 16]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </>
      );
    }
    // Standard eyes (smile/smirk/wink)
    return (
      <>
        <mesh position={[-0.18, eyeY, eyeZ]}>
          <sphereGeometry args={[0.07, 16, 16]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {id === "wink" ? (
          <mesh position={[0.18, eyeY, eyeZ]}>
            <boxGeometry args={[0.16, 0.025, 0.03]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        ) : (
          <mesh position={[0.18, eyeY, eyeZ]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        )}
      </>
    );
  };

  // Mouth
  const mouth = (() => {
    if (id === "smirk") {
      return (
        <mesh position={[0.05, mouthY, eyeZ]} rotation={[0, 0, 0.18]}>
          <boxGeometry args={[0.22, 0.04, 0.03]} />
          <meshStandardMaterial color="#7a2222" />
        </mesh>
      );
    }
    if (id === "shades") {
      return (
        <mesh position={[0, mouthY, eyeZ]}>
          <boxGeometry args={[0.28, 0.04, 0.03]} />
          <meshStandardMaterial color="#7a2222" />
        </mesh>
      );
    }
    // Smile (default)
    return (
      <group position={[0, mouthY - 0.04, eyeZ]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.16, 0.03, 12, 24, Math.PI]} />
          <meshStandardMaterial color="#7a2222" />
        </mesh>
      </group>
    );
  })();

  return <group>{renderEyes()}{mouth}</group>;
}

// ─── Hair ─────────────────────────────────────────────────────────────────

function Hair({ id, color }: { id: AvatarConfig["hair"]; color: string }) {
  if (id === "bald") return null;

  if (id === "short") {
    return (
      <mesh position={[0, 2.25, -0.05]}>
        <sphereGeometry args={[0.58, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    );
  }

  if (id === "long") {
    return (
      <group>
        {/* Top */}
        <mesh position={[0, 2.2, -0.05]}>
          <sphereGeometry args={[0.6, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.8]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        {/* Long sides hanging down to shoulders */}
        <mesh position={[-0.5, 1.5, -0.1]}>
          <boxGeometry args={[0.18, 0.9, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        <mesh position={[0.5, 1.5, -0.1]}>
          <boxGeometry args={[0.18, 0.9, 0.5]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      </group>
    );
  }

  if (id === "curly") {
    // A puff of small spheres
    const puffs: [number, number, number][] = [
      [0, 2.4, 0], [-0.3, 2.35, 0.05], [0.3, 2.35, 0.05],
      [-0.45, 2.2, -0.1], [0.45, 2.2, -0.1], [0, 2.45, -0.15],
      [-0.2, 2.5, -0.1], [0.2, 2.5, -0.1], [0, 2.3, 0.4],
    ];
    return (
      <group>
        {puffs.map((p, i) => (
          <mesh key={i} position={p}>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshStandardMaterial color={color} roughness={0.95} />
          </mesh>
        ))}
      </group>
    );
  }

  if (id === "mohawk") {
    return (
      <group>
        {/* Sides shaved (very thin) */}
        <mesh position={[0, 2.2, -0.05]}>
          <sphereGeometry args={[0.56, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2.5]} />
          <meshStandardMaterial color={shade(color, -0.3)} roughness={0.95} />
        </mesh>
        {/* Spike */}
        <mesh position={[0, 2.65, 0]}>
          <coneGeometry args={[0.18, 0.7, 6]} />
          <meshStandardMaterial color={color} roughness={0.85} />
        </mesh>
      </group>
    );
  }

  if (id === "ponytail") {
    return (
      <group>
        <mesh position={[0, 2.2, -0.05]}>
          <sphereGeometry args={[0.58, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
        {/* Tail behind */}
        <mesh position={[0, 1.7, -0.55]} rotation={[0.4, 0, 0]}>
          <cylinderGeometry args={[0.12, 0.06, 0.9, 16]} />
          <meshStandardMaterial color={color} roughness={0.9} />
        </mesh>
      </group>
    );
  }

  return null;
}

// ─── Hat ──────────────────────────────────────────────────────────────────

function Hat({ id, color }: { id: AvatarConfig["hat"]; color: string }) {
  if (id === "none") return null;

  if (id === "cap") {
    return (
      <group position={[0, 2.4, 0]}>
        {/* Crown */}
        <mesh>
          <sphereGeometry args={[0.55, 24, 24, 0, Math.PI * 2, 0, Math.PI / 2.2]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
        {/* Brim */}
        <mesh position={[0, -0.05, 0.4]}>
          <boxGeometry args={[0.7, 0.06, 0.4]} />
          <meshStandardMaterial color={color} roughness={0.7} />
        </mesh>
      </group>
    );
  }

  if (id === "beanie") {
    return (
      <group position={[0, 2.35, 0]}>
        <mesh>
          <sphereGeometry args={[0.6, 24, 24, 0, Math.PI * 2, 0, Math.PI / 1.7]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>
        {/* Cuff */}
        <mesh position={[0, -0.18, 0]}>
          <torusGeometry args={[0.6, 0.08, 12, 24]} />
          <meshStandardMaterial color={shade(color, -0.2)} roughness={0.95} />
        </mesh>
        {/* Pom */}
        <mesh position={[0, 0.4, 0]}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial color="#f5f5f5" roughness={0.9} />
        </mesh>
      </group>
    );
  }

  if (id === "tophat") {
    return (
      <group position={[0, 2.55, 0]}>
        {/* Brim */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.7, 0.7, 0.06, 32]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
        </mesh>
        {/* Cylinder */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.45, 0.45, 0.7, 32]} />
          <meshStandardMaterial color={color} roughness={0.5} metalness={0.1} />
        </mesh>
        {/* Band */}
        <mesh position={[0, -0.04, 0]}>
          <cylinderGeometry args={[0.46, 0.46, 0.08, 32]} />
          <meshStandardMaterial color="#dc2626" />
        </mesh>
      </group>
    );
  }

  if (id === "crown") {
    const points: [number, number, number][] = [];
    const N = 8;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * Math.PI * 2;
      points.push([Math.cos(a) * 0.5, 0.15, Math.sin(a) * 0.5]);
    }
    return (
      <group position={[0, 2.45, 0]}>
        {/* Base ring */}
        <mesh>
          <cylinderGeometry args={[0.55, 0.55, 0.18, 32]} />
          <meshStandardMaterial color={color} metalness={0.85} roughness={0.2} />
        </mesh>
        {/* Spikes */}
        {points.map((p, i) => (
          <mesh key={i} position={p}>
            <coneGeometry args={[0.08, 0.25, 6]} />
            <meshStandardMaterial color={color} metalness={0.85} roughness={0.2} />
          </mesh>
        ))}
        {/* Gem */}
        <mesh position={[0, 0.05, 0.55]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#dc2626" emissive="#7a0d0d" emissiveIntensity={0.5} />
        </mesh>
      </group>
    );
  }

  return null;
}
