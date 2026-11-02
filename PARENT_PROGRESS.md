# TIẾN ĐỘ THỰC HIỆN CẢI TIẾN: PHỤ HUYNH, LỊCH SỬ HOẠT ĐỘNG & GIỌNG TRUYỆN ĐA VAI (PARENT-V2)

---

## 1. SAO LƯU AN TOÀN TRƯỚC KHI THỰC HIỆN (.before-parent-v2)
- `backup/ParentArea.tsx.before-parent-v2`
- `backup/App.tsx.before-parent-v2`
- `backup/StoryReaderModal.tsx.before-parent-v2`
- `backup/audioEngine.ts.before-parent-v2`
- `backup/server.ts.before-parent-v2`
- `backup/learning.ts.before-parent-v2`
- `backup/LessonPlayground.tsx.before-parent-v2`

---

## 2. TIẾN ĐỘ TỪNG PHẦN

| Phân hệ | Yêu cầu | Giải pháp kỹ thuật | Trạng thái |
|:---|:---|:---|:---:|
| **D. Micro Từ Vựng "Nhại Giọng Theo Cô"** | - Bật biểu tượng micro ở mỗi đối tượng từ vựng tiếng Anh khi tích chọn `settings.allowMicrophone`.<br>- Khi tắt cài đặt thì ẩn hoàn toàn biểu tượng mic.<br>- Xử lý trải nghiệm nhại giọng thật có visualizer sóng âm, khen thưởng, không lưu âm thanh. | - Khi `settings.allowMicrophone === true`, mỗi thẻ từ vựng hiển thị nút Micro tím nổi bật (`Nhại theo cô`). Khi `settings.allowMicrophone === false`, ẩn hoàn toàn biểu tượng này.<br>- Khi bé chạm vào: Cô giáo đọc mẫu từ tiếng Anh, mở bộ lắng nghe với sóng âm động sinh động (hoàn toàn không lưu âm thanh lên đĩa/mạng), sau đó nổ sao chúc mừng và cô giáo khen ngợi nồng nhiệt. | **Hoàn thành 100%** |
| **E. Chờ Nói Xong Xuôi Mới Sang Màn Mới** | - Xử lý trong trò chơi và mục giác quan: khi nói xong xuôi lời dẫn/khen thưởng màn cũ rồi mới chuyển sang màn khác.<br>- Tránh tình trạng sang màn khác nhưng vẫn nói câu của bàn cũ hoặc nói dở màn cũ đã chuyển màn. | - Cập nhật `BrainGamePlayground.tsx`: `triggerRoundWin` await trọn vẹn `speakTeacherVoice(...)` của màn cũ trước khi `setRound(r => r + 1)`, dọn sạch âm thanh.<br>- Cập nhật `LessonPlayground.tsx`: `handleTapChoice`, `handleBalloonPop`, `handlePutInBasket`, `handleMemoryCardFlip` đều await cô giáo nói xong trọn vẹn mới sang câu hỏi/màn mới.<br>- Cập nhật `SensoryZeroToThreeMonths.tsx` và `PeekabooFourToTwelveMonths.tsx`: dừng âm thanh cũ và chờ câu ú òa hoàn tất trước khi chuyển đổi. | **Hoàn thành 100%** |
| **F. Nút [Quay lại] [Lịch sử] trong Cài Đặt Phụ Huynh** | - Bổ sung nút Lịch sử ngay cạnh nút Quay lại trong Khu vực dành cho phụ huynh theo đúng định dạng `Quay lại     Lịch sử`. | - Tại header của `ParentDashboard`, bố trí 2 nút ngang hàng với nút `Quay lại` ở trước và nút `Lịch sử` ở sau, chiều cao $\ge 44\text{px}$, bấm mở ngay modal Lịch sử hoạt động. | **Hoàn thành 100%** |
| **G. Chuyển Giác Quan vào Hôm Nay & Tạo Tab "Nhạc"** | - Đưa mục giác quan vào dưới cùng của mục "Hôm nay".<br>- Thay thế tab thứ 4 ở thanh điều hướng thành icon nốt nhạc và tiêu đề "Nhạc".<br>- Sưu tầm 10-15 bài tiếng Anh (ABC, Twinkle Twinkle, Old MacDonald,...) và toàn bộ danh mục bài hát thiếu nhi Việt Nam theo 3 lứa tuổi (3 tuổi, 4 tuổi, 5 tuổi). | - Đã đưa toàn bộ Sân chơi giác quan (0–3m & 4–12m) xuống đáy tab "Hôm nay".<br>- Thay tab thứ 4 thành icon `<Music />` với tên "Nhạc".<br>- Tạo kho dữ liệu `src/data/kidsMusicData.ts` gồm 26 bài hát Việt Nam (chuẩn 3, 4, 5 tuổi theo danh sách tác giả yêu cầu) và 15 bài hát tiếng Anh thiếu nhi nổi tiếng thế giới.<br>- Tạo component `src/components/KidsMusicPlayer.tsx` với trình phát giai điệu Web Audio phong phú, lời bài hát karaoke có highlight dòng, nút Bé hát cùng cô, và bàn gõ nhịp vỗ tay nhận sao thưởng. | **Hoàn thành 100%** |

---

## 3. CÁC TỆP ĐÃ SỬA VÀ TẠO MỚI
1. `src/utils/audioEngine.ts` (Bộ điều phối âm thanh tập trung, quản lý giọng cô giáo, giọng người kể truyện và các phong cách thoại nhân vật).
2. `src/components/ParentArea.tsx` (Giao diện Cài đặt phụ huynh tinh gọn, bảng 3 cô giáo, chọn giọng người kể truyện, nút nghe thử, nút `Quay lại` & `Lịch sử` ngang hàng).
3. `src/utils/activityTracker.ts` (Module ghi nhận nhật ký cục bộ 90 ngày, tính toán thống kê phân bổ theo giờ, ngày, nhóm nội dung).
4. `src/components/ActivityHistoryModal.tsx` (Màn hình Lịch sử hoạt động chi tiết với biểu đồ cột, Top 5, gợi ý bố mẹ, thiết lập giới hạn).
5. `src/components/LessonPlayground.tsx` (Thêm nút Micro nhại theo cô theo cài đặt, cơ chế await hoàn tất giọng nói trước khi sang màn mới).
6. `src/components/BrainGamePlayground.tsx` (Chờ nói xong xuôi lời chúc mừng trọn vẹn mới chuyển màn).
7. `src/components/PeekabooFourToTwelveMonths.tsx` & `src/components/SensoryZeroToThreeMonths.tsx` (Đảm bảo dứt điểm âm thanh cũ trước khi đổi tương tác).
8. `src/data/kidsMusicData.ts` (Kho 41 bài hát: 26 bài thiếu nhi Việt Nam 3-5 tuổi theo đúng tác giả và 15 bài nhạc tiếng Anh kinh điển).
9. `src/components/KidsMusicPlayer.tsx` (Trình phát nhạc thiếu nhi đa năng, gõ nhịp vỗ tay, chạy chữ karaoke).
10. `src/App.tsx` (Tích hợp tab Nhạc, dời Giác quan xuống đáy Hôm nay, kết nối nút Lịch sử trong Khu vực phụ huynh).

