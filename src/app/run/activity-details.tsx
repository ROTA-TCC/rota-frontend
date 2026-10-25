import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ActivitySummaryCard } from '@/components/activity/ActivitySummaryCard';
import { ActivityTextField } from '@/components/activity/ActivityTextField';
import { EquipmentField } from '@/components/activity/EquipmentField';
import { MediaPicker } from '@/components/activity/MediaPicker';
import { SelectField } from '@/components/activity/SelectField';
import {
  EFFORT_OPTIONS,
  HIDDEN_DETAILS_OPTIONS,
  SPORT_OPTIONS,
  TAG_OPTIONS,
  VISIBILITY_OPTIONS,
  getSportFromTrackingType,
} from '@/constants/activityOptions';
import {
  useActivityFormColors,
  type ActivityFormPalette,
} from '@/constants/activityFormTheme';
import { useActivityDraft } from '@/providers/ActivityDraftProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { createRun } from '@/services/api/runService';
import { registerDistanceRecord } from '@/services/localRecords';
import type { ActivityMedia, PublishedActivity } from '@/types/activity';
import type { SportId } from '@/types/record';

export default function ActivityDetailsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();
  const colors = useActivityFormColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { draft, clearDraft, setPublishedActivity } = useActivityDraft();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [sport, setSport] = useState<SportId>(() =>
    getSportFromTrackingType(draft?.sourceType ?? 'normal')
  );
  const [tag, setTag] = useState('Treino');
  const [effort, setEffort] = useState('Moderado');
  const [privateNotes, setPrivateNotes] = useState('');
  const [equipment, setEquipment] = useState<string[]>([]);
  const [visibility, setVisibility] = useState('Público');
  const [hiddenDetails, setHiddenDetails] = useState('none');
  const [muteActivity, setMuteActivity] = useState(false);
  const [media, setMedia] = useState<ActivityMedia[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const handleDiscard = useCallback(() => {
    if (isSaving) return;

    if (!draft) {
      router.replace('/(tabs)/record');
      return;
    }

    Alert.alert(
      'Descartar atividade',
      'Esta corrida será removida permanentemente e não será publicada.',
      [
        { text: 'Continuar editando', style: 'cancel' },
        {
          text: 'Descartar',
          style: 'destructive',
          onPress: () => {
            clearDraft();
            router.replace('/(tabs)/record');
          },
        },
      ]
    );
  }, [clearDraft, draft, isSaving, router]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      handleDiscard();
      return true;
    });

    return () => subscription.remove();
  }, [handleDiscard]);

  const handleSave = async () => {
    if (!draft || isSaving) return;

    setIsSaving(true);

    try {
      await createRun(draft.run);
      const isRecord = await registerDistanceRecord(
        draft.run.distanceMeters
      );

      const activity: PublishedActivity = {
        id: String(Date.now()),
        run: draft.run,
        sourceType: draft.sourceType,
        createdAt: draft.createdAt,
        title: title.trim(),
        description: description.trim(),
        sport,
        tag,
        effort,
        privateNotes: privateNotes.trim(),
        equipment,
        visibility,
        hiddenDetails,
        muteActivity,
        media,
        isRecord,
      };

      setPublishedActivity(activity);
      clearDraft();
      router.replace({
        pathname: '/activity/[id]',
        params: { id: activity.id },
      });
    } catch {
      setIsSaving(false);
      Alert.alert(
        'Erro ao salvar',
        'Não foi possível publicar sua atividade. Verifique sua conexão e tente novamente.'
      );
    }
  };

  const renderSection = (sectionTitle: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{sectionTitle}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Salvar atividade</Text>

        <Pressable
          onPress={handleDiscard}
          disabled={isSaving}
          hitSlop={8}
          style={({ pressed }) => [
            styles.closeButton,
            pressed && styles.closeButtonPressed,
            isSaving && styles.buttonDisabled,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Fechar e descartar atividade"
        >
          <Ionicons name="close" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      {draft ? (
        <KeyboardAvoidingView
          style={styles.body}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
          >
            <ActivitySummaryCard
              run={draft.run}
              sourceType={draft.sourceType}
              sport={sport}
              createdAt={draft.createdAt}
            />

            {renderSection(
              'Detalhes da atividade',
              <>
                <ActivityTextField
                  label="Título da atividade"
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Dê um título para sua corrida"
                  maxLength={60}
                  returnKeyType="next"
                />

                <ActivityTextField
                  label="Descrição"
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Como foi? Compartilhe mais informações..."
                  maxLength={500}
                  multiline
                />

                <SelectField
                  label="Tipo de esporte/atividade"
                  value={sport}
                  options={SPORT_OPTIONS}
                  onSelect={(value) => setSport(value as SportId)}
                  modalTitle="Tipo de esporte/atividade"
                />

                <SelectField
                  label="Tag de atividade"
                  value={tag}
                  options={TAG_OPTIONS}
                  onSelect={setTag}
                  modalTitle="Tag de atividade"
                />

                <SelectField
                  label="Grau de esforço"
                  value={effort}
                  options={EFFORT_OPTIONS}
                  onSelect={setEffort}
                  modalTitle="Grau de esforço"
                />
              </>
            )}

            {renderSection('Mídia', <MediaPicker media={media} onChange={setMedia} />)}

            {renderSection(
              'Equipamento',
              <EquipmentField value={equipment} onChange={setEquipment} />
            )}

            {renderSection(
              'Privacidade',
              <>
                <ActivityTextField
                  label="Observações privadas"
                  value={privateNotes}
                  onChangeText={setPrivateNotes}
                  placeholder="Anote suas observações privadas aqui..."
                  maxLength={500}
                  multiline
                  icon="lock-closed-outline"
                  helper="Somente você verá estas observações."
                />

                <SelectField
                  label="Quem pode ver"
                  value={visibility}
                  options={VISIBILITY_OPTIONS}
                  onSelect={setVisibility}
                  modalTitle="Quem pode ver"
                />

                <SelectField
                  label="Detalhes ocultos"
                  value={hiddenDetails}
                  options={HIDDEN_DETAILS_OPTIONS}
                  onSelect={setHiddenDetails}
                  placeholder="Escolher"
                  modalTitle="Detalhes ocultos"
                />

                <View style={styles.muteRow}>
                  <View style={styles.muteText}>
                    <Text style={styles.muteTitle}>Silenciar atividade</Text>
                    <Text style={styles.muteSubtitle}>
                      Não publicar nos feeds Início ou de clubes
                    </Text>
                  </View>

                  <Switch
                    value={muteActivity}
                    onValueChange={setMuteActivity}
                    trackColor={{ false: colors.cardAlt, true: colors.accent }}
                    thumbColor={muteActivity ? colors.accentText : colors.card}
                    ios_backgroundColor={colors.cardAlt}
                    accessibilityLabel="Silenciar atividade"
                  />
                </View>
              </>
            )}
          </ScrollView>

          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 12) },
            ]}
          >
            <Pressable
              onPress={handleDiscard}
              disabled={isSaving}
              style={({ pressed }) => [
                styles.discardButton,
                pressed && styles.discardButtonPressed,
                isSaving && styles.buttonDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Descartar atividade"
            >
              <Ionicons name="trash-outline" size={19} color={colors.danger} />
            </Pressable>

            <Pressable
              onPress={handleSave}
              disabled={isSaving}
              testID="save-activity"
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.saveButtonPressed,
                isSaving && styles.buttonDisabled,
              ]}
              accessibilityRole="button"
              accessibilityLabel="Salvar atividade"
            >
              {isSaving ? (
                <ActivityIndicator size="small" color={colors.accentText} />
              ) : (
                <Ionicons name="checkmark" size={19} color={colors.accentText} />
              )}
              <Text style={styles.saveText}>
                {isSaving ? 'Salvando...' : 'Salvar atividade'}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIcon}>
            <Ionicons
              name="document-text-outline"
              size={30}
              color={colors.textSecondary}
            />
          </View>
          <Text style={styles.emptyTitle}>Nenhuma atividade pendente</Text>
          <Text style={styles.emptyText}>
            Finalize uma corrida para revisar os detalhes antes de publicar.
          </Text>
          <Pressable
            onPress={() => router.replace('/(tabs)/record')}
            style={({ pressed }) => [
              styles.emptyButton,
              pressed && styles.emptyButtonPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Voltar para gravar"
          >
            <Text style={styles.emptyButtonText}>Voltar para gravar</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: ActivityFormPalette) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingBottom: 12,
      backgroundColor: colors.background,
      zIndex: 5,
    },
    closeButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: colors.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    closeButtonPressed: {
      backgroundColor: colors.cardAlt,
    },
    headerTitle: {
      color: colors.textPrimary,
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: -0.5,
    },
    body: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingTop: 4,
      paddingBottom: 28,
      gap: 26,
    },
    section: {
      gap: 12,
      paddingTop: 22,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderTopColor: colors.border,
    },
    sectionTitle: {
      color: colors.textPrimary,
      fontSize: 15,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    sectionContent: {
      gap: 14,
    },
    muteRow: {
      minHeight: 60,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 12,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: colors.card,
    },
    muteText: {
      flex: 1,
      gap: 2,
    },
    muteTitle: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
    muteSubtitle: {
      color: colors.textSecondary,
      fontSize: 11,
      lineHeight: 15,
    },
    footer: {
      flexDirection: 'row',
      gap: 10,
      paddingTop: 12,
      paddingHorizontal: 20,
      backgroundColor: colors.background,
    },
    discardButton: {
      width: 52,
      height: 52,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 14,
      backgroundColor: colors.card,
    },
    discardButtonPressed: {
      backgroundColor: colors.cardAlt,
    },
    saveButton: {
      flex: 1,
      height: 52,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      borderRadius: 14,
      backgroundColor: colors.accent,
    },
    saveButtonPressed: {
      opacity: 0.82,
    },
    buttonDisabled: {
      opacity: 0.6,
    },
    saveText: {
      color: colors.accentText,
      fontSize: 14,
      fontWeight: '700',
    },
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      paddingHorizontal: 32,
    },
    emptyIcon: {
      width: 64,
      height: 64,
      borderRadius: 22,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 4,
    },
    emptyTitle: {
      color: colors.textPrimary,
      fontSize: 16,
      fontWeight: '700',
    },
    emptyText: {
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      textAlign: 'center',
    },
    emptyButton: {
      height: 46,
      paddingHorizontal: 22,
      borderRadius: 14,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    emptyButtonPressed: {
      opacity: 0.82,
    },
    emptyButtonText: {
      color: colors.accentText,
      fontSize: 12,
      fontWeight: '700',
    },
  });
