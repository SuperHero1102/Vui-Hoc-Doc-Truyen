export interface DialogueLine {
  id: string;
  speakerVi: string;
  speakerEn: string;
  avatarEmoji: string;
  role: 'child' | 'adult' | 'friend';
  speechVi: string;
  speechEn: string;
  phoneticVi?: string;
  highlightTextVi?: string;
}

export interface SituationChallengeOption {
  id: string;
  emoji: string;
  textVi: string;
  textEn: string;
  isCorrect: boolean;
  feedbackVi: string;
  feedbackEn: string;
}

export interface DailyCommunicationSituation {
  id: string;
  order: number;
  titleVi: string;
  titleEn: string;
  category: 'school' | 'home' | 'public' | 'manners';
  categoryLabelVi: string;
  ageBadge: string;
  badgeEmoji: string;
  colorHex: string;
  bgGradient: string;
  scenicType:
    | 'school_gate'
    | 'home_leaving'
    | 'home_arriving'
    | 'market_scene'
    | 'supermarket_scene'
    | 'park_playground'
    | 'zoo_safari'
    | 'guest_greeting'
    | 'gift_receiving'
    | 'apology_scene';
  summaryVi: string;
  contextDescVi: string;
  contextDescEn: string;
  parentRealLifeTipVi: string;
  goldenRuleVi: string;
  dialogue: DialogueLine[];
  challenge: {
    questionVi: string;
    questionEn: string;
    options: SituationChallengeOption[];
  };
}

export const DAILY_COMMUNICATION_SITUATIONS: DailyCommunicationSituation[] = [
  // 1. Đến trường chào cô giáo
  {
    id: 'den-truong-chao-co',
    order: 1,
    titleVi: 'Đến trường chào cô giáo',
    titleEn: 'Greeting the Teacher at School',
    category: 'school',
    categoryLabelVi: 'Trường học · Lễ phép đầu ngày',
    ageBadge: '1–5 tuổi',
    badgeEmoji: '🏫',
    colorHex: '#3B82F6',
    bgGradient: 'from-blue-500 to-indigo-600',
    scenicType: 'school_gate',
    summaryVi: 'Bé mầm non tự tin khoanh hai tay cúi đầu chào cô giáo vào mỗi buổi sáng.',
    contextDescVi: 'Mỗi sáng khi bố mẹ đưa bé đến cổng trường mầm non, cô giáo tươi cười đứng đón các bé vào lớp.',
    contextDescEn: 'Every morning when parents take the child to kindergarten, the teacher warmly welcomes them at the gate.',
    parentRealLifeTipVi: 'Bố mẹ hãy làm gương cúi đầu chào cô giáo trước: "Chào cô Hoa ạ!". Bé quan sát thấy bố mẹ lễ phép sẽ học theo một cách tự nhiên và hào hứng.',
    goldenRuleVi: '✨ Quy tắc vàng: Khoanh hai tay trước ngực, mắt nhìn cô tươi cười và nói to rõ: "Con chào cô ạ!"',
    dialogue: [
      {
        id: 'd1-1',
        speakerVi: 'Cô giáo Hoa',
        speakerEn: 'Teacher Rose',
        avatarEmoji: '👩‍🏫',
        role: 'adult',
        speechVi: 'Chào con yêu! Chào mừng con đến lớp mầm non vui vẻ!',
        speechEn: 'Good morning sweetheart! Welcome to our happy class!',
        phoneticVi: 'Gút mo-ninh!',
      },
      {
        id: 'd1-2',
        speakerVi: 'Bé yêu',
        speakerEn: 'Polite Child',
        avatarEmoji: '👧',
        role: 'child',
        speechVi: 'Con chào cô giáo ạ! Con chúc cô buổi sáng vui vẻ ạ!',
        speechEn: 'Good morning teacher! Have a wonderful day!',
        highlightTextVi: 'Con chào cô giáo ạ!',
      },
      {
        id: 'd1-3',
        speakerVi: 'Cô giáo Hoa',
        speakerEn: 'Teacher Rose',
        avatarEmoji: '👩‍🏫',
        role: 'adult',
        speechVi: 'Bé ngoan lắm! Mời con vào lớp cùng chơi với các bạn nhé!',
        speechEn: 'You are so polite! Come in and play with your friends!',
      },
    ],
    challenge: {
      questionVi: 'Khi bước đến cổng trường gặp cô giáo đón, bé sẽ làm gì?',
      questionEn: 'When you arrive at school and see your teacher, what should you do?',
      options: [
        {
          id: 'opt-1-correct',
          emoji: '🙇',
          textVi: 'Khoanh hai tay lễ phép: "Con chào cô giáo ạ!"',
          textEn: 'Fold arms and say: "Good morning teacher!"',
          isCorrect: true,
          feedbackVi: 'Tuyệt vời lắm! Bé khoanh tay chào cô rất lễ phép và đáng yêu!',
          feedbackEn: 'Wonderful! You are so polite and well-mannered!',
        },
        {
          id: 'opt-1-wrong',
          emoji: '🏃',
          textVi: 'Không nói gì và chạy ào thẳng vào sân trường',
          textEn: 'Run inside without saying anything',
          isCorrect: false,
          feedbackVi: 'Chưa đúng rồi! Bé nhớ dừng lại một chút khoanh tay chào cô nhé!',
          feedbackEn: 'Not quite! Remember to pause and greet your teacher first!',
        },
      ],
    },
  },

  // 2. Chào bố mẹ trước khi đi học
  {
    id: 'chao-bo-me-di-hoc',
    order: 2,
    titleVi: 'Đi học chào bố mẹ & ông bà',
    titleEn: 'Saying Goodbye to Parents & Grandparents',
    category: 'home',
    categoryLabelVi: 'Gia đình · Đi thưa về gửi',
    ageBadge: '1–5 tuổi',
    badgeEmoji: '🎒',
    colorHex: '#10B981',
    bgGradient: 'from-emerald-500 to-teal-600',
    scenicType: 'home_leaving',
    summaryVi: 'Bé chuẩn bị đeo ba lô đi học, khoanh tay chào tạm biệt ông bà và bố mẹ ở nhà.',
    contextDescVi: 'Trời sáng bừng ấm áp, ba lô đã chuẩn bị sẵn sàng, bé chào tạm biệt người thân để bước ra xe tới trường.',
    contextDescEn: 'The morning is bright, backpack is ready, the child says goodbye to family before heading out.',
    parentRealLifeTipVi: 'Thực hiện một động tác ôm âu yếm hoặc "đập tay may mắn" (high-five) kèm lời chúc "Chúc con đi học vui vẻ" giúp bé giảm cảm giác lo âu chia xa.',
    goldenRuleVi: '✨ Quy tắc vàng: "Đi thưa về gửi" - Luôn cất lời chào người thân trước khi bước ra khỏi cửa nhà.',
    dialogue: [
      {
        id: 'd2-1',
        speakerVi: 'Bố mẹ',
        speakerEn: 'Parents',
        avatarEmoji: '👨‍👩‍👧',
        role: 'adult',
        speechVi: 'Chúc con yêu một ngày ở trường thật ngoan và học nhiều điều bổ ích nhé!',
        speechEn: 'Have a joyful day at school and learn fun new things, sweetheart!',
      },
      {
        id: 'd2-2',
        speakerVi: 'Bé yêu',
        speakerEn: 'Little Hero',
        avatarEmoji: '👦',
        role: 'child',
        speechVi: 'Dạ vâng ạ! Con chào bố mẹ, con đi học ạ!',
        speechEn: 'Goodbye Mommy and Daddy! I am going to school now!',
        highlightTextVi: 'Con chào bố mẹ con đi học ạ!',
      },
    ],
    challenge: {
      questionVi: 'Trước khi bước chân ra cửa đi học, bé nên nói câu gì với bố mẹ?',
      questionEn: 'Before stepping out the door for school, what should you say?',
      options: [
        {
          id: 'opt-2-correct',
          emoji: '🎒',
          textVi: 'Dạ con chào bố mẹ, con đi học ạ!',
          textEn: 'Goodbye Mommy and Daddy, see you soon!',
          isCorrect: true,
          feedbackVi: 'Đúng rồi! Bé là em bé ngoan biết đi thưa về gửi!',
          feedbackEn: 'Correct! You are a wonderful polite child!',
        },
        {
          id: 'opt-2-wrong',
          emoji: '🙈',
          textVi: 'Lặng lẽ xách ba lô đi thẳng không chào ai',
          textEn: 'Walk away silently without saying bye',
          isCorrect: false,
          feedbackVi: 'Bé ơi, hãy cất tiếng chào để bố mẹ yên tâm và mỉm cười nhé!',
          feedbackEn: 'Remember to always say goodbye with a cheerful voice!',
        },
      ],
    },
  },

  // 3. Tan học về nhà chào bố mẹ & ông bà
  {
    id: 've-nha-chao-gia-dinh',
    order: 3,
    titleVi: 'Đi học về chào bố mẹ & ông bà',
    titleEn: 'Arriving Home and Greeting Family',
    category: 'home',
    categoryLabelVi: 'Gia đình · Ấm áp sum họp',
    ageBadge: '1–5 tuổi',
    badgeEmoji: '🏡',
    colorHex: '#F59E0B',
    bgGradient: 'from-amber-500 to-orange-600',
    scenicType: 'home_arriving',
    summaryVi: 'Tan học về đến nhà, bé tháo giày ngay ngắn và tươi cười chào cả nhà.',
    contextDescVi: 'Cánh cửa mở ra, mùi cơm chiều thơm phức từ bếp. Bé về đến nhà ấm êm sau một ngày khám phá ở trường.',
    contextDescEn: 'The door opens to the warm smell of dinner. The child returns home happily after a fun school day.',
    parentRealLifeTipVi: 'Khi bé về nhà chào hỏi, bố mẹ hãy dừng việc đang làm một chút, nhìn vào mắt con và mỉm cười đón nhận bằng cái ôm ấm áp.',
    goldenRuleVi: '✨ Quy tắc vàng: Cởi giày dép gọn gàng lên giá rồi mới khoanh tay chào: "Con mới đi học về ạ!"',
    dialogue: [
      {
        id: 'd3-1',
        speakerVi: 'Bé yêu',
        speakerEn: 'Sweet Child',
        avatarEmoji: '👧',
        role: 'child',
        speechVi: 'Con chào ông bà, con chào bố mẹ! Con mới đi học về ạ!',
        speechEn: 'Hello Grandpa and Grandma, hello Mommy and Daddy! I am home!',
        highlightTextVi: 'Con mới đi học về ạ!',
      },
      {
        id: 'd3-2',
        speakerVi: 'Bà ngoại',
        speakerEn: 'Grandma',
        avatarEmoji: '👵',
        role: 'adult',
        speechVi: 'Ôi bé Bông của bà về rồi! Hôm nay ở lớp cháu có vui không nào?',
        speechEn: 'My dear grandchild is back! Did you have fun at school today?',
      },
    ],
    challenge: {
      questionVi: 'Vừa bước vào nhà sau buổi học mầm non, bé làm gì đầu tiên?',
      questionEn: 'When arriving home from kindergarten, what should you do first?',
      options: [
        {
          id: 'opt-3-correct',
          emoji: '👟',
          textVi: 'Để dép lên kệ ngay ngắn và cất tiếng chào cả nhà',
          textEn: 'Put shoes neatly and greet family warmly',
          isCorrect: true,
          feedbackVi: 'Chính xác! Bé vừa gọn gàng ngăn nắp vừa lễ phép hiếu thảo!',
          feedbackEn: 'Spot on! You are so tidy and polite!',
        },
        {
          id: 'opt-3-wrong',
          emoji: '🛋️',
          textVi: 'Ném ba lô xuống sàn và nhảy tót lên ghế sofa',
          textEn: 'Drop bag on the floor and jump on the sofa',
          isCorrect: false,
          feedbackVi: 'Cần sửa lại nhé: Bé hãy để giày dép đúng chỗ và chào ông bà trước nha!',
          feedbackEn: 'Tidy up your shoes first and greet family warmly!',
        },
      ],
    },
  },

  // 4. Đi chợ cùng mẹ - Gặp người lớn chào hỏi
  {
    id: 'di-cho-gap-nguoi-quen',
    order: 4,
    titleVi: 'Đi chợ cùng mẹ · Chào hỏi người quen',
    titleEn: 'At the Market · Greeting Neighbors',
    category: 'public',
    categoryLabelVi: 'Xã hội · Giao tiếp thân thiện',
    ageBadge: '1–5 tuổi',
    badgeEmoji: '🧺',
    colorHex: '#EC4899',
    bgGradient: 'from-pink-500 to-rose-600',
    scenicType: 'market_scene',
    summaryVi: 'Bé cùng mẹ đi chợ rau quả, gặp các bác hàng xóm thân thiện và biết chào hỏi niềm nở.',
    contextDescVi: 'Khu chợ quê rực rỡ sắc hoa quả tươi ngon, mọi người mua sắm tấp nập. Bé gặp bác bán hàng xóm.',
    contextDescEn: 'A vibrant local market filled with fresh fruits and friendly neighbors shopping together.',
    parentRealLifeTipVi: 'Dạy con nhận biết các danh xưng lễ phép trong tiếng Việt: Bác, Chú, Cô, Dì. Khen ngợi ngay khi con tự tin cất tiếng chào người lớn.',
    goldenRuleVi: '✨ Quy tắc vàng: Mỉm cười thân thiện, đứng cạnh bố mẹ và cất tiếng chào: "Cháu chào bác ạ!"',
    dialogue: [
      {
        id: 'd4-1',
        speakerVi: 'Bác bán hoa quả',
        speakerEn: 'Fruit Seller Auntie',
        avatarEmoji: '🍎',
        role: 'adult',
        speechVi: 'Chào hai mẹ con! Hôm nay bé đi chợ cùng mẹ trông nhanh nhẹn và đáng yêu quá!',
        speechEn: 'Hello both of you! You look so bright and helpful shopping with mommy today!',
      },
      {
        id: 'd4-2',
        speakerVi: 'Bé yêu',
        speakerEn: 'Little Helper',
        avatarEmoji: '👦',
        role: 'child',
        speechVi: 'Cháu chào bác ạ! Cháu chúc bác bán đắt hàng ạ!',
        speechEn: 'Good morning auntie! Nice to see you today!',
        highlightTextVi: 'Cháu chào bác ạ!',
      },
    ],
    challenge: {
      questionVi: 'Khi đi chợ cùng mẹ và gặp bác hàng xóm chào mình, bé nên làm gì?',
      questionEn: 'When shopping with mom and a friendly neighbor greets you, what do you do?',
      options: [
        {
          id: 'opt-4-correct',
          emoji: '😊',
          textVi: 'Mỉm cười, khoanh tay: "Cháu chào bác ạ!"',
          textEn: 'Smile and say: "Good morning auntie!"',
          isCorrect: true,
          feedbackVi: 'Bé ngoan tuyệt vời! Bác hàng xóm khen ngợi bé hết lời đấy!',
          feedbackEn: 'Awesome! Everyone loves a polite, smiling child!',
        },
        {
          id: 'opt-4-wrong',
          emoji: '🙈',
          textVi: 'Núp sau lưng mẹ, bịt tai không chịu nói gì',
          textEn: 'Hide behind mom and stay silent',
          isCorrect: false,
          feedbackVi: 'Đừng ngại ngùng bé nhé! Bác hàng xóm rất yêu mến bé đấy!',
          feedbackEn: 'Do not be shy! Neighbors love to hear your sweet greeting!',
        },
      ],
    },
  },

  // 5. Đi siêu thị cùng bố mẹ
  {
    id: 'di-sieu-thi-cung-bo-me',
    order: 5,
    titleVi: 'Đi siêu thị cùng bố mẹ',
    titleEn: 'At the Supermarket with Parents',
    category: 'public',
    categoryLabelVi: 'Nơi công cộng · Lễ phép & Kiên nhẫn',
    ageBadge: '1–5 tuổi',
    badgeEmoji: '🛒',
    colorHex: '#8B5CF6',
    bgGradient: 'from-purple-500 to-indigo-600',
    scenicType: 'supermarket_scene',
    summaryVi: 'Bé đi siêu thị văn minh: biết xin phép trước khi lấy đồ và cảm ơn cô thu ngân.',
    contextDescVi: 'Siêu thị mát rượi có xe đẩy chở đầy ắp hàng hóa. Bé muốn xin mẹ một hộp sữa chua dâu ngọt lành.',
    contextDescEn: 'A bright modern supermarket with shopping carts. The child wants to ask mom for a fruit yogurt.',
    parentRealLifeTipVi: 'Dạy bé kỹ năng xin phép "Mẹ ơi con có thể... không ạ?" thay vì tự ý giật đồ trên kệ hoặc vòi vĩnh.',
    goldenRuleVi: '✨ Quy tắc vàng: Luôn hỏi ý kiến bố mẹ bằng hai từ "xin phép" và nói lời "cảm ơn" cô thu ngân.',
    dialogue: [
      {
        id: 'd5-1',
        speakerVi: 'Bé yêu',
        speakerEn: 'Little Shopper',
        avatarEmoji: '👧',
        role: 'child',
        speechVi: 'Mẹ ơi, con xin phép chọn hộp sữa chua dâu tây này được không ạ?',
        speechEn: 'Mommy, may I please choose this strawberry yogurt?',
        highlightTextVi: 'Con xin phép...',
      },
      {
        id: 'd5-2',
        speakerVi: 'Mẹ yêu',
        speakerEn: 'Mommy',
        avatarEmoji: '👩',
        role: 'adult',
        speechVi: 'Được chứ con yêu! Con biết xin phép mẹ rất lễ phép, mẹ thưởng cho con nhé!',
        speechEn: 'Of course, sweetheart! You asked so politely, mommy is very happy!',
      },
      {
        id: 'd5-3',
        speakerVi: 'Cô thu ngân',
        speakerEn: 'Cashier',
        avatarEmoji: '💳',
        role: 'adult',
        speechVi: 'Cô gửi bé túi đồ nhé! Chúc bé ăn ngon miệng!',
        speechEn: 'Here is your shopping bag! Enjoy your treat!',
      },
      {
        id: 'd5-4',
        speakerVi: 'Bé yêu',
        speakerEn: 'Little Shopper',
        avatarEmoji: '👧',
        role: 'child',
        speechVi: 'Cháu cảm ơn cô ạ!',
        speechEn: 'Thank you very much!',
      },
    ],
    challenge: {
      questionVi: 'Khi muốn mua một món đồ trong siêu thị, bé làm thế nào cho đúng?',
      questionEn: 'When you want an item in the supermarket, what is the right way to ask?',
      options: [
        {
          id: 'opt-5-correct',
          emoji: '🍓',
          textVi: 'Hỏi mẹ lễ phép: "Mẹ ơi con xin phép lấy món này được không ạ?"',
          textEn: 'Ask politely: "Mommy, may I please pick this?"',
          isCorrect: true,
          feedbackVi: 'Rất thông minh! Bé biết xin phép đàng hoàng, bố mẹ rất tự hào!',
          feedbackEn: 'Brilliant! Asking politely makes parents proud and happy!',
        },
        {
          id: 'opt-5-wrong',
          emoji: '🛒',
          textVi: 'Tự tiện xé vỏ hộp bánh ăn ngay khi chưa tính tiền',
          textEn: 'Tear open the snack box before paying',
          isCorrect: false,
          feedbackVi: 'Không nên nhé! Phải mang đồ ra quầy thu ngân tính tiền trước bé nha!',
          feedbackEn: 'Never open packaging before paying at the counter!',
        },
      ],
    },
  },

  // 6. Đi công viên cùng bố mẹ - Chơi chung & Xếp hàng
  {
    id: 'di-cong-vien-choi-chung',
    order: 6,
    titleVi: 'Đi công viên cùng bố mẹ · Kết bạn & Xếp hàng',
    titleEn: 'At the Park · Making Friends & Taking Turns',
    category: 'public',
    categoryLabelVi: 'Vui chơi · Nhường nhịn & Hòa đồng',
    ageBadge: '1–5 tuổi',
    badgeEmoji: '🎡',
    colorHex: '#06B6D4',
    bgGradient: 'from-cyan-500 to-blue-600',
    scenicType: 'park_playground',
    summaryVi: 'Bé vui chơi ở công viên: xếp hàng trượt cầu trượt, rủ bạn chơi chung và nói xin lỗi nếu vô tình va vào bạn.',
    contextDescVi: 'Công viên rợp bóng cây xanh có cầu trượt liên hoàn, xích đu và bập bênh với rất nhiều bạn nhỏ.',
    contextDescEn: 'A green playground with slides, swings, and seesaws where lots of happy children are playing.',
    parentRealLifeTipVi: 'Dạy con khái niệm "thay phiên nhau" (take turns) và "xếp hàng chờ tới lượt". Đây là nền tảng trí tuệ cảm xúc (EQ) quan trọng nhất.',
    goldenRuleVi: '✨ Quy tắc vàng: Chờ đến lượt, rủ bạn chơi cùng: "Chào bạn, mình cùng chơi nhé!" và nói "Xin lỗi" nếu va chạm.',
    dialogue: [
      {
        id: 'd6-1',
        speakerVi: 'Bé yêu',
        speakerEn: 'Friendly Child',
        avatarEmoji: '👦',
        role: 'child',
        speechVi: 'Chào bạn! Mình có thể chơi cầu trượt cùng bạn được không?',
        speechEn: 'Hello! Would you like to slide with me?',
        highlightTextVi: 'Mình cùng chơi nhé!',
      },
      {
        id: 'd6-2',
        speakerVi: 'Bạn nhỏ',
        speakerEn: 'Little Friend',
        avatarEmoji: '🧒',
        role: 'friend',
        speechVi: 'Được chứ! Chúng mình cùng xếp hàng lần lượt trượt nhé!',
        speechEn: 'Yes! Let us take turns sliding down!',
      },
    ],
    challenge: {
      questionVi: 'Khi thấy nhiều bạn đang đợi chơi xích đu ở công viên, bé nên làm gì?',
      questionEn: 'When there is a line for the swings at the playground, what should you do?',
      options: [
        {
          id: 'opt-6-correct',
          emoji: '🤝',
          textVi: 'Vui vẻ xếp hàng theo thứ tự và chờ đến lượt mình',
          textEn: 'Wait patiently in line for your turn',
          isCorrect: true,
          feedbackVi: 'Đúng chuẩn bé ngoan văn minh! Mọi người đều yêu quý bé!',
          feedbackEn: 'Well done! Patient and fair children are loved by everyone!',
        },
        {
          id: 'opt-6-wrong',
          emoji: '😤',
          textVi: 'Chen ngang và đẩy bạn khác ra để giành xích đu',
          textEn: 'Push ahead and grab the swing from others',
          isCorrect: false,
          feedbackVi: 'Chen lấn rất nguy hiểm! Bé hãy kiên nhẫn xếp hàng nhé!',
          feedbackEn: 'Pushing is unsafe! Always wait politely for your turn.',
        },
      ],
    },
  },

  // 7. Đi du lịch sở thú cùng bố mẹ
  {
    id: 'du-lich-so-thu-cung-bo-me',
    order: 7,
    titleVi: 'Đi du lịch sở thú cùng bố mẹ',
    titleEn: 'Visiting the Zoo with Parents',
    category: 'public',
    categoryLabelVi: 'Khám phá · Tuân thủ an toàn',
    ageBadge: '1–5 tuổi',
    badgeEmoji: '🦒',
    colorHex: '#14B8A6',
    bgGradient: 'from-teal-500 to-emerald-600',
    scenicType: 'zoo_safari',
    summaryVi: 'Bé khám phá thế giới động vật: luôn nắm tay bố mẹ, tuân thủ biển báo và lễ phép chào chú nhân viên sở thú.',
    contextDescVi: 'Thế giới sở thú kỳ thú với những chú hươu cao cổ cao lớn, chú voi thổi kèn và đàn chim hồng hạc xinh đẹp.',
    contextDescEn: 'A magical zoo with tall giraffes, trumpeting elephants, and pink flamingos in the sunshine.',
    parentRealLifeTipVi: 'Nhắc nhở con luôn đi cạnh bố mẹ ở nơi đông người, tuyệt đối không tự ý cho động vật ăn thức ăn lạ.',
    goldenRuleVi: '✨ Quy tắc vàng: Nắm tay bố mẹ, quan sát các loài động vật từ khoảng cách an toàn và vâng lời chú hướng dẫn viên.',
    dialogue: [
      {
        id: 'd7-1',
        speakerVi: 'Bé yêu',
        speakerEn: 'Curious Child',
        avatarEmoji: '👧',
        role: 'child',
        speechVi: 'Bố mẹ ơi, nhìn kìa! Chú hươu cao cổ đang ăn lá cây trên cao kìa!',
        speechEn: 'Mommy, Daddy, look! The giraffe is eating leaves high up in the tree!',
      },
      {
        id: 'd7-2',
        speakerVi: 'Chú bảo tồn thú',
        speakerEn: 'Zookeeper',
        avatarEmoji: '🦁',
        role: 'adult',
        speechVi: 'Chào bé! Các bé nhớ đứng sau hàng rào an toàn và giữ yên tĩnh để ngắm bạn hươu nhé!',
        speechEn: 'Hello little ones! Please stay behind the safety railing and watch quietly!',
      },
      {
        id: 'd7-3',
        speakerVi: 'Bé yêu',
        speakerEn: 'Curious Child',
        avatarEmoji: '👧',
        role: 'child',
        speechVi: 'Dạ vâng ạ! Cháu cảm ơn chú đã nhắc nhở ạ!',
        speechEn: 'Yes sir! Thank you for reminding us!',
        highlightTextVi: 'Dạ vâng ạ!',
      },
    ],
    challenge: {
      questionVi: 'Khi đi tham quan sở thú đông người, hành động nào là an toàn và ngoan nhất?',
      questionEn: 'When visiting a crowded zoo, which action is safest and most polite?',
      options: [
        {
          id: 'opt-7-correct',
          emoji: '👨‍👩‍👧',
          textVi: 'Luôn nắm tay bố mẹ và đứng sau hàng rào an toàn',
          textEn: 'Hold parents\' hands and stay behind safety rails',
          isCorrect: true,
          feedbackVi: 'Tuyệt vời! Vừa an toàn cho bản thân vừa thể hiện bé biết vâng lời!',
          feedbackEn: 'Spot on! Safety first and always listen to instructions!',
        },
        {
          id: 'opt-7-wrong',
          emoji: '🐒',
          textVi: 'Tự ý trèo qua rào chắn ném túi nilon cho khỉ ăn',
          textEn: 'Climb over fences and throw plastic bags to monkeys',
          isCorrect: false,
          feedbackVi: 'Rất nguy hiểm! Thức ăn lạ có thể làm các con thú bị đau bụng đấy bé ơi!',
          feedbackEn: 'Very dangerous! Never climb barriers or feed wild animals.',
        },
      ],
    },
  },

  // 8. Khách đến chơi nhà - Lễ phép mời nước
  {
    id: 'khach-den-nha-moi-nuoc',
    order: 8,
    titleVi: 'Khách đến chơi nhà · Lễ phép mời nước',
    titleEn: 'Welcoming Guests · Offering Water Politely',
    category: 'manners',
    categoryLabelVi: 'Lễ giáo · Tiếp khách chu đáo',
    ageBadge: '1–5 tuổi',
    badgeEmoji: '🍵',
    colorHex: '#6366F1',
    bgGradient: 'from-indigo-500 to-purple-600',
    scenicType: 'guest_greeting',
    summaryVi: 'Khi có khách đến thăm nhà, bé niềm nở đón tiếp, bưng cốc nước bằng hai tay kính mời người lớn.',
    contextDescVi: 'Tiếng chuông cửa reo vang, bác đồng nghiệp thân thiết của bố đến chơi nhà.',
    contextDescEn: 'The doorbell chimes. A friendly guest visits the family at home.',
    parentRealLifeTipVi: 'Trước khi khách đến, mẹ có thể tập dượt cùng bé: cách bưng khay/cốc bằng hai tay, miệng mỉm cười nói: "Cháu mời bác uống nước ạ!".',
    goldenRuleVi: '✨ Quy tắc vàng: Bưng đồ mời người lớn bằng CẢ HAI TAY, đầu hơi cúi cung kính.',
    dialogue: [
      {
        id: 'd8-1',
        speakerVi: 'Bé yêu',
        speakerEn: 'Polite Host',
        avatarEmoji: '👦',
        role: 'child',
        speechVi: 'Cháu chào bác ạ! Cháu mời bác vào nhà chơi ạ!',
        speechEn: 'Hello uncle! Welcome to our house, please come in!',
        highlightTextVi: 'Cháu chào bác ạ!',
      },
      {
        id: 'd8-2',
        speakerVi: 'Bác khách',
        speakerEn: 'Visiting Guest',
        avatarEmoji: '👨‍💼',
        role: 'adult',
        speechVi: 'Bác chào con! Bé hôm nay trông ra dáng người lớn và hiếu khách quá!',
        speechEn: 'Hello sweetie! You are such a hospitable young child!',
      },
      {
        id: 'd8-3',
        speakerVi: 'Bé yêu',
        speakerEn: 'Polite Host',
        avatarEmoji: '👦',
        role: 'child',
        speechVi: 'Cháu mời bác uống nước mát ạ!',
        speechEn: 'Here is some fresh water for you, please enjoy!',
        highlightTextVi: 'Cháu mời bác uống nước ạ!',
      },
    ],
    challenge: {
      questionVi: 'Khi bưng cốc nước mời khách đến nhà, bé nên cầm như thế nào?',
      questionEn: 'When offering a glass of water to a guest, how should you hold it?',
      options: [
        {
          id: 'opt-8-correct',
          emoji: '🤲',
          textVi: 'Cầm cốc cẩn thận bằng CẢ HAI TAY và nói: "Cháu mời bác ạ!"',
          textEn: 'Hold carefully with BOTH HANDS and offer politely',
          isCorrect: true,
          feedbackVi: 'Bé ngoan tuyệt đối! Người lớn ai cũng khen bé được dạy dỗ chu đáo!',
          feedbackEn: 'Excellently done! Using both hands shows deep respect.',
        },
        {
          id: 'opt-8-wrong',
          emoji: '💧',
          textVi: 'Cầm một tay quăng mạnh cốc nước lên bàn làm bắn tung tóe',
          textEn: 'Toss the cup on the table with one hand splashing water',
          isCorrect: false,
          feedbackVi: 'Nhớ dùng cả hai tay bưng thật cẩn thận để không làm đổ nước bé nhé!',
          feedbackEn: 'Always use both hands gently to avoid spills and show respect.',
        },
      ],
    },
  },

  // 9. Bé nhận quà - Biết nói lời cảm ơn
  {
    id: 'nhan-qua-noi-cam-on',
    order: 9,
    titleVi: 'Bé nhận quà · Biết nói lời cảm ơn',
    titleEn: 'Receiving Gifts · Saying Thank You',
    category: 'manners',
    categoryLabelVi: 'Biết ơn · Tôn trọng & Trân trọng',
    ageBadge: '1–5 tuổi',
    badgeEmoji: '🎁',
    colorHex: '#E11D48',
    bgGradient: 'from-rose-600 to-pink-700',
    scenicType: 'gift_receiving',
    summaryVi: 'Khi được người lớn tặng quà hay bánh kẹo, bé đưa hai tay đón nhận và cảm ơn chân thành.',
    contextDescVi: 'Bà ngoại sang chơi mang tặng bé một chiếc hộp quà xinh xắn buộc nơ đỏ rực rỡ.',
    contextDescEn: 'Grandma visits with a beautifully wrapped gift with a shiny red ribbon for the child.',
    parentRealLifeTipVi: 'Dạy con trân trọng tình cảm của người tặng quà hơn giá trị món đồ. Luôn nói cảm ơn ngay trước khi mở quà.',
    goldenRuleVi: '✨ Quy tắc vàng: "Cháu cảm ơn bà ạ!" - Đón quà bằng hai tay và nở nụ cười biết ơn.',
    dialogue: [
      {
        id: 'd9-1',
        speakerVi: 'Bà ngoại',
        speakerEn: 'Grandma',
        avatarEmoji: '👵',
        role: 'adult',
        speechVi: 'Bà có hộp bánh quy ngon tặng em bé ngoan ngoãn của bà này!',
        speechEn: 'Here is a box of yummy cookies for my sweetest grandchild!',
      },
      {
        id: 'd9-2',
        speakerVi: 'Bé yêu',
        speakerEn: 'Grateful Child',
        avatarEmoji: '👧',
        role: 'child',
        speechVi: 'Cháu cảm ơn bà nhiều lắm ạ! Cháu xin bà bằng hai tay ạ!',
        speechEn: 'Thank you so much Grandma! I receive it with both hands!',
        highlightTextVi: 'Cháu cảm ơn bà ạ!',
      },
    ],
    challenge: {
      questionVi: 'Khi được ông bà hoặc cô chú trao quà, bé sẽ làm gì để bày tỏ lòng biết ơn?',
      questionEn: 'When grandparents or relatives give you a present, what do you do?',
      options: [
        {
          id: 'opt-9-correct',
          emoji: '🎁',
          textVi: 'Đưa hai tay đón lấy và nói: "Cháu cảm ơn bà ạ!"',
          textEn: 'Receive with two hands and say: "Thank you so much!"',
          isCorrect: true,
          feedbackVi: 'Tuyệt vời! Bé biết nói lời cảm ơn làm ông bà vô cùng hạnh phúc!',
          feedbackEn: 'Splendid! Saying thank you warms everyone\'s heart!',
        },
        {
          id: 'opt-9-wrong',
          emoji: '😠',
          textVi: 'Giật lấy món quà rồi xé vỏ vội vàng không nói lời nào',
          textEn: 'Snatch the present and run away without a word',
          isCorrect: false,
          feedbackVi: 'Đừng vội bé ơi! Hãy đón quà bằng hai tay và cảm ơn người lớn trước nhé!',
          feedbackEn: 'Hold on! Always say thank you before opening your surprise.',
        },
      ],
    },
  },

  // 10. Lỡ làm đổ đồ - Dũng cảm xin lỗi
  {
    id: 'lo-lam-do-noi-xin-loi',
    order: 10,
    titleVi: 'Lỡ làm đổ đồ · Dũng cảm xin lỗi & sửa sai',
    titleEn: 'Making a Mistake · Sincere Apology',
    category: 'manners',
    categoryLabelVi: 'Trung thực · Dũng cảm nhận lỗi',
    ageBadge: '1–5 tuổi',
    badgeEmoji: '🤝',
    colorHex: '#059669',
    bgGradient: 'from-emerald-600 to-green-700',
    scenicType: 'apology_scene',
    summaryVi: 'Khi vô tình làm đổ nước hay đồ chơi, bé không giấu diếm mà dũng cảm nhận lỗi và nói xin lỗi.',
    contextDescVi: 'Bé đang chạy chơi trong phòng khách thì chạm phải cốc nước trên bàn làm nước đổ ra thảm.',
    contextDescEn: 'While playing in the living room, the child accidentally bumps a cup and spills water.',
    parentRealLifeTipVi: 'Khi con lỡ làm đổ vỡ, phụ huynh hãy giữ bình tĩnh, tránh quát mắng làm con sợ hãi giấu lỗi. Hãy khen ngợi sự trung thực của con khi con dũng cảm xin lỗi và cùng con dọn dẹp.',
    goldenRuleVi: '✨ Quy tắc vàng: Nhìn thẳng vào mắt mẹ, khoanh tay nhận lỗi: "Con xin lỗi mẹ ạ, con sẽ cẩn thận hơn!"',
    dialogue: [
      {
        id: 'd10-1',
        speakerVi: 'Bé yêu',
        speakerEn: 'Brave Child',
        avatarEmoji: '👦',
        role: 'child',
        speechVi: 'Con xin lỗi mẹ ạ! Con lỡ tay làm đổ nước ra bàn, để con lấy khăn lau giúp mẹ nhé!',
        speechEn: 'I am so sorry Mommy! I accidentally spilled the water, let me help you wipe it up!',
        highlightTextVi: 'Con xin lỗi mẹ ạ!',
      },
      {
        id: 'd10-2',
        speakerVi: 'Mẹ yêu',
        speakerEn: 'Gentle Mommy',
        avatarEmoji: '👩',
        role: 'adult',
        speechVi: 'Không sao đâu con! Biết dũng cảm nhận lỗi và giúp mẹ dọn dẹp là con rất ngoan!',
        speechEn: 'It is alright sweetheart! Being honest and helping clean up makes you a champion!',
      },
    ],
    challenge: {
      questionVi: 'Khi lỡ làm đổ nước hoặc làm rơi đồ vật của người khác, bé nên nói câu gì?',
      questionEn: 'If you accidentally spill water or drop someone\'s toy, what should you say?',
      options: [
        {
          id: 'opt-10-correct',
          emoji: '🙇‍♂️',
          textVi: 'Dạ con xin lỗi ạ, con sẽ cẩn thận hơn và giúp dọn dẹp!',
          textEn: 'I am so sorry! I will be more careful and help clean up.',
          isCorrect: true,
          feedbackVi: 'Bé vô cùng dũng cảm và trung thực! Biết nhận lỗi là đức tính cao đẹp nhất!',
          feedbackEn: 'You are so brave and honest! Saying sorry is a superpower!',
        },
        {
          id: 'opt-10-wrong',
          emoji: '🙈',
          textVi: 'Đổ thừa cho chú mèo làm rồi bỏ chạy đi chỗ khác',
          textEn: 'Blame the cat and run away',
          isCorrect: false,
          feedbackVi: 'Không được nói dối bé nhé! Hãy trung thực nhận lỗi và xin lỗi ba mẹ nha!',
          feedbackEn: 'Never lie or blame others! Be brave and speak the truth.',
        },
      ],
    },
  },
];
