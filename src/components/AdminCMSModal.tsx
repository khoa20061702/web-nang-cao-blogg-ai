import React, { useState } from 'react';
import {
  X,
  PlusCircle,
  Sparkles,
  Calendar,
  Tag,
  Image,
  FileText,
  Trash2,
  Edit3,
  CheckCircle2,
  Clock,
  Layers,
  Send,
  Loader2,
  Upload,
} from 'lucide-react';
import { BlogPost, CategoryType } from '../types/blog.ts';
import { UserProfile } from './AuthModal.tsx';
import { AlertTriangle, Lock } from 'lucide-react';

interface AdminCMSModalProps {
  isOpen: boolean;
  onClose: () => void;
  posts: BlogPost[];
  onAddPost: (newPost: BlogPost) => void;
  onDeletePost: (postId: string) => void;
  onSummarizeText: (text: string) => Promise<string>;
  currentUser?: UserProfile | null;
  onOpenAuth?: () => void;
}

const PRESET_COVERS = [
  { label: 'Công nghệ & Bán dẫn', url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80' },
  { label: 'Đại học & Campus', url: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80' },
  { label: 'Âm nhạc & Lễ hội', url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80' },
  { label: 'Thể thao & Bóng đá', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80' },
];

export const AdminCMSModal: React.FC<AdminCMSModalProps> = ({
  isOpen,
  onClose,
  posts,
  onAddPost,
  onDeletePost,
  onSummarizeText,
  currentUser,
  onOpenAuth,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'list'>('create');

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryType>('Tin Phenikaa');
  const [author, setAuthor] = useState('Ban Biên Tập Phenikaa');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState(PRESET_COVERS[0].url);
  const [tagsInput, setTagsInput] = useState('Phenikaa, Sinh Viên, Tin Mới');
  const [publishMode, setPublishMode] = useState<'now' | 'schedule'>('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('');

  // AI Assistant in CMS
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAutoSummarizeExcerpt = async () => {
    if (!content.trim() || content.trim().length < 50) {
      alert('Vui lòng nhập nội dung bài viết ít nhất 50 ký tự trước khi dùng AI tạo tóm tắt.');
      return;
    }

    try {
      setIsAiGenerating(true);
      const generated = await onSummarizeText(content);
      if (generated) {
        setExcerpt(generated);
      }
    } catch (err: any) {
      alert('Không thể tạo tóm tắt: ' + (err.message || 'Lỗi kết nối'));
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert('Vui lòng điền đầy đủ Tiêu đề và Nội dung bài viết.');
      return;
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newPost: BlogPost = {
      id: `post-${Date.now()}`,
      title: title.trim(),
      category,
      author: author.trim() || 'Biên Tập Viên Phenikaa',
      authorRole: 'Ban Truyền thông & Báo chí',
      publishedAt:
        publishMode === 'now'
          ? new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' })
          : scheduledDateTime || new Date().toLocaleString('vi-VN', { dateStyle: 'short', timeStyle: 'short' }),
      readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} phút đọc`,
      excerpt: excerpt.trim() || content.slice(0, 150) + '...',
      coverImage: coverImage.trim() || PRESET_COVERS[0].url,
      content: content.trim(),
      tags: tags.length > 0 ? tags : ['Phenikaa News'],
      viewsCount: 1,
      status: publishMode === 'now' ? 'published' : 'scheduled',
      scheduledFor: publishMode === 'schedule' ? scheduledDateTime : undefined,
      reactions: { like: 0, heart: 0, haha: 0, wow: 0, sad: 0 },
      comments: [],
    };

    onAddPost(newPost);
    setSuccessMessage(`Đã xuất bản thành công bài viết: "${title}"!`);

    // Reset Form
    setTitle('');
    setExcerpt('');
    setContent('');
    setTimeout(() => {
      setSuccessMessage(null);
      setActiveTab('list');
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-800 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#003366] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff6b00] text-white flex items-center justify-center font-bold">
              CMS
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Hệ Thống Quản Trị Nội Dung (Admin CMS)
              </h3>
              <p className="text-xs text-slate-300">
                Báo Tin Tức & Giải Trí Phenikaa • Quản lý & Xuất bản bài viết
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#002244] p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveTab('create')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'create' ? 'bg-[#ff6b00] text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Đăng bài mới
              </button>
              <button
                onClick={() => setActiveTab('list')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === 'list' ? 'bg-[#ff6b00] text-white font-bold' : 'text-slate-300 hover:text-white'
                }`}
              >
                Danh sách bài ({posts.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#004080] transition-colors ml-2"
              aria-label="Đóng CMS"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Auth Banner for Rubric Demo */}
          {!currentUser ? (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  <strong>Chưa đăng nhập:</strong> Bạn đang ở chế độ xem. Vui lòng đăng nhập tài khoản <strong>Admin</strong> hoặc <strong>Editor</strong> để ghi dữ liệu thật vào MongoDB.
                </span>
              </div>
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3 py-1 bg-[#00529C] hover:bg-[#003d75] text-white font-bold rounded-lg shrink-0 transition-colors shadow-2xs"
                >
                  Đăng Nhập Ngay
                </button>
              )}
            </div>
          ) : currentUser.role === 'student' ? (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  <strong>Phân quyền Sinh Viên:</strong> Bạn đang đăng nhập với quyền <code>student</code>. Khi gửi bài viết, server Express sẽ trả về lỗi <code>403 Forbidden</code> (dùng để demo tiêu chí xử lý phân quyền của thầy).
                </span>
              </div>
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="px-3 py-1 bg-[#ff6b00] hover:bg-[#e05e00] text-white font-bold rounded-lg shrink-0 transition-colors shadow-2xs"
                >
                  Đổi Tài Khoản Admin
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Đang đăng nhập với tư cách: <strong>{currentUser.fullName}</strong> ({currentUser.role === 'admin' ? '👑 Quản Trị Viên' : '✍️ Biên Tập Viên'}). Dữ liệu được đồng bộ trực tiếp với MongoDB.
                </span>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-medium flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: FORM SOẠN THẢO BÀI VIẾT */}
          {activeTab === 'create' && (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Tiêu đề & Chuyên mục */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tiêu đề bài viết <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ví dụ: Lễ hội Phenikaa Youth Fest 2026..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#00529C] focus:ring-1 focus:ring-[#00529C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Chuyên mục <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CategoryType)}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#00529C]"
                  >
                    <option value="Tin Phenikaa">Tin Phenikaa</option>
                    <option value="Giải Trí & Đời Sống">Giải Trí & Đời Sống</option>
                    <option value="Thể Thao & Bứt Phá">Thể Thao & Bứt Phá</option>
                    <option value="Công Nghệ & Đổi Mới">Công Nghệ & Đổi Mới</option>
                    <option value="Multimedia">Multimedia</option>
                    <option value="Góc Sinh Viên">Góc Sinh Viên</option>
                  </select>
                </div>
              </div>

              {/* Tác giả & Ảnh bìa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Tác giả / Ban Biên Tập
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="Tên tác giả hoặc CLB"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#00529C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    URL Ảnh bìa đại diện
                  </label>
                  <input
                    type="text"
                    value={coverImage}
                    onChange={(e) => setCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#00529C]"
                  />
                </div>
              </div>

              {/* Chọn ảnh mẫu nhanh */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="text-slate-500">Hoặc chọn ảnh chủ đề nhanh:</span>
                {PRESET_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCoverImage(preset.url)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] transition-colors ${
                      coverImage === preset.url
                        ? 'bg-[#00529C] text-white border-[#00529C]'
                        : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              {/* Tóm tắt ngắn (Excerpt) kèm nút AI Auto-Generate */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Tóm tắt ngắn (Sapo)
                  </label>
                  <button
                    type="button"
                    onClick={handleAutoSummarizeExcerpt}
                    disabled={isAiGenerating}
                    className="text-xs font-semibold text-[#ff6b00] hover:text-[#e05e00] flex items-center gap-1 disabled:opacity-50"
                  >
                    {isAiGenerating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>AI đang tạo tóm tắt...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Tự động tạo tóm tắt bằng Gemini AI</span>
                      </>
                    )}
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Đoạn tóm tắt mở đầu bài viết (Sapo)..."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#00529C]"
                />
              </div>

              {/* Toàn văn bài viết */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nội dung toàn văn bài viết <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Soạn thảo nội dung toàn văn bài viết ở đây..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#00529C] font-sans leading-relaxed"
                />
              </div>

              {/* Tags & Đặt lịch xuất bản */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Gắn thẻ Tags (cách nhau bằng dấu phẩy)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Phenikaa, Sinh Viên, Công Nghệ"
                    className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:border-[#00529C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Chế độ phát hành bài viết
                  </label>
                  <div className="flex items-center gap-3 mt-1">
                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="publishMode"
                        checked={publishMode === 'now'}
                        onChange={() => setPublishMode('now')}
                        className="accent-[#00529C]"
                      />
                      <span>Xuất bản ngay</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
                      <input
                        type="radio"
                        name="publishMode"
                        checked={publishMode === 'schedule'}
                        onChange={() => setPublishMode('schedule')}
                        className="accent-[#00529C]"
                      />
                      <span>Đặt lịch xuất bản</span>
                    </label>
                  </div>

                  {publishMode === 'schedule' && (
                    <input
                      type="datetime-local"
                      value={scheduledDateTime}
                      onChange={(e) => setScheduledDateTime(e.target.value)}
                      className="mt-2 w-full px-3 py-1 text-xs rounded-lg border border-slate-300 bg-white"
                    />
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Hủy bỏ
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#ff6b00] hover:bg-[#e05e00] text-white shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {publishMode === 'now' ? 'Xuất Bản Bài Viết' : 'Lưu & Đặt Lịch Xuất Bản'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: QUẢN LÝ DANH SÁCH BÀI VIẾT */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 pb-2 border-b">
                <span>Tổng số bài viết trong hệ thống: {posts.length}</span>
                <span className="text-[#00529C] font-semibold">Tất cả trạng thái</span>
              </div>

              <div className="divide-y divide-slate-100 space-y-3">
                {posts.map((post) => (
                  <div
                    key={post.id}
                    className="pt-3 first:pt-0 flex items-center justify-between gap-4 group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-16 h-12 rounded-lg object-cover shrink-0 bg-slate-100 border border-slate-200"
                      />
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-800 truncate">
                          {post.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                          <span className="text-[#00529C] font-medium">{post.category}</span>
                          <span>•</span>
                          <span>{post.publishedAt}</span>
                          <span>•</span>
                          <span>{post.author}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          if (confirm(`Bạn có chắc muốn xóa bài viết "${post.title}"?`)) {
                            onDeletePost(post.id);
                          }
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Xóa bài viết"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
