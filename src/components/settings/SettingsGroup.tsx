import React, { Children, Fragment, useMemo, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSettingsColors, type SettingsPalette } from '@/constants/settingsTheme';

interface SettingsGroupProps {
  children: ReactNode;
}

export function SettingsGroup({ children }: SettingsGroupProps) {
  const colors = useSettingsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const items = Children.toArray(children);

  return (
    <View style={styles.container}>
      {items.map((item, index) => (
        <Fragment key={index}>
          {item}
          {index < items.length - 1 && <View style={styles.divider} />}
        </Fragment>
      ))}
    </View>
  );
}

const createStyles = (colors: SettingsPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 4,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
    },
  });
