import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RecordScreen() {
  const router = useRouter();

  const handleSelectType = (type: string) => {
    router.push(`/run/active-run?type=${type}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Selecionar Atividade</Text>
        <Text style={styles.subtitle}>Escolha o modo ideal para o seu treino de hoje</Text>
      </View>

      <View style={styles.optionsContainer}>
        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => handleSelectType('normal')}>
          <Ionicons name="play-outline" size={24} color="#ff4500" style={styles.icon} />
          <Text style={styles.buttonText}>Corrida Normal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => handleSelectType('trail')}>
          <Ionicons name="trail-sign-outline" size={24} color="#ff4500" style={styles.icon} />
          <Text style={styles.buttonText}>Trilha</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => handleSelectType('walk')}>
          <Ionicons name="walk-outline" size={24} color="#ff4500" style={styles.icon} />
          <Text style={styles.buttonText}>Caminhada</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} activeOpacity={0.7} onPress={() => handleSelectType('treadmill')}>
          <Ionicons name="fitness-outline" size={24} color="#ff4500" style={styles.icon} />
          <Text style={styles.buttonText}>Esteira</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212', paddingHorizontal: 24, justifyContent: 'center' },
  header: { marginBottom: 36, alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#ffffff', marginBottom: 8, fontFamily: 'Eina03-SemiBold' },
  subtitle: { fontSize: 14, color: '#888888', textAlign: 'center', fontFamily: 'Eina03-SemiBold' },
  optionsContainer: { gap: 16 },
  button: {
    flexDirection: 'row',
    alignItem: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ff4500',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  icon: { marginRight: 12 },
  buttonText: { color: '#ff4500', fontSize: 18, fontWeight: '600', fontFamily: 'Eina03-SemiBold' },
});

