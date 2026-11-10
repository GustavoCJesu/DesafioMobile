import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  ArrowRight,
  Check,
  ChevronLeft,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react-native";
import { portalColors, portalGradient } from "@/portal/theme";
import {usePortalSession} from "@/portal/providers/PortalSessionProvider";

type Campo = "email" | "senha";

export default function PortalLogin() {

  const {  signIn } = usePortalSession();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [lembrar, setLembrar] = useState(true);
  const [campoFocado, setCampoFocado] = useState<Campo | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  function voltarParaGestao() {
    router.replace("/loginScreen");
  }

  async function entrar() {
    if (!email.trim() || !senha) {
      setErro("Informe o e-mail e a senha.");
      return;
    }
    setErro(null);
    setCarregando(true);
    try {
      await signIn(email, senha);
    }catch(e){
      setErro(e instanceof Error ? e.message : 'Não foi possivel entrar.')
    } finally {
      setCarregando(false);
    }
  }

  if (carregando) {
    return (
      <LinearGradient {...portalGradient} style={styles.loading}>
        <ActivityIndicator size="large" color={portalColors.white} />
        <Text style={styles.loadingText}>Entrando...</Text>
      </LinearGradient>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        bounces={false}
      >
        <LinearGradient {...portalGradient} style={styles.hero}>
          <SafeAreaView edges={["top"]}>
            <View style={styles.topBar}>
              <Pressable
                onPress={voltarParaGestao}
                hitSlop={12}
                accessibilityLabel="Voltar para o Gestão SST"
              >
                <ChevronLeft size={26} color={portalColors.white} />
              </Pressable>
              <View style={styles.topBarSpacer} />
            </View>

            <View style={styles.heroBody}>
              <View style={styles.pill}>
                <View style={styles.pillDot} />
                <Text style={styles.pillText}>Retirada de EPIs</Text>
              </View>
              <Text style={styles.heroTitle}>Seus EPIs, sempre à mão.</Text>

              <View style={styles.heroRow}>
                <Text style={styles.heroSubtitle}>
                  Veja o que você retirou nos lockers e dispensers e quando é hora
                  de trocar.
                </Text>
                <View style={styles.locker}>
                  <View style={styles.lockerGrid}>
                    {Array.from({ length: 9 }).map((_, i) => (
                      <View
                        key={i}
                        style={[styles.lockerCell, i === 4 && styles.lockerCellActive]}
                      />
                    ))}
                  </View>
                  <View style={styles.lockerSlot} />
                </View>
              </View>
            </View>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.sheet}>
          <Text style={styles.sheetTitle}>Entrar</Text>
          <Text style={styles.sheetSubtitle}>
            Use o e-mail e a senha cadastrados no sistema de retirada.
          </Text>

          <Text style={styles.label}>E-mail</Text>
          <View
            style={[styles.input, campoFocado === "email" && styles.inputFocused]}
          >
            <Mail size={18} color={portalColors.muted} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              onFocus={() => setCampoFocado("email")}
              onBlur={() => setCampoFocado(null)}
              placeholder="Digite seu e-mail"
              placeholderTextColor="#94a3b8"
              keyboardType="email-address"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputText}
            />
          </View>

          <Text style={[styles.label, styles.labelSpaced]}>Senha</Text>
          <View style={[styles.input, campoFocado === "senha" && styles.inputFocused]}>
            <Lock size={18} color={portalColors.muted} />
            <TextInput
              value={senha}
              onChangeText={setSenha}
              onFocus={() => setCampoFocado("senha")}
              onBlur={() => setCampoFocado(null)}
              placeholder="Digite sua senha"
              placeholderTextColor="#94a3b8"
              secureTextEntry={!mostrarSenha}
              autoCapitalize="none"
              autoCorrect={false}
              style={styles.inputText}
            />
            <Pressable
              onPress={() => setMostrarSenha((v) => !v)}
              hitSlop={10}
              accessibilityLabel={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
            >
              {mostrarSenha ? (
                <EyeOff size={18} color={portalColors.muted} />
              ) : (
                <Eye size={18} color={portalColors.muted} />
              )}
            </Pressable>
          </View>

          {erro && (
            <Text style={styles.erro}>{erro}</Text>
          )}

          <View style={styles.optionsRow}>
            <Pressable style={styles.remember} onPress={() => setLembrar((v) => !v)}>
              <View style={[styles.checkbox, lembrar && styles.checkboxChecked]}>
                {lembrar && <Check size={14} color={portalColors.white} strokeWidth={3} />}
              </View>
              <Text style={styles.rememberText}>Lembrar de mim</Text>
            </Pressable>
            <Pressable hitSlop={8}>
              <Text style={styles.forgot}>Esqueci a senha</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={entrar}
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          >
            <Text style={styles.buttonText}>Entrar</Text>
            <ArrowRight size={18} color={portalColors.white} />
          </Pressable>

          <Pressable
            onPress={voltarParaGestao}
            style={({ pressed }) => [styles.gestaoButton, pressed && styles.gestaoButtonPressed]}
          >
            <ChevronLeft size={18} color={portalColors.primary} />
            <Text style={styles.gestaoButtonText}>Voltar para o Gestão SST</Text>
          </Pressable>

          <View style={styles.notice}>
            <ShieldCheck size={16} color={portalColors.primary} />
            <Text style={styles.noticeText}>
              Acesso conectado ao Gestão SST. Seus dados de retirada aparecem
              também no seu perfil.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: portalColors.white,
  },
  scrollContent: {
    flexGrow: 1,
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: {
    color: portalColors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  hero: {
    paddingHorizontal: 24,
    paddingBottom: 48,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  topBarSpacer: {
    width: 26,
  },
  logoBox: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.45)",
  },
  logoText: {
    color: portalColors.white,
    fontSize: 13,
  },
  heroBody: {
    marginTop: 24,
    gap: 12,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  pillDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#86efac",
  },
  pillText: {
    color: portalColors.white,
    fontSize: 12,
    fontWeight: "700",
  },
  heroTitle: {
    color: portalColors.white,
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    maxWidth: 270,
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  heroSubtitle: {
    flex: 1,
    color: "rgba(255,255,255,0.88)",
    fontSize: 15,
    lineHeight: 22,
  },
  locker: {
    width: 106,
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  lockerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  lockerCell: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.55)",
  },
  lockerCellActive: {
    backgroundColor: "#86efac",
    borderColor: "#86efac",
  },
  lockerSlot: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  sheet: {
    flex: 1,
    marginTop: -28,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: portalColors.white,
  },
  sheetTitle: {
    color: portalColors.text,
    fontSize: 26,
    fontWeight: "800",
  },
  sheetSubtitle: {
    color: portalColors.muted,
    fontSize: 14.5,
    lineHeight: 21,
    marginTop: 4,
    marginBottom: 20,
  },
  label: {
    color: portalColors.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  labelSpaced: {
    marginTop: 16,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    height: 54,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: portalColors.border,
    backgroundColor: "#f5f7f6",
  },
  inputFocused: {
    borderColor: portalColors.primary,
    backgroundColor: portalColors.mint,
  },
  inputText: {
    flex: 1,
    color: portalColors.text,
    fontSize: 15.5,
    paddingVertical: 0,
  },
  erro: {
    color: "#dc2626",
    fontSize: 13,
    marginTop: 10,
  },
  optionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
  },
  remember: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: portalColors.primary,
    borderColor: portalColors.primary,
  },
  rememberText: {
    color: "#334155",
    fontSize: 14.5,
  },
  forgot: {
    color: portalColors.primary,
    fontSize: 14.5,
    fontWeight: "700",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 54,
    borderRadius: 14,
    backgroundColor: portalColors.primary,
    elevation: 4,
    shadowColor: portalColors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  buttonPressed: {
    backgroundColor: portalColors.primaryDark,
  },
  buttonText: {
    color: portalColors.white,
    fontSize: 16,
    fontWeight: "700",
  },
  gestaoButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    height: 50,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: portalColors.primary,
  },
  gestaoButtonPressed: {
    backgroundColor: portalColors.mint,
  },
  gestaoButtonText: {
    color: portalColors.primary,
    fontSize: 15,
    fontWeight: "700",
  },
  notice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 28,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: portalColors.mintBorder,
    backgroundColor: portalColors.mint,
  },
  noticeText: {
    flex: 1,
    color: "#334155",
    fontSize: 12.5,
    lineHeight: 18,
  },
});
