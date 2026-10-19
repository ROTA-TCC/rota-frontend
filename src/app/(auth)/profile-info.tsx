import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';

import { OnboardingFooter } from '@/components/auth/OnboardingFooter';
import { ProfileFieldPill } from '@/components/profile/ProfileFieldPill';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GlowBackground } from '@/components/ui/GlowBackground';
import { ProgressSteps } from '@/components/ui/ProgressSteps';
import { PickerModal } from '@/components/ui/picker/PickerModal';
import { useProfileSetup } from '@/providers/ProfileSetupProvider';
import { colors, spacing, typography } from '@/theme';

export default function ProfileInfoScreen() {
  const router = useRouter();
  const accentColor = colors.primaryTint;
  const { updateProfileData } = useProfileSetup();

  const [weight, setWeight] = useState('70.3 kg');
  const [height, setHeight] = useState('175 cm');
  const [age, setAge] = useState('24 anos');
  const [activePicker, setActivePicker] = useState<'weight' | 'height' | 'age' | null>(null);

  const handleNext = () => {
    const peso = parseFloat(weight.replace(' kg', '').replace(',', '.'));
    const altura = parseFloat(height.replace(' cm', ''));
    const idade = parseFloat(age.replace(' anos', ''));
    updateProfileData({ peso, altura, idade });
    router.push('/set-goals');
  };

  const goToNextStep = () => router.push('/set-goals');

  return (
    <GestureHandlerRootView style={styles.root}>
      <ThemedView style={styles.container}>
        <GlowBackground offset={60} opacity={0.5} />

        <View style={styles.header}>
          <ProgressSteps activeStep={0} accentColor={accentColor} />

          <ThemedText style={[styles.subtitle, { color: accentColor }]}>
            Informações pessoais
          </ThemedText>
          <ThemedText type="title" style={styles.title}>
            Informações do perfil
          </ThemedText>
          <ThemedText style={styles.description}>
            As informações do seu perfil desempenham um papel fundamental na personalização do
            acompanhamento de determinadas métricas.
          </ThemedText>
        </View>

        <View style={styles.formContainer}>
          <ProfileFieldPill
            label="Peso"
            value={weight}
            accentColor={accentColor}
            onPress={() => setActivePicker('weight')}
          />
          <ProfileFieldPill
            label="Altura"
            value={height}
            accentColor={accentColor}
            onPress={() => setActivePicker('height')}
          />
          <ProfileFieldPill
            label="Idade"
            value={age}
            accentColor={accentColor}
            onPress={() => setActivePicker('age')}
          />
        </View>

        <View style={styles.footer}>
          <OnboardingFooter
            onNext={handleNext}
            onSkip={goToNextStep}
            accentColor={accentColor}
          />
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
  root: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.xxxl,
    paddingTop: 50,
    paddingBottom: spacing.xxxl,
    overflow: 'hidden',
  },
  header: {
    marginBottom: spacing.giant,
  },
  subtitle: {
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  title: {
    marginBottom: spacing.lg,
  },
  description: {
    color: colors.textFaint,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.medium,
    lineHeight: 20,
  },
  formContainer: {
    gap: spacing.lg,
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    gap: spacing.lg,
  },
});
