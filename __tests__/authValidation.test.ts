import {
  getPasswordRequirements,
  hasErrors,
  isStrongPassword,
  isValidEmail,
  validateForgotPasswordForm,
  validateLoginForm,
  validateRegisterForm,
  validateResetPasswordForm,
} from '../src/utils/validation';

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail(' user.name+tag@domain.co ')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('user')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@domain')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });
});

describe('validateRegisterForm', () => {
  const validForm = {
    alias: 'Maria Silva',
    email: 'maria@email.com',
    password: 'senha1234',
    acceptedTerms: true,
  };

  it('returns no errors for valid data', () => {
    expect(validateRegisterForm(validForm)).toEqual({});
  });

  it('requires alias, email, password and terms', () => {
    const errors = validateRegisterForm({
      alias: '',
      email: '',
      password: '',
      acceptedTerms: false,
    });

    expect(hasErrors(errors)).toBe(true);
    expect(errors.alias).toBeDefined();
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
    expect(errors.acceptedTerms).toBeDefined();
  });

  it('rejects short alias and password', () => {
    const errors = validateRegisterForm({ ...validForm, alias: 'ab', password: '1234' });

    expect(errors.alias).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it('rejects invalid email', () => {
    const errors = validateRegisterForm({ ...validForm, email: 'maria@' });

    expect(errors.email).toBeDefined();
  });
});

describe('validateLoginForm', () => {
  it('returns no errors for valid credentials', () => {
    expect(validateLoginForm({ email: 'maria@email.com', password: 'senha1234' })).toEqual({});
  });

  it('requires email and password', () => {
    const errors = validateLoginForm({ email: '', password: '' });

    expect(hasErrors(errors)).toBe(true);
    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });

  it('validates login email format', () => {
    const errors = validateLoginForm({ email: 'invalid', password: 'senha1234' });

    expect(errors.email).toBeDefined();
  });
});

describe('password requirements', () => {
  it('accepts a password with length, number and special character', () => {
    const requirements = getPasswordRequirements('Senha123!');

    expect(requirements.every((requirement) => requirement.valid)).toBe(true);
    expect(isStrongPassword('Senha123!')).toBe(true);
  });

  it('tracks each missing requirement', () => {
    const requirements = getPasswordRequirements('senha');

    expect(requirements.find((requirement) => requirement.id === 'length')?.valid).toBe(false);
    expect(requirements.find((requirement) => requirement.id === 'number')?.valid).toBe(false);
    expect(requirements.find((requirement) => requirement.id === 'special')?.valid).toBe(false);
    expect(isStrongPassword('senha')).toBe(false);
  });
});

describe('validateForgotPasswordForm', () => {
  it('returns no errors for a valid email', () => {
    expect(validateForgotPasswordForm({ email: 'maria@email.com' })).toEqual({});
  });

  it('requires a valid email', () => {
    expect(hasErrors(validateForgotPasswordForm({ email: '' }))).toBe(true);
    expect(hasErrors(validateForgotPasswordForm({ email: 'maria@' }))).toBe(true);
  });
});

describe('validateResetPasswordForm', () => {
  it('returns no errors when passwords are strong and match', () => {
    expect(
      validateResetPasswordForm({ password: 'Senha123!', confirmPassword: 'Senha123!' })
    ).toEqual({});
  });

  it('rejects weak or mismatched passwords', () => {
    const weak = validateResetPasswordForm({ password: 'senha', confirmPassword: 'senha' });
    const mismatched = validateResetPasswordForm({
      password: 'Senha123!',
      confirmPassword: 'Senha123',
    });

    expect(weak.password).toBeDefined();
    expect(mismatched.confirmPassword).toBeDefined();
  });
});
