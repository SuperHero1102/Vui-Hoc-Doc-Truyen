# TIẾN ĐỘ THỰC HIỆN CẢI TIẾN: PHỤ HUYNH, LỊCH SỬ HOẠT ĐỘNG & GIỌNG TRUYỆN ĐA VAI (PARENT-V2)

---

## 1. SAO LƯU AN TOÀN TRƯỚC KHI THỰC HIỆN (.before-parent-v2)
- `backup/ParentArea.tsx.before-parent-v2`
- `backup/App.tsx.before-parent-v2`
- `backup/StoryReaderModal.tsx.before-parent-v2`
- `backup/audioEngine.ts.before-parent-v2`
- `backup/server.ts.before-parent-v2`
- `backup/learning.ts.before-parent-v2`

---

## 2. TIẾN ĐỘ TỪNG PHẦN

| Phân hệ | Yêu cầu | Giải pháp kỹ thuật | Trạng thái |
|:---|:---|:---|:---:|
| **A. Giọng Cô Giáo AI (Cài đặt phụ huynh)** | - Rà soát và chỉ rõ lý do 3 cô giáo nghe giống nhau.<br>- Phân hóa rõ rệt 3 cô giáo: Cô Mai, Cô Lan, Cô Hương với âm vực, tốc độ, phong cách riêng.<br>- Thêm nút "Nghe thử" cạnh mỗi cô. | - Rà soát: Trước đây tiếng Việt đi qua 1 voice duy nhất của Google Translate TTS hoặc SpeechSynthesis với cùng pitch/rate.<br>- Phân hóa: Cô Mai (pitch 1.0, rate 0.92, ân cần), Cô Lan (pitch 1.20, rate 1.04, líu lo), Cô Hương (pitch 0.88, rate 0.86, truyền cảm).<br>- Thêm nút "Nghe thử" phát câu chào đặc trưng. | Đang triển khai |
| **B. Lịch sử Hoạt động & Giới hạn** | - Nút "Lịch sử hoạt động" trên Sân chơi (ngang hàng nút Quay lại, cao $\ge 44\text{px}$), qua Cổng phụ huynh.<br>- Tự động ghi nhật ký 90 ngày (localStorage).<br>- 3 tab: Hôm nay, Tuần này, Tất cả; Biểu đồ cột theo giờ/ngày; Top 5; Phân bổ 5 nhóm; Gợi ý thông minh.<br>- Giới hạn giờ chơi, cảnh báo nhẹ nhàng bằng giọng cô khi sắp hết giờ, hết giờ hiện màn nghỉ ngơi.<br>- Nút Xóa lịch sử có xác nhận. | - Tạo module `activityTracker.ts`.<br>- Tạo component `ActivityHistoryModal.tsx`.<br>- Tích hợp nút trên Sân chơi và bộ đếm giờ trong `App.tsx`. | Đang triển khai |
| **C. Giọng Đọc Truyện Đa Vai** | - Thêm "Giọng Mẹ" (ấm áp, thủ thỉ) & "Giọng Bà" (khàn nhẹ, trầm chậm).<br>- Lời thoại nhân vật đọc bằng giọng riêng.<br>- Bộ chọn giọng trên modal đọc truyện & trong Cài đặt.<br>- Áp dụng thử nghiệm trên 2 truyện: "Con Cò Bé Bé" và "Sơn Tinh Thủy Tinh".<br>- Dừng ngay giọng cũ khi lật trang, đổi truyện hoặc thoát. | - Mở rộng `StoryReaderModal.tsx` và `audioEngine.ts`.<br>- Phân vai nhân vật đặc thù: Cò con, Cò mẹ, Sơn Tinh, Thủy Tinh, Vua Hùng.<br>- Đồng bộ qua bộ điều phối âm thanh `audioEngine`. | Đang triển khai |
