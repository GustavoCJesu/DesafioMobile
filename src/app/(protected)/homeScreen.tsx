import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
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

// Um único ponto para adaptar o formato dos certificados que a API devolver
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

  // Logo após o login o contexto tem { user, employee }; depois do /me, { user: { employee } }
  const nome: string = user?.user?.employee?.name ?? user?.employee?.name ?? "";

  //Formatação do Nome
  const primeiroNome = nome.trim().split(/\s+/)[0];
  const iniciais = getIniciais(nome);

  //Formatação Data
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ backgroundColor: "#F2FAFE" }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View
        style={[
          globalStyles.container,
          { padding: 10, gap: 20, justifyContent: "flex-start" },
        ]}
      >
        {/* Menu do usuario */}
        <View style={[globalStyles.row, { gap: 4, alignSelf: "flex-start" }]}>
          <View>
            <Text
              style={[
                typography.h2,
                {
                  backgroundColor: "#4b5ce3",
                  color: "#fff",
                  borderRadius: 100,
                },
                globalStyles.ps,
              ]}
            >
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
        {/* Seção Indice de conformidade e outras informações */}
        <LinearGradient
          {...gradients.primary}
          style={[globalStyles.pm, { width: "100%", borderRadius: 20 }]}
        >
          <View
            style={[
              globalStyles.row,
              { width: "100%", justifyContent: "space-between" },
            ]}
          >
            <Text style={[{ color: "#fff" }, typography.bold]}>
              Índice de conformidade
            </Text>
            <Text style={globalStyles.span}>Todos os setores</Text>
          </View>
          <View>
            <View style={[globalStyles.row, { alignItems: "flex-end" }]}>
              <Text style={[{ color: "#fff" }, typography.p]}>
                <Text style={[typography.bigFont]}>{conformidade}%</Text> das
                convocações em dia
              </Text>
            </View>
            <View
              style={{
                width: "100%",
                backgroundColor: "#fff",
                height: 10,
                borderRadius: 100,
              }}
            >
              <View
                style={{
                  backgroundColor: "#a8b2fd",
                  width: `${conformidade}%`,
                  height: "100%",
                  borderRadius: 100,
                }}
              ></View>
            </View>
          </View>
          <View style={[globalStyles.row, { justifyContent: "space-between" }]}>
            <View>
              <Text style={[typography.h2, { color: "#fff" }]}>{ativos}</Text>
              <Text style={[{ color: "#fff" }, typography.p]}>Ativos</Text>
            </View>
            <View>
              <Text style={[typography.h2, { color: "#fff" }]}>
                {totalCertificados}
              </Text>
              <Text style={[{ color: "#fff" }, typography.p]}>
                Com certificados
              </Text>
            </View>
            <View>
              <Text style={[typography.h2, { color: "#fff" }]}>
                {certificadosIrregulares}
              </Text>
              <Text style={[{ color: "#fff" }, typography.p]}>
                Irregularidades
              </Text>
            </View>
          </View>
        </LinearGradient>
        {/* Seção Indice de conformidade e outras informações  - FIM*/}
        {/* Seção 'Precisa de Atenção' */}
        <View style={[{ width: "100%" }]}>
          <Text
            style={[
              typography.h3,
              typography.bold,
              { alignSelf: "flex-start" },
            ]}
          >
            Precisa de atenção
          </Text>
          <View style={[globalStyles.row, { justifyContent: "space-around" }]}>
            <View
              style={[
                globalStyles.box,
                globalStyles.ps,
                { backgroundColor: "#fff" },
              ]}
            >
              <View
                style={[
                  globalStyles.iconp,
                  {
                    backgroundColor: "#fae2a7",
                    alignSelf: "flex-start",
                    borderRadius: 10,
                  },
                ]}
              >
                <Clock color={"#BA8E23"} size={20} />
              </View>
              <Text style={typography.h2}>
                {certificadosPertoVencimento.length}
              </Text>
              <Text style={typography.p}>A vencer em 60 dias</Text>
            </View>
            <View
              style={[
                globalStyles.box,
                globalStyles.ps,
                { backgroundColor: "#fff" },
              ]}
            >
              <View
                style={[
                  globalStyles.iconp,
                  {
                    backgroundColor: "#f7d3d3",
                    alignSelf: "flex-start",
                    borderRadius: 10,
                  },
                ]}
              >
                <CircleX color={"red"} size={20} />
              </View>
              <Text style={typography.h2}>{certificadosIrregulares}</Text>
              <Text style={typography.p}>Certificados vencidos</Text>
            </View>
          </View>
        </View>
        {/* Seção 'Precisa de Atenção' - FIM */}
        {/* Ações Rapidas */}
        <View style={{ width: "100%", gap: 10 }}>
          <Text
            style={[
              typography.h3,
              typography.bold,
              { alignSelf: "flex-start" },
            ]}
          >
            Ações rápidas
          </Text>
          <View style={[globalStyles.row, { alignItems: "flex-start" }]}>
            {acoesRapidas.map(({ icon: Icon, label, href }) => (
              <TouchableOpacity
                key={label}
                onPress={href ? () => router.push(href) : undefined}
                style={[globalStyles.flex, { alignItems: "center", gap: 6 }]}
              >
                <View
                  style={[
                    globalStyles.iconp,
                    globalStyles.border,
                    { backgroundColor: "#fff" },
                  ]}
                >
                  <Icon color={"#4b5ce3"} size={30} strokeWidth={1.5} />
                </View>
                <Text style={[typography.p, { textAlign: "center" }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Ações Rapidas - FIM*/}
        <View style={{ width: "100%", gap: 10 }}>
          <View style={[globalStyles.row, { justifyContent: "space-between" }]}>
            <Text
              style={[
                typography.h3,
                typography.bold,
                { alignSelf: "flex-start" },
              ]}
            >
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
