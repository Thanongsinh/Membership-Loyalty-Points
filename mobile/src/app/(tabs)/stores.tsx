import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { getStores, getProducts } from "../../services/store.service";
import { addToCart } from "../../services/cart.service";
import { Store, Product } from "../../domain/entities/types";

export default function StoresScreen() {
  const queryClient = useQueryClient();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const { data: storesData, isLoading } = useQuery({
    queryKey: ["stores"],
    queryFn: () => getStores(1, 50),
  });

  const { data: productsData } = useQuery({
    queryKey: ["products", selectedStore?.id],
    queryFn: () => getProducts(selectedStore!.id),
    enabled: !!selectedStore,
  });

  const addMut = useMutation({
    mutationFn: (productId: string) => addToCart(productId),
    onSuccess: () => {
      Alert.alert("Added", "Item added to cart!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    onError: (e: any) => Alert.alert("Error", e.response?.data?.message || "Failed"),
  });

  if (selectedStore) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setSelectedStore(null)} style={styles.backBtn}>
          <Text style={styles.backText}>← Back to Stores</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{selectedStore.name}</Text>
        {selectedStore.description && <Text style={styles.subtitle}>{selectedStore.description}</Text>}
        <FlatList
          data={productsData?.data || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Product }) => (
            <View style={styles.card}>
              <Text style={styles.productName}>{item.name}</Text>
              {item.description && <Text style={styles.desc}>{item.description}</Text>}
              <View style={styles.row}>
                <Text style={styles.price}>{item.price.toLocaleString()} THB</Text>
                {item.pointsPrice && <Text style={styles.points}>{item.pointsPrice.toLocaleString()} pts</Text>}
              </View>
              <Text style={styles.stock}>Stock: {item.stock}</Text>
              <TouchableOpacity
                style={[styles.addBtn, item.stock <= 0 && styles.disabledBtn]}
                disabled={item.stock <= 0 || addMut.isPending}
                onPress={() => addMut.mutate(item.id)}
              >
                <Text style={styles.addText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stores</Text>
      {isLoading ? <Text>Loading...</Text> : (
        <FlatList
          data={storesData?.data || []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Store }) => (
            <TouchableOpacity style={styles.card} onPress={() => setSelectedStore(item)}>
              <Text style={styles.storeName}>{item.name}</Text>
              {item.description && <Text style={styles.desc}>{item.description}</Text>}
              {item.address && <Text style={styles.address}>{item.address}</Text>}
              <Text style={styles.count}>{item._count?.products ?? 0} products</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f8fafc" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  subtitle: { fontSize: 14, color: "#64748b", marginBottom: 12 },
  backBtn: { marginBottom: 8 },
  backText: { fontSize: 14, color: "#3b82f6" },
  card: { backgroundColor: "#fff", borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  storeName: { fontSize: 18, fontWeight: "bold", marginBottom: 4 },
  productName: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  desc: { fontSize: 14, color: "#64748b", marginBottom: 4 },
  address: { fontSize: 13, color: "#94a3b8", marginBottom: 4 },
  count: { fontSize: 13, color: "#0f172a", fontWeight: "500" },
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 8 },
  price: { fontSize: 16, fontWeight: "600" },
  points: { fontSize: 14, color: "#3b82f6", fontWeight: "600" },
  stock: { fontSize: 13, color: "#94a3b8", marginTop: 4, marginBottom: 8 },
  addBtn: { backgroundColor: "#0f172a", borderRadius: 8, padding: 12, alignItems: "center" },
  disabledBtn: { backgroundColor: "#cbd5e1" },
  addText: { color: "#fff", fontWeight: "600" },
});
