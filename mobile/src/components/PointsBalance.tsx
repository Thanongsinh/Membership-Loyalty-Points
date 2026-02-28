import { useEffect } from "react";
import { Text, StyleSheet } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from "react-native-reanimated";

interface Props {
  points: number;
}

export function PointsBalance({ points }: Props) {
  const scale = useSharedValue(0.5);

  useEffect(() => {
    scale.value = withTiming(1, { duration: 600 });
  }, [points]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.label}>Current Points</Text>
      <Text style={styles.points}>{points.toLocaleString()}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginVertical: 20 },
  label: { fontSize: 14, color: "#64748b", marginBottom: 4 },
  points: { fontSize: 48, fontWeight: "bold", color: "#0f172a" },
});
