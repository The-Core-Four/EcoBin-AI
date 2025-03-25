import React, { useState } from 'react';
import { 
  View, 
  Image, 
  TextInput, 
  ActivityIndicator, 
  StyleSheet, 
  Alert, 
  Text, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../Firebase_Config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../Firebase_Config';
import Icon from 'react-native-vector-icons/MaterialIcons';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();

  // Email validation must contain @gmail.com
  const validateEmail = (text: string) => {
    setEmail(text);
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(text)) {
      setEmailError('Valid Gmail required');
    } else {
      setEmailError('');
    }
  };

  // Password cannot be empty validation
  const validatePassword = (text: string) => {
    setPassword(text);
    setPasswordError(text ? '' : 'Password required');
  };

  const handleLogin = async () => {
    if (emailError || passwordError || !email || !password) {
      Alert.alert('Validation Error', 'Please fix input errors');
      return;
    }
    
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(FIREBASE_AUTH, email, password);
      const user = response.user;
      const userDoc = await getDoc(doc(FIREBASE_DB, 'users', user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        navigation.navigate(userData.type === 'Admin' ? 'HomeDD' : 'CustomerHome', { user: userData });
      } else {
        Alert.alert('Error', 'User profile not found');
      }
    } catch (error: any) {
      Alert.alert('Authentication Failed', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <Image 
          source={require('../../assets/icon.png')}
          style={styles.logo} 
          resizeMode="contain"
        />
        
        {/* Maintained Welcome text */}
        <Text style={styles.title}>Welcome to EcoBin AI</Text>

        {/* Email Input with Validation */}
        <View style={[styles.inputContainer, emailError && styles.inputError]}>
          <Icon name="email" size={20} color="#666" style={styles.icon} />
          <TextInput
            value={email}
            placeholder="Email address"
            placeholderTextColor="#999"
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={validateEmail}
            style={styles.input}
          />
        </View>
        {emailError ? <Text style={styles.errorText}>⚠️ {emailError}</Text> : null}

        {/* Password Input with Validation */}
        <View style={[styles.inputContainer, passwordError && styles.inputError]}>
          <Icon name="lock" size={20} color="#666" style={styles.icon} />
          <TextInput
            value={password}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            onChangeText={validatePassword}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Icon
              name={showPassword ? 'visibility-off' : 'visibility'}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? <Text style={styles.errorText}>⚠️ {passwordError}</Text> : null}

        {/* Login Button - Color unchanged */}
        <TouchableOpacity 
          style={[styles.button, (loading || emailError || passwordError) && styles.disabledButton]} 
          onPress={handleLogin}
          disabled={loading || !!emailError || !!passwordError}
          activeOpacity={0.8}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
        {/* Copyright Text */}
    <View style={styles.footer}>
      <Text style={styles.footerText}>©2025, The Core Four. All Rights Reserved.</Text>
    </View>
    </KeyboardAvoidingView>
  );
};

// Maintained original color scheme
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    padding: 32,
    justifyContent: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginBottom: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  inputError: {
    borderColor: '#EF4444',
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0F172A',
  },
  icon: {
    marginRight: 12,
  },
  eyeIcon: {
    padding: 8,
  },
  button: {
    backgroundColor: '#38E079',
    borderRadius: 12,
    padding: 18,
    marginTop: 24,
    elevation: 4,
    shadowColor: '#38E079',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#A0AEC0',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginBottom: 12,
    marginLeft: 8,
  },
  footer: {
  alignItems: 'center',
  paddingBottom: 16,
},
footerText: {
  fontSize: 12,
  color: '#94A3B8',
  textAlign: 'center',
},

});

export default LoginScreen;