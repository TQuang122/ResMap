import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

type AuthState = 'loading' | 'authed' | 'guest';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const authRequired = (import.meta.env.VITE_AUTH_REQUIRED ?? 'true') === 'true';
  const [state, setState] = useState<AuthState>('loading');
  const location = useLocation();

  useEffect(() => {
    if (!authRequired || !supabase) {
      setState('authed');
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setState(data.session ? 'authed' : 'guest');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setState(session ? 'authed' : 'guest');
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [authRequired]);

  if (!authRequired) return children;
  if (state === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-slate-400">
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  if (state === 'guest') {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
