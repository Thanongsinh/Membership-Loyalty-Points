import { View, Text, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "../../services/member.service";
import { PointsBalance } from "../../components/PointsBalance";
import { TierBadge } from "../../components/TierBadge";

const TIER_THRESHOLDS = { BRONZE: 0, SILVER: 1000, GOLD: 5000, PLATINUM: 20000 };

export default function HomeScreen() {
  const { data: member, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  if (isLoading) return <View style={styles.container}><Text>Loading...</Text></View>;
  if (!member) return <View style={styles.container}><Text>Error loading profile</Text></View>;

  const nextTier = member.tier === "PLATINUM" ? null
    : member.tier === "GOLD" ? "PLATINUM"
    : member.tier === "SILVER" ? "GOLD" : "SILVER";
  const pointsToNext = nextTier ? TIER_THRESHOLDS[nextTier] - member.totalPoints : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Welcome, {member.firstName}!</Text>
      <PointsBalance points={member.currentPoints} />
      <TierBadge tier={member.tier} />
      {nextTier && (
        <Text style={styles.nextTier}>
          {pointsToNext.toLocaleString()} points to {nextTier}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", paddingTop: 40, backgroundColor: "#f8fafc" },
  greeting: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  nextTier: { marginTop: 16, fontSize: 14, color: "#64748b" },
});
