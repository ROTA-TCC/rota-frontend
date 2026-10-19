import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { PromoCard } from '@/components/explore/PromoCard';
import {
  BRAND_ICON,
  COMING_SOON_CARD_IMAGE,
  COMMUNITY_AVATARS,
  COMMUNITY_CARD_IMAGE,
  COOLING_CARD_IMAGE,
} from '@/components/explore/recommendationData';
import { colors, spacing, typography } from '@/theme';

export function RecommendationGrid() {
  return (
    <View style={styles.container}>
      <PromoCard source={COOLING_CARD_IMAGE} style={styles.greenCard}>
        <View style={styles.greenCardContent}>
          <Text style={styles.greenTitle}>Resfriamento Pós-Corrida</Text>
          <Text style={styles.greenSubtitle}>
            Top 5 passos para um resfriamento seguro após a corrida
          </Text>
        </View>
      </PromoCard>

      <View style={styles.rightColumn}>
        <PromoCard source={COMMUNITY_CARD_IMAGE} style={styles.darkCard}>
          <View style={styles.darkCardTop}>
            <View style={styles.avatarStack}>
              {COMMUNITY_AVATARS.map((uri, index) => (
                <Image
                  key={uri}
                  source={{ uri }}
                  style={[
                    styles.avatar,
                    index > 0 && styles.avatarOverlap,
                    { zIndex: COMMUNITY_AVATARS.length - index },
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity style={styles.arrowButton} activeOpacity={0.8}>
              <Ionicons name="trending-up" size={16} color={colors.textOnLight} />
            </TouchableOpacity>
          </View>

          <View style={styles.darkCardBottomText}>
            <Text style={styles.darkTitle}>Junte-se a nós!</Text>
            <Text style={styles.darkSubtitle}>Evolua e crie conexões</Text>
          </View>
        </PromoCard>

        <PromoCard source={COMING_SOON_CARD_IMAGE} style={styles.redCard}>
          <Image source={BRAND_ICON} style={styles.brandIcon} resizeMode="contain" />
          <View style={styles.redCardContent}>
            <Text style={styles.redTitle}>EM BREVE</Text>
            <Text style={styles.redSubtitle}>Novos recursos e estatísticas</Text>
          </View>
        </PromoCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: spacing.lg,
    height: 260,
  },
  greenCard: {
    flex: 1,
    padding: spacing.xxl,
    justifyContent: 'flex-start',
  },
  greenCardContent: {
    zIndex: 2,
  },
  greenTitle: {
    color: colors.textOnLight,
    fontSize: typography.sizes.titleLg,
    fontWeight: typography.weights.heavy,
    lineHeight: 22,
    marginBottom: spacing.sm,
    textShadowColor: colors.white70,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  greenSubtitle: {
    color: colors.textOnLightSoft,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    lineHeight: 15,
    textShadowColor: colors.white70,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rightColumn: {
    flex: 1,
    gap: spacing.lg,
  },
  darkCard: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
    justifyContent: 'space-between',
  },
  darkCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 2,
  },
  avatarStack: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.surface,
  },
  avatarOverlap: {
    marginLeft: -10,
  },
  arrowButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.accentLime,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkCardBottomText: {
    zIndex: 2,
  },
  darkTitle: {
    color: colors.text,
    fontSize: typography.sizes.bodyLg,
    fontWeight: typography.weights.bold,
    marginBottom: 2,
  },
  darkSubtitle: {
    color: colors.textSecondary,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  redCard: {
    flex: 1,
    padding: 14,
    justifyContent: 'flex-end',
  },
  brandIcon: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 28,
    height: 28,
    zIndex: 2,
  },
  redCardContent: {
    zIndex: 2,
  },
  redTitle: {
    color: colors.text,
    fontSize: typography.sizes.label,
    fontWeight: typography.weights.heavy,
    marginBottom: 2,
  },
  redSubtitle: {
    color: colors.white85,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
});
