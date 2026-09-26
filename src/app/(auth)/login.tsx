import { useState } from 'react';
import { StyleSheet, View, TextInput, Pressable, TouchableOpacity, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import GoogleIcon from '@/components/social-icons/GoogleIcon';
import FacebookIcon from '@/components/social-icons/FacebookIcon';
import AppleIcon from '@/components/social-icons/AppleIcon';
import TwitterIcon from '@/components/social-icons/TwitterIcon';
import { useAuth } from '@/providers/AuthProvider';
import { ApiError } from '@/services/api/interceptors';
import { LoginDto } from '@ROTA-TCC/types';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginDto>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleLogin = async () => {
    setLoading(true);
    setErrors({});
    try {
      await login(formData);
    } catch (error: any) {
      if (error instanceof ApiError) {
        if (error.field) {
          setErrors({ [error.field]: error.message });
        } else {
          setErrors({ general: error.message });
        }
      } else {
        setErrors({ general: 'Falha ao fazer login' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.push('/(auth)/onboarding')} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Login</ThemedText>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.formCard}>
          <ThemedText style={styles.cardTitle}>Bem Vindo de Volta!</ThemedText>
          <TextInput 
            style={[styles.input, errors.email && styles.inputError]} 
            placeholder="Email" 
            placeholderTextColor="#8C8C8C" 
            keyboardType="email-address" 
            value={formData.email}
            onChangeText={(text) => { 
              setFormData(prev => ({ ...prev, email: text })); 
              setErrors(prev => ({...prev, email: ''})); 
            }}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
          
          <TextInput 
            style={[styles.input, errors.password && styles.inputError]} 
            placeholder="Senha" 
            placeholderTextColor="#8C8C8C" 
            secureTextEntry 
            value={formData.password}
            onChangeText={(text) => { 
              setFormData(prev => ({ ...prev, password: text })); 
              setErrors(prev => ({...prev, password: ''})); 
            }}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
          
          {errors.general && <Text style={[styles.errorText, { textAlign: 'center' }]}>{errors.general}</Text>}
        </View>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <ThemedText style={styles.dividerText}>Ou</ThemedText>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialIcons}>
          <TouchableOpacity style={styles.socialBtn}><GoogleIcon size={28} color="#000" /></TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}><FacebookIcon size={28} color="#000" /></TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}><TwitterIcon size={28} color="#000" /></TouchableOpacity>
          <TouchableOpacity style={styles.socialBtn}><AppleIcon size={28} color="#000" /></TouchableOpacity>
        </View>

        <Pressable style={styles.btnConcluir} onPress={handleLogin} disabled={loading}>
          <ThemedText style={styles.btnText}>{loading ? 'Entrando...' : 'Entrar'}</ThemedText>
        </Pressable>

        <TouchableOpacity onPress={() => router.push('/(auth)/cadastro')}>
          <ThemedText style={styles.loginLink}>Ainda não tenho conta</ThemedText>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  header: { backgroundColor: '#F69919', height: 110, justifyContent: 'flex-end', padding: 20 },
  headerContent: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  backButton: { marginRight: 12 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#000' },
  content: { padding: 40, alignItems: 'center' },
  formCard: { backgroundColor: '#D3D3D3', width: '100%', borderRadius: 16, padding: 30, marginBottom: 40 },
  cardTitle: { textAlign: 'center', fontSize: 18, marginBottom: 25, color: '#000', fontWeight: '700' },
  input: { backgroundColor: '#fff', height: 48, borderRadius: 8, marginBottom: 18, paddingHorizontal: 15, fontSize: 16 },
  inputError: { borderColor: 'red', borderWidth: 1 },
  errorText: { color: 'red', marginBottom: 10, fontSize: 12 },
  divider: { flexDirection: 'row', alignItems: 'center', width: '100%', marginBottom: 35 },
  dividerLine: { flex: 1, borderBottomWidth: 1, borderColor: '#000' },
  dividerText: { paddingHorizontal: 15, fontSize: 16, fontWeight: '500', color: '#000' },
  socialIcons: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 45 },
  socialBtn: { width: 55, height: 55, borderRadius: 27.5, borderWidth: 1, borderColor: '#000', backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  btnConcluir: { backgroundColor: '#D3D3D3', width: '100%', padding: 16, borderRadius: 10, alignItems: 'center', marginBottom: 25 },
  btnText: { fontSize: 18, fontWeight: '700', color: '#000' },
  loginLink: { fontSize: 18, fontWeight: '700', color: '#000' }
});
