import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMyProfile, updateMyProfile } from "../../services/member.service";
import { useAuthStore } from "../../stores/auth.store";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: getMyProfile,
  });
  const [form, setForm] = useState<{ firstName: string; lastName: string; phone: string } | null>(null);

  const updateMut = useMutation({
    mutationFn: () => updateMyProfile(form!),
    onSuccess: () => {
      Alert.alert("Success", "Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (e: any) => Alert.alert("Error", e.response?.data?.message || "Failed"),
  });

  if (isLoading) return <View style={styles.container}><Text>Loading...</Text></View>;
  if (!profile) return <View style={styles.container}><Text>Error</Text></View>;

  const current = form || { firstName: profile.firstName, lastName: profile.lastName, phone: profile.phone || "" };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>First Name</Text>
      <TextInput style={styles.input} value={current.firstName} onChangeText={(v) => setForm({ ...current, firstName: v })} />
      <Text style={styles.label}>Last Name</Text>
      <TextInput style={styles.input} value={current.lastName} onChangeText={(v) => setForm({ ...current, lastName: v })} />
      <Text style={styles.label}>Phone</Text>
      <TextInput style={styles.input} value={current.phone} onChangeText={(v) => setForm({ ...current, phone: v })} keyboardType="phone-pad" />
      <TouchableOpacity style={styles.saveBtn} onPress={() => updateMut.mutate()} disabled={updateMut.isPending}>
        <Text style={styles.saveBtnText}>Save</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={async () => {
          await logout();
          router.replace("/(auth)/login");
        }}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f8fafc" },
  label: { fontSize: 14, fontWeight: "600", color: "#64748b", marginBottom: 4, marginTop: 12 },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: "#fff" },
  saveBtn: { backgroundColor: "#0f172a", borderRadius: 8, padding: 16, alignItems: "center", marginTop: 24 },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  logoutBtn: { borderWidth: 1, borderColor: "#ef4444", borderRadius: 8, padding: 16, alignItems: "center", marginTop: 12 },
  logoutText: { color: "#ef4444", fontSize: 16, fontWeight: "600" },
});
