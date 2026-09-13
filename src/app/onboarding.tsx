import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import GoogleIcon from '../components/social-icons/GoogleIcon';
import FacebookIcon from '../components/social-icons/FacebookIcon';
import AppleIcon from '../components/social-icons/AppleIcon';
import MailIcon from '../components/social-icons/MailIcon';

export default function OnboardingScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assets/onboarding/fundo-onboarding.jpg')}
        style={styles.heroImage}
        resizeMode="cover"
      />
      <View style={styles.whiteCard}>
        <Text style={styles.title}>está a apenas alguns passos do Rota</Text>
        
        <TouchableOpacity style={styles.btnLogin}>
          <Text style={styles.btnText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.dividerText}>Ou continue com</Text>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialBox}>
            <GoogleIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBox}>
            <FacebookIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBox}>
            <AppleIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialBox}>
            <MailIcon />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heroImage: {
    flex: 0.65,
    backgroundColor: '#ff9a00', // Placeholder
  },
  whiteCard: {
    flex: 0.4,
    backgroundColor: '#0F0F0F',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    marginTop: -20,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
  },
  btnLogin: {
    borderWidth: 2,
    borderColor: '#FF743D',
    backgroundColor: 'transparent',
    height: 60,
    borderRadius: 31,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  btnText: {
    color: '#FF743D',
    fontSize: 16,
    fontWeight: '700',
  },
  dividerText: {
    color: '#D9D9D9',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  socialBox: {
    width: 58,
    height: 58,
    backgroundColor: '#262626',
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
