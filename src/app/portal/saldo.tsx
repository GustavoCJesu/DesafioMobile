import { SaldoEpiCard } from "@/portal/components/SaldoEpiCard";
import { SaldoEpiCardData } from "@/portal/mocks/saldoEpis";
import { useSaldoEpis } from "@/portal/hooks/useSaldoEpis";
import { usePortalSession } from "@/portal/providers/PortalSessionProvider";
import { portalColors, portalGradient } from "@/portal/theme";
import { LinearGradient } from "expo-linear-gradient";
import { formatarDataHora, tempoDesde } from "@/portal/utils/tempo";
import { ChevronLeft, RefreshCw, Search, WifiOff } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Filtro = "todos" | "saldo";

const filtros: Record<Filtro, (item: SaldoEpiCardData) => boolean> = {
  todos: () => true,
  saldo: (item) => item.disponivel > 0,
};

function normalize(text: string) {
  return text
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

export default function PortalSaldo() {
  const { session, signOut } = usePortalSession();
  const { saldo, loading, erro, offline, atualizadoEm, recarregar } = useSaldoEpis();
  const [agora, setAgora] = useState(() => Date.now())
  const [busca, setBusca] = useState("");
  const [filtro, setFiltro] = useState<Filtro>("todos");

  useEffect(()=>{
    const id = setInterval(()=> setAgora(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])

  const comSaldo = saldo.filter(filtros.saldo).length;
  const semSaldo = saldo.length - comSaldo;

  const termo = normalize(busca.trim());
  const itens = saldo.filter(
    (item) =>
      filtros[filtro](item) &&
      (!termo ||
        normalize(item.nome).includes(termo) ||
        normalize(item.categoria).includes(termo) ||
        item.ca.includes(termo)),
  );

  return (
    <View style={styles.screen}>
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
              <View style={[styles.syncDot, offline && styles.syncDotOffline]} />
              <Text style={styles.syncText}>
                {atualizadoEm
                  ? `${offline ? "Dados salvos" : "Sincronizado"} ${tempoDesde(atualizadoEm, agora)}`
                  : "Sincronizando..."}
              </Text>
            </View>
            <Pressable
              onPress={recarregar}
              disabled={loading}
              hitSlop={12}
              accessibilityLabel="Atualizar"
            >
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
          <Text style={styles.summaryValue}>{saldo.length}</Text>
          <Text style={styles.summaryLabel}>Liberados</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, styles.summaryGreen]}>
            {comSaldo}
          </Text>
          <Text style={styles.summaryLabel}>Com saldo</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryItem}>
          <Text style={[styles.summaryValue, styles.summaryOrange]}>
            {semSaldo}
          </Text>
          <Text style={styles.summaryLabel}>Sem saldo</Text>
        </View>
      </View>

      {offline && atualizadoEm && (
        <View style={styles.offlineBanner}>
          <WifiOff size={16} color="#9a3412" />
          <Text style={styles.offlineText}>
            Modo offline · dados de {formatarDataHora(atualizadoEm)}
          </Text>
        </View>
      )}

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
        style={{ flexGrow: 0, flexShrink: 0 }}
        contentContainerStyle={styles.chips}
      >
        {(
          [
            ["todos", `Todos · ${saldo.length}`],
            ["saldo", `Com saldo · ${comSaldo}`],
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

      {loading ? (
        <ActivityIndicator size="large" color={portalColors.primary} />
      ) : erro ? (
        <Text style={styles.empty}>{erro}</Text>
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <SaldoEpiCard item={item} />}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          ListEmptyComponent={
            <Text style={styles.empty}>Nenhum EPI encontrado</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: portalColors.background,
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
  syncDotOffline: {
    backgroundColor: portalColors.warn,
  },
  offlineBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: portalColors.warn,
    backgroundColor: "#fff7ed",
  },
  offlineText: {
    color: "#9a3412",
    fontSize: 13,
    fontWeight: "600",
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
    paddingBottom: 32,
    gap: 14,
  },
  empty: {
    color: portalColors.muted,
    textAlign: "center",
    padding: 32,
  },
});
