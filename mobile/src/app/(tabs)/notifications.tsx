import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getNotifications, markAsRead, markAllAsRead, Notification } from "../../services/notification.service";
import { useState } from "react";

export default function NotificationsScreen() {
  const qc = useQueryClient();
  const [refreshing, setRefreshing] = useState(false);
  const { data: notifications = [], refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: getNotifications,
  });

  const readMut = useMutation({
    mutationFn: markAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const readAllMut = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const unreadCount = notifications.filter((n: Notification) => !n.isRead).length;

  return (
    <View style={styles.container}>
      {unreadCount > 0 && (
        <TouchableOpacity style={styles.markAll} onPress={() => readAllMut.mutate()}>
          <Text style={styles.markAllText}>Mark all as read ({unreadCount})</Text>
        </TouchableOpacity>
      )}
      <FlatList
        data={notifications}
        keyExtractor={(item: Notification) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }: { item: Notification }) => (
          <TouchableOpacity
            style={[styles.item, !item.isRead && styles.unread]}
            onPress={() => !item.isRead && readMut.mutate(item.id)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.message}>{item.message}</Text>
            <Text style={styles.time}>{new Date(item.createdAt).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No notifications yet</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  markAll: { padding: 12, alignItems: "center", borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  markAllText: { color: "#3b82f6", fontWeight: "600" },
  item: { padding: 16, borderBottomWidth: 1, borderBottomColor: "#e2e8f0" },
  unread: { backgroundColor: "#eff6ff" },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  message: { fontSize: 14, color: "#64748b", marginBottom: 4 },
  time: { fontSize: 12, color: "#94a3b8" },
  empty: { textAlign: "center", padding: 40, color: "#94a3b8" },
});
