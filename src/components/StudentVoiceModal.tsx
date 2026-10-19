import React, { useState } from 'react';
import { X, Send, PenTool, CheckCircle2, User, School, Sparkles } from 'lucide-react';

interface StudentVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitIdea: (data: {
    studentName: string;
    studentId: string;
    faculty: string;
    topic: string;
    content: string;
  }) => void;
}

export const StudentVoiceModal: React.FC<StudentVoiceModalProps> = ({
  isOpen,
  onClose,
  onSubmitIdea,
}) => {
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [faculty, setFaculty] = useState('Khoa Công Nghệ Thông Tin');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !topic.trim() || !content.trim()) {
      alert('Vui lòng điền đầy đủ thông tin trước khi gửi.');
      return;
    }

    onSubmitIdea({
      studentName: studentName.trim(),
      studentId: studentId.trim(),
      faculty,
      topic: topic.trim(),
      content: content.trim(),
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-auto text-slate-800 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-[#00529C] text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ff6b00] text-white flex items-center justify-center font-bold">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Góc Sinh Viên & Hiến Kế Phát Triển
              </h3>
              <p className="text-xs text-slate-200">
                Gửi bài viết, cảm nghĩ, sáng kiến đổi mới tới Ban Biên Tập Báo Phenikaa
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-[#004080] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-serif font-bold text-xl text-slate-900">
                Gửi bài viết / Hiến kế thành công!
              </h4>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Cảm ơn bạn đã đóng góp tiếng nói xây dựng cho cộng đồng sinh viên Phenikaa. Ban Biên Tập sẽ liên hệ phản hồi sớm nhất.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Họ và tên sinh viên <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#00529C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mã số sinh viên (MSSV)
                  </label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="Ví dụ: 24100476"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#00529C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Khoa / Viện trực thuộc
                </label>
                <select
                  value={faculty}
                  onChange={(e) => setFaculty(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-[#00529C]"
                >
                  <option value="Khoa Công Nghệ Thông Tin">Khoa Công Nghệ Thông Tin</option>
                  <option value="Khoa Khoa Học Dữ Liệu">Khoa Khoa Học Dữ Liệu</option>
                  <option value="Khoa Kỹ Thuật Ô Tô & Năng Lượng">Khoa Kỹ Thuật Ô Tô & Năng Lượng</option>
                  <option value="Khoa Kinh Tế & Kinh Doanh">Khoa Kinh Tế & Kinh Doanh</option>
                  <option value="Viện Công Nghệ Sinh Học & Môi Trường">Viện Công Nghệ Sinh Học & Môi Trường</option>
                  <option value="Khoa Ngôn Ngữ & Khoa Học Xã Hội">Khoa Ngôn Ngữ & Khoa Học Xã Hội</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Chủ đề bài viết / Tên sáng kiến hiến kế <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ví dụ: Đề xuất mở thêm phòng tự học 24/7 tại nhà A9..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#00529C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nội dung chi tiết <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Trình bày bài viết, cảm nghĩ hoặc giải pháp hiến kế của bạn..."
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 focus:outline-none focus:border-[#00529C] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-6 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[#ff6b00] hover:bg-[#e05e00] text-white shadow-sm transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Gửi Cho Tòa Soạn</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
