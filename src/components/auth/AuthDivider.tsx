import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAuthTheme, type AuthTheme } from '@/constants/authTheme';

interface AuthDividerProps {
  label?: string;
}

export function AuthDivider({ label = 'ou' }: AuthDividerProps) {
  const theme = useAuthTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.line} />
      <Text style={styles.label}>{label}</Text>
      <View style={styles.line} />
    </View>
  );
}

const createStyles = (theme: AuthTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 16,
    },
    line: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    label: {
      marginHorizontal: 12,
      fontSize: 13,
      color: theme.textMuted,
    },
  });
