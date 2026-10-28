import { useMemo, useState } from "react";
import {
  ActivityIndicator,
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
import { Plus, ScanLine, Search } from "lucide-react-native";
import { EpiListItem } from "@/components/epis/EpiListItem";
import { useEpis } from "@/hooks/useEpis";
import { gradients } from "@/styles/gradientList";

// Remove acentos e caixa para a busca
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

// "Proteção respiratória" -> "Respiratória"
function shortCategory(category: string) {
  const short = category.replace(/^Proteção\s+(d[aoe]s?\s+|contra\s+)?/i, "");
  return short.charAt(0).toUpperCase() + short.slice(1);
}

export default function EpiScreen() {
  const { epis, loading, refreshing, error, refresh, retry } = useEpis();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set(epis.map((e) => e.category))],
    [epis],
  );

  const groups = useMemo(() => {
    const term = normalize(search.trim());
    const filtered = epis.filter(
      (e) =>
        (!activeCategory || e.category === activeCategory) &&
        (!term || normalize(e.name).includes(term) || e.ca.includes(term)),
    );
    return categories
      .map((category) => ({
        category,
        items: filtered.filter((e) => e.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [epis, categories, search, activeCategory]);

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

    if (groups.length === 0) {
      return (
        <View style={styles.feedback}>
          <Text style={styles.feedbackText}>Nenhum EPI encontrado</Text>
        </View>
      );
    }

    return groups.map(({ category, items }) => (
      <View key={category}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{category.toUpperCase()}</Text>
          <Text style={styles.sectionCount}>
            {items.length} {items.length === 1 ? "item" : "itens"}
          </Text>
        </View>
        <View style={styles.card}>
          {items.map((epi, index) => (
            <View key={epi.id}>
              {index > 0 && <View style={styles.separator} />}
              <EpiListItem epi={epi} />
            </View>
          ))}
        </View>
      </View>
    ));
  }

  return (
    <SafeAreaView style={styles.screen} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>EPIs</Text>
          <Text style={styles.subtitle}>
            {epis.length} cadastrados · {categories.length} categorias
          </Text>
        </View>
        {/* TODO: abrir o cadastro de EPI quando a tela existir */}
        <Pressable accessibilityLabel="Novo EPI">
          <LinearGradient
            {...gradients.primaryDiagonal}
            style={styles.addButton}
          >
            <Plus size={24} color="#fff" />
          </LinearGradient>
        </Pressable>
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color="#64748b" />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Nome do EPI ou número do CA"
          placeholderTextColor="#64748b"
          style={styles.searchInput}
          autoCorrect={false}
          returnKeyType="search"
        />
      </View>

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {[null, ...categories].map((category) => {
            const selected = category === activeCategory;
            return (
              <Pressable
                key={category ?? "all"}
                onPress={() => setActiveCategory(category)}
                style={[styles.chip, selected && styles.chipSelected]}
              >
                <Text
                  style={[styles.chipText, selected && styles.chipTextSelected]}
                >
                  {category ? shortCategory(category) : "Todas"}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.list}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
      >
        {renderBody()}
      </ScrollView>

      {/* TODO: abrir o fluxo de entrega de EPI quando a tela existir */}
      <Pressable style={styles.fabWrapper} accessibilityLabel="Entregar EPI">
        <LinearGradient {...gradients.primary} style={styles.fab}>
          <ScanLine size={20} color="#fff" />
          <Text style={styles.fabText}>Entregar EPI</Text>
        </LinearGradient>
      </Pressable>
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
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 50,
    marginHorizontal: 20,
    marginTop: 18,
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
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 4,
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    color: "#475569",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  sectionCount: {
    color: "#64748b",
    fontSize: 12,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#fff",
    overflow: "hidden",
    marginBottom: 8,
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
  fabWrapper: {
    position: "absolute",
    right: 20,
    bottom: 16,
    borderRadius: 100,
    elevation: 6,
    shadowColor: "#33447f",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    height: 52,
    borderRadius: 100,
  },
  fabText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});
