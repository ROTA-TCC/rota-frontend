import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { SocialLoginRow } from '@/components/auth/SocialLoginRow';
import { colors, radius, spacing, typography } from '@/theme';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../../assets/onboarding/fundo-onboarding.jpg')}
        style={styles.heroImage}
        resizeMode="cover"
      />

      <View style={styles.card}>
        <Text style={styles.title}>está a apenas alguns passos do Rota</Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.8}
        >
          <Text style={styles.loginText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.dividerText}>Ou continue com</Text>

        <SocialLoginRow variant="dark" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.screenLight,
  },
  heroImage: {
    flex: 0.65,
    backgroundColor: colors.primaryTint,
  },
  card: {
    flex: 0.4,
    backgroundColor: colors.surfaceOnboarding,
    borderTopLeftRadius: radius.xxl,
    borderTopRightRadius: radius.xxl,
    padding: spacing.xxxl,
    marginTop: -20,
    justifyContent: 'center',
  },
  title: {
    color: colors.text,
    fontSize: 22,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.xxxl,
    textAlign: 'center',
  },
  loginButton: {
    borderWidth: 2,
    borderColor: colors.primarySoft,
    backgroundColor: 'transparent',
    height: 60,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.giant,
  },
  loginText: {
    color: colors.primarySoft,
    fontSize: typography.sizes.input,
    fontWeight: typography.weights.bold,
  },
  dividerText: {
    color: colors.textSoftAlt,
    fontSize: typography.sizes.bodyLg,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
});
