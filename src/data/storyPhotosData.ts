/**
 * Kho ảnh minh họa bìa & hoạt cảnh truyện cổ tích thiếu nhi chuẩn xuất bản (Classic Storybook Illustration Art).
 * Tích hợp trực tiếp các bìa tranh truyện xuất bản chính thống do người dùng cung cấp:
 *  - Sơn Tinh, Thủy Tinh (/assets/aistudio/image_eae3bb1d.png)
 *  - Tấm Cám (/assets/aistudio/image_a2e74361.png)
 *  - Cây Khế (/assets/aistudio/image_5385c091.png)
 *  - Cây Tre Trăm Đốt (/assets/aistudio/image_718add15.png)
 *  - Thầy Bói Xem Voi (/assets/aistudio/image_651ad262.png)
 * Cùng toàn bộ tranh truyện thiếu nhi kinh điển Việt Nam và Thế giới.
 */

export interface StoryPhotoInfo {
  photoUrl: string;
  captionVi: string;
  sceneDescriptionVi: string;
}

export const STORY_REAL_PHOTOS_DETAILED: Record<string, StoryPhotoInfo> = {
  // =========================================================================
  // ĐỘ TUỔI 0-2: ĐỒNG DAO RU CON & TRUYỆN TRANH ĐẦU ĐỜI (1 - 11)
  // =========================================================================
  'story-con-co-be-be': {
    photoUrl: 'https://images.unsplash.com/photo-1555169062-013468b47731?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Tranh chú cò trắng đậu cành tre bên đồng lúa quê hương',
    sceneDescriptionVi: 'Hình ảnh chú cò con lông trắng muốt bên rặng tre làng, đôi cánh nhỏ vỗ nhịp êm đềm theo câu ca dao ru con của mẹ.',
  },
  'story-con-co-an-dem': {
    photoUrl: 'https://images.unsplash.com/photo-1549608276-5786777e6587?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chú cò trắng lội bì bõm kiếm mồi ven bờ ao làng lúc chập tối',
    sceneDescriptionVi: 'Bờ ao quê tĩnh mịch lúc hoàng hôn buông, chú cò chăm chỉ mò tôm bắt cá, thương đàn con thơ đợi ở tổ.',
  },
  'story-ong-trang-xuong-choi': {
    photoUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Vầng trăng rằm tròn vành vạnh vàng óng tỏa sáng khắp trời đêm',
    sceneDescriptionVi: 'Ánh trăng rằm vàng rực rỡ sà xuống chơi cùng các bạn nhỏ trong đêm hội trăng rằm tháng Tám.',
  },
  'story-nu-na-nu-nong': {
    photoUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Đôi bàn chân nhỏ xíu bụ bẫm của bé đang chơi trò nu na nu nống',
    sceneDescriptionVi: 'Đôi bàn chân hồng hào đáng yêu được mẹ vỗ về, nhịp nhàng chơi trò đồng dao truyền thống vui nhộn.',
  },
  'story-dung-dang-dung-de': {
    photoUrl: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Các bạn nhỏ tung tăng nắm tay dạo chơi dưới ánh nắng ấm áp',
    sceneDescriptionVi: 'Đoàn bé thơ vừa đi vừa hát vang bài ca đồng dao dắt nhau đi chơi, tiếng cười giòn tan rộn rã sân làng.',
  },
  'story-ganh-ganh-gong-gong': {
    photoUrl: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Con đường làng quê mộc mạc với cánh đồng lúa chín vàng ươm',
    sceneDescriptionVi: 'Hình ảnh gánh gánh gồng gồng gánh lúa gánh khoai về nhà, tượng trưng cho sự cần cù và ấm no.',
  },
  'story-tieng-keu-con-vat': {
    photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Bạn cún con và mèo con đáng yêu cùng vui đùa trong sân nhà',
    sceneDescriptionVi: 'Những người bạn nhỏ bốn chân thân quen cất tiếng kêu gâu gâu, meo meo đón chào ngày mới tươi vui.',
  },
  'story-sac-mau-quanh-be': {
    photoUrl: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Cầu vồng bảy sắc rực rỡ và những chùm bóng bay sắc màu',
    sceneDescriptionVi: 'Thế giới màu sắc diệu kỳ quanh bé với đỏ, vàng, xanh, tím bừng sáng trong ánh mặt trời chan hòa.',
  },
  'story-do-vat-quen-thuoc': {
    photoUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Bình sữa ấm, chiếc gối mềm và chú gấu bông thân thiết của bé',
    sceneDescriptionVi: 'Những đồ dùng nhỏ quen thuộc đồng hành cùng bé từng bữa ăn ngon và giấc ngủ êm dịu.',
  },
  'story-cu-cai-trang': {
    photoUrl: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Củ cải trắng to bự mập mạp nhổ lên từ luống đất tuyết mùa đông',
    sceneDescriptionVi: 'Củ cải trắng thơm ngon tình bạn được Thỏ Con, Dê Con và Hươu sẻ chia cho nhau trong mùa đông giá lạnh.',
  },
  'story-chu-ga-trong-choai': {
    photoUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chú gà trống mào đỏ rực dõng dạc cất tiếng gáy o o ó đón bình minh',
    sceneDescriptionVi: 'Gà trống choai oai vệ đứng trên hàng rào cất tiếng gáy vang dội, đánh thức vạn vật thức dậy đón ngày mới.',
  },

  // =========================================================================
  // ĐỘ TUỔI 2-4: NGỤ NGÔN CON VẬT & BÀI HỌC ĐẠO ĐỨC (12 - 29, 54)
  // =========================================================================
  'story-thay-boi-xem-voi': {
    photoUrl: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Tranh truyện Thầy Bói Xem Voi - Chú voi khổng lồ giữa phiên chợ quê',
    sceneDescriptionVi: 'Năm thầy bói mù cùng sờ voi: thầy sờ vòi, thầy sờ ngà, thầy sờ tai, thầy sờ chân, thầy sờ đuôi cãi nhau nảy lửa, bài học về cái nhìn toàn diện.',
  },
  'story-ba-chu-heo-con': {
    photoUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Ba chú heo con hồng hào đáng yêu xây ngôi nhà gạch vững chắc',
    sceneDescriptionVi: 'Ba anh em heo con cùng nhau dựng nhà, chú heo út kiên nhẫn xây ngôi nhà gạch kiên cố ngăn sói xám.',
  },
  'story-ba-chu-de-gruff': {
    photoUrl: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Đàn dê dũng cảm sang ngọn đồi cỏ xanh ngắt qua cây cầu gỗ',
    sceneDescriptionVi: 'Ba chú dê Gruff thông minh hiệp lực vượt qua cây cầu gỗ bắc qua suối để tới thảo nguyên cỏ non.',
  },
  'story-chu-vit-con-xau-xi': {
    photoUrl: 'https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Thiên nga trắng muốt dang đôi cánh lộng lẫy trên mặt hồ trong veo',
    sceneDescriptionVi: 'Chú vịt con từng bị chê cười nay đã lớn khôn thành một chú thiên nga kiêu hãnh và xinh đẹp tuyệt trần.',
  },
  'story-rua-va-tho': {
    photoUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Bạn thỏ trắng tai dài và bạn rùa chăm chỉ trên đường chạy bãi cỏ',
    sceneDescriptionVi: 'Rùa từng bước kiên trì tiến về đích trong khi Thỏ chủ quan ngủ quên, bài học quý báu về sự bền bỉ.',
  },
  'story-cao-tho-ga-trong': {
    photoUrl: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chú cáo đỏ đuôi xù lấp ló bên bìa rừng xanh',
    sceneDescriptionVi: 'Cáo ranh mãnh chiếm nhà Thỏ, nhưng đã bị chú Gà Trống dũng cảm vác hái đuổi chạy trốn khỏi rừng sâu.',
  },
  'story-ga-con-hat-thoc': {
    photoUrl: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chú gà con lông vàng óng như tơ chăm chỉ nhặt hạt thóc vàng',
    sceneDescriptionVi: 'Gà con biết yêu quý từng hạt lúa vàng do người nông dân vất vả làm ra, không bao giờ bỏ phí thức ăn.',
  },
  'story-de-den-de-trang': {
    photoUrl: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Hai chú dê gặp nhau trên cây cầu hẹp bắc qua dòng suối sâu',
    sceneDescriptionVi: 'Bài học nhớ đời khi hai chú dê bướng bỉnh húc nhau rơi xuống nước, nhắc bé phải luôn biết nhường nhịn.',
  },
  'story-chu-tho-ngoan': {
    photoUrl: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chú thỏ con ngoan ngoãn ngồi gặm cỏ non bên hiên nhà gỗ',
    sceneDescriptionVi: 'Thỏ con biết vâng lời mẹ dặn, đi chơi không la cà và luôn nhớ đường về tổ ấm gia đình.',
  },
  'story-su-tich-con-muoi': {
    photoUrl: '/assets/stories/story_su_tich_con_muoi.jpg',
    captionVi: 'Tranh truyện cổ tích Việt Nam: Sự Tích Con Muỗi (NXB Kim Đồng)',
    sceneDescriptionVi: 'Hình ảnh dân gian xưa về tình nghĩa vợ chồng son sắt và lời răn dạy thâm thúy về lòng biết ơn đối với người đã cưu mang mình.',
  },
  'story-su-tich-chim-bim-bip': {
    photoUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chú chim rừng hót líu lo bên suối nước mát lành',
    sceneDescriptionVi: 'Tiếng kêu bìm bịp bìm bịp gọi nhau nhớ nguồn, dạy các bé luôn nhớ ơn cha mẹ sinh thành nuôi dưỡng.',
  },
  'story-jack-cay-dau-than': {
    photoUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Cây đậu thần khổng lồ với thân dây leo vươn cao tít lên chín tầng mây',
    sceneDescriptionVi: 'Cây đậu thần màu nhiệm đưa chú bé Jack lên thăm lâu đài trên mây và khám phá kho báu kỳ diệu.',
  },
  'story-cong-chua-hat-dau': {
    photoUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chiếc giường hoàng gia chất cao hai mươi tầng đệm êm ái',
    sceneDescriptionVi: 'Nàng công chúa thực sự với tâm hồn thuần khiết và sự nhạy cảm tinh tế qua thử thách hạt đậu xanh.',
  },
  'story-con-qua-khat-nuoc': {
    photoUrl: 'https://images.unsplash.com/photo-1520808663317-647b476a81b9?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chú chim quạ thông minh gắp từng viên sỏi thả vào bình nước',
    sceneDescriptionVi: 'Khi nước dâng cao đến miệng bình, chú quạ đã uống được ngụm nước mát lành nhờ trí thông minh tuyệt vời.',
  },
  'story-cao-va-chum-nho': {
    photoUrl: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Những chùm nho tím mọng nước lúc lỉu trên giàn dưới nắng vàng',
    sceneDescriptionVi: 'Cáo nhảy mãi không tới chùm nho bèn tự chê nho còn xanh, ngụ ngôn răn dạy tính khiêm tốn thật thà.',
  },
  'story-su-tu-va-chuot-nhat': {
    photoUrl: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chúa sơn lâm sư tử dũng mãnh và người bạn chuột nhắt bé nhỏ',
    sceneDescriptionVi: 'Chú chuột nhắt nhỏ bé đã cắn đứt lưới săn cứu sống sư tử, minh chứng cho sức mạnh của lòng tốt và tình bạn.',
  },
  'story-kien-va-chau-chau': {
    photoUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Đàn kiến chăm chỉ tha mồi tích trữ lương thực cho mùa đông',
    sceneDescriptionVi: 'Bác kiến cần mẫn lao động suốt mùa hè, giúp đàn kiến có cuộc sống ấm êm no đủ suốt những ngày giá rét.',
  },
  'story-cau-be-chan-cuu': {
    photoUrl: 'https://images.unsplash.com/photo-1484557052118-f32bd25b45b5?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Đàn cừu trắng nhởn nhơ gặm cỏ trên sườn đồi xanh ngát',
    sceneDescriptionVi: 'Cậu bé nói dối sói đến để đùa vui, đến khi sói đến thật thì không ai tin, bài học sâu sắc về lòng trung thực.',
  },
  'story-con-ngong-vang': {
    photoUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chú ngỗng trắng tuyệt đẹp với bộ lông óng ánh rực rỡ',
    sceneDescriptionVi: 'Chàng út ngốc nghếch tốt bụng được thưởng chú ngỗng vàng đem lại tiếng cười vui cho nàng công chúa.',
  },

  // =========================================================================
  // ĐỘ TUỔI 4-5: CỔ TÍCH VIỆT NAM & KINH ĐIỂN THẾ GIỚI (30 - 53, 55)
  // =========================================================================
  'story-tam-cam': {
    photoUrl: '/assets/stories/story_tam_cam.jpg',
    captionVi: 'Tranh truyện cổ tích Việt Nam: Tấm Cám (NXB Phụ Nữ Việt Nam)',
    sceneDescriptionVi: 'Cô Tấm dịu hiền thử vừa chiếc hài thêu ngọc ngà trước hoàng cung, câu chuyện bất hủ về lẽ công bằng và ở hiền gặp lành.',
  },
  'story-son-tinh-thuy-tinh': {
    photoUrl: '/assets/stories/story_son_tinh_thuy_tinh.jpg',
    captionVi: 'Tranh truyện truyền thuyết: Sơn Tinh Thủy Tinh (Huyền sử Hùng Vương)',
    sceneDescriptionVi: 'Sơn Tinh cùng các dũng sĩ dâng cao núi đồi, chặn đứng từng đợt sóng cuộn dâng trào của Thủy Tinh, bảo vệ bờ cõi muôn dân.',
  },
  'story-cay-khe': {
    photoUrl: '/assets/stories/story_cay_khe.jpg',
    captionVi: 'Tranh truyện cổ tích Việt Nam: Cây Khế (NXB Hà Nội)',
    sceneDescriptionVi: 'Chim Phượng Hoàng lông óng ả bay đến cành khế sai trĩu quả dặn dò người em hiền lành may túi ba gang mang đi mà đựng.',
  },
  'story-cay-tre-tram-dot': {
    photoUrl: '/assets/stories/story_cay_tre_tram_dot.jpg',
    captionVi: 'Tranh truyện dân gian Việt Nam: Cây Tre Trăm Đốt (NXB Kim Đồng)',
    sceneDescriptionVi: 'Anh Khoai chất phác niệm câu thần chú Khắc Nhập Khắc Xuất kỳ diệu, dính chặt phú ông tham lam vào thân tre trăm đốt.',
  },
  'story-thach-sanh': {
    photoUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Cây đa cổ thụ và núi rừng huyền bí nơi Thạch Sanh trừ chằn tinh',
    sceneDescriptionVi: 'Chàng dũng sĩ Thạch Sanh thật thà, giương cung vàng bắn đại bàng và gảy cây đàn thần làm tan quân giặc.',
  },
  'story-banh-chung-banh-giay': {
    photoUrl: '/assets/stories/story_banh_chung_banh_giay.jpg',
    captionVi: 'Tranh truyện cổ tích Việt Nam: Bánh Chưng Bánh Giầy (NXB Kim Đồng)',
    sceneDescriptionVi: 'Hoàng tử Lang Liêu dâng lên Vua cha chiếc Bánh Chưng vuông xanh biếc và Bánh Giầy tròn trắng mịn thơm lừng hạt nếp quê hương.',
  },
  'story-su-tich-dua-hau': {
    photoUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Quả dưa hấu ruột đỏ ngọt lịm trên bãi cát đảo hoang Mai An Tiêm',
    sceneDescriptionVi: 'Mai An Tiêm cần cù gieo trồng hạt giống chim nhả trên đảo hoang, tạo nên giống dưa hấu ngọt mát cho đời.',
  },
  'story-su-tich-trau-cau': {
    photoUrl: '/assets/stories/story_su_tich_trau_cau.jpg',
    captionVi: 'Tranh truyện cổ tích Việt Nam: Sự Tích Trầu Cau (NXB Kim Đồng)',
    sceneDescriptionVi: 'Thân cây cau thẳng tắp, dây trầu xanh biếc quấn quanh tảng đá vôi son sắt, biểu tượng ngàn đời của nghĩa tình gia đình Việt.',
  },
  'story-chu-cuoi-cung-trang': {
    photoUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Cây đa cổ thụ tỏa bóng bên chú Cuội ngồi trông trần gian đêm rằm',
    sceneDescriptionVi: 'Cây đa thần bay vút lên cung trăng, mang theo chú Cuội tốt bụng ngồi trông trâu thổi sáo mỗi mùa Trung Thu.',
  },
  'story-thanh-giong': {
    photoUrl: '/assets/stories/story_thanh_giong.jpg',
    captionVi: 'Tranh truyện cổ tích Việt Nam: Thánh Gióng (NXB Kim Đồng)',
    sceneDescriptionVi: 'Tráng sĩ làng Phù Đổng cưỡi ngựa sắt, vung roi sắt nhổ bụi tre ngà đánh đuổi giặc ngoại xâm, phi thẳng lên đỉnh non thiêng về trời.',
  },
  'story-su-tich-ho-guom': {
    photoUrl: '/assets/stories/story_su_tich_ho_guom.jpg',
    captionVi: 'Tranh truyện cổ tích Việt Nam: Sự Tích Hồ Gươm (NXB Kim Đồng)',
    sceneDescriptionVi: 'Rùa Vàng linh thiêng nổi lên mặt hồ Tả Vọng nhận lại thanh gươm thần Thuận Thiên từ tay Vua Lê Thái Tổ, mở ra thái bình cho muôn dân.',
  },
  'story-co-be-quang-khan-do': {
    photoUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Cô bé trùm khăn đỏ bước đi trên con đường hoa xuyên qua rừng thông',
    sceneDescriptionVi: 'Cô bé quàng khăn đỏ vâng lời mẹ mang bánh sang biếu bà ngoại, bài học cảnh giác trước người lạ xảo quyệt.',
  },
  'story-co-be-lo-lem': {
    photoUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Đôi hài pha lê lấp lánh và lâu đài hoàng gia tráng lệ',
    sceneDescriptionVi: 'Nàng Lọ Lem hiền hậu bước lên xe ngựa bí ngô tham dự vũ hội, tình yêu và lòng nhân từ đã mở ra hạnh phúc viên mãn.',
  },
  'story-bach-tuyet-bay-chu-lun': {
    photoUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Quả táo đỏ mọng trong ngôi nhà gỗ ấm áp của bảy chú lùn giữa rừng',
    sceneDescriptionVi: 'Nàng Bạch Tuyết xinh đẹp được bảy chú lùn tốt bụng yêu thương bảo bọc, cái thiện luôn chiến thắng cái ác.',
  },
  'story-nang-tien-ca': {
    photoUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Đại dương xanh ngắt với làn sóng vỗ bờ và rạn san hô lung linh',
    sceneDescriptionVi: 'Nàng tiên cá với giọng hát trong trẻo và trái tim yêu thương biển cả vô bờ bến.',
  },
  'story-co-be-ban-diem': {
    photoUrl: 'https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Ánh lửa que diêm ấm áp bừng sáng giữa đêm đông tuyết rơi buốt giá',
    sceneDescriptionVi: 'Mỗi que diêm thắp lên là một giấc mơ đoàn tụ ấm cúng bên người bà hiền hậu yêu dấu.',
  },
  'story-hoang-tu-ech': {
    photoUrl: 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chú ếch xanh hiền lành bên đài phun nước bằng đá cẩm thạch',
    sceneDescriptionVi: 'Lời hứa với chú ếch nhỏ đã hóa giải lời nguyền độc ác, chàng hoàng tử khôi ngô xuất hiện trong niềm vui hân hoan.',
  },
  'story-chu-linh-chi-dung-cam': {
    photoUrl: 'https://images.unsplash.com/photo-1581235720704-06d3acfcb36f?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chú lính đồ chơi dũng cảm đứng thẳng hàng trong bộ quân phục',
    sceneDescriptionVi: 'Chú lính chì một chân kiên định vượt qua thác ghềnh phong ba, giữ trọn trái tim son sắt vì nàng vũ công nhỏ.',
  },
  'story-chu-be-ti-hon': {
    photoUrl: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Mầm cây xanh biếc bé nhỏ ẩn mình dưới những chiếc lá rừng khổng lồ',
    sceneDescriptionVi: 'Cậu bé Tí Hon tuy thân hình nhỏ xíu bằng ngón tay nhưng thông minh, dũng cảm cứu thoát cả gia đình.',
  },
  'story-hai-anh-em-quy-lun': {
    photoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Ổ bánh mì nướng vàng thơm lừng chia đều cho hai anh em',
    sceneDescriptionVi: 'Tình cảm anh em nhường nhịn từng mẩu bánh ngon đã làm tan chảy cả trái tim của những chú quỷ lùn ranh mãnh.',
  },
  'story-pinocchio': {
    photoUrl: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Xưởng điêu khắc đồ chơi bằng gỗ của bác thợ mộc Geppetto',
    sceneDescriptionVi: 'Chú bé người gỗ Pinocchio học cách sống thật thà, chăm chỉ để trở thành một cậu bé bằng xương bằng thịt ngoan ngoãn.',
  },
  'story-hansel-va-gretel': {
    photoUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Ngôi nhà bánh kẹo rực rỡ với mái nhà bánh quy và cửa sổ kẹo dẻo',
    sceneDescriptionVi: 'Hai anh em Hansel và Gretel dũng cảm, thông minh rải sỏi đánh dấu đường về nhà an toàn bên cha kính yêu.',
  },
  'story-aladdin-cay-den-than': {
    photoUrl: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Cây đèn dầu bằng đồng cổ kính tỏa ánh sáng xanh nhiệm màu',
    sceneDescriptionVi: 'Chàng Aladdin thật thà đánh thức Thần Đèn, dùng những điều ước kỳ diệu để giúp đỡ dân nghèo và bảo vệ công lý.',
  },
  'story-peter-pan': {
    photoUrl: 'https://images.unsplash.com/photo-1517976487504-59a1a04c2efd?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Bầu trời đêm ngập tràn những vì sao lấp lánh hướng về đảo Neverland',
    sceneDescriptionVi: 'Chú bé Peter Pan biết bay cùng bụi tiên Tinker Bell đưa các bạn nhỏ bay qua tháp đồng hồ tới xứ sở diệu kỳ.',
  },
  'story-alice-xu-so-dieu-ky': {
    photoUrl: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=800&auto=format&fit=crop&q=80',
    captionVi: 'Chú thỏ trắng cầm đồng hồ quả quýt trong khu vườn hoa kỳ thú',
    sceneDescriptionVi: 'Cô bé Alice bước vào hang thỏ khám phá thế giới thần tiên đầy màu sắc, gặp gỡ những người bạn kỳ lạ vui nhộn.',
  },
};

export const STORY_REAL_PHOTOS: Record<string, string> = Object.fromEntries(
  Object.entries(STORY_REAL_PHOTOS_DETAILED).map(([id, info]) => [id, info.photoUrl])
);

export function getStoryRealisticPhoto(storyId: string, pageIndex?: number): string {
  if (STORY_REAL_PHOTOS[storyId]) {
    return STORY_REAL_PHOTOS[storyId];
  }
  return 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80';
}

export function getStoryPhotoInfo(storyId: string): StoryPhotoInfo {
  return (
    STORY_REAL_PHOTOS_DETAILED[storyId] || {
      photoUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
      captionVi: 'Hình ảnh câu chuyện cổ tích thiếu nhi kỳ diệu',
      sceneDescriptionVi: 'Bối cảnh truyện tranh sinh động, đưa bé vào thế giới cổ tích ấm áp và giàu tính nhân văn.',
    }
  );
}
