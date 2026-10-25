import React, { useMemo, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSocialColors, type SocialPalette } from '@/constants/socialTheme';
import type { ActivityPost } from '@/types/social';
import {
  BookmarkIcon,
  CommentIcon,
  HeartIcon,
  MoreIcon,
  ShareIcon,
  TrophyIcon,
  VerifiedIcon,
} from './icons';

interface ActivityPostCardProps {
  post: ActivityPost;
  onAuthorPress?: () => void;
  onChallengePress?: () => void;
  onCommentPress?: () => void;
  onSharePress?: () => void;
  onMorePress?: () => void;
}

function formatKudos(count: number) {
  return count.toLocaleString('pt-BR');
}

export function ActivityPostCard({
  post,
  onAuthorPress,
  onChallengePress,
  onCommentPress,
  onSharePress,
  onMorePress,
}: ActivityPostCardProps) {
  const colors = useSocialColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const [hasGivenKudos, setHasGivenKudos] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const kudosCount = post.kudos.count + (hasGivenKudos ? 1 : 0);
  const subtitle = [post.timeLabel, post.location].filter(Boolean).join(' · ');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.authorButton}
          activeOpacity={0.8}
          onPress={onAuthorPress}
          disabled={!onAuthorPress}
          accessibilityRole={onAuthorPress ? 'button' : undefined}
          accessibilityLabel={`Ver perfil de ${post.author.name}`}
        >
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: post.author.avatarUrl }}
              style={styles.avatar}
              resizeMode="cover"
            />
            {post.author.verified && (
              <View style={styles.verifiedBadge}>
                <VerifiedIcon size={10} color={colors.verifiedText} />
              </View>
            )}
          </View>

          <View style={styles.authorInfo}>
            <Text style={styles.authorName} numberOfLines={1}>
              {post.author.name}
            </Text>
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.iconButton}
          activeOpacity={0.7}
          onPress={onMorePress}
          disabled={!onMorePress}
          hitSlop={8}
          accessibilityRole={onMorePress ? 'button' : undefined}
          accessibilityLabel="Mais opções da atividade"
        >
          <MoreIcon size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>{post.title}</Text>

      <View style={styles.stats}>
        {post.stats.map((stat, index) => (
          <React.Fragment key={stat.id}>
            {index > 0 && <View style={styles.statDivider} />}
            <View style={styles.stat}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statValue} numberOfLines={1}>
                {stat.value}
              </Text>
            </View>
          </React.Fragment>
        ))}

        {typeof post.achievements === 'number' && (
          <>
            <View style={styles.statDivider} />
            <View style={[styles.stat, styles.achievements]}>
              <Text style={styles.statLabel}>Conquistas</Text>
              <View style={styles.achievementValue}>
                <TrophyIcon size={16} color={colors.trophy} />
                <Text style={styles.statValue}>{post.achievements}</Text>
              </View>
            </View>
          </>
        )}
      </View>

      {post.challenge && (
        <View style={styles.challenge}>
          <View style={styles.challengeLeft}>
            <View style={styles.challengeLogo}>
              <Text style={styles.challengeLogoText} numberOfLines={2}>
                {post.challenge.badgeLabel}
              </Text>
            </View>

            <View style={styles.challengeInfo}>
              <Text style={styles.challengeTitle} numberOfLines={2}>
                {post.challenge.title}
              </Text>
              <Text style={styles.challengeProgress}>{post.challenge.progress}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.challengeButton}
            activeOpacity={0.8}
            onPress={onChallengePress}
            disabled={!onChallengePress}
            accessibilityRole={onChallengePress ? 'button' : undefined}
            accessibilityLabel={post.challenge.actionLabel}
          >
            <Text style={styles.challengeButtonLabel}>{post.challenge.actionLabel}</Text>
          </TouchableOpacity>
        </View>
      )}

      {post.imageUrls.length > 0 && (
        <View style={styles.imageGrid}>
          {post.imageUrls.slice(0, 2).map((imageUrl, index) => (
            <Image
              key={`${post.id}-image-${index}`}
              source={{ uri: imageUrl }}
              style={[styles.image, post.imageUrls.length === 1 && styles.singleImage]}
              resizeMode="cover"
              accessibilityLabel={`Imagem ${index + 1} da atividade ${post.title}`}
            />
          ))}
        </View>
      )}

      <View style={styles.kudosRow}>
        {post.kudos.avatarUrls.length > 0 && (
          <View style={styles.kudosAvatars}>
            {post.kudos.avatarUrls.map((avatarUrl, index) => (
              <Image
                key={`${post.id}-kudos-${index}`}
                source={{ uri: avatarUrl }}
                style={styles.kudosAvatar}
                resizeMode="cover"
              />
            ))}
          </View>
        )}
        <Text style={styles.kudosText}>{formatKudos(kudosCount)} deram Kudos</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.action, hasGivenKudos && styles.actionActive]}
            activeOpacity={0.7}
            onPress={() => setHasGivenKudos((current) => !current)}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={hasGivenKudos ? 'Remover kudos' : 'Dar kudos'}
            accessibilityState={{ selected: hasGivenKudos }}
          >
            <HeartIcon
              size={18}
              color={hasGivenKudos ? colors.accent : colors.textSecondary}
              filled={hasGivenKudos}
            />
            <Text style={[styles.actionCount, hasGivenKudos && styles.actionCountActive]}>
              {formatKudos(kudosCount)}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.action}
            activeOpacity={0.7}
            onPress={onCommentPress}
            disabled={!onCommentPress}
            hitSlop={6}
            accessibilityRole={onCommentPress ? 'button' : undefined}
            accessibilityLabel={`Comentários: ${post.comments}`}
          >
            <CommentIcon size={18} color={colors.textSecondary} />
            <Text style={styles.actionCount}>{post.comments}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.action, styles.iconAction]}
            activeOpacity={0.7}
            onPress={onSharePress}
            disabled={!onSharePress}
            hitSlop={6}
            accessibilityRole={onSharePress ? 'button' : undefined}
            accessibilityLabel="Compartilhar atividade"
          >
            <ShareIcon size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isSaved && styles.saveButtonActive]}
          activeOpacity={0.7}
          onPress={() => setIsSaved((current) => !current)}
          hitSlop={6}
          accessibilityRole="button"
          accessibilityLabel={isSaved ? 'Remover dos salvos' : 'Salvar atividade'}
          accessibilityState={{ selected: isSaved }}
        >
          <BookmarkIcon
            size={18}
            color={isSaved ? colors.accent : colors.textSecondary}
            filled={isSaved}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const createStyles = (colors: SocialPalette) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: colors.border,
      padding: 16,
      gap: 14,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.06,
      shadowRadius: 14,
      elevation: 2,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    authorButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    avatarWrapper: {
      width: 46,
      height: 46,
    },
    avatar: {
      width: '100%',
      height: '100%',
      borderRadius: 23,
      borderWidth: 1,
      borderColor: colors.border,
    },
    verifiedBadge: {
      position: 'absolute',
      right: -2,
      bottom: -2,
      width: 17,
      height: 17,
      borderRadius: 9,
      backgroundColor: colors.verified,
      borderWidth: 2,
      borderColor: colors.avatarBorder,
      alignItems: 'center',
      justifyContent: 'center',
    },
    authorInfo: {
      flex: 1,
      gap: 3,
    },
    authorName: {
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '600',
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    iconButton: {
      width: 34,
      height: 34,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: colors.textPrimary,
      fontSize: 19,
      fontWeight: '700',
      letterSpacing: -0.2,
      lineHeight: 25,
    },
    stats: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      paddingVertical: 12,
      paddingHorizontal: 14,
    },
    stat: {
      flex: 1,
      gap: 3,
    },
    statDivider: {
      width: 1,
      height: 30,
      marginHorizontal: 12,
      backgroundColor: colors.divider,
    },
    achievements: {
      alignItems: 'flex-end',
    },
    statLabel: {
      color: colors.textSecondary,
      fontSize: 11,
      fontWeight: '600',
      letterSpacing: 0.4,
      textTransform: 'uppercase',
    },
    statValue: {
      color: colors.textPrimary,
      fontSize: 17,
      fontWeight: '700',
      letterSpacing: -0.2,
    },
    achievementValue: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
    },
    challenge: {
      backgroundColor: colors.surfaceElevated,
      borderRadius: 16,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    },
    challengeLeft: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    challengeLogo: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.badgeBackground,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 4,
    },
    challengeLogoText: {
      color: colors.badgeText,
      fontSize: 10,
      fontWeight: '700',
      textAlign: 'center',
      lineHeight: 12,
    },
    challengeInfo: {
      flex: 1,
      gap: 3,
    },
    challengeTitle: {
      color: colors.textPrimary,
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 16,
    },
    challengeProgress: {
      color: colors.textSecondary,
      fontSize: 11,
    },
    challengeButton: {
      height: 32,
      paddingHorizontal: 14,
      borderRadius: 16,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    challengeButtonLabel: {
      color: colors.accentText,
      fontSize: 12,
      fontWeight: '700',
    },
    imageGrid: {
      flexDirection: 'row',
      gap: 8,
    },
    image: {
      flex: 1,
      height: 178,
      borderRadius: 14,
      backgroundColor: colors.surfaceElevated,
    },
    singleImage: {
      height: 220,
    },
    kudosRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    kudosAvatars: {
      flexDirection: 'row',
      paddingLeft: 6,
    },
    kudosAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: colors.avatarBorder,
      marginLeft: -6,
    },
    kudosText: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: colors.divider,
      paddingTop: 12,
      paddingHorizontal: 2,
    },
    actions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    action: {
      height: 36,
      paddingHorizontal: 10,
      borderRadius: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    actionActive: {
      backgroundColor: colors.accentSoft,
    },
    iconAction: {
      width: 36,
      paddingHorizontal: 0,
      justifyContent: 'center',
    },
    actionCount: {
      color: colors.textSecondary,
      fontSize: 13,
      fontWeight: '600',
    },
    actionCountActive: {
      color: colors.accent,
    },
    saveButton: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.surfaceElevated,
    },
    saveButtonActive: {
      backgroundColor: colors.accentSoft,
    },
  });
