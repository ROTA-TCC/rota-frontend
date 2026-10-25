import React, { useMemo } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useProfileColors, type ProfilePalette } from '@/constants/profileTheme';
import { PostAction } from './PostAction';
import { CommentIcon, HeartIcon, MoreIcon } from './icons';

interface PostCardProps {
  author: string;
  avatarUrl: string;
  timeLabel: string;
  text: string;
  imageUrl: string;
  comments: number;
  likes: number;
  onCommentPress?: () => void;
  onLikePress?: () => void;
  onMorePress?: () => void;
}

export function PostCard({
  author,
  avatarUrl,
  timeLabel,
  text,
  imageUrl,
  comments,
  likes,
  onCommentPress,
  onLikePress,
  onMorePress,
}: PostCardProps) {
  const colors = useProfileColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUrl }} style={styles.avatar} resizeMode="cover" />
        <View style={styles.authorInfo}>
          <Text style={styles.author}>{author}</Text>
          <Text style={styles.time}>{timeLabel}</Text>
        </View>
      </View>

      <Text style={styles.text}>{text}</Text>

      <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="cover" />

      <View style={styles.footer}>
        <View style={styles.actions}>
          <PostAction icon={CommentIcon} count={comments} label="Comentários" onPress={onCommentPress} />
          <PostAction icon={HeartIcon} count={likes} label="Curtidas" onPress={onLikePress} />
        </View>

        <TouchableOpacity
          style={styles.moreButton}
          activeOpacity={0.7}
          onPress={onMorePress}
          accessibilityRole="button"
          accessibilityLabel="Mais opções"
        >
          <MoreIcon size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: ProfilePalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      gap: 12,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
    },
    authorInfo: {
      gap: 2,
    },
    author: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    time: {
      color: colors.textSecondary,
      fontSize: 11,
    },
    text: {
      color: colors.textPrimary,
      fontSize: 14,
      lineHeight: 19.6,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: 14,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 4,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    moreButton: {
      padding: 4,
    },
  });
