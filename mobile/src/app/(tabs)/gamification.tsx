import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { checkIn, getBadges, CheckInResult } from "../../services/gamification.service";
import { useState } from "react";

export default function GamificationScreen() {
  const qc = useQueryClient();
  const { data: badges = [] } = useQuery({ queryKey: ["badges"], queryFn: getBadges });
  const [result, setResult] = useState<CheckInResult | null>(null);

  const checkInMut = useMutation({
    mutationFn: checkIn,
    onSuccess: (data) => {
      setResult(data);
      qc.invalidateQueries({ queryKey: ["badges"] });
      qc.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err: any) => {
      Alert.alert("Check-in", err.response?.data?.message || "Failed");
    },
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Daily Check-in</Text>
      <Text style={styles.desc}>Check in daily to earn points! Every 7th day gets a bonus.</Text>

      <TouchableOpacity
        style={[styles.button, checkInMut.isPending && styles.buttonDisabled]}
        onPress={() => checkInMut.mutate()}
        disabled={checkInMut.isPending}
      >
        <Text style={styles.buttonText}>Check In Today</Text>
      </TouchableOpacity>

      {result && (
        <View style={styles.resultBox}>
          <Text style={styles.resultTitle}>Check-in successful!</Text>
          <Text>Streak: {result.streak} days</Text>
          <Text>Points earned: +{result.points}</Text>
          {result.bonusPoints > 0 && <Text style={styles.bonus}>Streak bonus: +{result.bonusPoints}</Text>}
        </View>
      )}

      <Text style={[styles.title, { marginTop: 32 }]}>Badges</Text>
      <View style={styles.badgeGrid}>
        {badges.map((badge) => (
          <View key={badge.key} style={[styles.badgeCard, !badge.earned && styles.badgeLocked]}>
            <Text style={styles.badgeIcon}>{badge.icon}</Text>
            <Text style={styles.badgeName}>{badge.name}</Text>
            <Text style={styles.badgeDesc}>{badge.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 20 },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  desc: { fontSize: 14, color: "#64748b", marginBottom: 16 },
  button: { backgroundColor: "#0f172a", borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  resultBox: { marginTop: 16, backgroundColor: "#f0fdf4", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "#bbf7d0" },
  resultTitle: { fontWeight: "bold", marginBottom: 4 },
  bonus: { color: "#16a34a", fontWeight: "600" },
  badgeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  badgeCard: { width: "47%", backgroundColor: "#fff", borderRadius: 12, padding: 16, alignItems: "center", borderWidth: 1, borderColor: "#e2e8f0" },
  badgeLocked: { opacity: 0.35 },
  badgeIcon: { fontSize: 32, marginBottom: 8 },
  badgeName: { fontWeight: "600", fontSize: 14, textAlign: "center" },
  badgeDesc: { fontSize: 11, color: "#64748b", textAlign: "center", marginTop: 4 },
});
