import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

const ORANGE = '#FF8C00';

interface PrivacyFooterProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function PrivacyFooter({ onComplete, onSkip }: PrivacyFooterProps) {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={styles.btnNext}
        onPress={onComplete}
        activeOpacity={0.85}
      >
        <Text style={styles.btnNextText}>Concluir</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.btnSkip}
        onPress={onSkip}
        activeOpacity={0.7}
      >
        <Text style={styles.btnSkipText}>Pular</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    gap: 14,
    marginTop: 16,
  },
  btnNext: {
    backgroundColor: ORANGE,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  btnNextText: {
    color: '#0A0F09',
    fontWeight: '700',
    fontSize: 15,
  },
  btnSkip: {
    padding: 6,
  },
  btnSkipText: {
    color: ORANGE,
    fontWeight: '600',
    fontSize: 14,
  },
});
