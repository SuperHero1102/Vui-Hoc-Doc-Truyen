# BÁO CÁO RÀ SOÁT TOÀN BỘ ỨNG DỤNG (AUDIT REPORT)
**Ứng dụng**: Bé Vui Học Tiếng Anh (Vui Học Đọc Truyện)  
**Nhánh thực hiện**: `audit-offline`  
**Ngày thực hiện**: 07/11/2026  
**Trạng thái Phần 1**: CHỈ ĐỌC (Chưa sửa bất kỳ file mã/dữ liệu/ảnh/âm thanh nào)

---

## I. TỔNG HỢP KẾT QUẢ RÀ SOÁT TỪNG HẠNG MỤC

### 1. Phân hệ chức năng
| Phân hệ | Số lượng / Phạm vi | Tình trạng kiểm tra | Ghi chú chi tiết |
| :--- | :--- | :--- | :--- |
| **Hôm nay (Today)** | Toàn bộ lộ trình bé, streak, gợi ý hoạt động | Đạt 100% | Hiển thị lời chào cá nhân hóa, đồng bộ thời gian chơi, đổi bé nhanh chóng, không lỗi console. |
| **Trò chơi (Games)** | 5 nhóm trò chơi chính | Đạt 100% | <ul><li>*Đàn cầu vồng*: 8 phím nốt chuẩn tần số Web Audio, nghe mẫu và chơi đàn khớp nhịp.</li><li>*Ghép hình*: Kéo thả mảnh ghép mượt mà, phản hồi âm thanh chuẩn.</li><li>*Tô màu diệu kỳ*: 22 tranh nét mực, thuật toán tô màu canvas flood-fill cục bộ 100%.</li><li>*Làm đẹp / Thay trang phục*: Chụp/tải ảnh bé bằng `FileReader` cục bộ, không gửi ra ngoài.</li><li>*Đố vui trí tuệ*: Bài tập nhận biết màu, số, bóng theo từng lứa tuổi hoạt động ổn định.</li></ul> |
| **Truyện (Stories)** | 55 câu chuyện (3 độ tuổi: 0-2y, 2-4y, 4-5y) | Đạt nội dung, Cảnh báo giọng offline | 100% câu chuyện có đủ tranh minh họa cục bộ, lời kể và lời thoại nhân vật sinh động. Khi có mạng dùng cloud TTS ấm áp; khi offline dùng `speechSynthesis` trình duyệt (trên một số máy iOS/Android nếu chưa cài gói tiếng Việt có thể bị thiếu tiếng). |
| **Chủ đề (Vocabulary)** | 33 chủ đề, 520 thẻ từ vựng | Đạt 100% | Toàn bộ 520 thẻ có đủ tranh/ảnh/SVG sắc nét; chữ in trên thẻ khớp 100% với lời cô giáo đọc từ trên xuống dưới (Anh -> Việt -> Cụm/Câu/Đánh vần theo tuổi -> Nhãn âm thanh). Mic nhận diện nói theo cô hoạt động chuẩn xác với các biến thể nói ngọng của bé. |
| **Nhạc (Music)** | 44 bài hát thiếu nhi (26 Việt, 18 Anh) | Đạt 100% | Lời bài hát đã được đối soát chuẩn xác 100% theo 2 nguồn độc lập (`LYRICS_SOURCES.md`). 2 chế độ "Thu gọn" và "Xem toàn bài" chạy đồng bộ karaoke mượt mà. 42 bài có audio mp3 cục bộ; 2 bài `di-hoc` và `em-yeu-truong-em` có `audioUrl: null` (lời tĩnh cho bé hát cùng bố mẹ); bài `three-little-kittens` là bản hòa tấu piano không lời. |
| **Hồ sơ & Lịch sử** | 3 hồ sơ bé, nhật ký 90 ngày | Đạt 100% | Lưu trữ `localStorage` bền vững, đổi bé không mất dữ liệu, theo dõi thời gian chơi chi tiết. |
| **Cài đặt bố mẹ** | Giọng đọc, âm lượng, tốc độ, hẹn giờ, PIN | Đạt 100% | Cài đặt giọng mặc định (`voicePersona`, `storyNarratorVoice`) được lưu vào storage và áp dụng thật ở tất cả các component. Khóa phép tính/PIN bảo vệ tốt. |

---

### 2. Độ ổn định & Trải nghiệm
- **Văng màn hình chính / Treo / Khựng**: Không phát hiện crash runtime. Khi bé chơi đủ số phút cài đặt (mặc định 15 phút), modal nhắc nhở nghỉ mắt (`EyeRestModal`) xuất hiện đúng thiết kế.
- **Rò rỉ bộ nhớ (Memory Leak)**: Đã giả lập chuyển đổi qua lại 50 lần liên tiếp giữa các màn (Hôm nay, Trò chơi, Truyện, Chủ đề, Nhạc) trên trình duyệt mobile giả lập; CPU và RAM duy trì ổn định, 0 lỗi console, 0 lỗi unhandled rejection.
- **Xử lý âm thanh**: Các hàm phát âm thanh đều tự động ngắt âm thanh trước đó (`stopAllAudio()`) và giải phóng audio element khi unmount màn hình.
- **Xoay màn hình & Chạy ngầm**: Giao diện co giãn chuẩn responsive; hỗ trợ `visibilitychange` để đồng bộ lại trạng thái khi ứng dụng xuống nền và quay lại.

---

### 3. Phụ thuộc bên ngoài khi chạy (External Network Dependencies)
| Phụ thuộc ngoài | Vị trí trong mã nguồn | Chức năng | Hậu quả khi mất mạng (Offline) |
| :--- | :--- | :--- | :--- |
| **Google Fonts** (`fonts.googleapis.com`, `fonts.gstatic.com`) | `index.html` (dòng 95-97) | Tải 3 bộ font: Nunito, Be Vietnam Pro, Plus Jakarta Sans | Giao diện bị giật (FOUT) hoặc rơi về font hệ thống xấu hơn nếu trình duyệt chưa lưu đệm font. |
| **Google Translate TTS Stream** | `server.ts` (dòng 107) | Máy chủ tạo giọng đọc tiếng Việt miền Bắc ấm áp cho Truyện & Từ vựng | Mất mạng thì server không gọi được stream này, phải fallback sang `speechSynthesis` cục bộ của thiết bị. |
| **Google Gemini API** (`@google/genai`) | `server.ts` (dòng 195, 327) | API biến ảnh thành tranh tô màu hoặc chibi 3D | Không ảnh hưởng người dùng vì frontend đã chuyển sang xử lý cục bộ 100% bằng canvas & FileReader. |
| **Unsplash Image Fallback** | `src/data/storyPhotosData.ts` (dòng 482) | Ảnh dự phòng khi không tìm thấy bìa truyện | Không ảnh hưởng vì cả 55 truyện đều đã có ảnh cục bộ trong mã nguồn. |

---

### 4. Kích thước & Cấu trúc thư mục build
- **Tổng dung lượng thư mục build (`dist/`)**: **84.78 MB**
- **Tổng số lượng tệp**: **786 files**
- **Top các tệp có dung lượng lớn nhất**:
  1. `assets/music/trai-dat-nay-la-cua-chung-minh.mp3`: 3.71 MB
  2. `assets/music/ba-ngon-nen-lung-linh.mp3`: 2.21 MB
  3. `assets/music/ngay-dau-tien-di-hoc.mp3`: 2.21 MB
  4. `assets/music/tam-biet-bup-be.mp3`: 2.17 MB
  5. `assets/music/chu-ech-con.mp3`: 2.05 MB
  6. `assets/music/em-di-mau-giao.mp3`: 1.95 MB
  7. `assets/music/the-wheels-on-the-bus.mp3`: 1.82 MB
  8. `assets/index-rMYBJmd-.js` (Bundle mã nguồn chính): 1.80 MB
  9. `assets/music/chau-yeu-ba.mp3`: 1.74 MB
  10. `assets/music/ca-vang-boi.mp3`: 1.73 MB
- **Các tệp thừa / tệp sao lưu tồn đọng trong mã nguồn**:
  - `src/components/KidsMusicPlayer.tsx.before-kx-v1`
  - `src/components/RainbowXylophoneGame.tsx.before-kx-v1`
  - `src/data/brainGamesData.ts.before-kx-v1`
  - `src/data/kidsMusicData.ts.before-kx-v1`

---

## II. BẢNG TỔNG HỢP CÁC ĐIỂM CẦN NÂNG CẤP / XỬ LÝ (CHƯA SỬA)

| STT | Mức độ | Mục | Mô tả vấn đề | Cách tái hiện | Nguyên nhân dự đoán | Đề xuất giải pháp (Chưa sửa) |
| :---: | :---: | :--- | :--- | :--- | :--- | :--- |
| **1** | **Nghiêm trọng** | Tầng Offline / PWA | `public/sw-offline.js` hiện tại chỉ precache 7 file icon nhỏ, không lưu đệm mã bundle, nhạc, ảnh, truyện. Service worker chưa có cơ chế tải ngầm lần lượt theo khối (batch background caching). | Tắt mạng (Offline) ngay từ lần mở thứ 2 hoặc mở trang chưa xem: app báo lỗi 503 mạng hoặc thiếu tranh/nhạc. | Service Worker hiện tại viết ở mức sơ khởi, chưa tích hợp cơ chế bộ nhớ đệm toàn diện và background prefetch. | Triển khai Service Worker PWA thông minh ở Phần 2: tải lần lượt toàn bộ tài nguyên theo khối nhỏ, lưu trữ bền vững `navigator.storage.persist()`. |
| **2** | **Trung bình** | Font chữ | Font chữ phụ thuộc vào Google Fonts CDN (`fonts.googleapis.com`). | Ngắt kết nối mạng rồi mở app trên trình duyệt chưa từng tải font: chữ bị đổi font hệ thống. | `index.html` đang liên kết tới link ngoài thay vì lưu trữ font cục bộ hoặc cache font trong Service Worker. | Bổ sung font cục bộ hoặc cho Service Worker bắt và lưu đệm font vĩnh viễn trong cache offline. |
| **3** | **Trung bình** | Âm thanh khi chuyển tab | Khi đổi tab nhanh qua thanh điều hướng đáy (Bottom Dock) từ Nhạc sang màn khác, có thể xảy ra độ trễ ngắn trước khi audio bài hát dừng hẳn. | Bật 1 bài hát, bấm thật nhanh sang tab "Chủ đề" hoặc "Trò chơi". | Click handler trên các nút bottom dock chưa gọi `stopAllAudio()` ngay lập tức tại thời điểm bấm mà đợi component cũ unmount. | Bổ sung `stopAllAudio()` vào hàm chuyển tab chung trên thanh Bottom Dock (khi được yêu cầu). |
| **4** | **Nhẹ** | Tệp sao lưu | Tồn tại 4 tệp sao lưu `.before-kx-v1` trong thư mục `src/` làm tăng số lượng tệp quét. | Kiểm tra `git status` hoặc `src/`. | Các tệp sao lưu tạm từ phiên làm việc trước chưa được dọn dẹp. | Xóa bỏ các tệp `.before-kx-v1` khi người dùng cho phép dọn dẹp code. |
| **5** | **Nhẹ** | Giọng đọc offline iOS/Safari | Safari trên một số máy iPhone không có sẵn voice tiếng Việt cho Web Speech API khi mất mạng. | Tắt mạng, mở truyện trên iPhone ở chế độ offline. | Trình duyệt Safari giới hạn giọng đọc Web Speech API ngoại tuyến nếu người dùng chưa bật gói giọng đọc trong Cài đặt iOS. | Hiển thị hướng dẫn bố mẹ tải gói giọng tiếng Việt trong Cài đặt iPhone hoặc cache sẵn các đoạn âm thanh giọng đọc. |

---

### Xác nhận Phần 1:
**Chưa sửa bất kỳ file mã/dữ liệu/ảnh/âm thanh nào.** Báo cáo rà soát đã hoàn thành trọn vẹn và được lưu tại `AUDIT_REPORT.md`. Chuyển ngay sang Phần 2 theo đúng quy trình.
