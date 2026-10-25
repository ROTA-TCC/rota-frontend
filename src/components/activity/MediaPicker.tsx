import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import {
  useActivityFormColors,
  type ActivityFormPalette,
} from '@/constants/activityFormTheme';
import { MAX_ACTIVITY_MEDIA } from '@/constants/activityOptions';
import type { ActivityMedia } from '@/types/activity';

interface MediaPickerProps {
  media: ActivityMedia[];
  onChange: (media: ActivityMedia[]) => void;
}

export function MediaPicker({ media, onChange }: MediaPickerProps) {
  const colors = useActivityFormColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [isPicking, setIsPicking] = useState(false);

  const remaining = MAX_ACTIVITY_MEDIA - media.length;
  const isAtLimit = remaining <= 0;

  const pickMedia = async () => {
    if (isPicking || isAtLimit) return;

    setIsPicking(true);

    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Permissão necessária',
          'Permita o acesso à galeria para anexar fotos e vídeos à sua atividade.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Abrir ajustes', onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'],
        allowsMultipleSelection: true,
        selectionLimit: remaining,
        orderedSelection: true,
        quality: 0.85,
      });

      if (result.canceled) return;

      const nextMedia: ActivityMedia[] = result.assets.map((asset, index) => ({
        id: asset.assetId ?? `${Date.now()}-${index}`,
        uri: asset.uri,
        type: asset.type ?? null,
        fileName: asset.fileName,
      }));

      onChange([...media, ...nextMedia].slice(0, MAX_ACTIVITY_MEDIA));
    } catch {
      Alert.alert('Erro', 'Não foi possível abrir sua galeria. Tente novamente.');
    } finally {
      setIsPicking(false);
    }
  };

  const removeMedia = (id: string) => {
    onChange(media.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      {media.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.mediaList}
        >
          {media.map((item) => {
            const isVideo =
              item.type === 'video' || item.type === 'pairedVideo';

            return (
              <View key={item.id} style={styles.thumbnail}>
                {isVideo ? (
                  <View style={styles.videoPreview}>
                    <Ionicons
                      name="videocam-outline"
                      size={24}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.videoLabel} numberOfLines={1}>
                      {item.fileName ?? 'Vídeo'}
                    </Text>
                  </View>
                ) : (
                  <Image source={{ uri: item.uri }} style={styles.thumbnailImage} />
                )}

                <Pressable
                  onPress={() => removeMedia(item.id)}
                  hitSlop={6}
                  style={styles.removeButton}
                  accessibilityRole="button"
                  accessibilityLabel="Remover mídia"
                >
                  <Ionicons name="close" size={13} color="#FFFFFF" />
                </Pressable>
              </View>
            );
          })}
        </ScrollView>
      ) : null}

      <Pressable
        onPress={pickMedia}
        disabled={isPicking || isAtLimit}
        style={({ pressed }) => [
          styles.addButton,
          pressed && styles.addButtonPressed,
          isAtLimit && styles.addButtonDisabled,
        ]}
        accessibilityRole="button"
        accessibilityLabel="Adicionar fotos ou vídeos"
      >
        <View style={styles.addIcon}>
          <Ionicons name="images-outline" size={18} color={colors.accent} />
        </View>

        <View style={styles.addText}>
          <Text style={styles.addTitle}>Adicionar fotos ou vídeos</Text>
          <Text style={styles.addSubtitle}>
            {isAtLimit
              ? `Limite de ${MAX_ACTIVITY_MEDIA} mídias atingido`
              : `${media.length} de ${MAX_ACTIVITY_MEDIA} selecionados`}
          </Text>
        </View>

        {isPicking ? (
          <ActivityIndicator size="small" color={colors.accent} />
        ) : (
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        )}
      </Pressable>
    </View>
  );
}

const createStyles = (colors: ActivityFormPalette) =>
  StyleSheet.create({
    container: {
      gap: 10,
    },
    mediaList: {
      gap: 10,
      paddingRight: 4,
    },
    thumbnail: {
      width: 96,
      height: 96,
      borderRadius: 12,
      overflow: 'hidden',
      backgroundColor: colors.cardAlt,
    },
    thumbnailImage: {
      width: '100%',
      height: '100%',
    },
    videoPreview: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: 10,
    },
    videoLabel: {
      maxWidth: '100%',
      color: colors.textSecondary,
      fontSize: 9,
      fontWeight: '500',
    },
    removeButton: {
      position: 'absolute',
      top: 6,
      right: 6,
      width: 22,
      height: 22,
      borderRadius: 11,
      backgroundColor: 'rgba(0, 0, 0, 0.68)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    addButton: {
      minHeight: 56,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 14,
      borderRadius: 12,
      backgroundColor: colors.card,
    },
    addButtonPressed: {
      backgroundColor: colors.cardAlt,
    },
    addButtonDisabled: {
      opacity: 0.55,
    },
    addIcon: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.accentSoft,
      alignItems: 'center',
      justifyContent: 'center',
    },
    addText: {
      flex: 1,
      gap: 2,
    },
    addTitle: {
      color: colors.textPrimary,
      fontSize: 13,
      fontWeight: '600',
    },
    addSubtitle: {
      color: colors.textMuted,
      fontSize: 11,
    },
  });
