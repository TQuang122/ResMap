import React, { useState } from 'react';
import { Trash2, AlertTriangle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CleanupButtonProps {
  onCleanupComplete?: (result: { logs: number; topics: number; lecturers: number }) => void;
}

const CleanupButton: React.FC<CleanupButtonProps> = ({ onCleanupComplete }) => {
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [result, setResult] = useState<{ logs: number; topics: number; lecturers: number } | null>(null);

  const handleCleanup = async () => {
    if (!supabase) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('cleanup_all_old_data');

      if (error) {
        console.error('Cleanup error:', error);
        alert('Có lỗi xảy ra khi dọn dẹp dữ liệu.');
      } else if (data) {
        setResult({
          logs: data.logs_deleted || 0,
          topics: data.topics_deleted || 0,
          lecturers: data.lecturers_deleted || 0,
        });
        onCleanupComplete?.(data);
        
        setTimeout(() => {
          setResult(null);
          setShowConfirm(false);
        }, 3000);
      }
    } catch (err) {
      console.error('Cleanup exception:', err);
      alert('Có lỗi xảy ra khi dọn dẹp dữ liệu.');
    } finally {
      setLoading(false);
    }
  };

  if (showConfirm) {
    return (
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-orange-100 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-orange-800">Xác nhận dọn dẹp?</h4>
            <p className="text-sm text-orange-700 mt-1">
              Hành động này sẽ xoá vĩnh viễn:
            </p>
            <ul className="text-sm text-orange-600 mt-1 ml-4 list-disc">
              <li>Lịch sử hoạt động cũ hơn 3 ngày</li>
              <li>Đề tài đã lưu cũ hơn 30 ngày</li>
              <li>Giảng viên quan tâm cũ hơn 30 ngày</li>
            </ul>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleCleanup}
                disabled={loading}
                className="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Đang xoá...' : 'Xác nhận xoá'}
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 text-sm font-semibold rounded-lg hover:bg-slate-300"
              >
                Huỷ
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-green-800 font-semibold">
          <Trash2 className="w-5 h-5" />
          Đã dọn dẹp thành công!
        </div>
        <p className="text-sm text-green-700 mt-1">
          Đã xoá: {result.logs} logs, {result.topics} đề tài, {result.lecturers} giảng viên
        </p>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
      Dọn dẹp dữ liệu cũ
    </button>
  );
};

export default CleanupButton;
