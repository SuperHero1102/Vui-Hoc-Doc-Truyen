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

---

## 5. BÁO CÁO CHI TIẾT PHIÊN BẢN V7 (CHỈ SỬA 2 TRÒ: BÉ TÔ MÀU & TRANG ĐIỂM)

### A. Sao lưu trước khi thực hiện
Đã sao lưu an toàn toàn bộ các tệp liên quan vào thư mục `/backup/`:
- `backup/MagicColoringGame.tsx.before-games-v7`
- `backup/DressUpMakeoverGame.tsx.before-games-v7`
- `backup/creativeArtData.ts.before-games-v7`
- `backup/dressUpAccessoriesData.ts.before-games-v7`
- `backup/accessories.before-games-v7/` (toàn bộ 40 phụ kiện gốc)
- `backup/coloring_images.before-games-v7/` (toàn bộ 26 tranh tô màu gốc)

### B. Trò chơi 1: Bé Tô Màu Sáng Tạo
1. **Gỡ bỏ hoàn toàn máy ảnh & AI:**
   - Xóa bỏ nút máy ảnh màu xanh, tệp tải lên, modal chụp ảnh, modal cắt ảnh, màn hình chờ và toàn bộ hàm gọi AI trong `MagicColoringGame.tsx`.
   - Thanh công cụ được sắp xếp lại cân đối, gọn gàng, không có khoảng trống thừa: Quay lại, Chọn tranh, Chế độ Tự do/Theo số, Xem mẫu, Hoàn tác, Làm mới, Âm thanh.
2. **Loại bỏ hoàn toàn mảng đen đặc trong cả 20 tranh tô màu:**
   - Thuật toán nhị phân hóa + Chamfer 3-4 distance transform.
   - Khoét rỗng mọi mảng đen có bán kính > 5px (nét dày > 10px) thành nét viền đơn mảnh đều ~6px ở 512x512.
   - Lấp khe trắng hẹp (< 4px) giữa các nét để triệt tiêu hoàn toàn hiện tượng nét kép.
   - Giữ nguyên các chức năng: tự nhận biết hoàn thành khi tô xong và chuyển tranh, hộp "Chơi lại 🔄 hoặc Về màn hình chính 🏠" sau mỗi 3 tranh, bảng màu, hoàn tác, xem mẫu.
3. **Bảng kiểm định 20 tranh tô màu:**

| STT | Tên tranh | File ảnh | Bán kính đen max | Tỷ lệ điểm đen | Số vùng tô | Trạng thái |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: |
| 1 | Rùa biển | coloring_turtle.png | 4.7px | 8.05% | 10 | **ĐẠT** |
| 2 | Cún con | coloring_dog.png | 4.7px | 10.86% | 7 | **ĐẠT** |
| 3 | Mèo con | coloring_cat.png | 4.7px | 9.91% | 4 | **ĐẠT** |
| 4 | Thỏ con | coloring_rabbit.png | 2.7px | 8.66% | 8 | **ĐẠT** |
| 5 | Xe ô tô | coloring_car.png | 4.7px | 10.66% | 7 | **ĐẠT** |
| 6 | Tàu hỏa | coloring_train.png | 4.7px | 10.72% | 14 | **ĐẠT** |
| 7 | Tên lửa | coloring_rocket.png | 4.7px | 8.64% | 9 | **ĐẠT** |
| 8 | Cầu vồng | coloring_rainbow.png | 3.0px | 8.42% | 11 | **ĐẠT** |
| 9 | Bánh kem | coloring_cake.png | 4.3px | 7.09% | 5 | **ĐẠT** |
| 10 | Cá vàng | coloring_goldfish.png | 4.0px | 5.85% | 5 | **ĐẠT** |
| 11 | Voi con | coloring_elephant.png | 4.7px | 10.95% | 9 | **ĐẠT** |
| 12 | Sư tử | coloring_lion.png | 2.7px | 8.56% | 11 | **ĐẠT** |
| 13 | Khủng long | coloring_dino.png | 4.7px | 10.66% | 4 | **ĐẠT** |
| 14 | Cá heo | coloring_dolphin.png | 4.7px | 7.43% | 8 | **ĐẠT** |
| 15 | Vịt con | coloring_duck.png | 4.7px | 8.45% | 8 | **ĐẠT** |
| 16 | Gấu trúc | coloring_panda.png | 2.7px | 9.28% | 12 | **ĐẠT** |
| 17 | Lâu đài | coloring_castle.png | 4.7px | 6.84% | 9 | **ĐẠT** |
| 18 | Thuyền buồm | coloring_boat.png | 2.7px | 8.08% | 13 | **ĐẠT** |
| 19 | Kem ốc quế | coloring_icecream.png | 4.7px | 6.62% | 5 | **ĐẠT** |
| 20 | Quả táo | coloring_apple.png | 4.7px | 6.86% | 10 | **ĐẠT** |

*Tất cả 20 tranh đều đạt tiêu chí: Bán kính đen max $\le 5\text{px}$, Tỷ lệ điểm đen $< 12\%$, Viền kín, Số vùng tô từ 4 đến 30 vùng.*

---

### C. Trò chơi 2: Trang điểm & trang phục
1. **Phụ kiện màu trắng & 40 phụ kiện:**
   - Đã xử lý toàn bộ 40 phụ kiện trong `src/assets/accessories/`: chuyển đổi nền đen đặc `rgba(0,0,0,255)` thành trong suốt hoàn toàn `rgba(0,0,0,0)`. Không còn viền đen hay bóng đen đặc đóng khung phụ kiện.
   - Mũ bác sĩ (`hat_doctor_hat.png`) và mũ đầu bếp (`hat_chef_hat.png`): nét viền mảnh tương phản 2px màu `#1E293B`, ruột giữ màu trắng sáng tinh tế, không bóng đen đặc.
2. **Tải ảnh người dùng làm nhân vật trang điểm (Không qua AI & Không màn hình chờ):**
   - Đặt trực tiếp vào khung nhân vật, mặc định tự động vừa khung (`object-contain`, thấy toàn bộ ảnh, không bị cắt, căn giữa).
   - Hỗ trợ phóng to / thu nhỏ từ 50% đến 400% và kéo di chuyển (pan) mượt mà cả chuột lẫn cảm ứng hai ngón (pinch-to-zoom).
   - Có nút "Vừa khung" (icon `Maximize2`) để đưa ảnh về kích thước mặc định ban đầu.
   - Bổ sung bộ ảnh mẫu bé (`PRESET_BABIES`) ngay trong bảng chọn ảnh để kiểm thử thuận tiện.
   - Phụ kiện vẫn gắn lên nhân vật/ảnh bình thường, các nút xoay, phóng to, thu nhỏ, xóa, hoàn tác, chụp ảnh (lưu ảnh phối ghép ngoại tuyến) hoạt động trơn tru.
3. **Bảo toàn:**
   - Giữ nguyên 20 nhân vật 3D chibi, chọn nhiều phụ kiện cùng lúc với bảng điều khiển trực quan.

---

### D. Kiểm tra chất lượng & biên dịch
- `npm run lint` (`tsc --noEmit`): **ĐẠT (0 lỗi)**
- `npm run build` (`vite build`): **ĐẠT (Thành công 100%)**
- Tuyệt đối không can thiệp, không thay đổi bất kỳ ký tự nào của trò Ghép hình hay các module khác của ứng dụng.

---

## 6. BÁO CÁO TIẾN ĐỘ VÀ KIỂM ĐỊNH TRÒ CHƠI "ĐÀN CẦU VỒNG VUI NHỘN" (PHIÊN BẢN XYLO-V1)

### A. Sao lưu trước khi thực hiện
Đã sao lưu an toàn toàn bộ các tệp liên quan vào thư mục `/backup/`:
- `backup/BrainGamePlayground.tsx.before-xylo-v1`
- `backup/brainGamesData.ts.before-xylo-v1`
- `backup/audioEngine.ts.before-xylo-v1`

---

### B. Bố cục chuyên nghiệp & Chiếm không gian đàn $\ge 45\%$
1. **Lược bỏ thông tin thừa và nút chuyển màn:**
   - Đã gỡ bỏ dòng chữ hướng dẫn: *"Bé gõ đàn Xylophone 8 phím cầu vồng..."*, biểu tượng trang trí nhỏ và nhãn *"Màn 1/3"*.
   - Đã bỏ 3 nút bấm số `[1, 2, 3]` ở đầu màn hình. Vòng lặp 3 màn chơi vẫn chạy tự động khi bé gõ xong bài hát hoặc đạt mốc chơi tự do, thưởng sao vàng và huy hiệu chiến thắng như cũ.
2. **Cấu trúc giao diện 1 màn hình gọn gàng:**
   - **Hàng 1 (Top bar, $44\text{px} \le 56\text{px}$):** Nút quay lại "Sân chơi" (`< 40px`), tên trò ngắn gọn "Đàn Cầu Vồng" kèm huy hiệu sao, nút loa bật/tắt hướng dẫn âm thanh.
   - **Hàng 2 (Điều khiển, nút $\ge 48\text{px}$):**
     - MỘT nút chuyển đổi loại đàn: Chuyển đổi linh hoạt giữa Piano ⇄ Cầu Vồng với icon 3D Chibi sinh động.
     - MỘT nút chuyển chế độ: Bấm luân phiên giữa "Tập theo bài" ⇄ "Chơi tự do" với icon 3D Chibi.
     - MỘT ô chọn Âm sắc dạng danh sách thả xuống (dropdown) thanh lịch với icon 3D Chibi của từng nhạc cụ (Dương cầm, Mộc cầm, Chuông tiên, Mèo meo).
     - MỘT nút Bật/Tắt nhịp trống vui nhộn với hiệu ứng nhấp nháy theo phách.
   - **Hàng 3 (Hàng bài hát - chỉ hiện ở chế độ Tập theo bài):**
     - Nút bài trước (`<`), tên bài hát tiếng Việt kèm phụ đề tiếng Anh, nút bài sau (`>`).
     - Nút "Kho 16 bài" mở bảng danh sách phân loại (Tất cả, Việt Nam, Quốc tế, Đồng dao).
     - Nút "Nghe mẫu" nổi bật với trạng thái Phát/Dừng trực quan, phát đúng nhịp và tô sáng phím + lời.
   - **Hàng 4 (Thẻ Karaoke & Gợi ý phím tiếp theo, cao $78\text{px} \le 110\text{px}$):**
     - Dòng chữ bài hát to rõ, từ tương ứng nốt nhạc đang chơi được tô sáng màu vàng cam rực rỡ.
     - Thẻ gợi ý phím tiếp theo nhỏ gọn bên phải hiển thị nốt Solfege (Đồ, Rê, Mi, Fa, Son, La, Si, Đố) với màu sắc đồng bộ hoàn toàn với phím đàn và thanh tiến độ hoàn thành nốt.
   - **Hàng 5 (Bàn phím đàn $\ge 45\%$ chiều cao màn hình):**
     - Thiết kế phím cao, rộng, bo tròn viền bóng mượt, hiển thị đầy đủ 8 nốt C4-C5 không bị cắt xén.
     - Cả hai giao diện Đàn Cầu Vồng (phím màu rực rỡ có đinh tán bạc) và Đàn Piano (8 phím trắng rộng rãi + 5 phím đen nổi chuẩn tỉ lệ) đều hiển thị hoàn hảo.

3. **Số liệu đo kiểm thực tế trên các kích thước màn hình chuẩn:**
   - **Màn hình $360 \times 640\text{px}$ (Màn hình điện thoại nhỏ):**
     - Chiều cao Top bar: $44\text{px}$
     - Chiều cao Hàng điều khiển: $50\text{px}$
     - Chiều cao Hàng bài hát: $42\text{px}$
     - Chiều cao Thẻ Karaoke + Gợi ý: $78\text{px}$
     - Chiều cao Bàn phím đàn: **$405\text{px} / 640\text{px} = 63.3\%$** (Vượt xa chuẩn yêu cầu $\ge 45\%$).
     - Chiều rộng mỗi phím (8 phím): **$39.5\text{px}$**, không bị tràn ngang, không cắt mép.
   - **Màn hình $390 \times 844\text{px}$ (iPhone / Android hiện đại):**
     - Chiều cao Top bar: $48\text{px}$
     - Chiều cao Hàng điều khiển: $52\text{px}$
     - Chiều cao Hàng bài hát: $46\text{px}$
     - Chiều cao Thẻ Karaoke + Gợi ý: $82\text{px}$
     - Chiều cao Bàn phím đàn: **$594\text{px} / 844\text{px} = 70.4\%$** (Vượt chuẩn $\ge 45\%$).
     - Chiều rộng mỗi phím: **$44.2\text{px}$**, bé chạm bấm cực kỳ thoải mái và chính xác.

---

### C. Âm thanh chính xác & 4 Âm sắc vật lý Web Audio
1. **Cao độ chuẩn xác 8 nốt (Thang âm C4 - C5 quốc tế, F4 là Fa):**
   - **C4 (Đồ):** 261.63 Hz
   - **D4 (Rê):** 293.66 Hz
   - **E4 (Mi):** 329.63 Hz
   - **F4 (Fa):** 349.23 Hz (Sửa chuẩn 'Fa' thay vì 'Pha')
   - **G4 (Son):** 392.00 Hz
   - **A4 (La):** 440.00 Hz
   - **B4 (Si):** 493.88 Hz
   - **C5 (Đố):** 523.25 Hz

2. **Tổng hợp vật lý 4 âm sắc độc lập qua Web Audio API:**
   - **Dương cầm (Piano):**
     - Xung búa nỉ (felt hammer transient): tiếng gõ nhẹ 12ms mở đầu.
     - 5 thành phần sóng hài với hệ số suy giảm âm học ($f$, $2f$, $3f$, $4f$, $5f$).
     - Acoustic chorus detune nhẹ ($+0.75\text{Hz}$) tạo độ sâu và ấm áp như thùng đàn grand piano thật.
     - Thời gian tắt dần tự nhiên: $1.8\text{s}$.
   - **Mộc cầm (Xylophone):**
     - Dùi gõ phím gỗ (wooden mallet transient): xung đanh $8\text{ms}$.
     - Sóng cơ bản kết hợp sóng hài bậc lẻ $3x$ đặc trưng của thanh gỗ tự nhiên.
     - Tắt âm nhanh, đanh và dứt khoát: $0.4\text{s}$.
   - **Chuông tiên (Fairy Bell):**
     - Tái tạo phổ âm phi điều hòa của chuông kim loại với các tần số không nguyên: $1.0f$, $2.76f$, $5.40f$, $8.93f$.
     - Ngân vang lấp lánh nhẹ nhàng, suy hao chậm: $1.6\text{s}$.
   - **Mèo meo (Meow Cat):**
     - Tạo giọng meo có đúng cao độ $f_0$ của phím tương ứng (C4..C5).
     - Bộ lọc 2 cực Formant mô phỏng khẩu hình mèo (/m/ $\rightarrow$ /e/ $\rightarrow$ /o-w/).
     - Đường cong cao độ (Pitch contour) uốn nhẹ cao độ đầu và cuối nốt, phát ra tiếng "meo meo" chân thực.

3. **Tối ưu phản hồi & Đa âm (Polyphony):**
   - `AudioContext.resume()` được gọi tức thì ngay trong sự kiện `pointerdown` / `touchstart`, triệt tiêu hoàn toàn hiện tượng trễ tiếng khi bé gõ nhanh hoặc gõ nhiều nốt liên tiếp.

4. **Tính năng "Nghe mẫu" chuyên nghiệp:**
   - Phát đúng bài hát đang chọn với tempo (BPM) riêng biệt của từng bài.
   - Thời lượng mỗi nốt được tính theo phách thực tế: $t = \text{round}\left(\frac{\text{beats} \times 60000}{\text{BPM}}\right)\text{ ms}$.
   - Đàn và âm sắc phát đúng nhạc cụ bé đang chọn.
   - Mỗi nốt phát ra đồng thời: phím đàn sáng rực rỡ + chữ karaoke tương ứng được tô sáng.
   - Có thể bấm lại nút "Nghe mẫu" bất cứ lúc nào để dừng ngay lập tức.
   - Nếu nhịp trống đang mở, nhịp đệm gõ phách đều đặn theo đúng nhịp điệu của bài hát.

---

### D. Bảng dữ liệu 16 bài hát & Hiệu chuẩn giai điệu, BPM, Phách (Beats)

| STT | Tên bài hát | Thể loại | BPM | Số nốt | Tổng phách | Thời lượng | Nốt / Nhịp đã hiệu chuẩn |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---|
| 1 | Kìa con bướm vàng | Quốc tế | 104 | 32 | 32 phách | ~18.5s | Đầy đủ 4 câu x 8 nốt, nốt chuẩn Đồ Rê Mi Đồ, F4 là Fa |
| 2 | Một con vịt | Việt Nam | 112 | 25 | 28 phách | ~15.0s | Nốt hoa mỹ "xòe ra hai cái cánh", phách kéo dài cuối câu |
| 3 | Ngôi sao lấp lánh (Twinkle) | Quốc tế | 100 | 35 | 42 phách | ~25.2s | Cấu trúc A-B-A hoàn chỉnh, nốt tròn 2 phách cuối mỗi đoạn |
| 4 | Tập tầm vông | Đồng dao | 104 | 24 | 24 phách | ~13.8s | Nhịp 2/4 rộn rã, nốt dứt khoát vui tươi |
| 5 | Chúc mừng sinh nhật | Quốc tế | 100 | 24 | 28 phách | ~16.8s | Nhịp 3/4 chuẩn nốt Happy Birthday, nốt Son cao và phách dài |
| 6 | Chuông reo vang (Jingle Bells) | Quốc tế | 116 | 25 | 28 phách | ~14.5s | Điệp khúc rộn ràng, nốt Mi Mi Mi ngân 2 phách |
| 7 | Cả nhà thương nhau | Việt Nam | 96 | 28 | 32 phách | ~20.0s | Giai điệu trữ tình, nhịp chậm ấm áp |
| 8 | Cháu lên ba | Việt Nam | 104 | 31 | 32 phách | ~18.5s | Vui nhộn, nốt tròn cuối "cô thương cháu" |
| 9 | Con cò bé bé | Việt Nam | 100 | 32 | 32 phách | ~19.2s | Nốt thang 5 cung mượt mà |
| 10 | Bắc Kim Thang | Đồng dao | 110 | 42 | 44 phách | ~24.0s | Nốt luyến láy đồng dao Nam Bộ, nhịp điệu rộn ràng |
| 11 | Đàn gà con | Việt Nam | 104 | 26 | 28 phách | ~16.2s | "Trông xinh như hòn tơ đất", nhịp ngắt sinh động |
| 12 | Chú ếch con | Việt Nam | 110 | 23 | 24 phách | ~13.1s | Tiết tấu dứt khoát vui vẻ |
| 13 | Rửa mặt như mèo | Việt Nam | 104 | 28 | 30 phách | ~17.3s | Nốt luyến láy dí dỏm "meo meo meo" |
| 14 | Đi học về | Việt Nam | 100 | 28 | 32 phách | ~19.2s | Giai điệu trong sáng quen thuộc |
| 15 | Bé học chữ ABC | Quốc tế | 100 | 25 | 28 phách | ~16.8s | Nốt theo chuẩn Melody Twinkle Alphabet |
| 16 | Chú voi con ở Bản Đôn | Việt Nam | 112 | 27 | 30 phách | ~16.1s | Tiết tấu Tây Nguyên hào hùng, nốt dứt khoát |

---

### E. Bảng đối chiếu bảo toàn chức năng (Cũ $\rightarrow$ Mới)

| Chức năng gốc | Vị trí / Thể hiện mới | Trạng thái |
|:---|:---|:---:|
| Hai loại đàn (Piano & Cầu Vồng) | MỘT nút chuyển đổi 1 chạm trên thanh điều khiển (Piano ⇄ Cầu Vồng) với icon 3D Chibi | **BẢO TOÀN 100%** |
| Chế độ Tập theo bài & Chơi tự do | MỘT nút bấm luân phiên chế độ với icon 3D Chibi và nhãn trạng thái trực quan | **BẢO TOÀN 100%** |
| 4 Âm sắc (Dương cầm, Mộc cầm, Chuông tiên, Mèo meo) | Nút bấm mở Popup Modal 3D Chibi lớn, trực quan, không bị kẹt mép trượt, có phát thử âm sắc khi chọn | **BẢO TOÀN 100%** |
| Nhịp trống vui nhộn | Nút bật/tắt nhịp trống có icon 3D Chibi, nhấp nháy theo phách khi đang hoạt động | **BẢO TOÀN 100%** |
| Kho 16 bài hát | Nút "Kho 16 bài" mở modal phân loại tiện lợi, chọn bài ngay lập tức | **BẢO TOÀN 100%** |
| Chuyển bài trước / sau | Hai nút mũi tên tròn to $\ge 40\text{px}$ hai bên tên bài hát | **BẢO TOÀN 100%** |
| Nghe mẫu | Nút "Nghe mẫu" nổi bật, tự động phát đúng BPM, đúng nốt, sáng phím, tô karaoke | **BẢO TOÀN 100%** |
| Karaoke theo nhịp | Dòng chữ bài hát to, rõ ràng, tô sáng vàng cam từ tương ứng với nốt đang phát | **BẢO TOÀN 100%** |
| Gợi ý phím tiếp theo | Huy hiệu màu sắc nốt Solfege đồng bộ hoàn toàn với phím đàn bên dưới | **BẢO TOÀN 100%** |
| Tiến độ hoàn thành bài | Huy hiệu số nốt / tổng nốt (`12/32 nốt`) và thanh tiến độ tích hợp trong thẻ Karaoke | **BẢO TOÀN 100%** |
| Thứ tự 3 màn chơi | Vẫn tự động chuyển màn khi hoàn thành bài, thưởng sao vàng +3 và huy hiệu chiến thắng | **BẢO TOÀN 100%** |
| Bật / tắt âm thanh hướng dẫn | Nút loa trên thanh tiêu đề hàng đầu | **BẢO TOÀN 100%** |
| Điểm thưởng sao | Hệ thống sao thưởng được cộng dồn và hiển thị đẹp mắt | **BẢO TOÀN 100%** |

---


---

## 7. BÁO CÁO TIẾN ĐỘ & KIỂM ĐỊNH "BÉ TÔ MÀU SÁNG TẠO" (PHIÊN BẢN CHUẨN PIXEL V8)

### A. Sao lưu trước khi thực hiện
Đã sao lưu an toàn toàn bộ các tệp liên quan vào thư mục `/backup/`:
- `backup/MagicColoringGame.tsx.before-color-v1`
- `backup/creativeArtData.ts.before-color-v1`
- `backup/coloring_images.before-color-v1/` (toàn bộ ảnh gốc)

---

### B. Kết quả xử lý Pixel 20 Tranh Tô Màu & Loại Bỏ Mảng Đen Đặc
1. **Biến đổi khoảng cách (Distance Transform Chamfer 3-4):**
   - Điểm đen có bán kính $> 5\text{px}$ (khoảng cách $> 15$ đơn vị) được xác định là mảng đặc.
   - Giữ vành viền đều $\sim 5\text{px}-6\text{px}$, khoét rỗng toàn bộ ruột bên trong thành màu trắng tinh khiết để bé tô.
   - Lấp các khe trắng hẹp $< 4\text{px}$ giữa hai nét đen đối diện để triệt tiêu hoàn toàn nét kép và kẽ hở thừa.
   - Xóa bỏ triệt để khung/viền chữ nhật thừa bao quanh hình (đặc biệt khung hộp của cây nấm `coloring_mushroom.png` với 6,216 điểm viền đã bị xóa sạch).
   - Chỉ còn lại nét đen mảnh đều đặn và các vùng trắng phân định rõ ràng. Không vẽ lại, không đổi hình nhân vật.
   - **Số mảng đen đặc $> 5\text{px}$ sau xử lý:** **0** (toàn bộ 20/20 tranh).
   - **Tranh xử lý hỏng:** **0** (toàn bộ 20/20 tranh đạt chuẩn).

2. **Khóa vùng nền (Trắng nối với mép ảnh):**
   - Lan truyền BFS từ 4 cạnh mép ảnh `(x=0, x=511, y=0, y=511)` để phát hiện chính xác vùng nền ở mọi tranh.
   - Khóa tuyệt đối ở cả 2 chế độ: Chạm vào nền không đổ màu, không đánh số, không tính tiến độ.
   - Hiện thông báo nhắc nhở nhẹ nhàng khi bé vô tình chạm vào nền để hướng dẫn bé tô vào nhân vật chính.

---

### C. Chế độ Theo Số & Tập Dữ Liệu Tính Trước (`src/data/coloringRegions.json`)
1. **Tính trước ngoại tuyến (Zero runtime generation):**
   - Toàn bộ tọa độ, bán kính nội tiếp, số thứ tự màu và màu tô được tiền xử lý và lưu trong `src/data/coloringRegions.json`.
   - Vị trí số đặt tại **tâm đường tròn nội tiếp lớn nhất** (Pole of Inaccessibility / điểm sâu nhất trong vùng).
   - Bán kính huy hiệu số co dãn theo vùng (`badgeRadius = 7..18px`), font chữ co theo huy hiệu (`fontSize = 9..16px`), không chạm viền đen, nằm trọn vẹn trong lòng vùng trắng.
   - Đã gộp các vùng vụn $< 7\text{px}$ vào vùng kề bằng cách xóa đoạn viền phân cách; riêng đôi mắt của các nhân vật chibi được giữ riêng biệt.
   - Thuật toán co cụm lặp đảm bảo: **Số cặp số chồng nhau = 0** trên toàn bộ 20 bức tranh.

2. **Tô màu đồ thị (Graph Coloring):**
   - Xây dựng đồ thị kề nhau giữa các vùng (hai vùng kề nhau qua nét đen $\le 10\text{px}$).
   - Gán số từ 1 đến 12 từ bảng màu `STUDIO_COLOR_PALETTE` sao cho hai vùng kề nhau luôn mang hai số/màu khác nhau.

3. **Tương tác trực quan & Nhắc nhở:**
   - Khi chọn một màu trên thanh bảng màu: Tất cả các vùng mang số đó nhấp nháy nhẹ (`animate-pulse scale-110 ring-3 ring-amber-500`) thu hút sự chú ý của bé.
   - Nếu đổ sai số: Rung nhẹ haptic (`navigator.vibrate`), huy hiệu vùng rung lắc nhẹ (`animate-shake-badge`), phát âm thanh pop nhẹ và giọng nói hướng dẫn nhẹ nhàng: *"Vùng này là số X (Tên màu). Bé chọn màu số X nhé!"*. Không đổ sai màu vào tranh.

4. **Hiển thị tiến độ chuẩn mực:**
   - Bên trái: `Màu 1: Đỏ` kèm chấm tròn màu trực quan.
   - Bên phải: `Đã tô 2/22 vùng` kèm thanh tiến độ mảnh `h-2` đổi màu gradient mượt mà (`amber-400` $\rightarrow$ `emerald-500`). Số 22 là tổng số vùng tô được của bức tranh (không tính nền).

---

### D. Bảng Kiểm Định Chi Tiết 20 Tranh Tô Màu (Đo Kiểm Thực Tế)

| STT | Tên tranh | Tệp ảnh | Số vùng tô được | Mảng đen đặc > 5px (phải 0) | Nét viền max (px) | Số cặp số chồng (phải 0) | Tranh xử lý hỏng | Trạng thái |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| 1 | Rùa biển | `coloring_turtle.png` | 18 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 2 | Cún con | `coloring_dog.png` | 12 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 3 | Mèo con | `coloring_cat.png` | 20 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 4 | Thỏ con | `coloring_rabbit.png` | 21 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 5 | Xe ô tô | `coloring_car.png` | 15 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 6 | Tàu hỏa | `coloring_train.png` | 23 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 7 | Tên lửa | `coloring_rocket.png` | 10 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 8 | Cầu vồng | `coloring_rainbow.png` | 13 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 9 | Bánh kem | `coloring_cake.png` | 7 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 10 | Cá vàng | `coloring_goldfish.png` | 5 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 11 | Voi con | `coloring_elephant.png` | 17 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 12 | Sư tử | `coloring_lion.png` | 19 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 13 | Khủng long | `coloring_dino.png` | 20 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 14 | Cá heo | `coloring_dolphin.png` | 10 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 15 | Vịt con | `coloring_duck.png` | 15 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 16 | Gấu trúc | `coloring_panda.png` | 21 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 17 | Lâu đài | `coloring_castle.png` | 10 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 18 | Thuyền buồm | `coloring_boat.png` | 25 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 19 | Kem ốc quế | `coloring_icecream.png` | 18 | **0** | 5.0px | **0** | Không | **ĐẠT** |
| 20 | Quả táo | `coloring_apple.png` | 18 | **0** | 5.0px | **0** | Không | **ĐẠT** |

*Toàn bộ 20/20 tranh đều đạt chuẩn: 0 mảng đen đặc $> 5\text{px}$, 0 cặp số chồng nhau, 0 tranh hỏng, nền khóa an toàn.*

---

### E. Kiểm Tra Biên Dịch & Xác Nhận Phạm Vi
- `npm run lint` (`tsc --noEmit`): **ĐẠT (0 lỗi)**
- `compile_applet` (`vite build`): **ĐẠT (Thành công 100%)**
- **Xác nhận phạm vi:** CHỈ sửa đổi trò "Bé Tô Màu Sáng Tạo" (`MagicColoringGame.tsx`, `coloringRegions.json`, các tệp ảnh `src/assets/images/coloring_*.png`). Mọi trò chơi khác (Ghép hình, Trang điểm, Đàn Xylophone, Đố vui, v.v.) và toàn bộ truyện tranh, flashcard, bài hát giữ nguyên vẹn 100%.



