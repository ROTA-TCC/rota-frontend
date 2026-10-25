import React, { useMemo } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import GoogleColorIcon from '@/components/social-icons/GoogleColorIcon';
import AppleIcon from '@/components/social-icons/AppleIcon';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';

export type SocialProvider = 'google' | 'apple';

interface SocialAuthButtonsProps {
  onPress?: (provider: SocialProvider) => void;
}

export function SocialAuthButtons({ onPress }: SocialAuthButtonsProps) {
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handlePress = (provider: SocialProvider) => {
    if (onPress) {
      onPress(provider);
      return;
    }

    Alert.alert('Em breve', 'Login social estará disponível em breve.');
  };

  return (
    <View style={styles.container}>
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => handlePress('google')}
        accessibilityRole="button"
        accessibilityLabel="Continuar com Google"
      >
        <GoogleColorIcon size={18} />
        <Text style={styles.buttonText}>Google</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => handlePress('apple')}
        accessibilityRole="button"
        accessibilityLabel="Continuar com Apple"
      >
        <AppleIcon size={18} color={theme.text} />
        <Text style={styles.buttonText}>Apple</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 12,
      marginTop: 22,
    },
    button: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: 48,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
    },
    buttonPressed: {
      backgroundColor: theme.surfacePressed,
    },
    buttonText: {
      fontSize: 14,
      fontWeight: '600',
      color: theme.text,
    },
  });
