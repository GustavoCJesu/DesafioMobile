import { Platform, StyleSheet, Text, View } from "react-native";
import { Clock, HardHat } from "lucide-react-native";
import { SaldoEpi } from "@/portal/mocks/saldoEpis";
import { portalColors } from "@/portal/theme";

type Props = {
  item: SaldoEpi;
};

export function SaldoEpiCard({ item }: Props) {
  const caEmAlerta = item.caVenceEmDias !== null && item.caVenceEmDias <= 60;
  const percentual = item.limite > 0 ? (item.disponivel / item.limite) * 100 : 0;

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.icon}>
          <HardHat size={22} color={portalColors.primary} />
        </View>
        <View style={styles.titleBlock}>
          <Text style={styles.categoria}>{item.categoria.toUpperCase()}</Text>
          <Text style={styles.nome}>{item.nome}</Text>
        </View>
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>Liberado</Text>
        </View>
      </View>

      <View style={styles.tags}>
        <View style={[styles.tag, caEmAlerta && styles.tagAlerta]}>
          <Text style={[styles.tagMono, caEmAlerta && styles.tagAlertaText]}>
            CA{item.ca}·
            {caEmAlerta
              ? `vence em ${item.caVenceEmDias} dias`
              : `válido até ${item.caValidade}`}
          </Text>
        </View>
        <View style={[styles.tag, styles.tagRow]}>
          <Clock size={13} color={portalColors.muted} />
          <Text style={styles.tagText}>Vida útil {item.vidaUtilDias} dias</Text>
        </View>
      </View>

      <View style={styles.saldoBox}>
        <View style={styles.saldoHeader}>
          <Text style={styles.saldoLabel}>Disponível para retirar</Text>
          <Text style={styles.saldoLabel}>limite {item.limite} por período</Text>
        </View>
        <Text style={styles.saldoValor}>
          {item.disponivel} <Text style={styles.saldoUnidade}>{item.unidade}</Text>
        </Text>
        <View style={styles.progressTrack}>
          {/* Único estilo dinâmico: largura proporcional ao saldo */}
          <View style={[styles.progressFill, { width: `${percentual}%` }]} />
        </View>
      </View>

      {item.tamanhos.length > 0 && (
        <View style={styles.tamanhos}>
          <Text style={styles.tamanhosTitle}>Tamanhos · estoque no equipamento</Text>
          <View style={styles.tamanhosRow}>
            {item.tamanhos.map(({ tamanho, estoque }) =>
              estoque > 0 ? (
                <View key={tamanho} style={styles.tamanhoChip}>
                  <Text style={styles.tamanhoLabel}>{tamanho}</Text>
                  <Text style={styles.tamanhoEstoque}>{estoque} un.</Text>
                </View>
              ) : (
                <View key={tamanho} style={[styles.tamanhoChip, styles.tamanhoVazio]}>
                  <Text style={styles.tamanhoVazioLabel}>{tamanho}</Text>
                  <Text style={styles.tamanhoVazioTexto}>sem estoque</Text>
                </View>
              ),
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const mono = Platform.select({ ios: "Menlo", default: "monospace" });

const styles = StyleSheet.create({
  card: {
    backgroundColor: portalColors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: portalColors.border,
    padding: 16,
    gap: 14,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: portalColors.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
    gap: 2,
  },
  categoria: {
    color: portalColors.primary,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  nome: {
    color: portalColors.text,
    fontSize: 17,
    fontWeight: "800",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "#a6ebc5",
    backgroundColor: "#e7f9ef",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#12b76a",
  },
  badgeText: {
    color: "#0b8a4f",
    fontSize: 12,
    fontWeight: "700",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: portalColors.border,
    backgroundColor: "#f1f5f9",
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  tagAlerta: {
    backgroundColor: portalColors.warnBackground,
    borderColor: portalColors.warnBorder,
  },
  tagMono: {
    color: "#334155",
    fontSize: 12,
    fontFamily: mono,
  },
  tagAlertaText: {
    color: portalColors.warn,
  },
  tagText: {
    color: "#334155",
    fontSize: 12.5,
  },
  saldoBox: {
    backgroundColor: portalColors.background,
    borderRadius: 14,
    padding: 14,
    gap: 6,
  },
  saldoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  saldoLabel: {
    color: portalColors.muted,
    fontSize: 12.5,
  },
  saldoValor: {
    color: portalColors.primary,
    fontSize: 30,
    fontWeight: "800",
  },
  saldoUnidade: {
    color: portalColors.muted,
    fontSize: 15,
    fontWeight: "700",
  },
  progressTrack: {
    height: 8,
    borderRadius: 100,
    backgroundColor: "#d5e5db",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 100,
    backgroundColor: portalColors.primary,
  },
  tamanhos: {
    gap: 8,
  },
  tamanhosTitle: {
    color: portalColors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  tamanhosRow: {
    flexDirection: "row",
    gap: 8,
  },
  tamanhoChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: portalColors.primary,
    backgroundColor: portalColors.white,
  },
  tamanhoVazio: {
    borderStyle: "dashed",
    borderColor: "#cbd5e1",
    backgroundColor: "#f1f5f9",
  },
  tamanhoLabel: {
    color: portalColors.text,
    fontWeight: "800",
    fontSize: 13,
  },
  tamanhoEstoque: {
    color: portalColors.primary,
    fontSize: 13,
  },
  tamanhoVazioLabel: {
    color: "#94a3b8",
    fontWeight: "800",
    fontSize: 13,
  },
  tamanhoVazioTexto: {
    color: "#94a3b8",
    fontSize: 13,
  },
});
