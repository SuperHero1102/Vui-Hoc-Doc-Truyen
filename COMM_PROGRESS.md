# TIẾN ĐỘ THỰC HIỆN CHỦ ĐỀ: GIAO TIẾP HÀNG NGÀY (DAILY COMMUNICATION)

**Nguyên tắc cam kết**:
- CHỈ làm lại chủ đề “Giao tiếp hàng ngày” và banner giới thiệu. Mọi chủ đề, mục khác giữ nguyên 100%.
- Đã sao lưu dữ liệu cũ vào thư mục `backup/`:
  - `backup/dailyCommunicationData.ts.before-comm-v1`
  - `backup/DailyCommunicationStage.tsx.before-comm-v1`
  - `backup/DailyScenicArtwork.tsx.before-comm-v1`
- Không báo xong giả: Thực hiện theo đợt ảnh (mỗi đợt 2 tình huống, 10 ảnh), người dùng nhắn "tiếp tục" sẽ tiến hành đợt kế tiếp.
- Tiêu chuẩn độ dài câu:
  - Tiếng Anh: $\le 6$ từ/câu.
  - Tiếng Việt: $\le 8$ từ/câu.
  - Quy tắc vàng: $\le 10$ từ.
  - Mẹo cho bố mẹ: $\le 15$ từ.
- Tiêu chuẩn ảnh: Tỉ lệ 4:3, 640x480, WebP $\le 40$KB, phong cách 3D Chibi đất sét, nhân vật nhất quán theo Character Sheet.

---

## 1. Bảng Nhân Vật Chuẩn (Character Sheet)
- **Tập tin**: `public/assets/communication/comm_characters_sheet.webp` (17.7 KB, 640x480).
- **Nhân vật**:
  - Bé Bông: Bé Chibi áo vàng, quần xanh, nụ cười rạng rỡ.
  - Cô Hoa: Cô giáo mầm non đeo kính tròn, áo dài hồng phấn nhạt.
  - Bố: Bố trẻ trung, áo sơ mi polo xanh lam.
  - Mẹ: Mẹ dịu dàng, váy cam pastel.
  - Ông: Râu tóc bạc hiền từ, áo nâu gile.
  - Bà: Tóc búi bạc, áo bà ba hoa tím nhạt.
  - Bạn Mi: Bạn gái nhỏ cột tóc hai bên, váy yếm xanh bạc hà.

---

## 2. Danh Sách 10 Tình Huống & Tiến Độ Tạo Ảnh

| STT | Tên Tình Huống | Quy Tắc Vàng ($\le 10$ từ) | Thẻ Nên Làm (3) | Thẻ Không Nên (2) | Trạng Thái Ảnh |
|:---:|:---|:---|:---:|:---:|:---:|
| 1 | **Đến trường chào cô giáo** | Gặp cô, con khoanh tay chào ạ! | 3 thẻ | 2 thẻ | ✅ **Đợt 1 - Hoàn tất (5/5 ảnh $\le 40$KB)** |
| 2 | **Đi học chào bố mẹ, ông bà** | Đi học, con chào cả nhà ạ! | 3 thẻ | 2 thẻ | ✅ **Đợt 1 - Hoàn tất (5/5 ảnh $\le 40$KB)** |
| 3 | **Về nhà chào bố mẹ, ông bà** | Về nhà, con chào bố mẹ ạ! | 3 thẻ | 2 thẻ | ⏳ Chờ lệnh "tiếp tục" (Đợt 2) |
| 4 | **Đi chợ cùng mẹ, chào người quen** | Gặp người quen, con chào bác ạ! | 3 thẻ | 2 thẻ | ⏳ Chờ lệnh "tiếp tục" (Đợt 2) |
| 5 | **Đi công viên (chào bạn, xếp hàng)** | Chơi công viên, cùng nhau xếp hàng! | 3 thẻ | 2 thẻ | ⏳ Chờ lệnh "tiếp tục" (Đợt 3) |
| 6 | **Khách đến chơi nhà, chào hỏi** | Khách đến nhà, con khoanh tay chào! | 3 thẻ | 2 thẻ | ⏳ Chờ lệnh "tiếp tục" (Đợt 3) |
| 7 | **Nhận quà, nói cảm ơn** | Nhận quà hai tay, con cảm ơn! | 3 thẻ | 2 thẻ | ⏳ Chờ lệnh "tiếp tục" (Đợt 4) |
| 8 | **Làm sai hoặc hỏng đồ, nói xin lỗi** | Lỡ làm sai, con xin lỗi ngay! | 3 thẻ | 2 thẻ | ⏳ Chờ lệnh "tiếp tục" (Đợt 4) |
| 9 | **Mời cả nhà ăn cơm** | Trước khi ăn, con mời cả nhà! | 3 thẻ | 2 thẻ | ⏳ Chờ lệnh "tiếp tục" (Đợt 5) |
| 10 | **Xin phép và nói "làm ơn"** | Muốn nhờ ai, con nói làm ơn! | 3 thẻ | 2 thẻ | ⏳ Chờ lệnh "tiếp tục" (Đợt 5) |

---

## 3. Chi Tiết Tập Tin Ảnh Đã Sinh (Đợt 1)

1. `comm_characters_sheet.webp` - 17.7 KB (640x480) - Bảng nhân vật chuẩn 7 thành viên
2. `comm_1_do_1.webp` - 40.0 KB (640x480) - Cảnh 1.1 Nên: Bé Bông khoanh tay cúi đầu chào cô Hoa ở cổng trường
3. `comm_1_do_2.webp` - 34.0 KB (640x480) - Cảnh 1.2 Nên: Bé Bông vui vẻ vẫy tay bước vào lớp học
4. `comm_1_do_3.webp` - 35.0 KB (640x480) - Cảnh 1.3 Nên: Cô Hoa khen ngợi vỗ nhẹ đầu bé Bông
5. `comm_1_dont_1.webp` - 21.0 KB (640x480) - Cảnh 1.1 Không nên: Bé chạy vụt qua cổng trường cúi gằm mặt
6. `comm_1_dont_2.webp` - 31.0 KB (640x480) - Cảnh 1.2 Không nên: Bé núp sau chân mẹ mếu máo
7. `comm_2_do_1.webp` - 35.0 KB (640x480) - Cảnh 2.1 Nên: Bé Bông đeo ba lô cúi đầu chào bố mẹ ở hiên nhà
8. `comm_2_do_2.webp` - 27.0 KB (640x480) - Cảnh 2.2 Nên: Bé Bông ôm tạm biệt ông bà ấm áp
9. `comm_2_do_3.webp` - 37.0 KB (640x480) - Cảnh 2.3 Nên: Bố mẹ vui mừng vẫy tay chào tạm biệt bé
10. `comm_2_dont_1.webp` - 33.0 KB (640x480) - Cảnh 2.1 Không nên: Bé đi thẳng ra cửa không chào ai
11. `comm_2_dont_2.webp` - 22.0 KB (640x480) - Cảnh 2.2 Không nên: Bé ngồi bệt phụng phịu vứt ba lô

**Tổng cộng đã hoàn thiện**: 11 ảnh WebP (đều $\le 40$KB và 640x480).
Các tình huống 3 đến 10 đang hiển thị khung thẻ kèm nội dung đối thoại chuẩn và bảng minh họa tạm thời, sẵn sàng nạp ảnh WebP tương ứng theo từng đợt tiếp theo.
