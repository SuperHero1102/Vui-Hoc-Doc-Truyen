# BÁO CÁO TIẾN ĐỘ & KIỂM ĐỊNH ÂM THANH ĐỒNG BỘ THEO MÀN (AUDIO PROGRESS)

Đồng bộ âm thanh và giọng đọc theo từng màn chơi trong mục **Trò chơi** và mục **Giác quan**, triệt tiêu hoàn toàn hiện tượng âm thanh màn cũ nói đè lên màn mới hoặc nói sót sau khi đã chuyển màn.

---

## 1. NGUYÊN TẮC CỐT LÕI
1. **Âm thanh khớp màn hình:** Giọng nói hoặc âm thanh của màn nào thì chỉ được phát ở màn đấy.
2. **Nói xong mới chuyển màn:** Khi trẻ chọn đúng/hoàn thành câu hỏi, hệ thống đọc trọn vẹn lời khen và giải thích của màn hiện tại trước khi chuyển sang màn tiếp theo (có cơ chế timeout an toàn 3.6s - 3.8s để chống treo).
3. **Ngắt dứt khoát khi chuyển màn/tab:** Khi chuyển màn mới hoặc chuyển tab/rời trò chơi, gọi ngay `stopAllAudio()` để triệt tiêu mọi âm thanh thừa còn trong hàng đợi trước khi màn mới bắt đầu.
4. **Khóa tương tác tạm thời:** Trong lúc chờ đọc xong câu khen chuyển màn, khóa cờ `isAdvancingRef.current` để tránh trẻ chạm liên tiếp vào các lựa chọn khác.

---

## 2. CHI TIẾT CÁC HẠNG MỤC ĐÃ XỬ LÝ

| Thành phần | Vấn đề trước đây | Giải pháp đã triển khai | Trạng thái |
|:---|:---|:---|:---:|
| **1. BrainGamePlayground (Tìm hình giống nhau, Đoán bóng, v.v.)** | `triggerRoundWin` dùng `setTimeout(1250ms)` cứng, màn hình chuyển sang round mới trong khi giọng chúc mừng của round cũ vẫn đang nói 2-3.5s. | Chuyển `triggerRoundWin` thành bất đồng bộ: `await Promise.race([speakTeacherVoice(...), timeout(3600)])`. Chờ đọc xong trọn vẹn lời khen, sau đó gọi `stopAllAudio()` rồi mới `setRound(r => r + 1)`. Khóa nút `disabled={isAdvancingRef.current}`. | **HOÀN THÀNH 100%** |
| **2. SensoryZeroToThreeMonths (Giác quan 0-3 tháng)** | Khi bấm "Trước" / "Tiếp" chuyển thẻ, tiếng thì thầm hoặc nhạc ru của thẻ cũ vẫn tiếp tục phát trên thẻ mới. Không có cleanup khi unmount. | Viết lại `handlePrevCard` và `handleNextCard`: lập tức gọi `stopAllAudio()`, reset `activeLullaby` rồi mới chuyển thẻ. Bổ sung `useEffect` unmount cleanup `stopAllAudio()`. | **HOÀN THÀNH 100%** |
| **3. PeekabooFourToTwelveMonths (Giác quan 4-12 tháng)** | Chuyển đổi giữa 3 chế độ con (Ú òa / Bong bóng / Thẻ hình lớn) âm thanh cũ không bị ngắt. | Bổ sung hàm `handleSelectSubMode` gọi `stopAllAudio()` trước khi đổi chế độ. Bổ sung `stopAllAudio()` khi chạm thẻ mới và effect unmount cleanup. | **HOÀN THÀNH 100%** |
| **4. App.tsx (Toàn cục)** | Chuyển đổi giữa các tab lớn (Trò chơi ⇄ Giác quan ⇄ Bài học ⇄ Truyện tranh) giọng đọc truyện hoặc âm thanh trò chơi cũ không tự ngắt. | Bổ sung `useEffect` toàn cục trong `App.tsx` lắng nghe `[activeDockTab, activeBrainGame?.id, activeTopic?.id, selectedStory?.id]` tự động gọi `stopAllAudio()` ngay lập tức. | **HOÀN THÀNH 100%** |
| **5. RainbowXylophoneGame (Đàn Cầu Vồng)** | Ô chọn âm sắc dạng dropdown nằm trong container `overflow-x-auto` bị kẹt mép, không chọn được danh sách. | Thay dropdown bằng **Popup Modal 3D Chibi** lớn, độc lập, phím bấm to $\ge 80\text{px}$, hiển thị 4 nhạc cụ sắc nét, phát thử nốt khi chọn và tự động đóng modal. | **HOÀN THÀNH 100%** |

---

## 3. KIỂM ĐỊNH KỸ THUẬT
- `npm run lint` (`tsc --noEmit`): **ĐẠT (0 lỗi)**
- `npm run build` (`vite build`): **ĐẠT (Thành công 100%)**
