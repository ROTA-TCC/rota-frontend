import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AuthHeader } from '@/components/auth/AuthHeader';
import { SocialLoginRow } from '@/components/auth/SocialLoginRow';
import { authStyles } from '@/components/auth/authStyles';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme';
import { toFieldErrors } from '@/utils/formErrors';
import { LoginDto } from '@ROTA-TCC/types';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginDto>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    setLoading(true);
    setErrors({});
    try {
      await login(formData);
    } catch (error: unknown) {
      setErrors(toFieldErrors(error, 'Falha ao fazer login'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <AuthHeader title="Login" />

      <View style={authStyles.content}>
        <View style={authStyles.formCard}>
          <ThemedText style={authStyles.cardTitle}>Bem Vindo de Volta!</ThemedText>
          <TextInput
            style={[authStyles.input, errors.email && authStyles.inputError]}
            placeholder="Email"
            placeholderTextColor={colors.textDim}
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, email: text }));
              setErrors((prev) => ({ ...prev, email: '' }));
            }}
          />
          {errors.email && <Text style={authStyles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[authStyles.input, errors.password && authStyles.inputError]}
            placeholder="Senha"
            placeholderTextColor={colors.textDim}
            secureTextEntry
            value={formData.password}
            onChangeText={(text) => {
              setFormData((prev) => ({ ...prev, password: text }));
              setErrors((prev) => ({ ...prev, password: '' }));
            }}
          />
          {errors.password && <Text style={authStyles.errorText}>{errors.password}</Text>}

          {errors.general && (
            <Text style={[authStyles.errorText, styles.errorCentered]}>{errors.general}</Text>
          )}
        </View>

        <View style={authStyles.divider}>
          <View style={authStyles.dividerLine} />
          <ThemedText style={authStyles.dividerText}>Ou</ThemedText>
          <View style={authStyles.dividerLine} />
        </View>

        <SocialLoginRow />

        <Pressable style={authStyles.submitButton} onPress={handleLogin} disabled={loading}>
          <ThemedText style={authStyles.submitText}>
            {loading ? 'Entrando...' : 'Entrar'}
          </ThemedText>
        </Pressable>

        <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')}>
          <ThemedText style={authStyles.switchLink}>Ainda não tenho conta</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenLight },
  errorCentered: { textAlign: 'center' },
});
