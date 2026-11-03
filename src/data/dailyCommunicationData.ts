export type SpeakerRole =
  | 'child'
  | 'teacher'
  | 'mom'
  | 'dad'
  | 'grandpa'
  | 'grandma'
  | 'friend'
  | 'guest';

export interface DialogueLine {
  id: string;
  speaker: string;
  role: SpeakerRole;
  avatar: string;
  en: string; // Tối đa 6 từ
  vi: string; // Tối đa 8 từ
}

export interface CommunicationCard {
  id: string;
  title: string;
  img: string;
  isNegative?: boolean;
  correctiveTipVi?: string; // Lời nhắc sửa sai nhẹ nhàng cho thẻ không nên làm
  lines: DialogueLine[];
}

export interface SituationQuizOption {
  id: string;
  icon: string;
  en: string;
  vi: string;
  isCorrect: boolean;
  feedbackEn: string;
  feedbackVi: string;
}

export interface SituationQuiz {
  questionEn: string;
  questionVi: string; // Tối đa 8 từ
  options: [SituationQuizOption, SituationQuizOption];
}

export interface CommunicationSituation {
  id: string;
  index: number;
  shortName: string;
  titleVi: string;
  titleEn: string;
  icon3D: string;
  colorHex: string;
  goldenRuleVi: string; // Tối đa 10 từ
  parentTipVi: string; // Tối đa 15 từ
  doCards: [CommunicationCard, CommunicationCard, CommunicationCard]; // 3 thẻ Nên làm
  dontCards: [CommunicationCard, CommunicationCard]; // 2 thẻ Không nên làm
  quiz: SituationQuiz;
}

export const CHARACTER_AVATARS: Record<SpeakerRole, { nameVi: string; nameEn: string; emoji: string }> = {
  child: { nameVi: 'Bé Bông', nameEn: 'Be Bong', emoji: '👦' },
  teacher: { nameVi: 'Cô Hoa', nameEn: 'Teacher Rose', emoji: '👩‍🏫' },
  mom: { nameVi: 'Mẹ', nameEn: 'Mommy', emoji: '👩' },
  dad: { nameVi: 'Bố', nameEn: 'Daddy', emoji: '👨' },
  grandpa: { nameVi: 'Ông', nameEn: 'Grandpa', emoji: '👴' },
  grandma: { nameVi: 'Bà', nameEn: 'Grandma', emoji: '👵' },
  friend: { nameVi: 'Bạn Mi', nameEn: 'Friend Mi', emoji: '👧' },
  guest: { nameVi: 'Bác Khách', nameEn: 'Guest', emoji: '👨‍💼' },
};

export const COMMUNICATION_SITUATIONS: CommunicationSituation[] = [
  // 1. Đến trường chào cô giáo
  {
    id: 'den-truong-chao-co',
    index: 1,
    shortName: 'Chào cô giáo',
    titleVi: 'Đến trường chào cô giáo',
    titleEn: 'Greeting Teacher at School',
    icon3D: '🏫',
    colorHex: '#3B82F6',
    goldenRuleVi: 'Gặp cô, con khoanh tay chào ạ!',
    parentTipVi: 'Bố mẹ hãy chào cô trước để bé bắt chước tự nhiên.',
    doCards: [
      {
        id: 'c1_do_1',
        title: 'Khoanh tay chào cô',
        img: '/assets/communication/comm_1_do_1.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Good morning, teacher!',
            vi: 'Con chào cô giáo ạ!',
          },
          {
            id: 'l2',
            speaker: 'Cô Hoa',
            role: 'teacher',
            avatar: '👩‍🏫',
            en: 'Hello! Welcome to class!',
            vi: 'Cô chào bé ngoan nhé!',
          },
        ],
      },
      {
        id: 'c1_do_2',
        title: 'Vui vẻ vào lớp',
        img: '/assets/communication/comm_1_do_2.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I am ready to play!',
            vi: 'Con sẵn sàng học rồi ạ!',
          },
          {
            id: 'l2',
            speaker: 'Cô Hoa',
            role: 'teacher',
            avatar: '👩‍🏫',
            en: 'Come in and have fun!',
            vi: 'Vào lớp cùng các bạn nào!',
          },
        ],
      },
      {
        id: 'c1_do_3',
        title: 'Được cô khen ngoan',
        img: '/assets/communication/comm_1_do_3.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Cô Hoa',
            role: 'teacher',
            avatar: '👩‍🏫',
            en: 'Good job! You are polite!',
            vi: 'Bé ngoan và lễ phép lắm!',
          },
          {
            id: 'l2',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Thank you, teacher!',
            vi: 'Con cảm ơn cô ạ!',
          },
        ],
      },
    ],
    dontCards: [
      {
        id: 'c1_dont_1',
        title: 'Chạy thẳng không chào',
        img: '/assets/communication/comm_1_dont_1.webp',
        isNegative: true,
        correctiveTipVi: 'Bé nhớ dừng lại khoanh tay chào cô nhé!',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: '...',
            vi: 'Bé im lặng chạy vào lớp.',
          },
          {
            id: 'l2',
            speaker: 'Cô Hoa',
            role: 'teacher',
            avatar: '👩‍🏫',
            en: 'Please stop and say hello!',
            vi: 'Con nhớ dừng lại chào cô nhé!',
          },
        ],
      },
      {
        id: 'c1_dont_2',
        title: 'Khóc nhè bám mẹ',
        img: '/assets/communication/comm_1_dont_2.webp',
        isNegative: true,
        correctiveTipVi: 'Vui vẻ chào cô, cô sẽ yêu thương bé.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I want Mommy!',
            vi: 'Con muốn mẹ cơ!',
          },
          {
            id: 'l2',
            speaker: 'Cô Hoa',
            role: 'teacher',
            avatar: '👩‍🏫',
            en: 'Do not cry, sweetie!',
            vi: 'Đừng khóc, có cô ở đây!',
          },
        ],
      },
    ],
    quiz: {
      questionEn: 'What should you say to teacher?',
      questionVi: 'Đến lớp gặp cô, bé nói gì?',
      options: [
        {
          id: 'q1_opt1',
          icon: '🙇',
          en: 'Good morning, teacher!',
          vi: 'Con chào cô giáo ạ!',
          isCorrect: true,
          feedbackEn: 'Great job! You are very polite!',
          feedbackVi: 'Đúng rồi! Bé lễ phép lắm!',
        },
        {
          id: 'q1_opt2',
          icon: '🏃',
          en: 'Run away quietly',
          vi: 'Chạy thẳng không chào',
          isCorrect: false,
          feedbackEn: 'Remember to say hello first!',
          feedbackVi: 'Bé nhớ dừng lại chào cô nhé!',
        },
      ],
    },
  },

  // 2. Đi học chào bố mẹ, ông bà
  {
    id: 'di-hoc-chao-bo-me',
    index: 2,
    shortName: 'Chào đi học',
    titleVi: 'Đi học chào bố mẹ, ông bà',
    titleEn: 'Saying Goodbye Before School',
    icon3D: '🎒',
    colorHex: '#10B981',
    goldenRuleVi: 'Đi học, con chào tạm biệt cả nhà!',
    parentTipVi: 'Một cái ôm tạm biệt giúp con tự tin tới lớp.',
    doCards: [
      {
        id: 'c2_do_1',
        title: 'Khoanh tay chào bố mẹ',
        img: '/assets/communication/comm_2_do_1.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Goodbye Mommy and Daddy!',
            vi: 'Con chào bố mẹ đi học ạ!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Have a great day, dear!',
            vi: 'Chúc con học vui nhé!',
          },
        ],
      },
      {
        id: 'c2_do_2',
        title: 'Ôm chào ông bà',
        img: '/assets/communication/comm_2_do_2.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Goodbye Grandpa and Grandma!',
            vi: 'Cháu chào ông bà ạ!',
          },
          {
            id: 'l2',
            speaker: 'Ông',
            role: 'grandpa',
            avatar: '👴',
            en: 'Be a good child, sweetie!',
            vi: 'Cháu ngoan đi học vui nhé!',
          },
        ],
      },
      {
        id: 'c2_do_3',
        title: 'Bố mẹ vẫy tay chúc bé',
        img: '/assets/communication/comm_2_do_3.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'See you this afternoon!',
            vi: 'Chiều bố đón con nhé!',
          },
          {
            id: 'l2',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Yes, Daddy! Bye bye!',
            vi: 'Dạ vâng, con tạm biệt bố!',
          },
        ],
      },
    ],
    dontCards: [
      {
        id: 'c2_dont_1',
        title: 'Lẳng lặng đi ra cửa',
        img: '/assets/communication/comm_2_dont_1.webp',
        isNegative: true,
        correctiveTipVi: 'Bé cất lời chào để bố mẹ yên tâm nhé.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: '...',
            vi: 'Bé lẳng lặng đi ra cửa.',
          },
          {
            id: 'l2',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'Say goodbye to Daddy, please!',
            vi: 'Con nhớ chào bố mẹ nhé!',
          },
        ],
      },
      {
        id: 'c2_dont_2',
        title: 'Dỗi hờn vứt ba lô',
        img: '/assets/communication/comm_2_dont_2.webp',
        isNegative: true,
        correctiveTipVi: 'Đi học vui vẻ, gặp nhiều bạn tốt.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I do not want school!',
            vi: 'Con không thích đi học đâu!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'School is fun, let us go!',
            vi: 'Đi học rất vui con yêu!',
          },
        ],
      },
    ],
    quiz: {
      questionEn: 'What do you say before school?',
      questionVi: 'Trước khi đi học, bé nói câu gì?',
      options: [
        {
          id: 'q2_opt1',
          icon: '👋',
          en: 'Goodbye Mommy and Daddy!',
          vi: 'Con chào bố mẹ con đi học!',
          isCorrect: true,
          feedbackEn: 'Spot on! You are so polite!',
          feedbackVi: 'Đúng rồi! Bé đi thưa về gửi!',
        },
        {
          id: 'q2_opt2',
          icon: '🚪',
          en: 'Walk away quietly',
          vi: 'Bỏ đi không chào ai',
          isCorrect: false,
          feedbackEn: 'Always say goodbye first!',
          feedbackVi: 'Hãy chào tạm biệt người thân bé nhé!',
        },
      ],
    },
  },

  // 3. Về nhà chào bố mẹ, ông bà
  {
    id: 've-nha-chao-bo-me',
    index: 3,
    shortName: 'Chào về nhà',
    titleVi: 'Về nhà chào bố mẹ, ông bà',
    titleEn: 'Arriving Home and Greeting Family',
    icon3D: '🏡',
    colorHex: '#F59E0B',
    goldenRuleVi: 'Về đến nhà, con chào cả nhà!',
    parentTipVi: 'Bố mẹ mỉm cười đón con sau ngày dài ở lớp.',
    doCards: [
      {
        id: 'c3_do_1',
        title: 'Chào mẹ khi về tới nhà',
        img: '/assets/communication/comm_3_do_1.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Hello Mommy, I am home!',
            vi: 'Con mới đi học về ạ!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Welcome home, my baby!',
            vi: 'Mẹ chào bé ngoan của mẹ!',
          },
        ],
      },
      {
        id: 'c3_do_2',
        title: 'Khoanh tay chào ông bà',
        img: '/assets/communication/comm_3_do_2.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Hello Grandpa and Grandma!',
            vi: 'Cháu chào ông bà ạ!',
          },
          {
            id: 'l2',
            speaker: 'Bà',
            role: 'grandma',
            avatar: '👵',
            en: 'Good boy, come here!',
            vi: 'Bé ngoan của bà về rồi!',
          },
        ],
      },
      {
        id: 'c3_do_3',
        title: 'Xếp giày dép ngăn nắp',
        img: '/assets/communication/comm_3_do_3.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I put my shoes neatly!',
            vi: 'Con cất giày dép gọn gàng!',
          },
          {
            id: 'l2',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'You are so tidy, son!',
            vi: 'Con rất ngăn nắp, giỏi lắm!',
          },
        ],
      },
    ],
    dontCards: [
      {
        id: 'c3_dont_1',
        title: 'Vứt cặp nhảy lên sofa',
        img: '/assets/communication/comm_3_dont_1.webp',
        isNegative: true,
        correctiveTipVi: 'Chào người lớn trước khi đi chơi bé nhé.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: '...',
            vi: 'Vứt cặp chạy vào sofa.',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Please greet Grandpa first!',
            vi: 'Con nhớ chào ông bà trước!',
          },
        ],
      },
      {
        id: 'c3_dont_2',
        title: 'Đòi ăn kem vòi vĩnh',
        img: '/assets/communication/comm_3_dont_2.webp',
        isNegative: true,
        correctiveTipVi: 'Cất lời chào lễ phép trước khi xin đồ.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Give me ice cream now!',
            vi: 'Cho con ăn kem ngay đi!',
          },
          {
            id: 'l2',
            speaker: 'Bà',
            role: 'grandma',
            avatar: '👵',
            en: 'Say hello to Grandma first!',
            vi: 'Con chào bà trước đã nào!',
          },
        ],
      },
    ],
    quiz: {
      questionEn: 'What do you say arriving home?',
      questionVi: 'Đi học về đến nhà, bé nói gì?',
      options: [
        {
          id: 'q3_opt1',
          icon: '🏡',
          en: 'Hello, I am home!',
          vi: 'Con mới đi học về ạ!',
          isCorrect: true,
          feedbackEn: 'Awesome! Good manners!',
          feedbackVi: 'Đúng rồi! Bé rất hiếu thảo!',
        },
        {
          id: 'q3_opt2',
          icon: '🛋️',
          en: 'Do not say anything',
          vi: 'Vứt dép chạy vào nhà',
          isCorrect: false,
          feedbackEn: 'Say hello to family first!',
          feedbackVi: 'Bé nhớ chào cả nhà trước nhé!',
        },
      ],
    },
  },

  // 4. Đi chợ cùng mẹ, chào người quen
  {
    id: 'di-cho-cung-me',
    index: 4,
    shortName: 'Chào khi đi chợ',
    titleVi: 'Đi chợ cùng mẹ, chào người quen',
    titleEn: 'At the Market, Greeting Neighbors',
    icon3D: '🧺',
    colorHex: '#EC4899',
    goldenRuleVi: 'Gặp người quen, con mỉm cười chào!',
    parentTipVi: 'Chỉ vào người quen và hướng dẫn bé chào hỏi.',
    doCards: [
      {
        id: 'c4_do_1',
        title: 'Chào bác bán hoa quả',
        img: '/assets/communication/comm_4_do_1.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Good morning, Auntie!',
            vi: 'Cháu chào bác bán hoa quả!',
          },
          {
            id: 'l2',
            speaker: 'Bác Khách',
            role: 'guest',
            avatar: '👨‍💼',
            en: 'Hello! You look so cute!',
            vi: 'Chào con, bé ngoan quá!',
          },
        ],
      },
      {
        id: 'c4_do_2',
        title: 'Chúc bác đắt hàng',
        img: '/assets/communication/comm_4_do_2.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Have a nice day, Uncle!',
            vi: 'Cháu chúc chú đắt hàng ạ!',
          },
          {
            id: 'l2',
            speaker: 'Bác Khách',
            role: 'guest',
            avatar: '👨‍💼',
            en: 'Thank you so much, dear!',
            vi: 'Chú cảm ơn cháu nhiều nhé!',
          },
        ],
      },
      {
        id: 'c4_do_3',
        title: 'Mẹ khen bé tự tin',
        img: '/assets/communication/comm_4_do_3.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'You greeted everyone very well!',
            vi: 'Con chào hỏi rất giỏi!',
          },
          {
            id: 'l2',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I love helping you, Mommy!',
            vi: 'Con thích đi chợ cùng mẹ!',
          },
        ],
      },
    ],
    dontCards: [
      {
        id: 'c4_dont_1',
        title: 'Núp sau lưng mẹ',
        img: '/assets/communication/comm_4_dont_1.webp',
        isNegative: true,
        correctiveTipVi: 'Đừng rụt rè, hãy mỉm cười chào người quen.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: '...',
            vi: 'Bé núp sau lưng mẹ.',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Do not be shy, sweetie!',
            vi: 'Đừng ngại, con chào bác đi!',
          },
        ],
      },
      {
        id: 'c4_dont_2',
        title: 'Tự tiện vồ lấy quả',
        img: '/assets/communication/comm_4_dont_2.webp',
        isNegative: true,
        correctiveTipVi: 'Hỏi xin phép mẹ trước khi chạm vào đồ.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I want that apple now!',
            vi: 'Con muốn quả táo đó ngay!',
          },
          {
            id: 'l2',
            speaker: 'Bác Khách',
            role: 'guest',
            avatar: '👨‍💼',
            en: 'Please ask your Mommy first!',
            vi: 'Con xin phép mẹ trước nhé!',
          },
        ],
      },
    ],
    quiz: {
      questionEn: 'Meeting neighbors, what to do?',
      questionVi: 'Đi chợ gặp người quen, bé làm gì?',
      options: [
        {
          id: 'q4_opt1',
          icon: '😊',
          en: 'Good morning, Auntie!',
          vi: 'Cháu chào bác ạ!',
          isCorrect: true,
          feedbackEn: 'Very sweet! Everyone loves polite kids!',
          feedbackVi: 'Bé ngoan tuyệt vời!',
        },
        {
          id: 'q4_opt2',
          icon: '🙈',
          en: 'Hide and say nothing',
          vi: 'Núp sau lưng mẹ im lặng',
          isCorrect: false,
          feedbackEn: 'Be confident and say hello!',
          feedbackVi: 'Tự tin cất tiếng chào bé nhé!',
        },
      ],
    },
  },

  // 5. Đi công viên (chào bạn, xếp hàng, nhường bạn)
  {
    id: 'di-cong-vien',
    index: 5,
    shortName: 'Đi công viên',
    titleVi: 'Đi công viên (chào bạn, xếp hàng)',
    titleEn: 'At the Park, Taking Turns',
    icon3D: '🎡',
    colorHex: '#06B6D4',
    goldenRuleVi: 'Chơi cùng bạn, con luôn xếp hàng!',
    parentTipVi: 'Dạy con tính kiên nhẫn khi đợi lượt chơi.',
    doCards: [
      {
        id: 'c5_do_1',
        title: 'Rủ bạn chơi chung',
        img: '/assets/communication/comm_5_do_1.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Hello! Can we play together?',
            vi: 'Chào bạn, cùng chơi nhé!',
          },
          {
            id: 'l2',
            speaker: 'Bạn Mi',
            role: 'friend',
            avatar: '👧',
            en: 'Yes! Let us share swings!',
            vi: 'Được chứ, cùng chơi xích đu!',
          },
        ],
      },
      {
        id: 'c5_do_2',
        title: 'Nhường lượt cho bạn',
        img: '/assets/communication/comm_5_do_2.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'It is your turn now!',
            vi: 'Đến lượt bạn trượt rồi!',
          },
          {
            id: 'l2',
            speaker: 'Bạn Mi',
            role: 'friend',
            avatar: '👧',
            en: 'Thank you, you are kind!',
            vi: 'Cảm ơn bạn nhiều nhé!',
          },
        ],
      },
      {
        id: 'c5_do_3',
        title: 'Xếp hàng ngoan ngoãn',
        img: '/assets/communication/comm_5_do_3.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I wait in line nicely!',
            vi: 'Con kiên nhẫn xếp hàng!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Good job taking turns, dear!',
            vi: 'Bé ngoan biết nhường bạn!',
          },
        ],
      },
    ],
    dontCards: [
      {
        id: 'c5_dont_1',
        title: 'Xô đẩy chen hàng',
        img: '/assets/communication/comm_5_dont_1.webp',
        isNegative: true,
        correctiveTipVi: 'Chen lấn nguy hiểm, hãy kiên nhẫn xếp hàng.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Move! I want to slide!',
            vi: 'Tránh ra, để tớ trượt!',
          },
          {
            id: 'l2',
            speaker: 'Bạn Mi',
            role: 'friend',
            avatar: '👧',
            en: 'Please wait in line, friend!',
            vi: 'Bạn nhớ xếp hàng nhé!',
          },
        ],
      },
      {
        id: 'c5_dont_2',
        title: 'Giữ đồ chơi một mình',
        img: '/assets/communication/comm_5_dont_2.webp',
        isNegative: true,
        correctiveTipVi: 'Chia sẻ đồ chơi với bạn sẽ vui hơn.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'This swing is mine only!',
            vi: 'Xích đu này của tớ!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Share with your friends, please!',
            vi: 'Con cùng chơi với bạn nhé!',
          },
        ],
      },
    ],
    quiz: {
      questionEn: 'How to play at the playground?',
      questionVi: 'Ở công viên đông bạn, bé làm gì?',
      options: [
        {
          id: 'q5_opt1',
          icon: '🤝',
          en: 'Wait in line nicely!',
          vi: 'Xếp hàng chờ đến lượt mình!',
          isCorrect: true,
          feedbackEn: 'Correct! Taking turns is wonderful!',
          feedbackVi: 'Đúng chuẩn bé ngoan văn minh!',
        },
        {
          id: 'q5_opt2',
          icon: '😤',
          en: 'Push others away',
          vi: 'Chen ngang xô đẩy bạn',
          isCorrect: false,
          feedbackEn: 'Never push! Wait for your turn.',
          feedbackVi: 'Không xô đẩy, hãy kiên nhẫn nhé!',
        },
      ],
    },
  },

  // 6. Khách đến chơi nhà, chào hỏi
  {
    id: 'khach-den-choi-nha',
    index: 6,
    shortName: 'Khách đến nhà',
    titleVi: 'Khách đến chơi nhà, chào hỏi',
    titleEn: 'Welcoming Guests Politely',
    icon3D: '🍵',
    colorHex: '#6366F1',
    goldenRuleVi: 'Khách đến, con tươi cười chào hỏi!',
    parentTipVi: 'Bé tập mời nước người lớn bằng hai tay.',
    doCards: [
      {
        id: 'c6_do_1',
        title: 'Mời khách vào nhà',
        img: '/assets/communication/comm_6_do_1.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Hello! Welcome to our home!',
            vi: 'Cháu chào bác ạ!',
          },
          {
            id: 'l2',
            speaker: 'Bác Khách',
            role: 'guest',
            avatar: '👨‍💼',
            en: 'Hello! You are very polite!',
            vi: 'Bác chào bé ngoan nhé!',
          },
        ],
      },
      {
        id: 'c6_do_2',
        title: 'Mời nước bằng hai tay',
        img: '/assets/communication/comm_6_do_2.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Here is water for you!',
            vi: 'Cháu mời bác uống nước ạ!',
          },
          {
            id: 'l2',
            speaker: 'Bác Khách',
            role: 'guest',
            avatar: '👨‍💼',
            en: 'Thank you so much, sweetie!',
            vi: 'Bác cảm ơn con nhiều nhé!',
          },
        ],
      },
      {
        id: 'c6_do_3',
        title: 'Bố khen con lễ phép',
        img: '/assets/communication/comm_6_do_3.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'You welcomed our guest well!',
            vi: 'Con tiếp khách rất chu đáo!',
          },
          {
            id: 'l2',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I love being polite, Daddy!',
            vi: 'Con thích làm bé ngoan ạ!',
          },
        ],
      },
    ],
    dontCards: [
      {
        id: 'c6_dont_1',
        title: 'Trốn vào phòng không chào',
        img: '/assets/communication/comm_6_dont_1.webp',
        isNegative: true,
        correctiveTipVi: 'Ra chào khách với nụ cười thân thiện.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: '...',
            vi: 'Chạy vào phòng trốn mất.',
          },
          {
            id: 'l2',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'Come say hello to Uncle!',
            vi: 'Ra chào bác đi con ơi!',
          },
        ],
      },
      {
        id: 'c6_dont_2',
        title: 'Nói cộc lốc với khách',
        img: '/assets/communication/comm_6_dont_2.webp',
        isNegative: true,
        correctiveTipVi: 'Dùng từ dạ, thưa lễ phép với người lớn.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Who are you, stranger?',
            vi: 'Bác là ai đấy?',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Greet our guest politely, dear!',
            vi: 'Con phải chào bác lễ phép!',
          },
        ],
      },
    ],
    quiz: {
      questionEn: 'How to offer water to guests?',
      questionVi: 'Khách đến chơi, bé mời nước thế nào?',
      options: [
        {
          id: 'q6_opt1',
          icon: '🤲',
          en: 'Here is water for you!',
          vi: 'Mời bác uống nước bằng hai tay',
          isCorrect: true,
          feedbackEn: 'Perfect! Respectful and sweet!',
          feedbackVi: 'Bé ngoan tuyệt đối, đáng khen!',
        },
        {
          id: 'q6_opt2',
          icon: '💧',
          en: 'Toss cup on table',
          vi: 'Quẳng cốc nước lên bàn',
          isCorrect: false,
          feedbackEn: 'Hold carefully with both hands!',
          feedbackVi: 'Dùng cả hai tay bưng cẩn thận bé nhé!',
        },
      ],
    },
  },

  // 7. Nhận quà, nói cảm ơn
  {
    id: 'nhan-qua-cam-on',
    index: 7,
    shortName: 'Nhận quà cảm ơn',
    titleVi: 'Nhận quà, nói cảm ơn',
    titleEn: 'Receiving Gifts, Saying Thank You',
    icon3D: '🎁',
    colorHex: '#E11D48',
    goldenRuleVi: 'Nhận quà, con nói lời cảm ơn!',
    parentTipVi: 'Dạy bé nhận quà bằng hai tay kính cẩn.',
    doCards: [
      {
        id: 'c7_do_1',
        title: 'Nhận quà bằng hai tay',
        img: '/assets/communication/comm_7_do_1.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bà',
            role: 'grandma',
            avatar: '👵',
            en: 'Here is a gift for you!',
            vi: 'Bà có quà cho cháu này!',
          },
          {
            id: 'l2',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Thank you so much, Grandma!',
            vi: 'Cháu cảm ơn bà ạ!',
          },
        ],
      },
      {
        id: 'c7_do_2',
        title: 'Cúi đầu dạ con xin',
        img: '/assets/communication/comm_7_do_2.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I take it with both hands!',
            vi: 'Cháu xin bằng hai tay ạ!',
          },
          {
            id: 'l2',
            speaker: 'Bà',
            role: 'grandma',
            avatar: '👵',
            en: 'Good child, you are sweet!',
            vi: 'Bé ngoan của bà đáng yêu!',
          },
        ],
      },
      {
        id: 'c7_do_3',
        title: 'Trân trọng món quà',
        img: '/assets/communication/comm_7_do_3.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I love this gift, Mommy!',
            vi: 'Con thích món quà này lắm!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Always say thank you, dear!',
            vi: 'Luôn biết ơn con nhé!',
          },
        ],
      },
    ],
    dontCards: [
      {
        id: 'c7_dont_1',
        title: 'Giật lấy quà không cảm ơn',
        img: '/assets/communication/comm_7_dont_1.webp',
        isNegative: true,
        correctiveTipVi: 'Đón nhận bằng hai tay và nói cảm ơn.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Give it to me fast!',
            vi: 'Đưa nhanh cho cháu nào!',
          },
          {
            id: 'l2',
            speaker: 'Bà',
            role: 'grandma',
            avatar: '👵',
            en: 'Say thank you first, please!',
            vi: 'Cháu cảm ơn bà trước đã!',
          },
        ],
      },
      {
        id: 'c7_dont_2',
        title: 'Chê bai món quà',
        img: '/assets/communication/comm_7_dont_2.webp',
        isNegative: true,
        correctiveTipVi: 'Biết ơn tình cảm của người trao quà.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I do not like this!',
            vi: 'Cháu không thích quà này!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Appreciate every gift with love!',
            vi: 'Con phải trân trọng món quà!',
          },
        ],
      },
    ],
    quiz: {
      questionEn: 'What do you say receiving a gift?',
      questionVi: 'Khi được tặng quà, bé nói gì?',
      options: [
        {
          id: 'q7_opt1',
          icon: '🎁',
          en: 'Thank you so much!',
          vi: 'Cháu xin, cháu cảm ơn ạ!',
          isCorrect: true,
          feedbackEn: 'Splendid! Gratitude is beautiful!',
          feedbackVi: 'Tuyệt vời! Lòng biết ơn thật đẹp!',
        },
        {
          id: 'q7_opt2',
          icon: '🏃',
          en: 'Grab and run away',
          vi: 'Giật lấy chạy đi mất',
          isCorrect: false,
          feedbackEn: 'Always thank the giver first!',
          feedbackVi: 'Đón quà bằng hai tay và cảm ơn nhé!',
        },
      ],
    },
  },

  // 8. Làm sai hoặc làm hỏng đồ, nói xin lỗi
  {
    id: 'lam-sai-xin-loi',
    index: 8,
    shortName: 'Nói lời xin lỗi',
    titleVi: 'Làm sai hoặc làm hỏng đồ, nói xin lỗi',
    titleEn: 'Making Mistakes, Saying Sorry',
    icon3D: '🤝',
    colorHex: '#059669',
    goldenRuleVi: 'Làm sai, con dũng cảm xin lỗi!',
    parentTipVi: 'Bình tĩnh khi con làm vỡ để con nhận lỗi.',
    doCards: [
      {
        id: 'c8_do_1',
        title: 'Dũng cảm nhận lỗi',
        img: '/assets/communication/comm_8_do_1.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I am sorry, Mommy!',
            vi: 'Con xin lỗi mẹ ạ!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'It is okay, sweet boy!',
            vi: 'Không sao đâu con yêu!',
          },
        ],
      },
      {
        id: 'c8_do_2',
        title: 'Cùng mẹ lau dọn',
        img: '/assets/communication/comm_8_do_2.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Let me help clean up!',
            vi: 'Con giúp mẹ lau dọn nhé!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Thank you for helping me!',
            vi: 'Mẹ cảm ơn con nhé!',
          },
        ],
      },
      {
        id: 'c8_do_3',
        title: 'Hứa cẩn thận hơn',
        img: '/assets/communication/comm_8_do_3.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I will be more careful!',
            vi: 'Lần sau con sẽ cẩn thận!',
          },
          {
            id: 'l2',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'You are very brave, son!',
            vi: 'Con rất dũng cảm nhận lỗi!',
          },
        ],
      },
    ],
    dontCards: [
      {
        id: 'c8_dont_1',
        title: 'Đổ lỗi cho con mèo',
        img: '/assets/communication/comm_8_dont_1.webp',
        isNegative: true,
        correctiveTipVi: 'Dũng cảm nói thật, bố mẹ sẽ tha thứ.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'The cat did it, not me!',
            vi: 'Con mèo làm đổ đấy!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Be honest and speak truth!',
            vi: 'Con phải nói thật nhé!',
          },
        ],
      },
      {
        id: 'c8_dont_2',
        title: 'Ăn vạ khóc to',
        img: '/assets/communication/comm_8_dont_2.webp',
        isNegative: true,
        correctiveTipVi: 'Bình tĩnh xin lỗi, không cần sợ hãi.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Wah, I did not mean it!',
            vi: 'Oa oa, con không cố ý!',
          },
          {
            id: 'l2',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'Stop crying, just say sorry!',
            vi: 'Đừng khóc, hãy xin lỗi nhé!',
          },
        ],
      },
    ],
    quiz: {
      questionEn: 'Spilling water accidentally, what to do?',
      questionVi: 'Lỡ tay làm đổ nước, bé nên làm gì?',
      options: [
        {
          id: 'q8_opt1',
          icon: '🙇',
          en: 'I am sorry, Mommy!',
          vi: 'Con xin lỗi mẹ, con lau ngay!',
          isCorrect: true,
          feedbackEn: 'You are very brave and honest!',
          feedbackVi: 'Dũng cảm nhận lỗi là bé ngoan!',
        },
        {
          id: 'q8_opt2',
          icon: '😿',
          en: 'Blame someone else',
          vi: 'Đổ tội cho người khác',
          isCorrect: false,
          feedbackEn: 'Always be honest and say sorry!',
          feedbackVi: 'Không nói dối, hãy xin lỗi nhé!',
        },
      ],
    },
  },

  // 9. Mời cả nhà ăn cơm
  {
    id: 'moi-an-com',
    index: 9,
    shortName: 'Mời cơm gia đình',
    titleVi: 'Mời cả nhà ăn cơm',
    titleEn: 'Inviting Family to Enjoy Meals',
    icon3D: '🍚',
    colorHex: '#D97706',
    goldenRuleVi: 'Trước bữa ăn, con mời cả nhà!',
    parentTipVi: 'Bữa cơm ấm cúng bắt đầu bằng lời mời lễ phép.',
    doCards: [
      {
        id: 'c9_do_1',
        title: 'Mời ông bà xơi cơm',
        img: '/assets/communication/comm_9_do_1.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Enjoy your meal, Grandma!',
            vi: 'Cháu mời ông bà xơi cơm!',
          },
          {
            id: 'l2',
            speaker: 'Bà',
            role: 'grandma',
            avatar: '👵',
            en: 'Thank you, eat well, dear!',
            vi: 'Bà cảm ơn, bé ăn ngon nhé!',
          },
        ],
      },
      {
        id: 'c9_do_2',
        title: 'Mời bố mẹ ăn cơm',
        img: '/assets/communication/comm_9_do_2.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Enjoy your dinner, Mommy!',
            vi: 'Con mời bố mẹ ăn cơm!',
          },
          {
            id: 'l2',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'Good boy! Let us all eat!',
            vi: 'Cả nhà cùng ăn cơm nào!',
          },
        ],
      },
      {
        id: 'c9_do_3',
        title: 'Khen món mẹ nấu ngon',
        img: '/assets/communication/comm_9_do_3.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'This soup is so yummy!',
            vi: 'Món này ngon quá mẹ ơi!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Eat lots to grow strong!',
            vi: 'Ăn nhiều cho khỏe mạnh nhé!',
          },
        ],
      },
    ],
    dontCards: [
      {
        id: 'c9_dont_1',
        title: 'Ăn trước không mời',
        img: '/assets/communication/comm_9_dont_1.webp',
        isNegative: true,
        correctiveTipVi: 'Đợi cả nhà ngồi đông đủ và mời cơm.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I eat first, yum yum!',
            vi: 'Con ăn trước đây, ngon quá!',
          },
          {
            id: 'l2',
            speaker: 'Ông',
            role: 'grandpa',
            avatar: '👴',
            en: 'Invite everyone before eating, son!',
            vi: 'Con nhớ mời cả nhà trước!',
          },
        ],
      },
      {
        id: 'c9_dont_2',
        title: 'Kén ăn quấy khóc',
        img: '/assets/communication/comm_9_dont_2.webp',
        isNegative: true,
        correctiveTipVi: 'Ăn rau củ quả để mau cao lớn.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I do not want veggies!',
            vi: 'Con không ăn rau đâu!',
          },
          {
            id: 'l2',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'Try a little bit, please!',
            vi: 'Thử một chút nhé con yêu!',
          },
        ],
      },
    ],
    quiz: {
      questionEn: 'Before eating meals, what to do?',
      questionVi: 'Trước khi ăn cơm, bé làm gì?',
      options: [
        {
          id: 'q9_opt1',
          icon: '🍚',
          en: 'Enjoy your meal, everyone!',
          vi: 'Con mời cả nhà ăn cơm ạ!',
          isCorrect: true,
          feedbackEn: 'Wonderful! You are very well-mannered!',
          feedbackVi: 'Đúng rồi! Cả nhà đều vui lòng!',
        },
        {
          id: 'q9_opt2',
          icon: '🥢',
          en: 'Eat without inviting',
          vi: 'Bốc ăn ngay không mời ai',
          isCorrect: false,
          feedbackEn: 'Invite your family first!',
          feedbackVi: 'Nhớ mời cơm người lớn trước bé nhé!',
        },
      ],
    },
  },

  // 10. Xin phép và nói “làm ơn”
  {
    id: 'xin-phep-lam-on',
    index: 10,
    shortName: 'Xin phép & Làm ơn',
    titleVi: 'Xin phép và nói “làm ơn”',
    titleEn: 'Asking Permission and Saying Please',
    icon3D: '✨',
    colorHex: '#8B5CF6',
    goldenRuleVi: 'Muốn gì, con xin phép lễ phép!',
    parentTipVi: 'Từ "làm ơn" và "xin phép" mở ra sự yêu thương.',
    doCards: [
      {
        id: 'c10_do_1',
        title: 'Xin nước uống lịch sự',
        img: '/assets/communication/comm_10_do_1.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'May I have water, please?',
            vi: 'Mẹ cho con xin nước ạ!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Here you are, my love!',
            vi: 'Của con đây, bé ngoan!',
          },
        ],
      },
      {
        id: 'c10_do_2',
        title: 'Xin phép chơi đồ chơi',
        img: '/assets/communication/comm_10_do_2.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Can I play this toy?',
            vi: 'Con xin phép chơi đồ chơi!',
          },
          {
            id: 'l2',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'Yes, you asked so politely!',
            vi: 'Được chứ, con xin phép rất ngoan!',
          },
        ],
      },
      {
        id: 'c10_do_3',
        title: 'Nhờ bố giúp đỡ',
        img: '/assets/communication/comm_10_do_3.webp',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Please help me, Daddy!',
            vi: 'Bố giúp con với ạ!',
          },
          {
            id: 'l2',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'Daddy is always here!',
            vi: 'Bố giúp con ngay đây!',
          },
        ],
      },
    ],
    dontCards: [
      {
        id: 'c10_dont_1',
        title: 'Hét to ra lệnh',
        img: '/assets/communication/comm_10_dont_1.webp',
        isNegative: true,
        correctiveTipVi: 'Dùng từ xin phép và làm ơn khi nhờ vả.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'Give me that toy now!',
            vi: 'Đưa đồ chơi đây cho con!',
          },
          {
            id: 'l2',
            speaker: 'Mẹ',
            role: 'mom',
            avatar: '👩',
            en: 'Say please first, my dear!',
            vi: 'Con phải xin phép đàng hoàng!',
          },
        ],
      },
      {
        id: 'c10_dont_2',
        title: 'Tự lấy đồ không hỏi',
        img: '/assets/communication/comm_10_dont_2.webp',
        isNegative: true,
        correctiveTipVi: 'Luôn xin phép người lớn trước khi lấy đồ.',
        lines: [
          {
            id: 'l1',
            speaker: 'Bé Bông',
            role: 'child',
            avatar: '👦',
            en: 'I take it without asking!',
            vi: 'Con tự lấy không cần hỏi!',
          },
          {
            id: 'l2',
            speaker: 'Bố',
            role: 'dad',
            avatar: '👨',
            en: 'Always ask permission first, son!',
            vi: 'Phải hỏi ý kiến bố mẹ nhé!',
          },
        ],
      },
    ],
    quiz: {
      questionEn: 'When asking for help, what to say?',
      questionVi: 'Khi muốn nhờ giúp, bé nói gì?',
      options: [
        {
          id: 'q10_opt1',
          icon: '✨',
          en: 'Please help me, Daddy!',
          vi: 'Bố giúp con với ạ!',
          isCorrect: true,
          feedbackEn: 'Brilliant! "Please" is a magic word!',
          feedbackVi: 'Đúng rồi! Từ làm ơn rất kỳ diệu!',
        },
        {
          id: 'q10_opt2',
          icon: '😠',
          en: 'Yell and demand',
          vi: 'Hét to đòi ngay lập tức',
          isCorrect: false,
          feedbackEn: 'Ask politely with please!',
          feedbackVi: 'Nhớ xin phép lịch sự bé nhé!',
        },
      ],
    },
  },
];

export const DAILY_COMMUNICATION_SITUATIONS = COMMUNICATION_SITUATIONS;
export type DailyCommunicationSituation = CommunicationSituation;
