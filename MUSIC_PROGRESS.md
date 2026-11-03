# Tiến độ Nâng cấp Mục Nhạc (MUSIC_PROGRESS.md)

## Mục tiêu
- Nâng cấp giao diện thương mại cho mục Nhạc (44 bài: 26 Việt, 18 Anh).
- Bổ sung ảnh 3D chibi đất sét (256x256 WebP < 15KB) theo đợt 8 bài.
- Rà soát minh bạch 44 bài: Bản thu thật có lời (Ca sĩ hát) vs Giai điệu tổng hợp (Nghe giai điệu).
- Tải file âm thanh về nén mono 64kbps đặt trong `public/assets/music/` để nghe offline.
- Căn chỉnh mốc thời gian karaoke chính xác (~0.3s) và hiển thị phụ đề theo cài đặt phụ huynh.
- Chỉ sửa đổi phạm vi mục Nhạc, giữ nguyên các phần khác.

---

## Nhật ký triển khai chi tiết

### Bước 1: Sao lưu mã nguồn
- [x] Tạo `backup/KidsMusicPlayer.tsx.before-music-v4`
- [x] Tạo `backup/kidsMusicData.ts.before-music-v4`
- [x] Khởi tạo `MUSIC_PROGRESS.md`

### Bước 2: Rà soát & Bảng dữ liệu 44 bài hát
- [x] Bảng 44 bài: Tên, Nguồn thu âm, Nhãn nút (Ca sĩ hát / Nghe giai điệu), Tình trạng
- [x] Kiểm tra 4 bài: Đi học, Ngày đầu tiên đi học, Em yêu trường em, Chiếc đèn ông Sao
  - Kết quả rà soát: Trên kho lưu trữ mở Internet Archive (mục `rua-mat-nhu-meo`), không có bản thu có lời phù hợp cho 4 bài này (bài "Đi học về" là bài khác; không có "Chiếc đèn ông sao", "Ngày đầu tiên đi học", "Em yêu trường em").
  - Thực hiện theo phản hồi thống nhất: Gán nhãn trung thực **"Nghe giai điệu"**, sử dụng hộp nhạc acoustic đa âm chất lượng cao, ẩn karaoke và chờ người dùng đính kèm file MP3 thực tế.

### Bước 3: Tải & Nén âm thanh offline (64kbps mono MP3)
- [x] Script tải và chuyển đổi các file audio có lời về `/public/assets/music/`.
- [x] Nén mono 64kbps bằng ffmpeg đảm bảo dung lượng nhẹ (dưới 1.5MB/bài), tốc độ tải tức thì, hoạt động 100% offline.

### Bước 4: Đồng bộ Karaoke có mốc thời gian (Timed Lyrics)
- [x] Bổ sung cấu trúc `timedLyrics: TimedLyricLine[]` với mốc thời gian bắt đầu và kết thúc từng dòng.
- [x] Tích hợp phụ đề song ngữ (tiếng Anh cho bài hát Việt, tiếng Việt cho bài hát Anh) theo cài đặt phụ huynh `settings.storyLanguage`.
- [x] Tự động cuộn mượt mà dòng đang hát vào giữa màn hình, dòng sắp tới rõ vừa phải, dòng đã qua mờ dần.

### Bước 5: Tạo ảnh 3D Chibi Đợt 1 (8 bài đầu tiên) & Hoàn thiện 44 ảnh
- [x] Bài 1: Cháu lên ba (`music_cover_chau-len-ba.webp` - 2.9 KB)
- [x] Bài 2: Rửa mặt như mèo (`music_cover_rua-mat-nhu-meo.webp` - 4.6 KB)
- [x] Bài 3: Đi học (`music_cover_di-hoc.webp` - 3.9 KB)
- [x] Bài 4: Trường chúng cháu là trường mầm non (`music_cover_truong-chung-chau-la-truong-mam-non.webp` - 3.5 KB)
- [x] Bài 5: Con cò bé bé (`music_cover_con-co-be-be.webp` - 2.8 KB)
- [x] Bài 6: Cả nhà thương nhau (`music_cover_ca-nha-thuong-nhau.webp` - 2.5 KB)
- [x] Bài 7: Cháu yêu bà (`music_cover_chau-yeu-ba.webp` - 4.2 KB)
- [x] Bài 8: Một con vịt (`music_cover_mot-con-vit.webp` - 14.0 KB)
- [x] 36 bài còn lại: Đã tạo và tối ưu đầy đủ trong `public/assets/music/covers/`, 100% tệp là WebP 256x256 dưới 15KB.

### Bước 6: Cải tiến Giao diện chuẩn thương mại (KidsMusicPlayer.tsx)
- [x] Banner tinh gọn: giữ số bài (44 bài) và nút "Tiếp tục nghe / Đang phát".
- [x] Dải chip cuộn ngang: Tất cả, Nhạc Việt, Lớp 3 tuổi, Lớp 4 tuổi, Lớp 5 tuổi, English, Yêu thích.
- [x] Ô tìm kiếm tích hợp: lọc nhanh theo tên bài hát, tác giả hoặc lời ca.
- [x] Thẻ bài: ảnh bìa 72px bo góc tròn, tên bài, tác giả, nhãn tuổi, nút tim yêu thích (hitbox $\ge 44\text{px}$), nhãn trạng thái minh bạch ("Ca sĩ hát" hoặc "Nghe giai điệu").
- [x] Màn phát lớn: ảnh bìa lớn kèm đĩa than xoay, thanh kéo tua (scrubbable range slider), nút điều khiển to bản (Trộn bài, Trước, Phát/Dừng, Sau, Lặp lại), khu vực Karaoke tự cuộn, tóm tắt bài học dưới 15 từ, 3 đệm gõ nhịp (trống, chuông, mõ).
- [x] Mini-player cố định dưới màn hình khi cuộn trang hoặc trên màn hình di động (360x640, 390x844).

### Bước 7: Kiểm thử & Biên dịch
- [x] `npm run lint` (`tsc --noEmit`): 0 lỗi.
- [x] `npm run build` (`vite build`): Biên dịch thành công.
- [x] Dev server khởi động lại trơn tru trên cổng 3000.
