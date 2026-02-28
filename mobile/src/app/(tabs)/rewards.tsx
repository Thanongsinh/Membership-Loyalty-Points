import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getRewards, redeemReward } from "../../services/reward.service";
import { getMyProfile } from "../../services/member.service";
import { Reward } from "../../domain/entities/types";

export default function RewardsScreen() {
  const queryClient = useQueryClient();
  const { data: rewardsData, isLoading } = useQuery({
    queryKey: ["rewards"],
    queryFn: () => getRewards(1, 50),
  });
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });

  const redeemMut = useMutation({
    mutationFn: redeemReward,
    onSuccess: () => {
      Alert.alert("Success", "Reward redeemed!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["rewards"] });
    },
    onError: (e: any) => Alert.alert("Error", e.response?.data?.message || "Failed"),
  });

  function renderReward({ item }: { item: Reward }) {
    const canRedeem = profile && profile.currentPoints >= item.pointsCost && item.stock > 0;
    return (
      <View style={styles.card}>
        <Text style={styles.rewardName}>{item.name}</Text>
        {item.description && <Text style={styles.desc}>{item.description}</Text>}
        <View style={styles.row}>
          <Text style={styles.points}>{item.pointsCost.toLocaleString()} pts</Text>
          <Text style={styles.stock}>Stock: {item.stock}</Text>
        </View>
        <TouchableOpacity
          style={[styles.redeemBtn, !canRedeem && styles.disabledBtn]}
          disabled={!canRedeem || redeemMut.isPending}
          onPress={() => redeemMut.mutate(item.id)}
        >
          <Text style={styles.redeemText}>{item.stock <= 0 ? "Out of Stock" : "Redeem"}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.balance}>Your points: {profile?.currentPoints.toLocaleString()}</Text>
      {isLoading ? <Text>Loading...</Text> : (
        <FlatList data={rewardsData?.data || []} renderItem={renderReward} keyExtractor={(item) => item.id} contentContainerStyle={{ paddingBottom: 20 }} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  balance: { fontSize: 16, fontWeight: "600", marginBottom: 16, color: "#64748b" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  rewardName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  desc: { fontSize: 14, color: "#64748b", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  points: { fontSize: 16, fontWeight: "600", color: "#0f172a" },
  stock: { fontSize: 14, color: "#94a3b8" },
  redeemBtn: { backgroundColor: "#0f172a", borderRadius: 8, padding: 12, alignItems: "center" },
  disabledBtn: { backgroundColor: "#cbd5e1" },
  redeemText: { color: "#fff", fontWeight: "600" },
});
