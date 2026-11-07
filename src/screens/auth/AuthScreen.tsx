/**
 * The Spot - Authentication Screen (Login & Sign Up)
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../../theme/colors';
import { radius, spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { Button } from '../../components/common/Button';
import { Icon } from '../../components/common/Icon';

interface AuthScreenProps {
  onSuccess: () => void;
  onBack: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onSuccess,
  onBack,
  initialMode = 'signup',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('aryan@thespot.app');
  const [password, setPassword] = useState('••••••••');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (mode === 'signup' && !name.trim()) {
      setErrorMsg('Please enter your full name or gamer tag.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 700);
  };

  const handleGoogleAuth = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onSuccess();
    }, 600);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content"  />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Bar */}
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Icon name="arrow-left" size={20} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {mode === 'login' ? 'Welcome Back.' : 'Join The Spot.'}
            </Text>
            <Text style={styles.subtitle}>
              {mode === 'login'
                ? 'Discover events and rejoin your squads in Pune.'
                : 'Experience Pune’s top parties, gaming sessions & squads.'}
            </Text>
          </View>

          {/* Mode Switch Tabs */}
          <View style={styles.switchTabs}>
            <TouchableOpacity
              onPress={() => {
                setMode('signup');
                setErrorMsg('');
              }}
              style={[styles.switchTab, mode === 'signup' && styles.switchTabActive]}
            >
              <Text style={[styles.switchTabText, mode === 'signup' && styles.switchTabTextActive]}>
                Sign Up
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setMode('login');
                setErrorMsg('');
              }}
              style={[styles.switchTab, mode === 'login' && styles.switchTabActive]}
            >
              <Text style={[styles.switchTabText, mode === 'login' && styles.switchTabTextActive]}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>

          {/* Google Auth Entry Point */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleGoogleAuth}
            style={styles.googleBtn}
          >
            <Text style={styles.googleIconText}>G</Text>
            <Text style={styles.googleBtnText}>Continue with Google</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with email</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Error Feedback */}
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Icon name="alert-circle" size={14} color={colors.roseDanger} />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.form}>
            {mode === 'signup' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Your Name or Handle</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Aryan Deshmukh"
                  placeholderTextColor={colors.textMuted}
                  style={styles.input}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="name@example.com"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Minimum 6 characters"
                placeholderTextColor={colors.textMuted}
                style={styles.input}
                secureTextEntry
              />
            </View>

            <Button
              title={mode === 'signup' ? 'Create Account' : 'Log In'}
              onPress={handleSubmit}
              loading={isLoading}
              size="lg"
              variant="primary"
              fullWidth
              style={styles.submitBtn}
            />
          </View>

          <Text style={styles.termsText}>
            By continuing, you agree to The Spot’s Terms of Service & Privacy Policy. Safe and respectful community standards apply.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.base,
    paddingBottom: spacing.xxl,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    fontSize: typography.fontSize.displaySm,
    fontWeight: typography.fontWeight.heavy,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  switchTabs: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundSurface2,
    borderRadius: radius.lg,
    padding: 4,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderDefault,
  },
  switchTab: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: radius.md,
  },
  switchTabActive: {
    backgroundColor: colors.primary,
  },
  switchTabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  switchTabTextActive: {
    color: colors.textPrimary,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.md,
    paddingVertical: spacing.md - 2,
    marginBottom: spacing.lg,
  },
  googleIconText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginRight: 10,
  },
  googleBtnText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.textPrimary,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderSubtle,
  },
  dividerText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    marginHorizontal: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.roseLight,
    borderWidth: 1,
    borderColor: colors.roseDanger,
    borderRadius: radius.md,
    padding: spacing.sm + 2,
    marginBottom: spacing.base,
  },
  errorText: {
    fontSize: typography.fontSize.xs,
    color: colors.roseDanger,
    marginLeft: 6,
    flex: 1,
  },
  form: {
    gap: spacing.base,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.backgroundSurface2,
    borderWidth: 1,
    borderColor: colors.borderDefault,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm + 4,
    color: colors.textPrimary,
    fontSize: typography.fontSize.base,
  },
  submitBtn: {
    marginTop: spacing.sm,
  },
  termsText: {
    fontSize: typography.fontSize.xxs,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
    lineHeight: 16,
  },
});
