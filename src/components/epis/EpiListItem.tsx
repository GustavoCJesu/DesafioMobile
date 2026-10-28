import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight, HardHat } from "lucide-react-native";
import { Epi } from "@/types/epi";

type Props = {
  epi: Epi;
  onPress?: (epi: Epi) => void;
};

export function EpiListItem({ epi, onPress }: Props) {
  const active = epi.status === "active";

  return (
    <Pressable
      onPress={() => onPress?.(epi)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <HardHat size={22} color="#3a4a9f" />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {epi.name}
        </Text>
        <View style={styles.meta}>
          <Text style={styles.ca}>CA {epi.ca}</Text>
          <View style={styles.status}>
            <View style={[styles.dot, active ? styles.dotActive : styles.dotInactive]} />
            <Text style={[styles.statusText, active ? styles.textActive : styles.textInactive]}>
              {active ? "Ativo" : "Inativo"}
            </Text>
          </View>
        </View>
      </View>

      <ChevronRight size={18} color="#94a3b8" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  pressed: {
    backgroundColor: "#f4f6fd",
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#e8ebfa",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
  },
  meta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  ca: {
    color: "#475569",
    fontSize: 11.5,
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    overflow: "hidden",
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: "#12b76a",
  },
  dotInactive: {
    backgroundColor: "#94a3b8",
  },
  statusText: {
    fontSize: 12.5,
    fontWeight: "700",
  },
  textActive: {
    color: "#0b8a4f",
  },
  textInactive: {
    color: "#64748b",
  },
});
