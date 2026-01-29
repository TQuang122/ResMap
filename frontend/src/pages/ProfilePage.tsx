import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

type SavedTopic = {
  id: string;
  title: string;
  description: string | null;
  difficulty: string | null;
  created_at: string;
};

type HistoryLog = {
  id: string;
  tool: string;
  request: Record<string, unknown> | null;
  response: Record<string, unknown> | null;
  created_at: string;
};

type TabKey = 'topics' | 'history';

const ProfilePage: React.FC = () => {
  const [tab, setTab] = useState<TabKey>('topics');
  const [email, setEmail] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [fullName, setFullName] = useState('');
  const [major, setMajor] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [deletingTopicId, setDeletingTopicId] = useState<string | null>(null);
  const [deletingLogId, setDeletingLogId] = useState<string | null>(null);
  const [topics, setTopics] = useState<SavedTopic[]>([]);
  const [logs, setLogs] = useState<HistoryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase chưa được cấu hình.');
      setLoading(false);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;

      if (!user) {
        setError('Bạn cần đăng nhập để xem hồ sơ.');
        setLoading(false);
        return;
      }

      setEmail(user.email ?? null);
      setAvatarUrl((user.user_metadata?.avatar_url as string) ?? null);

      const profileRes = await supabase
        .from('profiles')
        .select('full_name,major,avatar_url')
        .eq('id', user.id)
        .maybeSingle();

      if (!profileRes.error && profileRes.data) {
        setFullName(profileRes.data.full_name ?? '');
        setMajor(profileRes.data.major ?? '');
        setAvatarUrl(profileRes.data.avatar_url ?? avatarUrl);
      }

      const [topicsRes, logsRes] = await Promise.all([
        supabase
          .from('saved_topics')
          .select('id,title,description,difficulty,created_at')
          .order('created_at', { ascending: false }),
        supabase
          .from('history_logs')
          .select('id,tool,request,response,created_at')
          .order('created_at', { ascending: false })
          .limit(50),
      ]);

      if (topicsRes.error) {
        setError('Không thể tải danh sách đề tài đã lưu.');
      } else {
        setTopics((topicsRes.data as SavedTopic[]) ?? []);
      }

      if (logsRes.error) {
        setError('Không thể tải lịch sử hoạt động.');
      } else {
        setLogs((logsRes.data as HistoryLog[]) ?? []);
      }

      setLoading(false);
    };

    load();
  }, []);

  const handleSaveProfile = async () => {
    if (!supabase) {
      setError('Supabase chưa được cấu hình.');
      return;
    }
    const { data: sessionData } = await supabase.auth.getSession();
    const user = sessionData.session?.user;
    if (!user) {
      setError('Bạn cần đăng nhập để cập nhật hồ sơ.');
      return;
    }

    setProfileSaving(true);
    setError(null);
    const { error: upsertError } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: fullName.trim() || null,
      major: major.trim() || null,
      avatar_url: avatarUrl?.trim() || null,
      updated_at: new Date().toISOString(),
    });

    if (upsertError) {
      setError('Không thể lưu hồ sơ.');
    }
    setProfileSaving(false);
  };

  const handleDeleteTopic = async (topicId: string) => {
    if (!supabase) return;
    setDeletingTopicId(topicId);
    const { error: deleteError } = await supabase
      .from('saved_topics')
      .delete()
      .eq('id', topicId);
    if (deleteError) {
      setError('Không thể xoá đề tài.');
    } else {
      setTopics((prev) => prev.filter((topic) => topic.id !== topicId));
    }
    setDeletingTopicId(null);
  };

  const handleDeleteLog = async (logId: string) => {
    if (!supabase) return;
    setDeletingLogId(logId);
    const { error: deleteError } = await supabase
      .from('history_logs')
      .delete()
      .eq('id', logId);
    if (deleteError) {
      setError('Không thể xoá lịch sử.');
    } else {
      setLogs((prev) => prev.filter((log) => log.id !== logId));
    }
    setDeletingLogId(null);
  };

  const emptyState = useMemo(() => {
    if (tab === 'topics') return 'Chưa có đề tài nào được lưu.';
    return 'Chưa có lịch sử hoạt động.';
  }, [tab]);

  const formatRequest = (request: Record<string, unknown> | null) => {
    if (!request) return null;
    const entries = Object.entries(request).filter(([, value]) => value !== null && value !== undefined);
    if (entries.length === 0) return null;
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-600">
        {entries.map(([key, value]) => (
          <div key={key} className="flex items-start gap-2">
            <span className="uppercase text-[10px] tracking-widest text-slate-400">{key}</span>
            <span className="font-semibold text-slate-600 break-words">
              {typeof value === 'string' ? value : JSON.stringify(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white border border-orange-100 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-black text-xl">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  (email?.[0] ?? 'U').toUpperCase()
                )}
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.08em] text-orange-400">Hồ sơ</p>
                <h1 className="text-2xl font-black text-slate-900">{fullName || 'ResMap Profile'}</h1>
                <p className="text-sm text-slate-500 mt-1">{email ?? 'Người dùng'}</p>
                {major && <p className="text-xs text-slate-400 mt-1">{major}</p>}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTab('topics')}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                  tab === 'topics'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-slate-200 text-slate-500 hover:border-orange-200'
                }`}
              >
                Đề tài đã lưu
              </button>
              <button
                onClick={() => setTab('history')}
                className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                  tab === 'history'
                    ? 'bg-orange-500 text-white border-orange-500'
                    : 'border-slate-200 text-slate-500 hover:border-orange-200'
                }`}
              >
                Lịch sử hoạt động
              </button>
            </div>
          </div>

          {loading ? (
            <div className="mt-8 text-sm text-slate-500">Đang tải dữ liệu...</div>
          ) : error ? (
            <div className="mt-8 text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl p-4">
              {error}
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                <h2 className="text-sm font-bold text-slate-700">Cập nhật hồ sơ</h2>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="text-xs font-semibold text-slate-600">
                    Họ và tên
                    <input
                      value={fullName}
                      onChange={(event) => setFullName(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Nguyen Van A"
                    />
                  </label>
                  <label className="text-xs font-semibold text-slate-600">
                    Chuyên ngành
                    <input
                      value={major}
                      onChange={(event) => setMajor(event.target.value)}
                      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
                      placeholder="Kỹ thuật phần mềm"
                    />
                  </label>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={profileSaving}
                  className="mt-4 px-4 py-2 rounded-full bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 disabled:opacity-60"
                >
                  {profileSaving ? 'Đang lưu...' : 'Lưu hồ sơ'}
                </button>
              </div>
              {tab === 'topics' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {topics.length === 0 && (
                    <div className="text-sm text-slate-500">{emptyState}</div>
                  )}
                  {topics.map((topic) => (
                    <div key={topic.id} className="border border-slate-200 rounded-2xl p-4 bg-white">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-bold text-slate-900">{topic.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{topic.description}</p>
                        </div>
                        {topic.difficulty && (
                          <span className="text-xs font-bold px-2 py-1 rounded-full border border-orange-200 text-orange-600">
                            {topic.difficulty}
                          </span>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-slate-400">Lưu lúc {new Date(topic.created_at).toLocaleString()}</p>
                        <button
                          onClick={() => handleDeleteTopic(topic.id)}
                          disabled={deletingTopicId === topic.id}
                          className="text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-60"
                        >
                          {deletingTopicId === topic.id ? 'Đang xoá...' : 'Xoá'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {tab === 'history' && (
                <div className="space-y-3">
                  {logs.length === 0 && (
                    <div className="text-sm text-slate-500">{emptyState}</div>
                  )}
                  {logs.map((log) => (
                    <div key={log.id} className="border border-slate-200 rounded-2xl p-4 bg-white">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wide text-orange-500">{log.tool}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-slate-400">{new Date(log.created_at).toLocaleString()}</span>
                          <button
                            onClick={() => handleDeleteLog(log.id)}
                            disabled={deletingLogId === log.id}
                            className="text-xs font-semibold text-red-500 hover:text-red-600 disabled:opacity-60"
                          >
                            {deletingLogId === log.id ? 'Đang xoá...' : 'Xoá'}
                          </button>
                        </div>
                      </div>
                      <div className="mt-3">
                        {formatRequest(log.request) ?? (
                          <p className="text-xs text-slate-400">Không có dữ liệu yêu cầu.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
