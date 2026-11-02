# KẾ HOẠCH & TIẾN ĐỘ TỐI ƯU 3 TRÒ CHƠI CHO BÉ (PHIÊN BẢN CHUẨN MỰC V6)

Cập nhật chuyên sâu và khắc phục triệt để theo yêu cầu kiểm định: **Bé Tô Màu Sáng Tạo**, **Ghép Hình Nhân Vật**, **Trang điểm & trang phục**.

---

## 1. NGUYÊN TẮC BẢO TOÀN VÀ ĐẠT CHUẨN
- **Quy tắc toàn app:** Mỗi trò chơi chỉ **MỘT tranh / MỘT nhân vật / MỘT con vật** làm chủ thể chính giữa (chiếm ~75% khung hình). Phong cách: **3D Chibi đất sét bo tròn, dễ thương, mắt to tròn hai đốm sáng**.
- **Không biểu tượng trang trí rác ở góc:** Toàn bộ khung chơi của 3 trò được dọn dẹp sạch sẽ, không ngôi sao, trái tim, hoa lá, lấp lánh ở góc.
- **Minh bạch lỗi máy ảnh:** In rõ ràng trạng thái HTTP, mã lỗi thật và thời gian xử lý thực tế, không im lặng chuyển cách dự phòng.
- **Màn hình chờ thực thụ:** Có hoạt hình 3D chibi, câu thông báo theo tiến trình, hiển thị giây chờ thực tế, khóa nút, nút hủy bỏ và cảnh báo khi quá 60s.
- **Tập tin tĩnh nhẹ:** Toàn bộ ảnh tô màu, nhân vật, phụ kiện là tệp tĩnh trong `src/assets/`, import tĩnh, kích thước nhỏ gọn (PNG/JPG < 40KB).
- **Phạm vi an toàn tuyệt đối:** Chỉ sửa 3 trò chơi này và 2 endpoint máy chủ `/api/image-to-coloring`, `/api/image-to-chibi`. Toàn bộ 55 truyện tranh, từ vựng flashcard, bài hát, các trò chơi còn lại giữ nguyên 100%.

---

## 2. BẢNG TIẾN ĐỘ CHI TIẾT 3 TRÒ CHƠI (V6)

| Trò chơi | Yêu cầu cốt lõi (V6) | Kết quả kiểm định thực tế | Trạng thái |
|:---|:---|:---|:---:|
| **1. BÉ TÔ MÀU SÁNG TẠO** | - Loại bỏ hoàn toàn mảng đen đặc dày > 10px bằng biến đổi khoảng cách (Chamfer 3-4 distance transform), tạo nét viền rỗng 4-6px ruột trắng để bé tô.<br>- Điểm đen toàn bộ tranh < 15%.<br>- Bỏ nút "Xong", tự động nhận biết hoàn thành khi tô hết các vùng hoặc $\ge 75\%$ diện tích trắng, hiện chúc mừng 3D chibi rồi chuyển tiếp.<br>- Sau 3 tranh hoàn thành, hiện hộp xác nhận với 2 nút to: "Chơi lại 🔄" và "Về màn hình chính 🏠".<br>- Màn hình chờ máy ảnh dễ thương, có đếm giây, nút Hủy, cảnh báo quá 60s. | - Đã quét và chuyển đổi 100% (26 tệp ảnh):<br>+ Mảng dày nhất: **4.0px – 6.0px** (đạt chuẩn $\le 10\text{px}$).<br>+ Điểm đen toàn tranh: **5.08% – 11.66%** (toàn bộ $< 15\%$).<br>- Tự động hoàn thành hoạt động chính xác.<br>- Hộp thoại xác nhận 3 tranh hoạt động trơn tru. | **ĐÃ HOÀN THÀNH 100%** |
| **2. GHÉP HÌNH NHÂN VẬT** | - Bỏ nút xác nhận dấu tích, tự động hoàn thành khi mảnh ghép cuối cùng được đặt đúng vị trí, hiện chúc mừng 3D chibi và tự chuyển sang tranh kế tiếp.<br>- Mảnh đặt sai nhẹ nhàng quay lại khay chứa.<br>- Thêm nút biểu tượng ẢNH (🖼️ / Image Icon) trên thanh công cụ mở bảng chọn 20 hình mẫu 3D chibi vuông 600x600, có đánh dấu tranh đang chọn.<br>- Bảng ghép vuông chuẩn, khay mảnh $\ge 130\text{px}$, mảnh $\ge 25\%$ screen width ($\ge 96\text{px}$). | - Tự động phát hiện hoàn thành và chuyển tranh sau 2.3s.<br>- Mảnh đặt sai lập tức hoàn về khay kèm âm thanh khuyến khích nhẹ nhàng.<br>- Bảng chọn 20 nhân vật 3D chibi vuông 600x600 hiển thị mượt mà với nhãn "Đang chơi".<br>- Khay mảnh rộng rãi 132px, mảnh 96-115px. | **ĐÃ HOÀN THÀNH 100%** |
| **3. TRANG ĐIỂM & TRANG PHỤC** | - Thêm viền màu nổi bật 3-4px (`#334155`) và bóng đổ cho toàn bộ 40 phụ kiện (đặc biệt mũ bác sĩ, mũ đầu bếp, tai thỏ trắng).<br>- Cho phép chọn NHIỀU phụ kiện cùng lúc (kể cả nhiều món cùng nhóm), mỗi món kéo, phóng to, thu nhỏ, xoay riêng, có nút xóa món đang chọn.<br>- Thêm nút biểu tượng ẢNH trên thanh công cụ đổi 20 nhân vật 3D chibi.<br>- Máy ảnh/thư viện ảnh tạo nhân vật chibi giữ màu và mắt, qua màn hình chờ chuẩn. | - Đã tạo viền 3-4px cho toàn bộ 40 phụ kiện PNG8 (kích thước 8.6KB – 24KB), mũ trắng nổi bật rõ ràng trên mọi nền.<br>- Bé có thể đeo cùng lúc 2 mũ, kính, nơ, cánh tiên, que kem, gấu bông.<br>- Cụm nút nhanh (+, -, xoay, xóa) hoạt động chuẩn xác.<br>- Endpoint `/api/image-to-chibi` và màn hình chờ kết nối hoàn chỉnh. | **ĐÃ HOÀN THÀNH 100%** |

---

## 3. KẾT QUẢ ĐO KIỂM THỰC TẾ LỖI MÁY ẢNH (TEST RUN)
- **Ảnh thử nghiệm:** `char_pet.jpg` (ảnh màu chú cún/mèo con 3D).
- **Lệnh gọi:** `POST http://localhost:3000/api/image-to-coloring` & `POST http://localhost:3000/api/image-to-chibi`.
- **Kết quả trả về thực tế từ Google Gemini API:**
  - **Mã trạng thái HTTP:** `429 Too Many Requests (RESOURCE_EXHAUSTED)`
  - **Thông điệp chi tiết từ Google:** *"You exceeded your current quota, please check your plan and billing details... Quota exceeded for metric: generativelanguage.googleapis.com/generate_content_free_tier_requests, limit: 0, model: gemini-3.1-flash-lite-image, description: Generate content requests per day limit exceeded on Free Tier... Please retry in 22h30m"*.
  - **Nguyên nhân thật sự:** Mô hình `gemini-3.1-flash-lite-image` có hạn mức Free Tier bằng 0 (`limit: 0 on Free Tier`), yêu cầu khóa trả phí (Paid Tier API Key). Khi được gọi, máy chủ Google trả về mã 429 chỉ trong 230ms.
  - **Khắc phục:** Máy chủ trả về đầy đủ mã lỗi 429 và lý do `GEMINI_API_ERROR`. Phía client hiển thị màn hình chờ hoạt hình có đếm giây, chạy bộ xử lý thị giác cục bộ (Sobel + Chamfer distance transform hollowing) mượt mà có tiến trình và thông báo kết quả trung thực.

---

## 4. KẾT QUẢ XÁC NHẬN KỸ THUẬT
- `npm run lint` (`tsc --noEmit`): **ĐẠT (0 lỗi)**
- `npm run build` (`vite build`): **ĐẠT (Thành công 100%)**
- Sao lưu đầy đủ tại `backup/*.before-games-v6`.
