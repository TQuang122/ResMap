import React, { useState, useEffect } from 'react';
import { X, Play, ExternalLink, BookOpen, Video, Search } from 'lucide-react';
import { BlogItem, VideoItem, SupportData } from '../../../types';

interface ResourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SupportData;
  stepTitle?: string;
}

const ResourcesModal: React.FC<ResourcesModalProps> = ({ isOpen, onClose, data, stepTitle }) => {
  const [activeTab, setActiveTab] = useState<'videos' | 'blogs'>('videos');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setSearchQuery('');
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
    }
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const allVideos: VideoItem[] = [
    ...(data.videoUrl ? [{ title: data.videoTitle || 'Video hướng dẫn chính', url: data.videoUrl, duration: '10-15 min' }] : []),
    ...(data.additionalVideos || [])
  ];

  const filteredVideos = allVideos.filter(v => 
    v.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBlogs = (data.blogs || []).filter(b =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getYouTubeVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-orange-50 to-amber-50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Tài liệu tham khảo</h2>
              <p className="text-sm text-slate-500 mt-0.5">
                {stepTitle || 'Videos và Blogs hướng dẫn'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'videos'
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Video className="w-4 h-4" />
            Videos ({allVideos.length})
          </button>
          <button
            onClick={() => setActiveTab('blogs')}
            className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === 'blogs'
                ? 'border-orange-500 text-orange-600 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Blogs ({data.blogs?.length || 0})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {activeTab === 'videos' && (
            <>
              {filteredVideos.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Chưa có video nào</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {filteredVideos.map((video, idx) => {
                    const videoId = getYouTubeVideoId(video.url);
                    const thumbnailUrl = videoId 
                      ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                      : undefined;

                    return (
                      <div key={idx} className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="aspect-video bg-slate-100 relative">
                          {videoId ? (
                            <iframe
                              src={`https://www.youtube.com/embed/${videoId}`}
                              title={video.title}
                              className="w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Play className="w-12 h-12" />
                            </div>
                          )}
                          {video.duration && (
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                              {video.duration}
                            </span>
                          )}
                        </div>
                        <div className="p-4">
                          <h4 className="font-semibold text-slate-900 line-clamp-2">{video.title}</h4>
                          {video.url && (
                            <a
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 mt-2"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Xem trên YouTube
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {activeTab === 'blogs' && (
            <>
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500">Chưa có blog nào</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBlogs.map((blog, idx) => (
                    <a
                      key={idx}
                      href={blog.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-orange-300 transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">
                            {blog.title}
                          </h4>
                          {blog.description && (
                            <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                              {blog.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                            {blog.author && <span>{blog.author}</span>}
                            {blog.date && <span>• {blog.date}</span>}
                          </div>
                        </div>
                        <ExternalLink className="w-5 h-5 text-slate-400 group-hover:text-orange-500 flex-shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50">
          <p className="text-xs text-slate-500 text-center">
            Nhấp vào liên kết để mở bài viết/video trong tab mới
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResourcesModal;
