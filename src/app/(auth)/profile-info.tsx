import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { PickerModal } from '@/components/PickerModal';

export default function ProfileInfoScreen() {
  const router = useRouter();
  const accentColor = Colors.dark.tint;

  const [weight, setWeight] = useState('70.3 kg');
  const [height, setHeight] = useState('175 cm');
  const [age, setAge] = useState('24 anos');

  const [activePicker, setActivePicker] = useState<'weight' | 'height' | 'age' | null>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemedView style={styles.container}>
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <Image
            source={require('../../../assets/images/background-blur.png')}
            style={[styles.glowImage, styles.topGlow]}
            resizeMode="cover"
          />
          <Image
            source={require('../../../assets/images/background-blur.png')}
            style={[styles.glowImage, styles.bottomGlow]}
            resizeMode="cover"
          />
        </View>

        <View style={styles.header}>
          <View style={styles.progressBar}>
            <View style={[styles.step, styles.activeStep, { backgroundColor: accentColor }]} />
            <View style={styles.step} />
            <View style={styles.step} />
          </View>

          <ThemedText style={[styles.subtitle, { color: accentColor }]}>Informações pessoais</ThemedText>
          <ThemedText type="title" style={styles.title}>Informações do perfil</ThemedText>
          <ThemedText style={styles.description}>
            As informações do seu perfil desempenham um papel fundamental na personalização do acompanhamento de determinadas métricas.
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.inputPill} onPress={() => setActivePicker('weight')}>
            <ThemedText style={styles.inputLabel}>Peso</ThemedText>
            <View style={[styles.inputValue, { backgroundColor: '#222222' }]}>
              <ThemedText style={{ color: accentColor }}>{weight}</ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputPill} onPress={() => setActivePicker('height')}>
            <ThemedText style={styles.inputLabel}>Altura</ThemedText>
            <View style={[styles.inputValue, { backgroundColor: '#222222' }]}>
              <ThemedText style={{ color: accentColor }}>{height}</ThemedText>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.inputPill} onPress={() => setActivePicker('age')}>
            <ThemedText style={styles.inputLabel}>Idade</ThemedText>
            <View style={[styles.inputValue, { backgroundColor: '#222222' }]}>
              <ThemedText style={{ color: accentColor }}>{age}</ThemedText>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.btnNext, { backgroundColor: accentColor }]}
            onPress={() => router.push('/set-goals')}
            activeOpacity={0.85}
          >
            <ThemedText style={styles.btnNextText}>Próximo</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnSkip}
            onPress={() => router.push('/set-goals')}
            activeOpacity={0.7}
          >
            <ThemedText style={[styles.btnSkipText, { color: accentColor }]}>Pular</ThemedText>
          </TouchableOpacity>
        </View>

        <PickerModal
          isVisible={activePicker === 'weight'}
          onClose={() => setActivePicker(null)}
          title="Peso"
          min={40}
          max={150}
          step={0.1}
          decimals={1}
          unit="kg"
          selectedValue={weight}
          onSelect={(value) => {
            setWeight(value);
            setActivePicker(null);
          }}
        />

        <PickerModal
          isVisible={activePicker === 'height'}
          onClose={() => setActivePicker(null)}
          title="Altura"
          min={140}
          max={220}
          step={1}
          decimals={0}
          unit="cm"
          selectedValue={height}
          onSelect={(value) => {
            setHeight(value);
            setActivePicker(null);
          }}
        />

        <PickerModal
          isVisible={activePicker === 'age'}
          onClose={() => setActivePicker(null)}
          title="Idade"
          min={15}
          max={90}
          step={1}
          decimals={0}
          unit="anos"
          selectedValue={age}
          onSelect={(value) => {
            setAge(value);
            setActivePicker(null);
          }}
        />
      </ThemedView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 40,
    overflow: 'hidden',
  },
  glowImage: {
    position: 'absolute',
    width: 320,
    height: 320,
    opacity: 0.5,
  },
  topGlow: {
    top: -60,
    right: -60,
  },
  bottomGlow: {
    bottom: -60,
    left: -60,
    transform: [{ rotate: '180deg' }],
  },
  header: {
    marginBottom: 40,
  },
  progressBar: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 24,
  },
  step: {
    height: 3,
    borderRadius: 2,
    backgroundColor: '#2A2A2A',
    width: 12,
  },
  activeStep: {
    width: 24,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  title: {
    marginBottom: 16,
  },
  description: {
    color: '#828282',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 20,
  },
  formContainer: {
    gap: 16,
  },
  inputPill: {
    backgroundColor: '#151515',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  inputValue: {
    height: 40,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: 16,
  },
  btnNext: {
    height: 56,
    paddingHorizontal: 48,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNextText: {
    color: '#0A0F09',
    fontWeight: '700',
    fontSize: 15,
  },
  btnSkip: {
    padding: 10,
  },
  btnSkipText: {
    fontWeight: '600',
    fontSize: 14,
  },
});
