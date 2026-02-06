import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Info, CheckCircle, AlertCircle, Shield, ArrowRight } from 'lucide-react';
import { supabase, recoverSession } from '../lib/supabase';
import GoogleLogo from '../assets/google-logo.svg';
import { useNavigate, useLocation } from 'react-router-dom';
import NeuralNetwork from '../components/ui/NeuralNetwork';
import Footer from '../components/Footer';

type AuthMode = 'signin' | 'signup';

const PENDING_TOPIC_KEY = 'resmap_pending_topic';

// Animation variants
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: 'easeOut' }
  }
};

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.2, ease: 'easeIn' }
  }
};

const buttonVariants = {
  hover: { scale: 1.02, boxShadow: '0 10px 25px -5px rgba(99, 102, 241, 0.3)' },
  tap: { scale: 0.98 }
};

const inputFocusVariants = {
  focus: { scale: 1.01, borderColor: '#fb923c', ringColor: 'rgba(251, 146, 60, 0.2)' },
  blur: { scale: 1, borderColor: '#e2e8f0', ringColor: 'transparent' }
};

const successVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } }
};

// Password strength checker
const checkPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
  let strength = 0;
  if (password.length >= 6) strength += 1;
  if (password.length >= 10) strength += 1;
  if (/[A-Z]/.test(password)) strength += 1;
  if (/[0-9]/.test(password)) strength += 1;
  if (/[^A-Za-z0-9]/.test(password)) strength += 1;
  
  if (strength <= 1) return { strength, label: 'Yếu', color: 'bg-red-500' };
  if (strength <= 2) return { strength, label: 'Trung bình', color: 'bg-yellow-500' };
  if (strength <= 3) return { strength, label: 'Mạnh', color: 'bg-blue-500' };
  return { strength, label: 'Rất mạnh', color: 'bg-green-500' };
};

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [redirected, setRedirected] = useState(false);
  const [success, setSuccess] = useState<'signup' | 'reset' | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Get redirect info from location state
  const locationState = location.state as { 
    from?: string; 
    pendingTopic?: string; 
    message?: string 
  } | null;
  const redirectMessage = locationState?.message;
  const pendingTopic = locationState?.pendingTopic;
  const returnPath = locationState?.from || '/home';

  // Build redirect state for after successful login
  const buildRedirectState = () => ({
    authSuccess: true,
    authMessage: 'Đăng nhập thành công.',
    pendingTopic: pendingTopic || localStorage.getItem(PENDING_TOPIC_KEY)
  });

  // Password strength
  const passwordStrength = mode === 'signup' ? checkPasswordStrength(password) : null;
  const passwordsMatch = mode === 'signup' ? confirmPassword.length > 0 && password === confirmPassword : null;

  useEffect(() => {
    if (!supabase) return;

    let mounted = true;

    const checkAuth = async () => {
      try {
        const session = await recoverSession();
        if (!mounted) return;
        setIsAuthed(!!session);
        if (session && !redirected) {
          setRedirected(true);
          navigate(returnPath, { state: buildRedirectState() });
        }
      } catch (err) {
        if (!mounted) return;
        console.error('Auth check failed:', err);
        setIsAuthed(false);
      }
    };

    checkAuth();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session);
      if (session && !redirected) {
        setRedirected(true);
        navigate(returnPath, { state: buildRedirectState() });
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [navigate, redirected, returnPath, pendingTopic]);

  const handleOAuth = async () => {
    if (!supabase) {
      setMessage('Missing Supabase config. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setMessage('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth`,
      },
    });

    if (error) {
      setMessage(error.message);
    }
  };

  const handleResetPassword = async () => {
    if (!supabase) {
      setMessage('Missing Supabase config. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }
    if (!email.trim()) {
      setMessage('Vui lòng nhập email để đặt lại mật khẩu.');
      return;
    }

    setResetLoading(true);
    setMessage('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth`,
      });
      if (error) throw error;
      setSuccess('reset');
      setMessage('');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Gửi email thất bại.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    setSuccess(null);
    
    if (!supabase) {
      setMessage('Missing Supabase config. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setMessage('Vui lòng nhập họ và tên.');
        return;
      }
      if (password.length < 6) {
        setMessage('Mật khẩu phải có ít nhất 6 ký tự.');
        return;
      }
      if (password !== confirmPassword) {
        setMessage('Mật khẩu xác nhận không khớp.');
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });
        if (error) throw error;
        setSuccess('signup');
        setMode('signin');
        setPassword('');
        setConfirmPassword('');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        navigate(returnPath, { state: buildRedirectState() });
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Đăng nhập thất bại.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setMessage('Đã đăng xuất.');
  };

  // Success state view
  if (success === 'signup') {
    return (
      <motion.div
        className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16 md:pt-0"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <motion.div
          className="max-w-md w-full"
          initial="hidden"
          animate="visible"
          variants={successVariants}
        >
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center">
            <motion.div
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Đăng ký thành công!</h2>
            <p className="text-slate-600 mb-8">Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.</p>
            <motion.button
              onClick={() => setSuccess(null)}
              className="w-full py-3 px-6 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Đăng nhập ngay</span>
              <ArrowRight size={18} />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  if (success === 'reset') {
    return (
      <motion.div
        className="min-h-screen bg-slate-50 flex items-center justify-center px-4 pt-16 md:pt-0"
        initial="hidden"
        animate="visible"
        variants={pageVariants}
      >
        <motion.div
          className="max-w-md w-full"
          initial="hidden"
          animate="visible"
          variants={successVariants}
        >
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8 text-center">
            <motion.div
              className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Mail className="w-10 h-10 text-blue-600" />
            </motion.div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Kiểm tra email của bạn!</h2>
            <p className="text-slate-600 mb-8">Chúng tôi đã gửi link đặt lại mật khẩu đến <span className="font-semibold text-slate-900">{email}</span></p>
            <motion.button
              onClick={() => setSuccess(null)}
              className="w-full py-3 px-6 border-2 border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Quay lại đăng nhập
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-slate-50 flex flex-col"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div className="flex-1 grid md:grid-cols-2">
        {/* Left Panel - Marketing */}
        <motion.div
          className="hidden md:flex relative items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 pt-52"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <div className="absolute inset-0 opacity-40">
            <motion.div
              className="absolute -top-20 -left-10 w-64 h-64 rounded-full bg-white/20 blur-2xl"
              animate={{ x: [0, 10, 0], opacity: [0.4, 0.5, 0.4] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              className="absolute bottom-10 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl"
              animate={{ x: [0, -15, 0], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
          <NeuralNetwork color="#818cf8" />
          <div className="relative z-10 text-white max-w-md px-10">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Sparkles className="text-white" size={28} />
              <span className="uppercase tracking-[0.3em] text-sm font-semibold">ResMap Access</span>
            </motion.div>
            <motion.h1
              className="mt-4 text-6xl md:text-7xl font-black leading-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Chào mừng đến với ResMap
            </motion.h1>
            <motion.p
              className="mt-4 text-xl md:text-2xl text-white/90 leading-relaxed"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Trợ lý nghiên cứu dành riêng cho sinh viên FPT University. Lưu đề tài, theo dõi lịch sử, và tăng tốc hành trình NCKH.
            </motion.p>
            
            {/* Trust Signals */}
            <motion.div
              className="mt-8 grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="flex items-center gap-3 text-white/90">
                <Shield size={24} />
                <span className="text-base font-medium">Bảo mật cao</span>
              </div>
              <div className="flex items-center gap-3 text-white/90">
                <CheckCircle size={24} />
                <span className="text-base font-medium">5,000+ sinh viên</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Panel - Auth Form */}
        <div className="flex items-center justify-center px-4 py-48 md:py-24">
          <motion.div
            className="w-full max-w-md pt-8 md:pt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
          >
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
              {/* Header */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-1">ResMap Auth</p>
                <motion.h2
                  className="text-2xl font-black text-slate-900"
                  key={mode}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mode === 'signup' ? 'Tạo tài khoản' : 'Chào mừng trở lại'}
                </motion.h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  {mode === 'signup' ? 'Đăng ký để lưu đề tài và theo dõi tiến độ' : 'Đăng nhập để tiếp tục hành trình NCKH'}
                </p>
              </motion.div>

              {/* Toggle Buttons */}
              <div className="flex rounded-full border border-slate-200 p-1 mb-6">
                <motion.button
                  onClick={() => setMode('signin')}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 ${mode === 'signin' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                  whileTap={{ scale: 0.95 }}
                >
                  Đăng nhập
                </motion.button>
                <motion.button
                  onClick={() => setMode('signup')}
                  className={`flex-1 py-2 px-4 rounded-full text-sm font-semibold transition-all duration-200 ${mode === 'signup' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                  whileTap={{ scale: 0.95 }}
                >
                  Đăng ký
                </motion.button>
              </div>

              {/* Redirect Message */}
              {redirectMessage && (
                <motion.div
                  className="flex items-start gap-3 mb-6 p-4 rounded-xl bg-blue-50 border border-blue-100"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  role="alert"
                >
                  <Info size={20} className="text-blue-600 shrink-0 mt-0.5" aria-hidden="true" />
                  <p className="text-sm text-blue-800 leading-relaxed">{redirectMessage}</p>
                </motion.div>
              )}

              {/* OAuth Button */}
              <motion.button
                onClick={handleOAuth}
                className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:border-orange-300 hover:text-orange-600 transition-all duration-200 flex items-center justify-center gap-3 shadow-sm hover:shadow-md"
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                aria-label="Tiếp tục với Google"
              >
                <img src={GoogleLogo} alt="" className="w-5 h-5" aria-hidden="true" />
                <span>Tiếp tục với Google</span>
              </motion.button>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-sm text-slate-400 font-medium">hoặc</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Form */}
              <AnimatePresence mode="wait">
                <motion.form
                  key={mode}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={formVariants}
                  className="space-y-5"
                  onSubmit={handleSubmit}
                  noValidate
                >
                  {/* Full Name - Signup only */}
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label htmlFor="fullName" className="block text-sm font-semibold text-slate-700 mb-2">
                        Họ và tên
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <User size={18} className="text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                          id="fullName"
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Nguyễn Văn A"
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-200"
                          required
                          aria-required="true"
                          autoComplete="name"
                          onFocus={() => setFocusedField('fullName')}
                          onBlur={() => setFocusedField(null)}
                        />
                      </div>
                    </motion.div>
                  )}

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={18} className="text-slate-400" aria-hidden="true" />
                      </div>
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-200"
                        required
                        aria-required="true"
                        autoComplete="email"
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-2">
                      Mật khẩu
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400" aria-hidden="true" />
                      </div>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Nhập mật khẩu"
                        className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:bg-white transition-all duration-200"
                        required
                        aria-required="true"
                        autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                        onFocus={() => setFocusedField('password')}
                        onBlur={() => setFocusedField(null)}
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-orange-500 transition-colors"
                        whileTap={{ scale: 0.9 }}
                        aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                      </motion.button>
                    </div>
                    
                    {/* Password Strength Indicator - Signup only */}
                    {mode === 'signup' && password && passwordStrength && (
                      <motion.div
                        className="mt-3 space-y-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <motion.div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full ${level <= passwordStrength.strength ? passwordStrength.color : 'bg-slate-200'}`}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: level * 0.05 }}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <span className={`font-medium ${passwordStrength.strength <= 1 ? 'text-red-500' : passwordStrength.strength <= 2 ? 'text-yellow-500' : passwordStrength.strength <= 3 ? 'text-blue-500' : 'text-green-500'}`}>
                            {passwordStrength.label}
                          </span>
                          {passwordStrength.strength < 3 && <span className="text-slate-400">• Nên có chữ hoa, số và ký tự đặc biệt</span>}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Confirm Password - Signup only */}
                  {mode === 'signup' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 mb-2">
                        Xác nhận mật khẩu
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Lock size={18} className="text-slate-400" aria-hidden="true" />
                        </div>
                        <input
                          id="confirmPassword"
                          type={showConfirm ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Nhập lại mật khẩu"
                          className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-slate-50 text-sm outline-none transition-all duration-200 ${
                            confirmPassword.length > 0
                              ? passwordsMatch
                                ? 'border-green-400 focus:border-green-500 focus:ring-4 focus:ring-green-100'
                                : 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                              : 'border-slate-200 focus:border-orange-400 focus:ring-4 focus:ring-orange-100 focus:bg-white'
                          }`}
                          required
                          aria-required="true"
                          autoComplete="new-password"
                          onFocus={() => setFocusedField('confirmPassword')}
                          onBlur={() => setFocusedField(null)}
                        />
                        <motion.button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center transition-colors"
                          whileTap={{ scale: 0.9 }}
                          aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                        >
                          {showConfirm ? (
                            <EyeOff size={18} className="text-green-500" aria-hidden="true" />
                          ) : (
                            <Eye size={18} className={confirmPassword.length > 0 ? (passwordsMatch ? 'text-green-500' : 'text-red-400') : 'text-slate-400'} aria-hidden="true" />
                          )}
                        </motion.button>
                      </div>
                      {confirmPassword.length > 0 && !passwordsMatch && (
                        <motion.p
                          className="mt-2 text-xs text-red-500 flex items-center gap-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <AlertCircle size={12} />
                          Mật khẩu không khớp
                        </motion.p>
                      )}
                    </motion.div>
                  )}

                  {/* Remember Me & Forgot Password */}
                  {mode === 'signin' && (
                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500 focus:ring-offset-2 cursor-pointer"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Ghi nhớ đăng nhập</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleResetPassword}
                        disabled={resetLoading}
                        className="text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors disabled:opacity-50"
                      >
                        {resetLoading ? 'Đang gửi...' : 'Quên mật khẩu?'}
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 px-6 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25"
                    variants={buttonVariants}
                    whileHover={loading ? undefined : 'hover'}
                    whileTap={loading ? undefined : 'tap'}
                    aria-busy={loading}
                  >
                    {loading ? (
                      <>
                        <motion.span
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        />
                        <span>Đang xử lý...</span>
                      </>
                    ) : mode === 'signup' ? (
                      'Tạo tài khoản'
                    ) : (
                      'Đăng nhập'
                    )}
                  </motion.button>

                  {/* Terms - Signup only */}
                  {mode === 'signup' && (
                    <motion.p
                      className="text-xs text-slate-500 text-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      Bằng việc đăng ký, bạn đồng ý với{' '}
                      <a href="#" className="text-orange-500 hover:text-orange-600 hover:underline">Điều khoản sử dụng</a>
                      {' '}và{' '}
                      <a href="#" className="text-orange-500 hover:text-orange-600 hover:underline">Chính sách bảo mật</a>
                    </motion.p>
                  )}
                </motion.form>
              </AnimatePresence>

              {/* Toggle Mode */}
              <motion.div
                className="mt-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <span className="text-sm text-slate-500">
                  {mode === 'signup' ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
                  <button
                    type="button"
                    onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                    className="font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    {mode === 'signup' ? 'Đăng nhập ngay' : 'Đăng ký miễn phí'}
                  </button>
                </span>
              </motion.div>

              {/* Error Message */}
              <AnimatePresence>
                {message && (
                  <motion.div
                    className="mt-6 p-4 rounded-xl bg-red-50 border border-red-100"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    role="alert"
                    aria-live="polite"
                  >
                    <p className="text-sm text-red-700 flex items-start gap-2">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      {message}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Sign Out - When authenticated */}
              <AnimatePresence>
                {isAuthed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-100">
                      <p className="text-sm text-green-800 mb-3 flex items-center gap-2">
                        <CheckCircle size={16} />
                        Bạn đã đăng nhập
                      </p>
                      <motion.button
                        onClick={handleSignOut}
                        className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-white hover:border-orange-300 hover:text-orange-600 transition-all duration-200"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                      >
                        Đăng xuất
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </motion.div>
  );
};

export default AuthPage;
