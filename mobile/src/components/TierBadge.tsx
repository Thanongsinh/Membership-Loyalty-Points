import { View, Text, StyleSheet } from "react-native";
import { Tier } from "../domain/entities/types";

const TIER_COLORS: Record<Tier, string> = {
  BRONZE: "#CD7F32",
  SILVER: "#C0C0C0",
  GOLD: "#FFD700",
  PLATINUM: "#E5E4E2",
};

interface Props {
  tier: Tier;
}

export function TierBadge({ tier }: Props) {
  return (
    <View style={[styles.badge, { backgroundColor: TIER_COLORS[tier] }]}>
      <Text style={styles.text}>{tier}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  text: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
});
