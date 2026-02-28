import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useAuthStore } from "../../stores/auth.store";
import { registerApi } from "../../services/auth.service";

export default function RegisterScreen() {
  const [form, setForm] = useState({ email: "", password: "", firstName: "", lastName: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  async function handleRegister() {
    setLoading(true);
    try {
      const res = await registerApi(form.email, form.password, form.firstName, form.lastName, form.phone || undefined);
      await setAuth(res.user, res.accessToken, res.refreshToken);
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const update = (field: string) => (value: string) => setForm((p) => ({ ...p, [field]: value }));

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput style={styles.input} placeholder="First Name" value={form.firstName} onChangeText={update("firstName")} />
      <TextInput style={styles.input} placeholder="Last Name" value={form.lastName} onChangeText={update("lastName")} />
      <TextInput style={styles.input} placeholder="Email" value={form.email} onChangeText={update("email")} keyboardType="email-address" autoCapitalize="none" />
      <TextInput style={styles.input} placeholder="Password" value={form.password} onChangeText={update("password")} secureTextEntry />
      <TextInput style={styles.input} placeholder="Phone (optional)" value={form.phone} onChangeText={update("phone")} keyboardType="phone-pad" />
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Registering..." : "Register"}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: "center", padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  button: { backgroundColor: "#0f172a", borderRadius: 8, padding: 16, alignItems: "center", marginBottom: 16 },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { textAlign: "center", color: "#0f172a", fontSize: 14 },
});
