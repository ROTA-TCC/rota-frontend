import React, { useMemo, type ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';

interface AuthScreenProps {
  title: string;
  subtitle: ReactNode;
  onBack: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthScreen({ title, subtitle, onBack, children, footer }: AuthScreenProps) {
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View>
            <Pressable
              onPress={onBack}
              hitSlop={8}
              style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
              accessibilityRole="button"
              accessibilityLabel="Voltar"
            >
              <Ionicons name="arrow-back" size={20} color={theme.text} />
            </Pressable>

            <View style={styles.header}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
            </View>

            {children}
          </View>

          {!!footer && <View style={styles.footer}>{footer}</View>}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export function AuthFooterLink({
  text,
  linkText,
  onPress,
}: {
  text: string;
  linkText: string;
  onPress: () => void;
}) {
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.footerRow}>
      <Text style={styles.footerText}>{text}</Text>
      <Pressable onPress={onPress} hitSlop={8} accessibilityRole="link">
        <Text style={styles.footerLink}>{linkText}</Text>
      </Pressable>
    </View>
  );
}

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.background,
    },
    safe: {
      flex: 1,
    },
    content: {
      flexGrow: 1,
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 8,
      paddingBottom: 24,
    },
    backButton: {
      width: 42,
      height: 42,
      borderRadius: 21,
      borderWidth: 1,
      borderColor: theme.border,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    backButtonPressed: {
      backgroundColor: theme.surfacePressed,
    },
    header: {
      alignItems: 'center',
      marginTop: 18,
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      letterSpacing: -0.5,
      color: theme.text,
      marginBottom: 6,
    },
    subtitle: {
      fontSize: 12,
      lineHeight: 17,
      textAlign: 'center',
      color: theme.textMuted,
      paddingHorizontal: 10,
    },
    footer: {
      marginTop: 32,
      alignItems: 'center',
    },
    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    footerText: {
      fontSize: 13.5,
      color: theme.textMuted,
    },
    footerLink: {
      fontSize: 13.5,
      fontWeight: '600',
      color: theme.link,
      textDecorationLine: 'underline',
    },
  });
