import React, { useMemo, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type TextInputInstance,
  type TextInputProps,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { mockProfile } from '@/constants/mockProfile';
import { useSettingsColors, type SettingsPalette } from '@/constants/settingsTheme';
import { SettingsTopBar } from '@/components/settings/SettingsTopBar';
import { CameraIcon } from '@/components/settings/icons';

type FieldId = 'fullName' | 'phone' | 'email' | 'username';

interface FormValues {
  fullName: string;
  phone: string;
  email: string;
  username: string;
}

type FieldErrors = Partial<Record<FieldId, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_PATTERN = /^@[a-zA-Z0-9._]{3,30}$/;

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11);

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length <= 6) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  }

  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
  isLast?: boolean;
  error?: string;
  inputRef?: React.RefObject<TextInputInstance | null>;
  onSubmitEditing?: () => void;
  returnKeyType?: TextInputProps['returnKeyType'];
  keyboardType?: TextInputProps['keyboardType'];
  autoCapitalize?: TextInputProps['autoCapitalize'];
  autoComplete?: TextInputProps['autoComplete'];
  textContentType?: TextInputProps['textContentType'];
  autoCorrect?: boolean;
  maxLength?: number;
}

function FormField({
  label,
  value,
  onChangeText,
  onFocus,
  onBlur,
  focused,
  isLast = false,
  error,
  inputRef,
  onSubmitEditing,
  returnKeyType = 'next',
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  autoComplete,
  textContentType,
  autoCorrect,
  maxLength,
}: FormFieldProps) {
  const colors = useSettingsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  return (
    <View
      style={[
        styles.fieldRow,
        focused && styles.fieldRowFocused,
        isLast && styles.fieldRowLast,
      ]}
    >
      <Text style={[styles.fieldLabel, focused && styles.fieldLabelFocused]}>{label}</Text>

      <View style={styles.fieldContent}>
        <TextInput
          ref={inputRef}
          style={styles.fieldInput}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          onSubmitEditing={onSubmitEditing}
          returnKeyType={returnKeyType}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoComplete={autoComplete}
          textContentType={textContentType}
          autoCorrect={autoCorrect}
          maxLength={maxLength}
          selectionColor={colors.accent}
          placeholderTextColor={colors.textSecondary}
          accessibilityLabel={label}
        />
        {error ? <Text style={styles.fieldError}>{error}</Text> : null}
      </View>
    </View>
  );
}

export default function EditProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth();
  const { isDark } = useTheme();
  const colors = useSettingsColors();
  const styles = useMemo(() => createStyles(colors), [colors]);

  const phoneRef = useRef<TextInputInstance>(null);
  const emailRef = useRef<TextInputInstance>(null);
  const usernameRef = useRef<TextInputInstance>(null);

  const [values, setValues] = useState<FormValues>({
    fullName: mockProfile.name,
    phone: '(11) 99999-0000',
    email: 'seuemail@email.com',
    username: mockProfile.username,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [focusedField, setFocusedField] = useState<FieldId | null>(null);

  const updateField = (field: FieldId, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));

    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  };

  const validate = () => {
    const nextErrors: FieldErrors = {};
    const phoneDigits = values.phone.replace(/\D/g, '');

    if (values.fullName.trim().length < 3) {
      nextErrors.fullName = 'Informe seu nome completo.';
    }

    if (phoneDigits.length < 10) {
      nextErrors.phone = 'Informe um telefone válido.';
    }

    if (!EMAIL_PATTERN.test(values.email.trim())) {
      nextErrors.email = 'Informe um e-mail válido.';
    }

    if (!USERNAME_PATTERN.test(values.username.trim())) {
      nextErrors.username = 'Use @ e de 3 a 30 caracteres.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const focusField = (field: FieldId) => setFocusedField(field);
  const blurField = () => setFocusedField(null);

  const handleSave = () => {
    if (!validate()) {
      return;
    }

    Alert.alert('Perfil atualizado', 'Suas informações foram atualizadas com sucesso.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };

  const handleAvatarPress = () => {
    Alert.alert('Foto de perfil', 'A escolha de uma nova foto estará disponível em breve.');
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      'Excluir conta',
      'Esta ação é permanente e não pode ser desfeita. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir conta',
          style: 'destructive',
          onPress: () => {
            void logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <SettingsTopBar title="Editar Perfil" onBack={() => router.back()} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: mockProfile.avatarUrl }}
                style={styles.avatarImage}
                resizeMode="cover"
                accessibilityLabel="Foto de perfil"
              />

              <TouchableOpacity
                style={styles.avatarButton}
                activeOpacity={0.8}
                onPress={handleAvatarPress}
                accessibilityRole="button"
                accessibilityLabel="Alterar foto de perfil"
              >
                <CameraIcon size={16} color={colors.accentText} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.card}>
            <FormField
              label="Nome completo"
              value={values.fullName}
              onChangeText={(value) => updateField('fullName', value)}
              onFocus={() => focusField('fullName')}
              onBlur={blurField}
              focused={focusedField === 'fullName'}
              error={errors.fullName}
              onSubmitEditing={() => phoneRef.current?.focus()}
              returnKeyType="next"
              autoCapitalize="words"
              autoComplete="name"
              textContentType="name"
              maxLength={80}
            />

            <FormField
              label="Número de telefone"
              value={values.phone}
              onChangeText={(value) => updateField('phone', formatPhone(value))}
              onFocus={() => focusField('phone')}
              onBlur={blurField}
              focused={focusedField === 'phone'}
              error={errors.phone}
              inputRef={phoneRef}
              onSubmitEditing={() => emailRef.current?.focus()}
              returnKeyType="next"
              keyboardType="phone-pad"
              autoComplete="tel"
              textContentType="telephoneNumber"
            />

            <FormField
              label="E-mail"
              value={values.email}
              onChangeText={(value) => updateField('email', value)}
              onFocus={() => focusField('email')}
              onBlur={blurField}
              focused={focusedField === 'email'}
              error={errors.email}
              inputRef={emailRef}
              onSubmitEditing={() => usernameRef.current?.focus()}
              returnKeyType="next"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              textContentType="emailAddress"
              autoCorrect={false}
              maxLength={120}
            />

            <FormField
              label="Nome de usuário"
              value={values.username}
              onChangeText={(value) => updateField('username', value.replace(/\s/g, ''))}
              onFocus={() => focusField('username')}
              onBlur={blurField}
              focused={focusedField === 'username'}
              error={errors.username}
              inputRef={usernameRef}
              onSubmitEditing={handleSave}
              returnKeyType="done"
              autoCapitalize="none"
              autoComplete="username"
              textContentType="username"
              autoCorrect={false}
              maxLength={31}
              isLast
            />
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            activeOpacity={0.85}
            onPress={handleSave}
            accessibilityRole="button"
            accessibilityLabel="Salvar alterações"
          >
            <Text style={styles.saveLabel}>Salvar alterações</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.7}
            onPress={handleDeleteAccount}
            accessibilityRole="button"
            accessibilityLabel="Excluir conta"
          >
            <Text style={styles.deleteLabel}>Excluir conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const createStyles = (colors: SettingsPalette) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.screen,
      paddingHorizontal: 18,
    },
    flex: {
      flex: 1,
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingBottom: 8,
    },
    avatarSection: {
      alignItems: 'center',
      marginTop: 4,
      marginBottom: 24,
    },
    avatarWrapper: {
      width: 100,
      height: 100,
    },
    avatarImage: {
      width: '100%',
      height: '100%',
      borderRadius: 50,
      borderWidth: 1,
      borderColor: colors.border,
    },
    avatarButton: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.accent,
      borderWidth: 2,
      borderColor: colors.screen,
      alignItems: 'center',
      justifyContent: 'center',
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.border,
      paddingHorizontal: 20,
      paddingVertical: 6,
      marginBottom: 24,
    },
    fieldRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      paddingVertical: 18,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    fieldRowFocused: {
      borderBottomColor: colors.accent,
    },
    fieldRowLast: {
      borderBottomWidth: 0,
    },
    fieldLabel: {
      color: colors.textSecondary,
      fontSize: 14,
      flexShrink: 1,
    },
    fieldLabelFocused: {
      color: colors.textPrimary,
      fontWeight: '600',
    },
    fieldContent: {
      flex: 1,
      alignItems: 'flex-end',
      gap: 4,
    },
    fieldInput: {
      width: '100%',
      padding: 0,
      color: colors.textPrimary,
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'right',
    },
    fieldError: {
      color: colors.logout,
      fontSize: 11,
      textAlign: 'right',
    },
    saveButton: {
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.accent,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveLabel: {
      color: colors.accentText,
      fontSize: 15,
      fontWeight: '700',
    },
    deleteButton: {
      height: 52,
      borderRadius: 26,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 'auto',
    },
    deleteLabel: {
      color: colors.logout,
      fontSize: 14,
      fontWeight: '600',
    },
  });
