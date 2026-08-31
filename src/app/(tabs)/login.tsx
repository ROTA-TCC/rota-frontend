import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';

import { ThemedText } from '@/components/ui/themed-text';
import { ThemedView } from '@/components/ui/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const textColor = useThemeColor({}, 'text');
  const iconColor = useThemeColor({}, 'icon');

  function handleLogin() {
    // TODO: integrar com sua autenticação (API, Firebase, etc.)
    console.log('Login com:', email, password);
    router.replace('/(tabs)');
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ThemedView style={styles.container}>
        <Image
          source={require('@/assets/rota-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <ThemedText style={styles.subtitle}>
          Acesse sua conta para continuar
        </ThemedText>

        <TextInput
          style={[styles.input, { color: textColor, borderColor: iconColor }]}
          placeholder="E-mail"
          placeholderTextColor={iconColor}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[styles.input, { color: textColor, borderColor: iconColor }]}
          placeholder="Senha"
          placeholderTextColor={iconColor}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <ThemedText style={styles.buttonText}>Entrar</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <ThemedText style={[styles.link, { color: textColor }]}>
            Ainda não tem conta? Cadastre-se
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 12,
  },
  logo: {
    width: 200,
    height: 60,
    alignSelf: 'center',
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.6,
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
    backgroundColor: '#ff9a00',
  },
  buttonText: {
    color: '#0e0e0e',
    fontWeight: '700',
  },
  link: {
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
    textDecorationLine: 'underline',
  },
});
