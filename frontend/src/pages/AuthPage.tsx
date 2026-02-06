import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Info } from 'lucide-react';
import { supabase, recoverSession } from '../lib/supabase';
import GoogleLogo from '../assets/google-logo.svg';
import { useNavigate, useLocation } from 'react-router-dom';

type AuthMode = 'signin' | 'signup';

const PENDING_TOPIC_KEY = 'resmap_pending_topic';

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

const inputVariants = {
  focus: { scale: 1.01, borderColor: '#fb923c' },
  blur: { scale: 1, borderColor: '#e2e8f0' }
};

const buttonVariants = {
  hover: { scale: 1.02, boxShadow: '0 10px 25px -5px rgba(243, 111, 33, 0.25)' },
  tap: { scale: 0.98 }
};

const toggleVariants = {
  signin: { borderColor: '#f97316' },
  signup: { borderColor: '#cbd5e1' }
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
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [redirected, setRedirected] = useState(false);

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
      setMessage('Đã gửi email đặt lại mật khẩu. Hãy kiểm tra hộp thư.');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Gửi email thất bại.');
    } finally {
      setResetLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    if (!supabase) {
      setMessage('Missing Supabase config. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setMessage('Vui lòng nhập username.');
        return;
      }
      if (password.length < 6) {
        setMessage('Mật khẩu tối thiểu 6 ký tự.');
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
        setMessage('Tạo tài khoản thành công! Vui lòng kiểm tra email để xác thực.');
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

  return (
    <motion.div
      className="min-h-screen bg-slate-50"
      initial="hidden"
      animate="visible"
      variants={pageVariants}
    >
      <div className="min-h-screen grid md:grid-cols-2">
        <motion.div
          className="hidden md:flex relative items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300"
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
          <div className="relative z-10 text-white max-w-md px-10">
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <Sparkles className="text-white" size={22} />
              <span className="uppercase tracking-[0.3em] text-xs font-medium">ResMap Access</span>
            </motion.div>
            <motion.h1
              className="mt-6 text-5xl font-black leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.4 }}
            >
              Chào mừng đến với ResMap
            </motion.h1>
            <motion.p
              className="mt-5 text-lg text-white/90 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              Trợ lý nghiên cứu dành riêng cho sinh viên FPT University. Lưu đề tài, theo dõi lịch sử, và tăng tốc hành trình NCKH.
            </motion.p>
          </div>
        </motion.div>

        <div className="flex items-center justify-center px-4 py-12">
          <motion.div
            className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              className="flex items-center justify-between mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold">ResMap Auth</p>
                <motion.h2
                  className="mt-2 text-2xl font-black text-slate-900"
                  key={mode}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {mode === 'signup' ? 'Tạo tài khoản' : 'Đăng nhập'}
                </motion.h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  {mode === 'signup' ? 'Đăng ký để lưu đề tài và lịch sử học tập.' : 'Tiếp tục với email của bạn.'}
                </p>
              </div>

              <div className="flex rounded-full border border-slate-200 overflow-hidden text-sm font-semibold shrink-0 shadow-sm">
                <motion.button
                  onClick={() => setMode('signin')}
                  className={`px-5 py-2 ${mode === 'signin' ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  whileTap={{ scale: 0.95 }}
                >
                  Đăng nhập
                </motion.button>
                <motion.button
                  onClick={() => setMode('signup')}
                  className={`px-5 py-2 ${mode === 'signup' ? 'bg-orange-500 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                  whileTap={{ scale: 0.95 }}
                >
                  Đăng ký
                </motion.button>
              </div>
            </motion.div>

            {/* Show redirect message if user was redirected */}
            {redirectMessage && (
              <motion.div
                className="flex items-start gap-2 mb-6 p-3.5 rounded-xl bg-blue-50 border border-blue-100"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                role="alert"
              >
                <Info size={18} className="text-blue-500 shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm text-blue-700 leading-relaxed">{redirectMessage}</p>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
            >
              <motion.button
                onClick={handleOAuth}
                className="w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:border-orange-300 hover:text-orange-600 transition-all flex items-center justify-center gap-2.5 bg-white hover:bg-orange-50/50 shadow-sm hover:shadow-md"
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                aria-label="Tiếp tục với Google"
              >
                <img src={GoogleLogo} alt="" className="h-5 w-5" aria-hidden="true" />
                Tiếp tục với Google
              </motion.button>
            </motion.div>

            <motion.div
              className="flex items-center gap-3 text-sm text-slate-400 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              <div className="h-px flex-1 bg-slate-200" />
              <span className="font-medium">Hoặc</span>
              <div className="h-px flex-1 bg-slate-200" />
            </motion.div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={formVariants}
                className="space-y-4"
                onSubmit={handleSubmit}
                noValidate
              >
                {mode === 'signup' && (
                  <motion.label
                    className="block text-sm font-semibold text-slate-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    Username
                    <div className="mt-2 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={18} className="text-slate-400" aria-hidden="true" />
                      </div>
                      <input
                        type="text"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Nguyen Van A"
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-slate-50 focus:bg-white"
                        required
                        aria-required="true"
                        autoComplete="username"
                      />
                    </div>
                  </motion.label>
                )}

                <motion.label
                  className="block text-sm font-semibold text-slate-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: mode === 'signup' ? 0.2 : 0.1 }}
                >
                  Email
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-slate-50 focus:bg-white"
                      required
                      aria-required="true"
                      autoComplete="email"
                    />
                  </div>
                </motion.label>

                <motion.label
                  className="block text-sm font-semibold text-slate-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: mode === 'signup' ? 0.3 : 0.2 }}
                >
                  Mật khẩu
                  <div className="mt-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock size={18} className="text-slate-400" aria-hidden="true" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-slate-50 focus:bg-white"
                      required
                      aria-required="true"
                      autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-orange-500 transition-colors"
                      whileTap={{ scale: 0.9 }}
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                    </motion.button>
                  </div>
                </motion.label>

                {mode === 'signup' && (
                  <motion.label
                    className="block text-sm font-semibold text-slate-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Xác nhận mật khẩu
                    <div className="mt-2 relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={18} className="text-slate-400" aria-hidden="true" />
                      </div>
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-slate-50 focus:bg-white"
                        required
                        aria-required="true"
                        autoComplete="new-password"
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-orange-500 transition-colors"
                        whileTap={{ scale: 0.9 }}
                        aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                      >
                        {showConfirm ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
                      </motion.button>
                    </div>
                  </motion.label>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 rounded-xl bg-orange-500 text-white font-bold py-3 text-sm hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  variants={buttonVariants}
                  whileHover={loading ? undefined : 'hover'}
                  whileTap={loading ? undefined : 'tap'}
                  aria-busy={loading}
                >
                  {loading ? 'Đang xử lý...' : mode === 'signup' ? 'Đăng ký ngay' : 'Đăng nhập'}
                </motion.button>
              </motion.form>
            </AnimatePresence>

            <motion.div
              className="mt-5 flex items-center justify-between text-sm text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.3 }}
            >
              <motion.button
                type="button"
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="hover:text-orange-500 transition-colors font-medium"
                whileTap={{ scale: 0.95 }}
              >
                {resetLoading ? 'Đang gửi email...' : 'Quên mật khẩu?'}
              </motion.button>
              <span>
                {mode === 'signup' ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
                <motion.button
                  type="button"
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                  className="font-semibold text-orange-500 hover:text-orange-600 transition-colors inline-block"
                  whileTap={{ scale: 0.95 }}
                >
                  {mode === 'signup' ? 'Đăng nhập' : 'Đăng ký'}
                </motion.button>
              </span>
            </motion.div>

            <AnimatePresence>
              {message && (
                <motion.div
                  className="mt-5 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-sm text-orange-700"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  role="alert"
                  aria-live="polite"
                >
                  {message}
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {isAuthed && (
                <motion.button
                  onClick={handleSignOut}
                  className="mt-5 w-full rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:border-orange-300 hover:text-orange-500 hover:bg-orange-50 transition-all"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Đăng xuất
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AuthPage;
