import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { Funnel, Search, UserPlus } from "lucide-react-native";
import { EmployeeListItem } from "@/components/employees/EmployeeListItem";
import { useEmployees } from "@/hooks/useEmployees";
import { gradients } from "@/styles/gradientList";
import { Employee } from "@/types/employee";

type Chip = {
  key: string;
  label: string;
  match: (employee: Employee) => boolean;
};

// Remove acentos e caixa para a busca ("jose" encontra "José")
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

function onlyDigits(text: string) {
  return text.replace(/\D/g, "");
}

function matchesSearch(employee: Employee, query: string) {
  const term = normalize(query.trim());
  if (!term) return true;

  const digits = onlyDigits(term);
  return (
    normalize(employee.name).includes(term) ||
    normalize(employee.registration).includes(term) ||
    (digits.length > 0 && onlyDigits(employee.cpf).includes(digits))
  );
}

export default function EmployeeScreen() {
  const { employees, loading, refreshing, error, refresh, retry } =
    useEmployees();
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("all");

  const chips = useMemo(() => {
    const sectors = [...new Set(employees.map((e) => e.sector))].sort((a, b) =>
      a.localeCompare(b, "pt-BR"),
    );
    const base: Chip[] = [
      { key: "all", label: "Todos", match: () => true },
      { key: "active", label: "Ativos", match: (e) => e.status === "active" },
      {
        key: "inactive",
        label: "Inativos",
        match: (e) => e.status === "inactive",
      },
      ...sectors.map((sector) => ({
        key: `sector:${sector}`,
        label: sector,
        match: (e: Employee) => e.sector === sector,
      })),
    ];
    return base.map((chip) => ({
      ...chip,
      count: employees.filter(chip.match).length,
    }));
  }, [employees]);

  const filtered = useMemo(() => {
    const chip = chips.find((c) => c.key === activeChip) ?? chips[0];
    return employees.filter((e) => chip.match(e) && matchesSearch(e, search));
  }, [employees, chips, activeChip, search]);

  const activeCount = employees.filter((e) => e.status === "active").length;
  const subtitle = `${employees.length} ${
    employees.length === 1 ? "colaborador" : "colaboradores"
  } · ${activeCount} ${activeCount === 1 ? "ativo" : "ativos"}`;

  function renderBody() {
    if (loading) {
      return (
        <View style={styles.feedback}>
          <ActivityIndicator size="large" color="#4b5ce3" />
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={retry}>
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      );
    }

    return (
      <FlatList
        data={filtered}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <EmployeeListItem employee={item} />}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.feedback}>
            <Text style={styles.feedbackText}>
              Nenhum funcionário encontrado
            </Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      />
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>Funcionários</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
        {/* TODO: abrir o cadastro de funcionário quando a tela existir */}
        <Pressable accessibilityLabel="Novo funcionário">
          <LinearGradient
            {...gradients.primaryDiagonal}
            style={styles.addButton}
          >
            <UserPlus size={22} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>

      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color="#64748b" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Nome, matrícula ou CPF"
            placeholderTextColor="#64748b"
            style={styles.searchInput}
            autoCorrect={false}
            returnKeyType="search"
          />
        </View>
        {/* TODO: definir o que o botão de filtro abre (ordenação/filtros avançados) */}
        <Pressable style={styles.filterButton} accessibilityLabel="Filtros">
          <Funnel size={18} color="#0f172a" />
        </Pressable>
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {chips.map((chip) => {
            const selected = chip.key === activeChip;
            return (
              <Pressable
                key={chip.key}
                onPress={() => setActiveChip(chip.key)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {chip.label} · {chip.count}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.card}>{renderBody()}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f5f7fd",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  titleBlock: {
    flex: 1,
  },
  title: {
    color: "#0f172a",
    fontSize: 28,
    fontWeight: "800",
  },
  subtitle: {
    color: "#64748b",
    fontSize: 13,
    marginTop: 2,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  searchRow: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    marginTop: 18,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 50,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
    paddingVertical: 0,
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  chips: {
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  chipSelected: {
    backgroundColor: "#111a33",
    borderColor: "#111a33",
  },
  chipText: {
    color: "#334155",
    fontSize: 13,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: "#fff",
  },
  card: {
    flex: 1,
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    overflow: "hidden",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#e2e8f0",
  },
  feedback: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 32,
  },
  feedbackText: {
    color: "#64748b",
    fontSize: 14,
    textAlign: "center",
  },
  retryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 100,
    backgroundColor: "#4b5ce3",
  },
  retryText: {
    color: "#fff",
    fontWeight: "700",
  },
});
