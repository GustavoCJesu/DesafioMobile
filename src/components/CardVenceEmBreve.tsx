import { globalStyles } from "@/styles/globalStyles";
import { typography } from "@/styles/typography";
import { Text, View } from "react-native";

type Props = {
  nome: string;
  descricao: string;
  dias: number | null;
};

function getIniciais(nome: string) {
  const partes = nome.trim().split(/\s+/).filter(Boolean);
  if (partes.length === 0) return "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return `${partes[0][0]}${ultima}`.toUpperCase();
}

export function CardVenceEmBreve({ nome, descricao, dias }: Props) {
  return (
    <View style={[globalStyles.box, { flex: 0, margin: 0 }]}>
      <View
        style={[
          globalStyles.row,
          {
            gap: 10,
            width: "100%",
            padding: 10,
            backgroundColor: "#fff",
            borderRadius: 10,
          },
        ]}
      >
        <View
          style={{
            backgroundColor: "rgba(75, 92, 227, 0.3)",
            borderRadius: 100,
          }}
        >
          <Text style={[typography.h2, globalStyles.iconp, typography.primary]}>
            {getIniciais(nome)}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={typography.h3} numberOfLines={1}>
            {nome}
          </Text>
          <Text style={[typography.p, { fontSize: 14 }]} numberOfLines={1}>
            {descricao}
          </Text>
        </View>
        {dias !== null && (
          <Text style={globalStyles.alertSpan}>{dias} Dias</Text>
        )}
      </View>
    </View>
  );
}
