# TIẾN ĐỘ THAY THẾ HÌNH ẢNH 55 TRUYỆN THIẾU NHI (STORY PROGRESS)

Tệp quản lý và theo dõi tiến độ cập nhật hình ảnh gốc cho toàn bộ 55 câu chuyện thiếu nhi trong ứng dụng.

---

## 1. NGUYÊN TẮC THIẾT KẾ & THÔNG SỐ KỸ THUẬT

### 1.1. Logo trong danh sách (`story<số>_icon.jpg`)
- **Kích thước:** `256 x 256 px` (tỉ lệ 1:1)
- **Dung lượng tối đa:** `< 15 KB` (nén JPEG quality ~80, strip metadata)
- **Phong cách:** 3D icon đất sét bo tròn (cute friendly clay render), màu sắc tươi sáng pastel, ánh sáng studio mềm mại, bóng đổ nhẹ, nền trơn một màu pastel.
- **Chủ thể:** ĐÚNG MỘT vật thể hoặc nhân vật chính đại diện cho truyện, chiếm ~70% khung hình, nằm ở trung tâm.
- **Quy chuẩn an toàn:** Không chữ, không số, không logo, không chi tiết rườm rà.

### 1.2. Ảnh nền hoạt cảnh trong truyện (`story<số>_banner.jpg`)
- **Tỉ lệ khung hình:** Đúng tỉ lệ thật của khung ảnh trong code: ngang **16:9** (~800 x 450 px).
- **Dung lượng tối đa:** `< 60 KB` (nén JPEG tối ưu, strip metadata).
- **Phong cách:** Tranh minh họa sách thiếu nhi cổ điển (classic whimsical soft storybook illustration), nét vẽ mềm mại ấm áp, màu sắc tươi vui, giàu cảm xúc đồng quê/cổ tích.
- **Bố cục & Vùng chừa trống:** Chủ thể và hành động chính strictly nằm ở trung tâm và 2/3 phía trên khung hình. **Chừa trống 25% phía dưới** (mặt sàn, thảm, mặt nước hoặc bãi cỏ yên bình không có vật thể/nhân vật) để nhãn tiêu đề và nút bấm trong giao diện đè lên mà không che mất nội dung tranh. Dùng chung đồng bộ cho cả 3 trang của câu chuyện.
- **Quy chuẩn an toàn:** Không chữ/watermark/logo, không cảnh bạo lực hay rùng rợn, phù hợp 100% tâm lý trẻ thơ.

### 1.3. Quy tắc tích hợp Code
- Lưu tại: `src/assets/images/story<số>_icon.jpg` và `src/assets/images/story<số>_banner.jpg`
- Import tĩnh trực tiếp trong `src/data/storyPhotosData.ts`, không gọi dịch vụ ngoài khi app chạy.
- Thẻ ảnh luôn có fallback qua `onError` (ẩn ảnh lỗi, hiển thị emoji mặc định nếu có sự cố).
- Dòng nguồn: Đổi toàn bộ các dòng trích dẫn NXB / website bên thứ ba thành `"Tranh minh họa: <tên truyện>"`.
- Không thay đổi bố cục, CSS, nội dung truyện, bản dịch, âm thanh, nút bấm hay logic đọc truyện.

---

## 2. BẢNG TIẾN ĐỘ CHI TIẾT 55 TRUYỆN

| STT | Mã truyện (ID) | Tên truyện | Độ tuổi | Trạng thái Logo | Trạng thái Banner | Dung lượng Icon | Dung lượng Banner | Dòng nguồn (captionVi) | Trạng thái |
|:---:|:---|:---|:---:|:---:|:---:|:---:|:---:|:---|:---:|
| **1** | `story-con-co-be-be` | Con Cò Bé Bé | 0-2y | Đã tạo | Đã tạo (v2 chừa đáy 25%) | 3.8 KB | 45 KB | Tranh minh họa: Con Cò Bé Bé | **ĐÃ HOÀN THÀNH** |
| **2** | `story-con-co-an-dem` | Con Cò Mày Đi Ăn Đêm | 0-2y | Đã tạo | Đã tạo (chừa đáy 25%) | 7.6 KB | 58 KB | Tranh minh họa: Con Cò Mày Đi Ăn Đêm | **ĐÃ HOÀN THÀNH** |
| **3** | `story-ong-trang-xuong-choi` | Ông Trăng Xuống Chơi | 0-2y | Đã tạo | Đã tạo (chừa đáy 25%) | 5.8 KB | 50 KB | Tranh minh họa: Ông Trăng Xuống Chơi | **ĐÃ HOÀN THÀNH** |
| **4** | `story-nu-na-nu-nong` | Nu Na Nu Nống | 0-2y | Đã tạo | Đã tạo (chừa đáy 25%) | 4.9 KB | 54 KB | Tranh minh họa: Nu Na Nu Nống | **ĐÃ HOÀN THÀNH** |
| **5** | `story-dung-dang-dung-de` | Dung Dăng Dung Dẻ | 0-2y | Đã tạo | Đã tạo (chừa đáy 25%) | 9.9 KB | 54 KB | Tranh minh họa: Dung Dăng Dung Dẻ | **ĐÃ HOÀN THÀNH** |
| **6** | `story-ganh-ganh-gong-gong` | Gánh Gánh Gồng Gồng | 0-2y | Đã tạo | Đã tạo (chừa đáy 25%) | 6.9 KB | 54 KB | Tranh minh họa: Gánh Gánh Gồng Gồng | **ĐÃ HOÀN THÀNH** |
| **7** | `story-tieng-keu-con-vat` | Đố Bé Tiếng Kêu Con Gì? | 0-2y | Đã tạo | Đã tạo (chừa đáy 25%) | 8.5 KB | 40 KB | Tranh minh họa: Đố Bé Tiếng Kêu Con Gì? | **ĐÃ HOÀN THÀNH** |
| **8** | `story-sac-mau-quanh-be` | Thế Giới Sắc Màu Của Bé | 0-2y | Đã tạo | Đã tạo (chừa đáy 25%) | 7.0 KB | 43 KB | Tranh minh họa: Thế Giới Sắc Màu Của Bé | **ĐÃ HOÀN THÀNH** |
| **9** | `story-do-vat-quen-thuoc` | Đồ Vật Quen Thuộc Của Bé | 0-2y | Đã tạo | Đã tạo (chừa đáy 25%) | 5.0 KB | 46 KB | Tranh minh họa: Đồ Vật Quen Thuộc Của Bé | **ĐÃ HOÀN THÀNH** |
| **10** | `story-cu-cai-trang` | Củ Cải Trắng | 0-2y | Đã tạo | Đã tạo (chừa đáy 25%) | 6.8 KB | 54 KB | Tranh minh họa: Củ Cải Trắng | **ĐÃ HOÀN THÀNH** |
| **11** | `story-chu-ga-trong-choai` | Chú Gà Trống Choai | 0-2y | Đã tạo | Đã tạo (chừa đáy 25%) | 7.9 KB | 54 KB | Tranh minh họa: Chú Gà Trống Choai | **ĐÃ HOÀN THÀNH** |
| **12** | `story-ba-chu-heo-con` | Ba Chú Heo Con | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.4 KB | 53.6 KB | Tranh minh họa: Ba Chú Heo Con | **ĐÃ HOÀN THÀNH** |
| **13** | `story-ba-chu-de-gruff` | Ba Chú Dê Gruff | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 11.9 KB | 53.2 KB | Tranh minh họa: Ba Chú Dê Gruff | **ĐÃ HOÀN THÀNH** |
| **14** | `story-chu-vit-con-xau-xi` | Chú Vịt Con Xấu Xí | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 11.9 KB | 53.3 KB | Tranh minh họa: Chú Vịt Con Xấu Xí | **ĐÃ HOÀN THÀNH** |
| **15** | `story-rua-va-tho` | Rùa Và Thỏ | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 11.2 KB | 52.2 KB | Tranh minh họa: Rùa Và Thỏ | **ĐÃ HOÀN THÀNH** |
| **16** | `story-cao-tho-ga-trong` | Cáo, Thỏ Và Gà Trống | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.8 KB | 53.3 KB | Tranh minh họa: Cáo, Thỏ Và Gà Trống | **ĐÃ HOÀN THÀNH** |
| **17** | `story-ga-con-hat-thoc` | Gà Con Và Hạt Thóc | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.3 KB | 53.0 KB | Tranh minh họa: Gà Con Và Hạt Thóc | **ĐÃ HOÀN THÀNH** |
| **18** | `story-de-den-de-trang` | Chú Dê Đen Và Chú Dê Trắng | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.8 KB | 52.4 KB | Tranh minh họa: Chú Dê Đen Và Chú Dê Trắng | **ĐÃ HOÀN THÀNH** |
| **19** | `story-chu-tho-ngoan` | Chú Thỏ Ngoan | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.0 KB | 52.7 KB | Tranh minh họa: Chú Thỏ Ngoan | **ĐÃ HOÀN THÀNH** |
| **20** | `story-su-tich-con-muoi` | Sự Tích Con Muỗi | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.3 KB | 52.2 KB | Tranh minh họa: Sự Tích Con Muỗi | **ĐÃ HOÀN THÀNH** |
| **21** | `story-su-tich-chim-bim-bip` | Sự Tích Chim Bìm Bịp | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.0 KB | 53.2 KB | Tranh minh họa: Sự Tích Chim Bìm Bịp | **ĐÃ HOÀN THÀNH** |
| **22** | `story-jack-cay-dau-than` | Cậu Bé Và Cây Đậu Thần | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.3 KB | 52.1 KB | Tranh minh họa: Cậu Bé Và Cây Đậu Thần | **ĐÃ HOÀN THÀNH** |
| **23** | `story-cong-chua-hat-dau` | Nàng Công Chúa Và Hạt Đậu | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.9 KB | 52.8 KB | Tranh minh họa: Nàng Công Chúa Và Hạt Đậu | **ĐÃ HOÀN THÀNH** |
| **24** | `story-con-qua-khat-nuoc` | Con Quạ Khát Nước | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 11.5 KB | 52.8 KB | Tranh minh họa: Con Quạ Khát Nước | **ĐÃ HOÀN THÀNH** |
| **25** | `story-cao-va-chum-nho` | Con Cáo Và Chùm Nho | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.5 KB | 53.6 KB | Tranh minh họa: Con Cáo Và Chùm Nho | **ĐÃ HOÀN THÀNH** |
| **26** | `story-su-tu-va-chuot-nhat` | Sư Tử Và Chuột Nhắt | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.3 KB | 53.5 KB | Tranh minh họa: Sư Tử Và Chuột Nhắt | **ĐÃ HOÀN THÀNH** |
| **27** | `story-kien-va-chau-chau` | Kiến Và Châu Chấu | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.5 KB | 53.6 KB | Tranh minh họa: Kiến Và Châu Chấu | **ĐÃ HOÀN THÀNH** |
| **28** | `story-cau-be-chan-cuu` | Cậu Bé Chăn Cừu | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.6 KB | 53.4 KB | Tranh minh họa: Cậu Bé Chăn Cừu | **ĐÃ HOÀN THÀNH** |
| **29** | `story-con-ngong-vang` | Con Ngỗng Vàng | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.1 KB | 53.6 KB | Tranh minh họa: Con Ngỗng Vàng | **ĐÃ HOÀN THÀNH** |
| **30** | `story-tam-cam` | Tấm Cám | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 11.1 KB | 53.6 KB | Tranh minh họa: Tấm Cám | **ĐÃ HOÀN THÀNH** |
| **31** | `story-thach-sanh` | Thạch Sanh | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.2 KB | 52.9 KB | Tranh minh họa: Thạch Sanh | **ĐÃ HOÀN THÀNH** |
| **32** | `story-cay-khe` | Cây Khế | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.0 KB | 53.3 KB | Tranh minh họa: Cây Khế | **ĐÃ HOÀN THÀNH** |
| **33** | `story-banh-chung-banh-giay` | Sự Tích Bánh Chưng, Bánh Giầy | 4-5y | Đã tạo | Đã tạo (v2 chừa đáy 25%) | 6.4 KB | 53 KB | Tranh minh họa: Sự Tích Bánh Chưng, Bánh Giầy | **ĐÃ HOÀN THÀNH** |
| **34** | `story-su-tich-dua-hau` | Sự Tích Dưa Hấu (Mai An Tiêm) | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 11.6 KB | 53.2 KB | Tranh minh họa: Sự Tích Dưa Hấu | **ĐÃ HOÀN THÀNH** |
| **35** | `story-su-tich-trau-cau` | Sự Tích Trầu Cau | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.3 KB | 53.6 KB | Tranh minh họa: Sự Tích Trầu Cau | **ĐÃ HOÀN THÀNH** |
| **36** | `story-chu-cuoi-cung-trang` | Chú Cuội Cung Trăng | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.4 KB | 52.9 KB | Tranh minh họa: Chú Cuội Cung Trăng | **ĐÃ HOÀN THÀNH** |
| **37** | `story-thanh-giong` | Thánh Gióng | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.7 KB | 52.5 KB | Tranh minh họa: Thánh Gióng | **ĐÃ HOÀN THÀNH** |
| **38** | `story-son-tinh-thuy-tinh` | Sơn Tinh Thủy Tinh | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.9 KB | 53.0 KB | Tranh minh họa: Sơn Tinh Thủy Tinh | **ĐÃ HOÀN THÀNH** |
| **39** | `story-su-tich-ho-guom` | Sự Tích Hồ Gươm | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.7 KB | 52.7 KB | Tranh minh họa: Sự Tích Hồ Gươm | **ĐÃ HOÀN THÀNH** |
| **40** | `story-co-be-quang-khan-do` | Cô Bé Quàng Khăn Đỏ | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.4 KB | 53.2 KB | Tranh minh họa: Cô Bé Quàng Khăn Đỏ | **ĐÃ HOÀN THÀNH** |
| **41** | `story-co-be-lo-lem` | Cô Bé Lọ Lem | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.6 KB | 53.6 KB | Tranh minh họa: Cô Bé Lọ Lem | **ĐÃ HOÀN THÀNH** |
| **42** | `story-bach-tuyet-bay-chu-lun` | Nàng Bạch Tuyết Và Bảy Chú Lùn | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.1 KB | 53.6 KB | Tranh minh họa: Nàng Bạch Tuyết Và Bảy Chú Lùn | **ĐÃ HOÀN THÀNH** |
| **43** | `story-nang-tien-ca` | Nàng Tiên Cá | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.5 KB | 53.1 KB | Tranh minh họa: Nàng Tiên Cá | **ĐÃ HOÀN THÀNH** |
| **44** | `story-co-be-ban-diem` | Cô Bé Bán Diêm | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.7 KB | 53.6 KB | Tranh minh họa: Cô Bé Bán Diêm | **ĐÃ HOÀN THÀNH** |
| **45** | `story-hoang-tu-ech` | Chàng Hoàng Tử Ếch | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.1 KB | 52.6 KB | Tranh minh họa: Chàng Hoàng Tử Ếch | **ĐÃ HOÀN THÀNH** |
| **46** | `story-chu-linh-chi-dung-cam` | Chú Lính Chì Dũng Cảm | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.2 KB | 53.2 KB | Tranh minh họa: Chú Lính Chì Dũng Cảm | **ĐÃ HOÀN THÀNH** |
| **47** | `story-chu-be-ti-hon` | Chú Bé Tí Hon (Ngón Tay Cái) | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.9 KB | 53.5 KB | Tranh minh họa: Chú Bé Tí Hon | **ĐÃ HOÀN THÀNH** |
| **48** | `story-hai-anh-em-quy-lun` | Hai Anh Em Và Con Quỷ Lùn | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.3 KB | 52.0 KB | Tranh minh họa: Hai Anh Em Và Con Quỷ Lùn | **ĐÃ HOÀN THÀNH** |
| **49** | `story-pinocchio` | Pinocchio (Cậu Bé Người Gỗ) | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.6 KB | 53.6 KB | Tranh minh họa: Pinocchio | **ĐÃ HOÀN THÀNH** |
| **50** | `story-hansel-va-gretel` | Hansel Và Gretel | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.5 KB | 53.7 KB | Tranh minh họa: Hansel Và Gretel | **ĐÃ HOÀN THÀNH** |
| **51** | `story-aladdin-cay-den-than` | Aladdin Và Cây Đèn Thần | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.6 KB | 53.4 KB | Tranh minh họa: Aladdin Và Cây Đèn Thần | **ĐÃ HOÀN THÀNH** |
| **52** | `story-peter-pan` | Peter Pan (Cậu Bé Không Lớn) | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.0 KB | 52.8 KB | Tranh minh họa: Peter Pan | **ĐÃ HOÀN THÀNH** |
| **53** | `story-alice-xu-so-dieu-ky` | Alice Ở Xứ Sở Diệu Kỳ | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 13.4 KB | 53.1 KB | Tranh minh họa: Alice Ở Xứ Sở Diệu Kỳ | **ĐÃ HOÀN THÀNH** |
| **54** | `story-thay-boi-xem-voi` | Thầy Bói Xem Voi | 2-4y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.1 KB | 53.6 KB | Tranh minh họa: Thầy Bói Xem Voi | **ĐÃ HOÀN THÀNH** |
| **55** | `story-cay-tre-tram-dot` | Cây Tre Trăm Đốt | 4-5y | Đã tạo | Đã tạo (chừa đáy 25%) | 12.2 KB | 52.9 KB | Tranh minh họa: Cây Tre Trăm Đốt | **ĐÃ HOÀN THÀNH** |
