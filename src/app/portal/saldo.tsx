import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ChevronLeft, RefreshCw, Search } from "lucide-react-native";
import { SaldoEpiCard } from "@/portal/components/SaldoEpiCard";
import { SaldoEpi, saldoEpisMock } from "@/portal/mocks/saldoEpis";
import { portalColors, portalGradient } from "@/portal/theme";
import { usePortalSession } from "@/portal/providers/PortalSessionProvider";

type Filtro = "todos" | "saldo" | "vencer";

const filtros: Record<Filtro, (item: SaldoEpi) => boolean> = {
  todos: () => true,
  saldo: (item) => item.disponivel > 0,
  vencer: (item) => item.caVenceEmDias !== null && item.caVenceEmDias <= 60,
};

// Remove acentos e caixa para a busca
function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export default function PortalSaldo() {
  const { session, signOut } = usePortalSession();
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  const termo = normalize(busca.trim());
  const itens = saldoEpisMock.filter(
    (item) =>
      filtros[filtro](item) &&
      (!termo ||
        normalize(item.nome).includes(termo) ||
        normalize(item.categoria).includes(termo) ||
        item.ca.includes(termo)),
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <LinearGradient {...portalGradient} style={styles.hero}>
        <SafeAreaView edges={["top"]}>
          <View style={styles.topBar}>
            <Pressable
              onPress={signOut}
              hitSlop={12}
              accessibilityLabel="Voltar"
            >
              <ChevronLeft size={26} color={portalColors.white} />
            </Pressable>
            <View style={styles.sync}>
              <View style={styles.syncDot} />
              {/* esperado: há quanto tempo o saldo foi sincronizado com os equipamentos */}
              <Text style={styles.syncText}>Sincronizado há 2 min</Text>
            </View>
            {/* TODO: recarregar o saldo na API */}
            <Pressable hitSlop={12} accessibilityLabel="Atualizar">
              <RefreshCw size={20} color={portalColors.white} />
            </Pressable>
          </View>
          <Text style={styles.colaborador}>
            {session?.pessoa.nome} · {session?.pessoa.matricula}{" "}
          </Text>
          <Text style={styles.title}>Meu saldo de EPIs</Text>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          {/* esperado: total de EPIs liberados para o colaborador */}
          <Text style={styles.summaryValue}>5</Text>
          <Text style={styles.summaryLabel}>Liberados</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          {/* esperado: quantos dos liberados ainda têm saldo para retirar */}
          <Text style={[styles.summaryValue, styles.summaryGreen]}>4</Text>
          <Text style={styles.summaryLabel}>Com saldo</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          {/* esperado: quantos EPIs têm CA vencendo nos próximos 60 dias */}
          <Text style={[styles.summaryValue, styles.summaryOrange]}>1</Text>
          <Text style={styles.summaryLabel}>CA a vencer</Text>
        </View>
      </View>

      <View style={styles.searchBox}>
        <Search size={18} color={portalColors.muted} />
        <TextInput
          value={busca}
          onChangeText={setBusca}
          placeholder="Nome, categoria ou CA"
          placeholderTextColor={portalColors.muted}
          style={styles.searchInput}
          autoCorrect={false}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
      >
        {/* esperado nos chips: total de itens de cada filtro (mesmos números do resumo acima) */}
        {(
          [
            ["todos", "Todos · 5"],
            ["saldo", "Com saldo · 4"],
            ["vencer", "CA a vencer · 1"],
          ] as [Filtro, string][]
        ).map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => setFiltro(key)}
            style={[styles.chip, filtro === key && styles.chipSelected]}
          >
            <Text
              style={[
                styles.chipText,
                filtro === key && styles.chipTextSelected,
              ]}
            >
              {label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.list}>
        {itens.length === 0 ? (
          <Text style={styles.empty}>Nenhum EPI encontrado</Text>
        ) : (
          itens.map((item) => <SaldoEpiCard key={item.id} item={item} />)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: portalColors.background,
  },
  content: {
    paddingBottom: 32,
  },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 64,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    marginBottom: 20,
  },
  sync: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  syncDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#86efac",
  },
  syncText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12.5,
  },
  colaborador: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 14,
  },
  title: {
    color: portalColors.white,
    fontSize: 28,
    fontWeight: "800",
    marginTop: 4,
  },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: -44,
    marginHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 18,
    backgroundColor: portalColors.white,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  summaryValue: {
    color: portalColors.text,
    fontSize: 26,
    fontWeight: "800",
  },
  summaryGreen: {
    color: portalColors.primary,
  },
  summaryOrange: {
    color: portalColors.warn,
  },
  summaryLabel: {
    color: portalColors.muted,
    fontSize: 13,
  },
  summaryDivider: {
    width: StyleSheet.hairlineWidth,
    height: 40,
    backgroundColor: portalColors.border,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 50,
    marginHorizontal: 20,
    marginTop: 20,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: portalColors.border,
    backgroundColor: portalColors.white,
  },
  searchInput: {
    flex: 1,
    color: portalColors.text,
    fontSize: 15,
    paddingVertical: 0,
  },
  chips: {
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: portalColors.border,
    backgroundColor: portalColors.white,
  },
  chipSelected: {
    backgroundColor: portalColors.primary,
    borderColor: portalColors.primary,
  },
  chipText: {
    color: "#334155",
    fontSize: 13.5,
    fontWeight: "600",
  },
  chipTextSelected: {
    color: portalColors.white,
  },
  list: {
    paddingHorizontal: 20,
    gap: 14,
  },
  empty: {
    color: portalColors.muted,
    textAlign: "center",
    padding: 32,
  },
});
