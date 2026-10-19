import { BlogPost } from '../types/blog.ts';

export const INITIAL_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'Làn sóng AI tại Việt Nam: Cơ hội và thách thức cho thế hệ kỹ sư mới',
    category: 'Công nghệ',
    author: 'Nguyễn Văn Minh - Tech Journalist',
    publishedAt: '19/10/2026',
    readTime: '6 phút đọc',
    excerpt: 'Việt Nam đang trở thành một trong những điểm nóng về ứng dụng trí tuệ nhân tạo tại Đông Nam Á với sự đầu tư mạnh mẽ từ các tập đoàn và hệ sinh thái khởi nghiệp.',
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    tags: ['Trí tuệ nhân tạo', 'Gemini API', 'Node.js', 'Kỹ sư Việt'],
    content: `Trong giai đoạn 2024 - 2026, Việt Nam đã chứng kiến bước chuyển mình ngoạn mục trong việc tiếp cận và phát triển công nghệ trí tuệ nhân tạo (AI). Từ một thị trường chủ yếu gia công phần mềm truyền thống, các doanh nghiệp công nghệ trong nước như FPT, Viettel, Vingroup và hàng loạt startup công nghệ tài chính (Fintech), thương mại điện tử đã chủ động tích hợp các mô hình ngôn ngữ lớn (LLMs) vào hoạt động kinh doanh cốt lõi.

Theo báo cáo của Hiệp hội Trí tuệ Nhân tạo Việt Nam, hơn 68% doanh nghiệp công nghệ vừa và lớn đã triển khai ít nhất một tính năng hỗ trợ bằng AI trong quy trình quản trị hoặc chăm sóc khách hàng. Đặc biệt, việc Google công bố các dòng mô hình Gemini thế hệ mới với khả năng hiểu sâu sắc ngữ cảnh tiếng Việt đã mở ra cánh cửa cho các nhà phát triển xây dựng các hệ sinh thái báo chí thông minh, tóm tắt dữ liệu thời gian thực và phân tích hành vi độc giả.

Tuy nhiên, thách thức lớn nhất đối với cộng đồng kỹ sư phần mềm Việt Nam hiện nay nằm ở chất lượng hạ tầng dữ liệu và bài toán tối ưu chi phí vận hành API. Việc xử lý ngôn ngữ tiếng Việt đòi hỏi các kỹ sư phải hiểu rõ cấu trúc câu, thanh điệu ngữ âm và cách thiết kế System Prompt nghiêm ngặt để mô hình không bị "ảo giác" (hallucination) hoặc trả về văn phong dịch thuật gượng gạo. Hơn nữa, vấn đề bảo mật thông tin và quyền riêng tư theo Nghị định bảo vệ dữ liệu cá nhân (PDPD) cũng đặt ra yêu cầu các hệ thống backend Node.js phải tuân thủ nghiêm ngặt chuẩn mực bảo mật, không để lộ API Key trên phía client.

Nhìn chung, làn sóng AI không chỉ là trào lưu nhất thời mà đã định hình lại tiêu chuẩn của một sản phẩm số tại Việt Nam. Những lập trình viên làm chủ được việc kết hợp giữa backend Express.js vững chắc và các API AI hiện đại sẽ nắm giữ chìa khóa dẫn dắt kỷ nguyên số tiếp theo.`,
  },
  {
    id: 'post-2',
    title: 'Quy hoạch điện VIII và bước ngoặt chuyển dịch năng lượng tái tạo tại Việt Nam',
    category: 'Kinh tế',
    author: 'Trần Thị Thu Hà - Chuyên gia Năng lượng',
    publishedAt: '18/10/2026',
    readTime: '5 phút đọc',
    excerpt: 'Mục tiêu đạt phát thải ròng bằng 0 (Net Zero) vào năm 2050 đang thúc đẩy các dự án điện gió ngoài khơi và năng lượng mặt trời mái nhà phát triển với tốc độ kỷ lục.',
    coverImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=800&q=80',
    tags: ['Năng lượng sạch', 'Quy hoạch điện VIII', 'Net Zero', 'Kinh tế số'],
    content: `Quy hoạch phát triển điện lực quốc gia thời kỳ 2021 - 2030, tầm nhìn đến năm 2050 (Quy hoạch điện VIII) đang đi vào giai đoạn then chốt với hàng loạt chính sách khuyến khích năng lượng tái tạo được cụ thể hóa. Với cam kết mạnh mẽ tại Hội nghị COP26 về việc đưa phát thải ròng về 0 vào giữa thế kỷ, Việt Nam xác định điện mặt trời và điện gió là hai trụ cột chính để đảm bảo an ninh năng lượng quốc gia.

Dọc bờ biển miền Trung và Nam Trung Bộ, hàng loạt dự án điện gió ngoài khơi với tổng công suất dự kiến đạt 6.000 MW vào năm 2030 đang thu hút sự quan tâm của các tập đoàn đa quốc gia từ Đan Mạch, Nhật Bản và Đức. Ưu thế về chiều dài bờ biển hơn 3.260 km cùng vận tốc gió ổn định từ 7-9 m/s biến Việt Nam thành điểm đến lý tưởng cho ngành công nghiệp điện gió ngoài khơi.

Song song đó, cơ chế mua bán điện trực tiếp (DPPA) vừa được ban hành đã tạo đột phá cho các doanh nghiệp FDI công nghệ cao như Samsung, Intel và Foxconn tự chủ nguồn năng lượng tái tạo phục vụ sản xuất. Tuy nhiên, thách thức kỹ thuật lớn nhất vẫn là bài toán giải tỏa công suất lưới điện truyền tải 500kV Bắc - Nam và đầu tư hệ thống pin lưu trữ năng lượng (BESS) quy mô lớn để khắc phục tính bất định của thời tiết.

Giới chuyên gia nhận định, để đạt được mục tiêu kép vừa tăng trưởng kinh tế vừa giảm phát thải, Việt Nam cần sớm hoàn thiện khung pháp lý về giá điện hai thành phần và tăng cường hợp tác công - tư (PPP) trong phát triển hạ tầng truyền tải thông minh.`,
  },
  {
    id: 'post-3',
    title: 'Sài Gòn và văn hóa cà phê không ngủ: Nhịp sống số của thế hệ Gen Z',
    category: 'Đời sống',
    author: 'Lê Hoàng Nam - Urban Life',
    publishedAt: '17/10/2026',
    readTime: '4 phút đọc',
    excerpt: 'Từ những quán cà phê cóc ven đường đến các không gian co-working mở 24/7, văn hóa cà phê Sài Gòn đang chứng kiến sự giao thoa ấn tượng giữa nét truyền thống và lối sống du mục kỹ thuật số.',
    coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=800&q=80',
    tags: ['Sài Gòn', 'Văn hóa sống', 'Gen Z', 'Digital Nomad'],
    content: `Tại Thành phố Hồ Chí Minh, cà phê từ lâu không chỉ đơn thuần là một món đồ uống buổi sớm mà đã trở thành phong cách sống và nhịp thở của cả một đô thị năng động. Những ly cà phê sữa đá pha phin đậm đà hương vị truyền thống trên hè phố Nguyễn Du hay Nhà thờ Đức Bà vẫn tồn tại nguyên vẹn, song song cùng sự xuất hiện của những chuỗi không gian cà phê mở cửa xuyên đêm 24/7.

Đối với thế hệ Gen Z và những người làm việc tự do (digital nomads), quán cà phê nay đóng vai trò như một văn phòng làm việc mở, nơi hội tụ của sự sáng tạo và kết nối xã hội. Chỉ với một chiếc laptop, tai nghe chống ồn và ly cà phê cold brew thơm mát, các kỹ sư phần mềm, nhà thiết kế đồ họa hay người sáng tạo nội dung có thể làm việc và thảo luận dự án suốt nhiều giờ liền.

Đáng chú ý, văn hóa này được thúc đẩy mạnh mẽ bởi làn sóng số hóa toàn diện: 100% các quán cà phê đều trang bị mã QR thanh toán qua ứng dụng ngân hàng hoặc ví điện tử, hệ thống Wi-Fi băng thông cao tốc độ Gigabit và các tiện ích đặt món trước qua ứng dụng. Nhịp sống cà phê Sài Gòn vì thế vừa giữ được cái hồn phóng khoáng, hào sảng vốn có, vừa không ngừng đổi mới để bắt nhịp cùng xu thế chuyển đổi số hiện đại của thế giới.`,
  },
  {
    id: 'post-4',
    title: 'Engineering High-Performance AI Microservices with Node.js and Express',
    category: 'Global Tech',
    author: 'Alex Henderson - Principal Backend Architect',
    publishedAt: '16/10/2026',
    readTime: '5 min read',
    excerpt: 'A comprehensive engineering guide on building scalable, resilient Express.js API gateways that orchestrate large language models like Google Gemini in production.',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    tags: ['Architecture', 'Node.js', 'Express', 'Microservices'],
    content: `Integrating modern generative AI capabilities into digital publishing platforms requires backend engineers to rethink traditional request-response architectures. While invoking an LLM endpoint looks as simple as an HTTP POST request, real-world high-throughput platforms must navigate rate limiting, variable inference latencies, context window optimization, and prompt injection defense.

When designing the API gateway with Node.js and Express, three architectural pillars must be addressed:
First, strict input validation and payload bounds. Accepting arbitrary text payloads without length constraints exposes the service to memory exhaustion attacks and unnecessary API token costs. Enforcing character length thresholds and sanitizing inputs before invoking the model ensures operational reliability.

Second, structured output enforcement using schemas. Early LLM implementations relied on regex parsing of unpredictable markdown responses. With modern SDKs like @google/genai, developers can define strict response schemas with exact typed properties (such as headlines, arrays of bullet points, and key takeaways), eliminating parsing exceptions and hallucinated formatting.

Third, resilient error handling and defensive telemetry. Network timeouts and quota limits are inevitable when scaling AI features. Implementing intelligent retry strategies, circuit breakers, and descriptive HTTP status codes (such as 400 for malformed input and 429 for rate limits) guarantees a seamless experience for frontend client consumers.`,
  },
];
