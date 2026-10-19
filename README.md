# Báo Tin Tức & Giải Trí Phenikaa - Phenikaa News & Entertainment
> **Cổng thông tin báo điện tử và giải trí Đại học Phenikaa kết hợp trí tuệ nhân tạo Google Gemini AI tóm tắt tin tức tự động.**

[![Node.js Version](https://img.shields.io/badge/Node.js-18%2B%20%7C%2020%2B-green.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-lightgrey.svg)](https://expressjs.com/)
[![Google Gen AI](https://img.shields.io/badge/%40google%2Fgenai-Gemini%203.8%20Flash-orange.svg)](https://aistudio.google.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-cyan.svg)](https://tailwindcss.com/)

**Phenikaa News & Entertainment** là nền tảng báo điện tử và tin tức hiện đại dành cho sinh viên, giảng viên và bạn đọc quan tâm đến Đại học Phenikaa. Ứng dụng tích hợp mô hình **Google Gemini 3.8 Flash** thông qua SDK chính thức thế hệ mới `@google/genai`, mang lại khả năng tóm tắt tin tức tự động với cấu trúc JSON chuẩn mực, đo lường thời gian đọc tiết kiệm được và quản lý nội dung tòa soạn toàn diện.

---

## 📑 Mục lục

1. [Tính năng nổi bật](#-tính-năng-nổi-bật)
2. [Kiến trúc hệ thống & Công nghệ](#-kiến-trúc-hệ-thống--công-nghệ)
3. [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
4. [Hướng dẫn cài đặt & Khởi chạy nhanh](#-hướng-dẫn-cài-đặt--khởi-chạy-nhanh)
5. [Cấu hình biến môi trường (.env)](#-cấu-hình-biến-môi-trường-env)
6. [Tài liệu API Backend](#-tài-liệu-api-backend)
7. [Các lệnh NPM khả dụng](#-các-lệnh-npm-khả-dụng)
8. [Cấu trúc thư mục dự án](#-cấu-trúc-thư-mục-dự-án)
9. [Xử lý sự cố thường gặp (Troubleshooting)](#-xử-lý-sự-cố-thường-gặp-troubleshooting)

---

## ✨ Tính năng nổi bật

### 1. 📰 Giao diện Báo Điện Tử Hiện Đại & Đa Dạng Chuyên Mục
- **TopBar & Header Báo chí**: Cập nhật ngày tháng, thời tiết Hà Nội, tỷ giá ngoại tệ và khẩu hiệu *"Tri thức - Sáng tạo - Trách nhiệm"*.
- **Hệ thống chuyên mục phong phú**:
  - `Tin Phenikaa`: Các sự kiện, thông báo học thuật và hoạt động nổi bật của nhà trường.
  - `Giải Trí & Đời Sống`: Xu hướng giới trẻ, nghệ thuật, âm nhạc và văn hóa học đường.
  - `Thể Thao & Bứt Phá`: Giải bóng đá sinh viên, các câu lạc bộ thể thao năng động.
  - `Công Nghệ & Đổi Mới`: Dự án nghiên cứu, xe tự hành, bán dẫn, AI và robot tại Phenikaa.
  - `Multimedia`: Podcast phát thanh, video phóng sự và phóng sự ảnh chất lượng cao.
  - `Góc Sinh Viên`: Nơi chia sẻ kinh nghiệm học tập, thực tập và đời sống ký túc xá.
- **Tiêu điểm nóng (Featured News)**: Khối bài viết tâm điểm trang nhất và 4 bài tiêu điểm phụ bắt mắt.
- **Dòng sự kiện 24/7 (Sidebar 24/7)**: Cập nhật tin tức liên tục từng giờ và danh sách tin đọc nhiều nhất.

### 2. ⚡ Tóm tắt Bài viết Tức thì với Gemini 3.8 Flash (1-Click Summarize)
- Nhấn nút **"Tóm tắt AI"** trên bất kỳ bài viết nào để nhận ngay bản tóm tắt tinh gọn:
  - **Tiêu đề cốt lõi (Headline)**: Tóm tắt thông điệp quan trọng nhất trong 1 câu duy nhất.
  - **Điểm tin chính (Bullet Points)**: 3-5 ý gạch đầu dòng cô đọng số liệu và luận điểm.
  - **Kết luận điều hành (Key Takeaway)**: Góc nhìn tổng kết và hành động gợi ý.

### 3. ✍️ AI Sandbox - Studio Tùy Chỉnh Tóm Tắt (Custom Summarizer)
- Cho phép dán bất kỳ văn bản, bài báo bên ngoài hoặc tài liệu học tập để tóm tắt theo nhu cầu:
  - **Số lượng gạch đầu dòng**: Tùy chỉnh linh hoạt từ 1 đến 7 ý.
  - **Phong cách / Giọng văn (Tone)**: *Lôi cuốn (Engaging)*, *Trang trọng (Formal)*, *Tóm lược nhanh (Quick-take)*, hoặc *Kỹ thuật (Technical)*.
  - **Tùy chọn ngôn ngữ**: Tự động nhận diện (Auto), Ép buộc Tiếng Việt, hoặc Tiếng Anh.

### 4. 📊 Chỉ Số Đo Lường Thông Minh (Smart Telemetry)
- Tự động thống kê trực quan:
  - Đếm số từ trước và sau khi tóm tắt.
  - **Tỷ lệ nén nội dung (%)**.
  - **Thời gian đọc tiết kiệm được (phút)**.
  - **Thời gian phản hồi API (Latency ms)**.

### 5. 📝 Tòa Soạn & Quản Trị Nội Dung (Admin CMS)
- Hỗ trợ biên tập viên đăng tải bài viết mới trực tiếp trên giao diện:
  - Quản lý trạng thái bài: **Đã xuất bản (Published)**, **Hẹn giờ đăng (Scheduled)**, **Bản nháp (Draft)**.
  - Lọc theo danh mục và tìm kiếm nhanh.
  - Phân quyền tác giả, chức danh, ảnh bìa và thẻ tags.

### 6. 🗣️ Diễn Đàn Góc Sinh Viên (Student Voice)
- Cho phép sinh viên gửi bài viết, cảm nghĩ, tâm sự học đường hoặc phản ánh tới ban biên tập.
- Đính kèm thông tin tác giả, ngành học/khóa và chuyên mục phù hợp.

### 7. ❤️ Tương Tác Độc Giả Thời Gian Thực
- **Thả cảm xúc tương tác**: Like, Heart, Haha, Wow, Sad trực tiếp trên từng bài viết.
- **Hệ thống bình luận**: Bạn đọc có thể thảo luận và bày tỏ quan điểm tức thì.

### 8. 🛡️ Cơ Chế Caching & Local Fallback Thông Minh
- **Lưu cache tự động**: Tránh gọi trùng lặp Gemini API với các bài đã được tóm tắt.
- **Intelligent Local Fallback**: Khi API key vượt quá hạn mức miễn phí (Rate limit/Quota 429) hoặc mất mạng, hệ thống tự động kích hoạt thuật toán tóm tắt cục bộ thông minh, giữ cho trải nghiệm người dùng luôn mượt mà.

### 9. 💻 Tab Hướng Dẫn Tích Hợp Code (Code Guide View)
- Tích hợp tài liệu hướng dẫn kỹ thuật chi tiết:
  - Cài đặt SDK `@google/genai`
  - Code mẫu Express Server với JSON schema validation
  - Code mẫu Client gọi API fetch
  - Lệnh cURL kiểm thử trực tiếp.

---

## 🏗 Kiến trúc hệ thống & Công nghệ

Dự án sử dụng mô hình **Full-stack Unified Architecture**: Cổng `port 3000` phục vụ đồng thời cả Express Backend API và React 19 Frontend (thông qua Vite middleware trong môi trường dev).

```
┌────────────────────────────────────────────────────────┐
│                   Trình duyệt Client                   │
│          (React 19 + Tailwind CSS + Lucide Icons)      │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP Requests
                            ▼
┌────────────────────────────────────────────────────────┐
│               Express.js Server (Port 3000)             │
│                                                        │
│  ├─ GET  /api/health      --> Kiểm tra trạng thái API  │
│  ├─ POST /api/ai/summarize --> Xử lý prompt & schema   │
│  └─ Vite Middleware       --> Phục vụ Frontend SPA     │
└───────────────────────────┬────────────────────────────┘
                            │ @google/genai SDK
                            ▼
┌────────────────────────────────────────────────────────┐
│               Google Gemini API Cloud                  │
│               Mô hình: gemini-3.8-flash                │
└────────────────────────────────────────────────────────┘
```

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Motion, Lucide React.
- **Backend**: Node.js, Express 4.21, `@google/genai` (Official SDK), `dotenv`, `tsx`.
- **Kiểm thử**: Node.js Native Test Runner (`node:test`).

---

## 📋 Yêu cầu hệ thống

- **Node.js**: Phiên bản `18.0.0` trở lên (Khuyến nghị **Node.js 20.x LTS** hoặc mới hơn).
- **npm**: Phiên bản `9.x` hoặc `10.x`.
- **Khóa API Google Gemini**: Đăng ký miễn phí tại [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 🚀 Hướng dẫn cài đặt & Khởi chạy nhanh

### Bước 1: Mở thư mục dự án

Mở terminal tại thư mục gốc:
```bash
cd c:\Users\Admin\Downloads\web-nang-cao-blogg-ai
```

### Bước 2: Cài đặt các thư viện phụ thuộc

```bash
npm install
```

> **Lưu ý:** Dự án đã được cấu hình `esbuild@^0.28.0` đồng bộ hoàn toàn với Vite 8. Nếu bạn dùng npm phiên bản cũ hơn và gặp thông báo peer dependencies, có thể sử dụng:
> ```bash
> npm install --legacy-peer-deps
> ```

### Bước 3: Thiết lập biến môi trường (.env)

Tạo file `.env` tại thư mục gốc của dự án (hoặc copy từ `.env.example`):

**Trên Windows (PowerShell):**
```powershell
Copy-Item .env.example .env
```

**Trên Linux / macOS:**
```bash
cp .env.example .env
```

Mở file `.env` và điền khóa API của bạn:
```env
PORT=3000
GEMINI_API_KEY="AIzaSyYourSecretGeminiApiKeyHere"
```

### Bước 4: Khởi chạy dự án

Khởi động đồng thời cả Backend và Frontend:
```bash
npm run dev
```

Sau khi màn hình terminal hiển thị:
```
[VietNews Server] Running on http://0.0.0.0:3000
[VietNews Server] Gemini API Status: Configured
```

Mở trình duyệt và truy cập: **`http://localhost:3000`**

---

## 🔑 Cấu hình biến môi trường (.env)

| Tên biến | Bắt buộc | Mặc định | Mô tả |
| :--- | :---: | :---: | :--- |
| `GEMINI_API_KEY` | **Có** | - | Khóa API lấy từ [Google AI Studio](https://aistudio.google.com/app/apikey) để gọi mô hình Gemini. |
| `GOOGLE_API_KEY` | Tùy chọn | - | Biến tương đương dự phòng cho `GEMINI_API_KEY` (Server hỗ trợ cả hai). |
| `PORT` | Tùy chọn | `3000` | Cổng mạng cho Express Server. |
| `NODE_ENV` | Tùy chọn | `development` | Môi trường thực thi (`development` hoặc `production`). |

---

## 📡 Tài liệu API Backend

### 1. Kiểm tra trạng thái hệ thống
- **Endpoint**: `GET /api/health`
- **Mô tả**: Kiểm tra tình trạng kết nối server và Gemini API key.
- **Ví dụ cURL**:
  ```bash
  curl http://localhost:3000/api/health
  ```
- **Phản hồi mẫu**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-10-19T08:20:00.000Z",
    "hasApiKey": true,
    "model": "gemini-3.8-flash",
    "version": "1.0.0",
    "capabilities": [
      "summarization",
      "vietnamese-nlp",
      "structured-json"
    ]
  }
  ```

---

### 2. Tóm tắt nội dung bài viết với Gemini
- **Endpoint**: `POST /api/ai/summarize`
- **Headers**: `Content-Type: application/json`
- **Cấu trúc dữ liệu gửi lên (Request Body)**:
  ```json
  {
    "content": "Nội dung bài viết cần tóm tắt (tối thiểu 50 ký tự, tối đa 100.000 ký tự)...",
    "title": "Tiêu đề bài viết (tùy chọn)",
    "bulletsCount": 3,
    "tone": "engaging",
    "language": "auto"
  }
  ```

#### Chi tiết các tham số:
| Trường | Kiểu dữ liệu | Bắt buộc | Giá trị hợp lệ | Ghi chú |
| :--- | :---: | :---: | :--- | :--- |
| `content` | `string` | **Có** | Từ 50 đến 100.000 ký tự | Nội dung bài viết cần tóm tắt |
| `title` | `string` | Không | Chuỗi văn bản | Giúp AI định hình ngữ cảnh bài viết |
| `bulletsCount` | `number` | Không | `1` đến `7` (Mặc định: `3`) | Số lượng ý chính gạch đầu dòng |
| `tone` | `string` | Không | `engaging`, `formal`, `quick-take`, `technical` | Phong cách diễn đạt bản tóm tắt |
| `language` | `string` | Không | `auto`, `vi`, `en` (Mặc định: `auto`) | Ngôn ngữ ưu tiên |

- **Ví dụ gọi qua cURL**:
  ```bash
  curl -X POST http://localhost:3000/api/ai/summarize \
    -H "Content-Type: application/json" \
    -d '{
      "title": "Sinh viên Phenikaa phát triển xe tự hành thông minh",
      "content": "Nhóm nghiên cứu sinh viên Khoa Công nghệ Thông tin Đại học Phenikaa đã ra mắt nguyên mẫu xe tự hành ứng dụng cảm biến LiDAR và thị giác máy tính. Dự án đạt giải Nhất tại Hội nghị Nghiên cứu Khoa học Sinh viên cấp Trường và mở ra triển vọng ứng dụng thực tế trong khuôn viên đại học thông minh.",
      "bulletsCount": 3,
      "tone": "engaging",
      "language": "vi"
    }'
  ```

- **Phản hồi thành công (Status 200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "headline": "Sinh viên Phenikaa chế tạo thành công xe tự hành thông minh ứng dụng LiDAR",
      "bulletPoints": [
        "Ứng dụng công nghệ LiDAR kết hợp thị giác máy tính hiện đại.",
        "Đạt giải Nhất tại Hội nghị Nghiên cứu Khoa học Sinh viên cấp Trường.",
        "Tiềm năng ứng dụng đưa đón và vận chuyển nội khu đại học thông minh."
      ],
      "keyTakeaway": "Khẳng định năng lực đổi mới sáng tạo và tinh thần thực chiến của sinh viên Phenikaa.",
      "detectedLanguage": "Vietnamese",
      "sentiment": "positive",
      "metrics": {
        "originalWordCount": 54,
        "summaryWordCount": 58,
        "compressionRatio": 15.2,
        "estimatedReadTimeSavedMin": 1,
        "latencyMs": 850,
        "model": "gemini-3.8-flash"
      }
    }
  }
  ```

---

## 🛠 Các lệnh NPM khả dụng

| Lệnh | Chức năng |
| :--- | :--- |
| `npm run dev` | Khởi động server phát triển tích hợp (Express + Vite) tại `http://localhost:3000`. |
| `npm run build` | Biên dịch tối ưu hóa giao diện React cho môi trường production vào thư mục `dist/`. |
| `npm run start` | Khởi chạy server production (sau khi đã chạy `npm run build`). |
| `npm run test` | Chạy 9 bộ kiểm thử đơn vị tự động kiểm tra logic tóm tắt và prompt với `node:test`. |
| `npm run lint` | Chạy trình kiểm tra cú pháp và kiểu dữ liệu TypeScript (`tsc --noEmit`). |
| `npm run clean` | Dọn dẹp thư mục build tạm thời (`dist`, `server.js`). |

---

## 📁 Cấu trúc thư mục dự án

```
web-nang-cao-blogg-ai/
├── .env                  # Tệp cấu hình biến môi trường (API Key, Port) - Không commit
├── .env.example          # Tệp mẫu hướng dẫn cấu hình biến môi trường
├── index.html            # File HTML gốc của ứng dụng React
├── metadata.json         # Siêu dữ liệu mô tả tính năng của applet
├── package.json          # Danh sách dependencies và npm scripts
├── server.ts             # Express Server chính: Quản lý API Gemini & Vite middleware
├── tsconfig.json         # Cấu hình TypeScript
├── vite.config.ts        # Cấu hình Vite & plugin Tailwind CSS
│
└── src/
    ├── main.tsx          # Điểm khởi chạy của ứng dụng React
    ├── App.tsx           # Component chính: Điều phối Navbar, Header, Sidebar, CMS, Modals
    ├── index.css         # Thiết lập CSS và typography
    │
    ├── components/       # Các thành phần giao diện người dùng
    │   ├── TopBar.tsx             # Thanh trạng thái đỉnh trang (Thời tiết, tỷ giá, ngày giờ)
    │   ├── Header.tsx             # Banner thương hiệu Báo Phenikaa News & Entertainment
    │   ├── Navbar.tsx             # Thanh menu điều hướng chuyên mục & thanh tìm kiếm
    │   ├── FeaturedHotNews.tsx    # Khối bài viết tiêu điểm nóng trang nhất
    │   ├── Sidebar247.tsx         # Dòng sự kiện 24/7 theo giờ và widget Multimedia
    │   ├── EntertainmentSection.tsx # Chuyên mục Giải trí & Đời sống dạng thẻ tạp chí
    │   ├── NewsTechList.tsx       # Danh sách bài báo Công nghệ & Đổi mới
    │   ├── AdminCMSModal.tsx      # Modal quản trị tòa soạn: Tạo, hẹn giờ, sửa, xóa bài viết
    │   ├── StudentVoiceModal.tsx  # Modal diễn đàn Góc Sinh Viên Phenikaa
    │   ├── FullArticleModal.tsx   # Modal đọc toàn văn bài báo, tương tác thả cảm xúc & bình luận
    │   ├── CustomSummarizer.tsx   # AI Sandbox: Dán văn bản tùy chỉnh tóm tắt
    │   ├── SummaryResultModal.tsx # Hộp thoại hiển thị kết quả tóm tắt & telemetry
    │   ├── CodeGuideView.tsx      # Giao diện tài liệu API & code mẫu tích hợp
    │   └── Footer.tsx             # Chân trang thông tin bản quyền và liên hệ tòa soạn
    │
    ├── data/
    │   └── mockPosts.ts           # Dữ liệu bài viết mẫu phong phú (Tin Phenikaa, Giải trí, Công nghệ...)
    │
    ├── types/
    │   └── blog.ts                # TypeScript Interfaces (BlogPost, CommentItem, SummaryData, ...)
    │
    └── utils/
        ├── summarizeLogic.ts      # Hàm xác thực dữ liệu, prompt engineering và fallback cục bộ
        └── summarizeLogic.test.ts # 9 bài unit test tự động với node:test
```

---

## ❓ Xử lý sự cố thường gặp (Troubleshooting)

### 1. Lỗi xung đột cài đặt gói (`npm error ERESOLVE could not resolve`)
- **Nguyên nhân**: npm giải quyết xung đột peer dependency của `esbuild` và `vite`.
- **Cách khắc phục**:
  Chạy lệnh cài đặt với cờ `--legacy-peer-deps`:
  ```bash
  npm install --legacy-peer-deps
  ```
  *(Dự án hiện đã cập nhật `esbuild@^0.28.0` trong `package.json` tương thích hoàn toàn với Vite 8).*

### 2. Lỗi `'tsx' is not recognized as an internal or external command`
- **Nguyên nhân**: Thư viện `tsx` chạy TypeScript chưa được tải về `node_modules`.
- **Cách khắc phục**:
  Chạy lại lệnh:
  ```bash
  npm install
  ```

### 3. Thông báo `GEMINI_API_KEY chưa được cấu hình trên máy chủ`
- **Nguyên nhân**: Server không tìm thấy khóa `GEMINI_API_KEY` trong file `.env`.
- **Cách khắc phục**:
  1. Kiểm tra file `.env` đã nằm ở thư mục gốc của dự án.
  2. Điền khóa API hợp lệ:
     ```env
     GEMINI_API_KEY="khóa-api-của-bạn"
     ```
  3. Khởi động lại server bằng `npm run dev`.

### 4. Giới hạn tần suất gọi API (Rate Limit / Quota Exceeded 429)
- **Cơ chế dự phòng**: Server được tích hợp sẵn bộ tóm tắt thông minh cục bộ **Intelligent Local Fallback** (`generateLocalSummary`). Khi gặp giới hạn quota từ Google AI Studio, server sẽ tự động chuyển sang fallback giúp ứng dụng luôn hoạt động trơn tru mà không báo lỗi sập hệ thống.

---

## 📄 Bản quyền & Tác giả

- Dự án: **Phenikaa News & Entertainment**
- Đơn vị phát triển: **Nguyễn Đăng Khoa 24100476**
-Bài tập lớn cho môn web nâng cao
