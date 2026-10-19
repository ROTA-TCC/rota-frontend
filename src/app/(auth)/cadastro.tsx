import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { AuthHeader } from '@/components/auth/AuthHeader';
import { SocialLoginRow } from '@/components/auth/SocialLoginRow';
import { authStyles } from '@/components/auth/authStyles';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/providers/AuthProvider';
import { colors } from '@/theme';
import { toFieldErrors } from '@/utils/formErrors';

export default function CadastroScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [alias, setAlias] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleRegister = async () => {
    setLoading(true);
    setErrors({});
    try {
      await register(alias, email, password);
      Alert.alert('Sucesso', 'Conta criada com sucesso!');
      router.push('/(auth)/profile-info');
    } catch (error: unknown) {
      setErrors(toFieldErrors(error, 'Falha ao cadastrar'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <AuthHeader title="Cadastro" />

      <View style={authStyles.content}>
        <View style={authStyles.formCard}>
          <ThemedText style={authStyles.cardTitle}>Bem Vindo!</ThemedText>
          <TextInput
            style={[authStyles.input, errors.alias && authStyles.inputError]}
            placeholder="Nome do usuário"
            placeholderTextColor={colors.textDim}
            value={alias}
            onChangeText={(text) => {
              setAlias(text);
              setErrors((prev) => ({ ...prev, alias: '' }));
            }}
          />
          {errors.alias && <Text style={authStyles.errorText}>{errors.alias}</Text>}

          <TextInput
            style={[authStyles.input, errors.email && authStyles.inputError]}
            placeholder="Email"
            placeholderTextColor={colors.textDim}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setErrors((prev) => ({ ...prev, email: '' }));
            }}
          />
          {errors.email && <Text style={authStyles.errorText}>{errors.email}</Text>}

          <TextInput
            style={[authStyles.input, errors.password && authStyles.inputError]}
            placeholder="Senha"
            placeholderTextColor={colors.textDim}
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
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

        <Pressable style={authStyles.submitButton} onPress={handleRegister} disabled={loading}>
          <ThemedText style={authStyles.submitText}>
            {loading ? 'Cadastrando...' : 'Concluir'}
          </ThemedText>
        </Pressable>

        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <ThemedText style={authStyles.switchLink}>Já tenho uma conta</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.screenLight },
  errorCentered: { textAlign: 'center' },
});
