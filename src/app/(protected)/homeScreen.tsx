import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { globalStyles } from "@/styles/globalStyles";
import { useRouter } from "expo-router";
import { useUser } from "@/Context/UserContext";
import { useEffect, useState } from "react";
import { typography } from "@/styles/typography";
import { LinearGradient } from "expo-linear-gradient";
import { gradients } from "@/styles/gradientList";
import {
  CalendarPlus,
  CircleX,
  Clock,
  HardHat,
  Plus,
  StickyNote,
} from "lucide-react-native";

import { CardVenceEmBreve } from "@/components/CardVenceEmBreve";

import { index } from "@/services/serviceHome";

const acoesRapidas = [
  { icon: Plus, label: "Novo Funcionário", href: undefined },
  { icon: CalendarPlus, label: "Agendar Aula", href: undefined },
  { icon: StickyNote, label: "Relatório", href: undefined },
  { icon: HardHat, label: "EPIs", href: "/epiScreen" as const },
];

function toCardVenceEmBreve(item: any) {
  const nome = item?.employee?.name ?? item?.employee_name ?? item?.nome ?? "";
  return {
    nome,
    descricao: item?.norma ?? item?.certificate?.name ?? item?.descricao ?? "",
    dias: item?.dias ?? item?.days_left ?? item?.dias_restantes ?? null,
  };
}

function getIniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";
  const primeira = partes[0][0];
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return `${primeira}${ultima}`.toUpperCase();
}

export default function HomeScreen() {
  const [dadosHome, setDadosHome] = useState<null | any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHome() {
      const response = await index();
      setDadosHome(response);
      setLoading(false);
    }
    loadHome();
  }, []);

  const conformidade = Math.min(
    100,
    Math.max(0, Number(dadosHome?.conformidade) || 0),
  );
  const ativos = dadosHome?.ativos ?? 0;
  const totalCertificados = dadosHome?.totalCertificados ?? 0;
  const certificadosIrregulares = dadosHome?.certificadosIrregulares ?? 0;
  const certificadosPertoVencimento =
    dadosHome?.certificadosPertoVencimento ?? [];

  const { user } = useUser();
  const router = useRouter();

  const nome: string = user?.user?.employee?.name ?? user?.employee?.name ?? "";

  const primeiroNome = nome.trim().split(/\s+/)[0];
  const iniciais = getIniciais(nome);

  const dataAtual = new Date();
  const diaSemana = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
  }).format(dataAtual);
  const diaMes = new Intl.DateTimeFormat("pt-BR", { day: "numeric" }).format(
    dataAtual,
  );
  const mes = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(
    dataAtual,
  );
  const diaSemanaFormatado =
    diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1);
  const dataCompleta = `${diaSemanaFormatado}, ${diaMes} de ${mes}`;

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
      <View style={[globalStyles.container, styles.content]}>
        <View style={[globalStyles.row, styles.userMenu]}>
          <View>
            <Text style={[typography.h2, styles.avatar, globalStyles.ps]}>
              {iniciais}
            </Text>
          </View>
          <View>
            <Text style={typography.h2}>
              {primeiroNome ? `Olá, ${primeiroNome}` : "Olá"}
            </Text>
            <Text>{dataCompleta}</Text>
          </View>
        </View>
        <LinearGradient
          {...gradients.primary}
          style={[globalStyles.pm, styles.conformidadeCard]}
        >
          <View style={[globalStyles.row, styles.conformidadeHeader]}>
            <Text style={[styles.textWhite, typography.bold]}>
              Índice de conformidade
            </Text>
            <Text style={globalStyles.span}>Todos os setores</Text>
          </View>
          <View>
            <View style={[globalStyles.row, styles.conformidadeTextRow]}>
              <Text style={[styles.textWhite, typography.p]}>
                <Text style={[typography.bigFont]}>{conformidade}%</Text> das
                convocações em dia
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[styles.progressFill, { width: `${conformidade}%` }]}
              ></View>
            </View>
          </View>
          <View style={[globalStyles.row, styles.statsRow]}>
            <View>
              <Text style={[typography.h2, styles.textWhite]}>{ativos}</Text>
              <Text style={[styles.textWhite, typography.p]}>Ativos</Text>
            </View>
            <View>
              <Text style={[typography.h2, styles.textWhite]}>
                {totalCertificados}
              </Text>
              <Text style={[styles.textWhite, typography.p]}>
                Com certificados
              </Text>
            </View>
            <View>
              <Text style={[typography.h2, styles.textWhite]}>
                {certificadosIrregulares}
              </Text>
              <Text style={[styles.textWhite, typography.p]}>
                Irregularidades
              </Text>
            </View>
          </View>
        </LinearGradient>
        <View style={styles.section}>
          <Text style={[typography.h3, typography.bold, styles.sectionTitle]}>
            Precisa de atenção
          </Text>
          <View style={[globalStyles.row, styles.atencaoRow]}>
            <View style={[globalStyles.box, globalStyles.ps, styles.atencaoCard]}>
              <View style={[globalStyles.iconp, styles.atencaoIconAmarelo]}>
                <Clock color={"#BA8E23"} size={20} />
              </View>
              <Text style={typography.h2}>
                {certificadosPertoVencimento.length}
              </Text>
              <Text style={typography.p}>A vencer em 60 dias</Text>
            </View>
            <View style={[globalStyles.box, globalStyles.ps, styles.atencaoCard]}>
              <View style={[globalStyles.iconp, styles.atencaoIconVermelho]}>
                <CircleX color={"red"} size={20} />
              </View>
              <Text style={typography.h2}>{certificadosIrregulares}</Text>
              <Text style={typography.p}>Certificados vencidos</Text>
            </View>
          </View>
        </View>
        <View style={styles.sectionGap}>
          <Text style={[typography.h3, typography.bold, styles.sectionTitle]}>
            Ações rápidas
          </Text>
          <View style={[globalStyles.row, styles.acoesRow]}>
            {acoesRapidas.map(({ icon: Icon, label, href }) => (
              <TouchableOpacity
                key={label}
                onPress={href ? () => router.push(href) : undefined}
                style={[globalStyles.flex, styles.acaoItem]}
              >
                <View
                  style={[globalStyles.iconp, globalStyles.border, styles.acaoIcon]}
                >
                  <Icon color={"#4b5ce3"} size={30} strokeWidth={1.5} />
                </View>
                <Text style={[typography.p, styles.acaoLabel]}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.sectionGap}>
          <View style={[globalStyles.row, styles.venceHeader]}>
            <Text style={[typography.h3, typography.bold, styles.sectionTitle]}>
              Vence em breve
            </Text>
            <TouchableOpacity>
              <Text style={[typography.h3, typography.primary]}>Ver todos</Text>
            </TouchableOpacity>
          </View>
          {certificadosPertoVencimento.length === 0 ? (
            <Text style={typography.p}>Nenhum certificado vencendo em breve</Text>
          ) : (
            certificadosPertoVencimento.map((item: any, index: number) => {
              const card = toCardVenceEmBreve(item);
              return (
                <CardVenceEmBreve
                  key={item?.id ?? index}
                  nome={card.nome}
                  descricao={card.descricao}
                  dias={card.dias}
                />
              );
            })
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scroll: {
    backgroundColor: "#F2FAFE",
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    padding: 10,
    gap: 20,
    justifyContent: "flex-start",
  },
  userMenu: {
    gap: 4,
    alignSelf: "flex-start",
  },
  avatar: {
    backgroundColor: "#4b5ce3",
    color: "#fff",
    borderRadius: 100,
  },
  textWhite: {
    color: "#fff",
  },
  conformidadeCard: {
    width: "100%",
    borderRadius: 20,
  },
  conformidadeHeader: {
    width: "100%",
    justifyContent: "space-between",
  },
  conformidadeTextRow: {
    alignItems: "flex-end",
  },
  progressTrack: {
    width: "100%",
    backgroundColor: "#fff",
    height: 10,
    borderRadius: 100,
  },
  progressFill: {
    backgroundColor: "#a8b2fd",
    height: "100%",
    borderRadius: 100,
  },
  statsRow: {
    justifyContent: "space-between",
  },
  section: {
    width: "100%",
  },
  sectionGap: {
    width: "100%",
    gap: 10,
  },
  sectionTitle: {
    alignSelf: "flex-start",
  },
  atencaoRow: {
    justifyContent: "space-around",
  },
  atencaoCard: {
    backgroundColor: "#fff",
  },
  atencaoIconAmarelo: {
    backgroundColor: "#fae2a7",
    alignSelf: "flex-start",
    borderRadius: 10,
  },
  atencaoIconVermelho: {
    backgroundColor: "#f7d3d3",
    alignSelf: "flex-start",
    borderRadius: 10,
  },
  acoesRow: {
    alignItems: "flex-start",
  },
  acaoItem: {
    alignItems: "center",
    gap: 6,
  },
  acaoIcon: {
    backgroundColor: "#fff",
  },
  acaoLabel: {
    textAlign: "center",
  },
  venceHeader: {
    justifyContent: "space-between",
  },
});
