"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text3D, Center, RoundedBox } from "@react-three/drei";
import { Tier } from "@/domain/entities/types";
import { TIER_COLORS } from "./tier-constants";

interface Props {
  tier: Tier;
}

function Badge({ tier }: Props) {
  const color = TIER_COLORS[tier];
  return (
    <group>
      <RoundedBox args={[2.5, 2.5, 0.3]} radius={0.2}>
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </RoundedBox>
      <Center position={[0, 0, 0.2]}>
        <Text3D
          font="/fonts/helvetiker_regular.typeface.json"
          size={0.35}
          height={0.1}
          curveSegments={12}
        >
          {tier}
          <meshStandardMaterial color="#333" />
        </Text3D>
      </Center>
    </group>
  );
}

export function TierBadge3D({ tier }: Props) {
  return (
    <div className="h-48 w-48">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <Badge tier={tier} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
      </Canvas>
    </div>
  );
}
