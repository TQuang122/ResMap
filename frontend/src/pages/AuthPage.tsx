import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';
import GoogleLogo from '../assets/google-logo.svg';
import { useNavigate, useLocation } from 'react-router-dom';

type AuthMode = 'signin' | 'signup';

const PENDING_TOPIC_KEY = 'resmap_pending_topic';

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
    supabase.auth.getSession().then(({ data }) => {
      const authed = Boolean(data.session);
      setIsAuthed(authed);
      if (authed && !redirected) {
        setRedirected(true);
        navigate(returnPath, { state: buildRedirectState() });
      }
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const authed = Boolean(session);
      setIsAuthed(authed);
      if (authed && !redirected) {
        setRedirected(true);
        navigate(returnPath, { state: buildRedirectState() });
      }
    });

    return () => {
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
    <div className="min-h-screen bg-slate-100">
      <div className="min-h-screen grid md:grid-cols-2">
        <div className="hidden md:flex relative items-center justify-center overflow-hidden bg-gradient-to-br from-orange-500 via-orange-400 to-amber-300">
          <div className="absolute inset-0 opacity-40">
            <div className="absolute -top-20 -left-10 w-64 h-64 rounded-full bg-white/20 blur-2xl" />
            <div className="absolute bottom-10 right-0 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
          </div>
          <div className="relative z-10 text-white max-w-md px-10">
            <div className="flex items-center gap-3">
              <Sparkles className="text-white" size={22} />
              <span className="uppercase tracking-[0.3em] text-xs">ResMap Access</span>
            </div>
            <h1 className="mt-6 text-5xl font-black leading-tight">
              Chào mừng đến với ResMap
            </h1>
            <p className="mt-5 text-xl text-white/90">
              Trợ lý nghiên cứu dành riêng cho sinh viên FPT University. Lưu đề tài, theo dõi lịch sử, và tăng tốc hành trình NCKH.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-orange-400">ResMap Auth</p>
                <h2 className="mt-3 text-2xl font-black text-slate-900">
                  {mode === 'signup' ? 'Tạo tài khoản' : 'Đăng nhập'}
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  {mode === 'signup' ? 'Đăng ký để lưu đề tài và lịch sử học tập.' : 'Tiếp tục với email của bạn.'}
                </p>
              </div>

              <div className="flex rounded-full border border-slate-200 overflow-hidden text-xs font-semibold shrink-0">
                <button
                  onClick={() => setMode('signin')}
                  className={`px-4 py-1.5 ${mode === 'signin' ? 'bg-orange-500 text-white' : 'text-slate-500'}`}
                >
                  Đăng nhập
                </button>
                <button
                  onClick={() => setMode('signup')}
                  className={`px-4 py-1.5 ${mode === 'signup' ? 'bg-orange-500 text-white' : 'text-slate-500'}`}
                >
                  Đăng ký
                </button>
              </div>
            </div>

            {/* Show redirect message if user was redirected */}
            {redirectMessage && (
              <div className="flex items-start gap-2 mt-4 p-3 rounded-xl bg-blue-50 border border-blue-100">
                <Info size={16} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-sm text-blue-700">{redirectMessage}</p>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleOAuth}
                className="w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-700 hover:border-orange-200 hover:text-orange-600 transition-colors flex items-center justify-center gap-2"
                type="button"
              >
                <img src={GoogleLogo} alt="Google" className="h-5 w-5" />
                Tiếp tục với Google
              </button>
            </div>

            <div className="mt-5 flex items-center gap-3 text-xs text-slate-400">
              <div className="h-px flex-1 bg-slate-100" />
              <span>Hoặc</span>
              <div className="h-px flex-1 bg-slate-100" />
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="mt-5 space-y-4"
                onSubmit={handleSubmit}
              >
                {mode === 'signup' && (
                  <label className="block text-xs font-semibold text-slate-600">
                    Username
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                      <User size={16} className="text-slate-400" />
                      <input
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Nguyen Van A"
                        className="w-full text-sm outline-none"
                        required
                      />
                    </div>
                  </label>
                )}

                <label className="block text-xs font-semibold text-slate-600">
                  Email
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                    <Mail size={16} className="text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="you@example.com"
                      className="w-full text-sm outline-none"
                      required
                    />
                  </div>
                </label>

                <label className="block text-xs font-semibold text-slate-600">
                  Password
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                    <Lock size={16} className="text-slate-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="••••••••"
                      className="w-full text-sm outline-none"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-slate-400 hover:text-orange-500"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </label>

                {mode === 'signup' && (
                  <label className="block text-xs font-semibold text-slate-600">
                    Xác nhận mật khẩu
                    <div className="mt-2 flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
                      <Lock size={16} className="text-slate-400" />
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                        placeholder="••••••••"
                        className="w-full text-sm outline-none"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((prev) => !prev)}
                        className="text-slate-400 hover:text-orange-500"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-orange-500 text-white font-bold py-2.5 text-sm hover:bg-orange-600 transition-colors disabled:opacity-60"
                >
                  {loading ? 'Đang xử lý...' : mode === 'signup' ? 'Đăng ký' : 'Đăng nhập'}
                </button>
              </motion.form>
            </AnimatePresence>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={resetLoading}
                className="hover:text-orange-500"
              >
                {resetLoading ? 'Đang gửi email...' : 'Quên mật khẩu?'}
              </button>
              <span>
                {mode === 'signup' ? 'Đã có tài khoản?' : 'Chưa có tài khoản?'}{' '}
                <button
                  type="button"
                  onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
                  className="font-semibold text-orange-500"
                >
                  {mode === 'signup' ? 'Đăng nhập' : 'Đăng ký'}
                </button>
              </span>
            </div>

            {message && (
              <div className="mt-4 rounded-xl border border-orange-100 bg-orange-50 px-4 py-3 text-xs text-orange-700">
                {message}
              </div>
            )}

            {isAuthed && (
              <button
                onClick={handleSignOut}
                className="mt-4 w-full rounded-xl border border-slate-200 py-2.5 text-sm font-semibold text-slate-600 hover:border-orange-200 hover:text-orange-500 transition-colors"
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
