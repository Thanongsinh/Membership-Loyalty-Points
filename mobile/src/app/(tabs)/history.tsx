import { View, Text, FlatList, StyleSheet } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { getMyTransactions } from "../../services/transaction.service";
import { TransactionItem } from "../../components/TransactionItem";

export default function HistoryScreen() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-transactions"],
    queryFn: () => getMyTransactions(1, 50),
  });

  return (
    <View style={styles.container}>
      {isLoading ? <Text>Loading...</Text> : (
        <FlatList
          data={data?.data || []}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text style={styles.empty}>No transactions yet</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  empty: { textAlign: "center", color: "#94a3b8", marginTop: 40 },
});
