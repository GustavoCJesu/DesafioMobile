import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { Employee } from "@/types/employee";

type Props = {
  employee: Employee;
  onPress?: (employee: Employee) => void;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return `${first}${last}`.toUpperCase();
}

function formatDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export function EmployeeListItem({ employee, onPress }: Props) {
  const active = employee.status === "active";

  return (
    <Pressable
      onPress={() => onPress?.(employee)}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{getInitials(employee.name)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {employee.name}
        </Text>
        <Text style={styles.role} numberOfLines={1}>
          {employee.role} · {employee.sector}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {employee.registration} · adm. {formatDate(employee.admissionDate)}
        </Text>
      </View>

      <View style={[styles.badge, active ? styles.badgeActive : styles.badgeInactive]}>
        <View style={[styles.dot, active ? styles.dotActive : styles.dotInactive]} />
        <Text style={[styles.badgeText, active ? styles.badgeTextActive : styles.badgeTextInactive]}>
          {active ? "Ativo" : "Inativo"}
        </Text>
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
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  pressed: {
    backgroundColor: "#f4f6fd",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#e8ebfa",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#3a4a9f",
    fontWeight: "700",
    fontSize: 14,
  },
  info: {
    flex: 1,
    gap: 2,
  },
  name: {
    color: "#0f172a",
    fontSize: 16,
    fontWeight: "700",
  },
  role: {
    color: "#475569",
    fontSize: 13.5,
  },
  meta: {
    color: "#64748b",
    fontSize: 11.5,
    fontFamily: Platform.select({ ios: "Menlo", default: "monospace" }),
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
  },
  badgeActive: {
    backgroundColor: "#e7f9ef",
    borderColor: "#a6ebc5",
  },
  badgeInactive: {
    backgroundColor: "#f1f5f9",
    borderColor: "#cbd5e1",
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
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  badgeTextActive: {
    color: "#0b8a4f",
  },
  badgeTextInactive: {
    color: "#64748b",
  },
});
