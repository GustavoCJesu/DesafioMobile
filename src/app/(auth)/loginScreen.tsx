import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { ScreenContainer } from "@/components/ScreenContainer";

//Import dos icones
import {
  ShieldCheck,
  CircleCheck,
  User,
  Lock,
  MoveRight,
  Eye,
  EyeClosed,
} from "lucide-react-native";

//Import gradients
import { gradients } from "../../styles/gradientList";
import { LinearGradient } from "expo-linear-gradient";

import { typography } from "../../styles/typography";
import { globalStyles } from "../../styles/globalStyles";

import { SafeAreaView } from "react-native-safe-area-context"; // Importe daqui!
import { Label, Redirect, useRouter } from "expo-router";
import { useState } from "react";

import { login } from "../../../services/serviceLogin";

export default function loginScreen() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [hidePassword, setHidePassword] = useState(true);
  const [error, setError] = useState(false);

  const router = useRouter()

  const handleLogin = async (email: string, senha: string) => {
    if (!email || !senha) {
      setError(true);
      return;
    }

    try {
      const response = await login(email, senha);
      router.replace('/(app)/homeScreen')
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  return (
    <KeyboardAvoidingView style={globalStyles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <LinearGradient {...gradients.primary} style={globalStyles.container}>
        <SafeAreaView style={[globalStyles.container]}>
          <View
            style={[
              globalStyles.container,
              { padding: 20, justifyContent: "space-evenly" },
            ]}
          >
            <View style={[globalStyles.row, { gap: 5, alignSelf: "baseline" }]}>
              <View>
                <ShieldCheck color={"#fff"} size={40} />
              </View>
              <View>
                <Text style={{ color: "white", fontWeight: "500" }}>
                  Gestão SST
                </Text>
                <Text style={{ color: "white", fontWeight: "500" }}>
                  Pessoas & Segurança
                </Text>
              </View>
            </View>
            <View style={[]}>
              <Text style={[typography.h1, { color: "#fff" }]}>
                Cargos, treinamentos e EPIs na palma da mão
              </Text>
              <Text style={[typography.p, { color: "#fff" }]}>
                Acompanhe a conformidade da sua equipe de qualquer lugar.
              </Text>
            </View>
            <View style={[{ gap: 10, alignSelf: "flex-start" }]}>
              <View style={[globalStyles.row, { gap: 10, width: "100%" }]}>
                <View
                  style={[
                    globalStyles.row,
                    {
                      gap: 5,
                      backgroundColor: "rgb(255, 255, 255, 0.15)",
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      borderRadius: 40,
                    },
                  ]}
                >
                  <CircleCheck color={"#10b981"} />
                  <Text style={{ color: "#fff" }}>Funcionarios e Cargos</Text>
                </View>
                <View
                  style={[
                    globalStyles.row,
                    {
                      gap: 5,
                      backgroundColor: "rgb(255, 255, 255, 0.15)",
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      borderRadius: 40,
                    },
                  ]}
                >
                  <CircleCheck color={"#10b981"} />
                  <Text style={{ color: "#fff" }}>EPIs por CA</Text>
                </View>
              </View>
              <View
                style={[
                  globalStyles.row,
                  {
                    gap: 5,
                    backgroundColor: "rgb(255, 255, 255, 0.15)",
                    paddingVertical: 4,
                    paddingHorizontal: 10,
                    borderRadius: 40,
                    width: "100%",
                  },
                ]}
              >
                <CircleCheck color={"#10b981"} />
                <Text style={{ color: "#fff" }}>Certificados de NRs</Text>
              </View>
            </View>
          </View>
          <View
            style={[
              {
                backgroundColor: "#fff",
                width: "100%",
                borderTopEndRadius: 30,
                borderTopStartRadius: 30,
                gap: 15,
              },
              globalStyles.container,
              globalStyles.column,
              globalStyles.pm,
            ]}
          >
            <View style={{ alignSelf: "baseline" }}>
              <Text style={typography.h2}>Bem-vindo de volta</Text>
              <Text style={typography.p}>
                Entre com seu e-mail ou matrícula para continuar.
              </Text>
            </View>
            <View style={[{ alignSelf: "baseline", width: "100%", gap: 5 }]}>
              <Text style={typography.h3}>E-mail ou matrícula</Text>
              <View
                style={[
                  globalStyles.box,
                  globalStyles.row,
                  { width: "100%" },
                  globalStyles.input,
                ]}
              >
                <User />
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="E-mail"
                  onChangeText={setEmail}
                  value={email}
                />
              </View>
            </View>
            <View style={[{ alignSelf: "baseline", width: "100%", gap: 5 }]}>
              <Text style={typography.h3}>Senha</Text>
              <View
                style={[
                  globalStyles.box,
                  globalStyles.row,
                  { width: "100%" },
                  globalStyles.input,
                ]}
              >
                <Lock />
                <TextInput
                  style={{ flex: 1 }}
                  placeholder="Senha"
                  secureTextEntry={hidePassword}
                  onChangeText={setPassword}
                  value={password}
                />
                <TouchableOpacity
                  onPress={() => setHidePassword(!hidePassword)}
                >
                  {hidePassword ? <Eye /> : <EyeClosed />}
                </TouchableOpacity>
              </View>
            </View>
            {error ? (
              <Text style={typography.error}>Preencha todos os campos!</Text>
            ) : null}

            <View style={[{ alignSelf: "center" }, globalStyles.row]}>
              <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleLogin(email, password)}
              >
                <LinearGradient
                  {...gradients.primary}
                  style={[
                    globalStyles.row,
                    globalStyles.ps,
                    { justifyContent: "center", borderRadius: 10 },
                  ]}
                >
                  <Text style={[typography.h2, { color: "#fff" }]}>Entrar</Text>
                  <MoveRight color={"#fff"} size={30} />
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}
