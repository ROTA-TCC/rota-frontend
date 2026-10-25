export const PASSWORD_MIN_LENGTH = 8;
export const ALIAS_MIN_LENGTH = 3;

export type AuthFormErrors = Record<string, string>;

export interface RegisterFormValues {
  alias: string;
  email: string;
  password: string;
  acceptedTerms: boolean;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface ForgotPasswordFormValues {
  email: string;
}

export interface ResetPasswordFormValues {
  password: string;
  confirmPassword: string;
}

export interface PasswordRequirement {
  id: 'length' | 'number' | 'special';
  label: string;
  valid: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NUMBER_REGEX = /\d/;
const SPECIAL_CHARACTER_REGEX = /[^A-Za-z0-9]/;

export const isValidEmail = (email: string): boolean => EMAIL_REGEX.test(email.trim());

export const hasErrors = (errors: AuthFormErrors): boolean => Object.keys(errors).length > 0;

export const getPasswordRequirements = (password: string): PasswordRequirement[] => [
  {
    id: 'length',
    label: `Pelo menos ${PASSWORD_MIN_LENGTH} caracteres`,
    valid: password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: 'number',
    label: 'Um número',
    valid: NUMBER_REGEX.test(password),
  },
  {
    id: 'special',
    label: 'Um caractere especial',
    valid: SPECIAL_CHARACTER_REGEX.test(password),
  },
];

export const isStrongPassword = (password: string): boolean =>
  getPasswordRequirements(password).every((requirement) => requirement.valid);

export const validateRegisterForm = (values: RegisterFormValues): AuthFormErrors => {
  const errors: AuthFormErrors = {};
  const alias = values.alias.trim();
  const email = values.email.trim();

  if (!alias) {
    errors.alias = 'Informe seu nome completo.';
  } else if (alias.length < ALIAS_MIN_LENGTH) {
    errors.alias = `O nome deve ter pelo menos ${ALIAS_MIN_LENGTH} caracteres.`;
  }

  if (!email) {
    errors.email = 'Informe seu e-mail.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (!values.password) {
    errors.password = 'Crie uma senha.';
  } else if (values.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`;
  }

  if (!values.acceptedTerms) {
    errors.acceptedTerms = 'Você precisa aceitar os Termos e a Política de Privacidade.';
  }

  return errors;
};

export const validateLoginForm = (values: LoginFormValues): AuthFormErrors => {
  const errors: AuthFormErrors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = 'Informe seu e-mail.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  if (!values.password) {
    errors.password = 'Informe sua senha.';
  }

  return errors;
};

export const validateForgotPasswordForm = (values: ForgotPasswordFormValues): AuthFormErrors => {
  const errors: AuthFormErrors = {};
  const email = values.email.trim();

  if (!email) {
    errors.email = 'Informe seu e-mail.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Informe um e-mail válido.';
  }

  return errors;
};

export const validateResetPasswordForm = (values: ResetPasswordFormValues): AuthFormErrors => {
  const errors: AuthFormErrors = {};

  if (!values.password) {
    errors.password = 'Crie uma nova senha.';
  } else if (!isStrongPassword(values.password)) {
    errors.password = 'A senha deve atender a todos os requisitos.';
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Confirme a nova senha.';
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'As senhas não coincidem.';
  }

  return errors;
};
