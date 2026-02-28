import { View, Text, StyleSheet } from "react-native";
import { Transaction } from "../domain/entities/types";

const TYPE_COLORS = {
  EARN: "#22c55e",
  REDEEM: "#ef4444",
  ADJUST: "#f59e0b",
  EXPIRE: "#94a3b8",
};

interface Props {
  transaction: Transaction;
}

export function TransactionItem({ transaction }: Props) {
  const isPositive = transaction.points > 0;
  return (
    <View style={styles.container}>
      <View style={styles.left}>
        <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[transaction.type] + "20" }]}>
          <Text style={[styles.typeText, { color: TYPE_COLORS[transaction.type] }]}>{transaction.type}</Text>
        </View>
        <Text style={styles.desc}>{transaction.description || "-"}</Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.points, { color: isPositive ? "#22c55e" : "#ef4444" }]}>
          {isPositive ? "+" : ""}{transaction.points}
        </Text>
        <Text style={styles.date}>{new Date(transaction.createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff", borderRadius: 8, padding: 12, marginBottom: 8 },
  left: { flex: 1 },
  right: { alignItems: "flex-end" },
  typeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: "flex-start", marginBottom: 4 },
  typeText: { fontSize: 12, fontWeight: "600" },
  desc: { fontSize: 14, color: "#64748b" },
  points: { fontSize: 18, fontWeight: "bold" },
  date: { fontSize: 12, color: "#94a3b8" },
});
