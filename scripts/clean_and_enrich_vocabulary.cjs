// Script to clean up and replace all dummy / numbered / duplicate vocabulary items in lessonsData.json
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../src/data/lessonsData.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

// Topic 2 fixes (replace duplicates zebra item 11, hippo item 13)
const t2 = data.topics.find(t => t.id === 'wild-animals');
if (t2) {
  t2.vocabulary[10] = {
    id: "panda",
    en: "Panda",
    vi: "Gấu trúc Panda",
    phonetic: "/ˈpændə/",
    emoji: "🐼",
    colorHex: "#1F2937",
    bgTint: "#F3F4F6",
    soundEffect: "cheer",
    soundLabelVi: "Gấu trúc ăn lá trúc xanh!",
    phrase2To3y: { en: "Cute panda", vi: "Gấu trúc đáng yêu" },
    sentence3To4y: { en: "The panda loves eating bamboo.", vi: "Gấu trúc thích ăn lá trúc xanh." },
    phonics4To5y: { letter: "P", sound: "chữ P", spelling: "P - A - N - D - A", questionEn: "Which animal starts with P?", questionVi: "Con vật nào bắt đầu bằng chữ P?" }
  };
  t2.vocabulary[12] = {
    id: "deer",
    en: "Deer",
    vi: "Chú nai vàng",
    phonetic: "/dɪr/",
    emoji: "🦌",
    colorHex: "#B45309",
    bgTint: "#FEF3C7",
    soundEffect: "bell",
    soundLabelVi: "Chú nai hiền lành!",
    phrase2To3y: { en: "Gentle deer", vi: "Chú nai hiền" },
    sentence3To4y: { en: "The little deer runs in the forest.", vi: "Chú nai nhỏ chạy nhảy trong rừng." },
    phonics4To5y: { letter: "D", sound: "chữ D", spelling: "D - E - E - R", questionEn: "Which word starts with D?", questionVi: "Từ nào bắt đầu bằng chữ D?" }
  };
}

// Topic 3 fixes (replace duplicate jellyfish item 10 in ocean-world)
const t3 = data.topics.find(t => t.id === 'ocean-world');
if (t3) {
  t3.vocabulary[9] = {
    id: "shark",
    en: "Shark",
    vi: "Cá mập thân thiện",
    phonetic: "/ʃɑːrk/",
    emoji: "🦈",
    colorHex: "#0284C7",
    bgTint: "#E0F2FE",
    soundEffect: "whoosh",
    soundLabelVi: "Cá mập bơi nhanh vun vút!",
    phrase2To3y: { en: "Friendly shark", vi: "Cá mập thân thiện" },
    sentence3To4y: { en: "The shark swims swiftly in blue ocean.", vi: "Bạn cá mập bơi lượn dũng mãnh dưới biển sâu." },
    phonics4To5y: { letter: "S", sound: "chữ S", spelling: "S - H - A - R - K", questionEn: "Which fish starts with S?", questionVi: "Con cá nào bắt đầu bằng chữ S?" }
  };
}

// Topic 5 fixes (replace duplicate grape item 12)
const t5 = data.topics.find(t => t.id === 'fruits');
if (t5) {
  t5.vocabulary[11] = {
    id: "guava",
    en: "Guava",
    vi: "Quả ổi giòn",
    phonetic: "/ˈɡwɑːvə/",
    emoji: "🍐",
    colorHex: "#10B981",
    bgTint: "#D1FAE5",
    soundEffect: "crunch",
    soundLabelVi: "Quả ổi giòn ngọt!",
    phrase2To3y: { en: "Sweet guava", vi: "Ổi ngọt giòn" },
    sentence3To4y: { en: "I like eating sweet guava.", vi: "Bé thích ăn quả ổi giòn ngọt." },
    phonics4To5y: { letter: "G", sound: "chữ G", spelling: "G - U - A - V - A", questionEn: "Which fruit starts with G?", questionVi: "Quả nào bắt đầu bằng chữ G?" }
  };
}

// Topic 17 fixes (replace duplicate fire truck item 12, helicopter item 14)
const t17 = data.topics.find(t => t.id === 'vehicles');
if (t17) {
  t17.vocabulary[11] = {
    id: "ship",
    en: "Ship",
    vi: "Tàu thủy lớn",
    phonetic: "/ʃɪp/",
    emoji: "🚢",
    colorHex: "#0284C7",
    bgTint: "#E0F2FE",
    soundEffect: "horn",
    soundLabelVi: "Tu tu xình xịch lướt sóng!",
    phrase2To3y: { en: "Big ship", vi: "Tàu thủy to" },
    sentence3To4y: { en: "The big ship sails on ocean waves.", vi: "Tàu thủy lớn rẽ sóng ra khơi." },
    phonics4To5y: { letter: "S", sound: "chữ S", spelling: "S - H - I - P", questionEn: "Which vehicle starts with S?", questionVi: "Phương tiện nào bắt đầu bằng chữ S?" }
  };
  t17.vocabulary[13] = {
    id: "truck",
    en: "Truck",
    vi: "Xe tải chở hàng",
    phonetic: "/trʌk/",
    emoji: "🚚",
    colorHex: "#EA580C",
    bgTint: "#FFEDD5",
    soundEffect: "vroom",
    soundLabelVi: "Bíp bíp! Xe tải chở hàng!",
    phrase2To3y: { en: "Strong truck", vi: "Xe tải khỏe" },
    sentence3To4y: { en: "The truck carries fresh fruits.", vi: "Xe tải chở hoa quả về chợ." },
    phonics4To5y: { letter: "T", sound: "chữ T", spelling: "T - R - U - C - K", questionEn: "Which vehicle starts with T?", questionVi: "Phương tiện nào bắt đầu bằng chữ T?" }
  };
}

// Comprehensive custom replacement for items 9-16 across all dummy topics, completely deduplicated!
const newItemsMap = {
  "insects-birds": [
    { id: "caterpillar", en: "Caterpillar", vi: "Sâu bướm xanh", phonetic: "/ˈkætərpɪlər/", emoji: "🐛", colorHex: "#16A34A", bgTint: "#DCFCE7", phrase: ["Green caterpillar", "Sâu bướm bò lá"], sentence: ["The green caterpillar creeps slowly.", "Chú sâu bướm xanh bò êm trên lá."], letter: "C", spelling: "C - A - T - E - R - P - I - L - L - A - R" },
    { id: "firefly", en: "Firefly", vi: "Đom đóm sáng", phonetic: "/ˈfaɪərflaɪ/", emoji: "✨", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Shining firefly", "Đom đóm phát sáng"], sentence: ["The firefly shines brightly at night.", "Chú đom đóm thắp đèn sáng trong đêm."], letter: "F", spelling: "F - I - R - E - F - L - Y" },
    { id: "grasshopper", en: "Grasshopper", vi: "Châu chấu xanh", phonetic: "/ˈɡræshɑːpər/", emoji: "🦗", colorHex: "#65A30D", bgTint: "#ECFCCB", phrase: ["Jumping grasshopper", "Châu chấu nhảy cao"], sentence: ["The grasshopper hops in green grass.", "Bạn châu chấu nhảy tanh tách trong cỏ."], letter: "G", spelling: "G - R - A - S - S - H - O - P - P - E - R" },
    { id: "beetle", en: "Beetle", vi: "Bọ cánh cứng", phonetic: "/ˈbiːtl/", emoji: "🪲", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Shiny beetle", "Bọ cánh cứng bóng"], sentence: ["The little beetle has a hard shell.", "Chú bọ có chiếc áo giáp bóng loáng."], letter: "B", spelling: "B - E - E - T - L - E" },
    { id: "dragonfly", en: "Dragonfly", vi: "Chuồn chuồn ớt", phonetic: "/ˈdræɡənflaɪ/", emoji: "🛸", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["Red dragonfly", "Chuồn chuồn đỏ chót"], sentence: ["The dragonfly hovers above the pond.", "Chú chuồn chuồn ớt lượn trên mặt ao."], letter: "D", spelling: "D - R - A - G - O - N - F - L - Y" },
    { id: "pigeon", en: "Pigeon", vi: "Bồ câu trắng", phonetic: "/ˈpɪdʒɪn/", emoji: "🕊️", colorHex: "#475569", bgTint: "#F1F5F9", phrase: ["Gentle pigeon", "Bồ câu hiền lành"], sentence: ["White pigeon flies across blue sky.", "Bồ câu trắng liệng cánh trên trời xanh."], letter: "P", spelling: "P - I - G - E - O - N" },
    { id: "duckling", en: "Duckling", vi: "Vịt con lon ton", phonetic: "/ˈdʌklɪŋ/", emoji: "🦆", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Sweet duckling", "Vịt con bơi lội"], sentence: ["The yellow duckling swims in water.", "Chú vịt con bơi lội tung tăng."], letter: "D", spelling: "D - U - C - K - L - I - N - G" },
    { id: "woodpecker", en: "Woodpecker", vi: "Chim gõ kiến", phonetic: "/ˈwʊdpekər/", emoji: "🪵", colorHex: "#991B1B", bgTint: "#FEE2E2", phrase: ["Hardworking woodpecker", "Gõ kiến chăm chỉ"], sentence: ["Woodpecker taps on the tree trunk.", "Chim gõ kiến bắt sâu cho cây xanh."], letter: "W", spelling: "W - O - O - D - P - E - C - K - E - R" }
  ],
  "vegetables": [
    { id: "pea", en: "Peas", vi: "Hạt đậu Hà Lan", phonetic: "/piːz/", emoji: "🫛", colorHex: "#16A34A", bgTint: "#DCFCE7", phrase: ["Round peas", "Hạt đậu xanh tròn"], sentence: ["Little green peas are sweet and sweet.", "Hạt đậu nhỏ xanh thơm và ngọt."], letter: "P", spelling: "P - E - A - S" },
    { id: "cabbage", en: "Cabbage", vi: "Bắp cải tròn", phonetic: "/ˈkæbɪdʒ/", emoji: "🥬", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Round cabbage", "Bắp cải xanh tròn"], sentence: ["The fresh cabbage has many layers.", "Cây bắp cải cuộn tròn từng lớp lá."], letter: "C", spelling: "C - A - B - B - A - G - E" },
    { id: "sweet-potato", en: "Sweet Potato", vi: "Củ khoai lang", phonetic: "/swiːt pəˈteɪtoʊ/", emoji: "🍠", colorHex: "#9A3412", bgTint: "#FFEDD5", phrase: ["Sweet potato", "Khoai lang thơm ngọt"], sentence: ["Hot sweet potato smells so good.", "Củ khoai lang nướng thơm lừng lựng."], letter: "S", spelling: "S - W - E - E - T" },
    { id: "onion", en: "Onion", vi: "Củ hành tây", phonetic: "/ˈʌnjən/", emoji: "🧅", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Round onion", "Củ hành tây tròn"], sentence: ["The golden onion adds flavor to soup.", "Củ hành tây tròn thơm nức trong nồi súp."], letter: "O", spelling: "O - N - I - O - N" },
    { id: "bell-pepper", en: "Bell Pepper", vi: "Quả ớt chuông", phonetic: "/bel ˈpepər/", emoji: "🫑", colorHex: "#65A30D", bgTint: "#ECFCCB", phrase: ["Crisp bell pepper", "Ớt chuông giòn ngọt"], sentence: ["Bright bell pepper has vitamins.", "Ớt chuông đỏ ngọt cho bé khỏe mạnh."], letter: "B", spelling: "B - E - L - L" },
    { id: "garlic", en: "Garlic", vi: "Củ tỏi thơm", phonetic: "/ˈɡɑːrlɪk/", emoji: "🧄", colorHex: "#78716C", bgTint: "#F5F5F4", phrase: ["White garlic", "Củ tỏi trắng thơm"], sentence: ["Garlic makes baby's soup savory.", "Củ tỏi thơm giúp món ăn thêm ngon."], letter: "G", spelling: "G - A - R - L - I - C" },
    { id: "eggplant", en: "Eggplant", vi: "Quả cà tím", phonetic: "/ˈeɡplænt/", emoji: "🍆", colorHex: "#7E22CE", bgTint: "#F3E8FF", phrase: ["Purple eggplant", "Cà tím bóng bẩy"], sentence: ["Purple eggplant looks like a shiny toy.", "Quả cà tím mọng trông thật xinh."], letter: "E", spelling: "E - G - G - P - L - A - N - T" },
    { id: "radish", en: "Radish", vi: "Củ cải đỏ", phonetic: "/ˈrædɪʃ/", emoji: "🥗", colorHex: "#E11D48", bgTint: "#FFE4E6", phrase: ["Red radish", "Củ cải đỏ giòn"], sentence: ["The crunchy radish is good to eat.", "Củ cải tròn đỏ giòn tan thơm mát."], letter: "R", spelling: "R - A - D - I - S - H" }
  ],
  "baby-meals": [
    { id: "porridge", en: "Porridge", vi: "Bát cháo thơm", phonetic: "/ˈpɔːrɪdʒ/", emoji: "🥣", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Warm porridge", "Bát cháo ấm nóng"], sentence: ["Baby eats delicious porridge happily.", "Bé tự xúc từng thìa cháo thơm ngon."], letter: "P", spelling: "P - O - R - R - I - D - G - E" },
    { id: "oatmeal", en: "Oatmeal", vi: "Bột yến mạch", phonetic: "/ˈoʊtmiːl/", emoji: "🥣", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Nutritious oatmeal", "Yến mạch bổ dưỡng"], sentence: ["Oatmeal with berries is so good.", "Bột yến mạch thơm ấm bụng bé yêu."], letter: "O", spelling: "O - A - T - M - E - A - L" },
    { id: "yogurt", en: "Yogurt", vi: "Hũ sữa chua", phonetic: "/ˈjoʊɡərt/", emoji: "🥛", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Creamy yogurt", "Sữa chua sánh mịn"], sentence: ["Yogurt makes baby's tummy healthy.", "Sữa chua thơm mát tốt cho tiêu hóa."], letter: "Y", spelling: "Y - O - G - U - R - T" },
    { id: "pancake", en: "Pancake", vi: "Bánh pancake xốp", phonetic: "/ˈpænkeɪk/", emoji: "🥞", colorHex: "#F59E0B", bgTint: "#FEF3C7", phrase: ["Soft pancake", "Bánh pancake mềm"], sentence: ["Fluffy pancakes for morning snack.", "Chiếc bánh pancake thơm ngát mùi bơ."], letter: "P", spelling: "P - A - N - C - A - K - E" },
    { id: "cookie", en: "Cookie", vi: "Bánh quy giòn", phonetic: "/ˈkʊki/", emoji: "🍪", colorHex: "#B45309", bgTint: "#FEF3C7", phrase: ["Crunchy cookie", "Bánh quy giòn tan"], sentence: ["Baby shares a cookie with mommy.", "Bé chia chiếc bánh quy cho mẹ yêu."], letter: "C", spelling: "C - O - O - K - I - E" },
    { id: "orange-juice", en: "Orange Juice", vi: "Nước cam tươi", phonetic: "/ˈɔːrɪndʒ dʒuːs/", emoji: "🧃", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Sweet orange juice", "Nước cam thơm ngọt"], sentence: ["Fresh orange juice has vitamin C.", "Nước cam tươi nhiều vitamin tăng đề kháng."], letter: "O", spelling: "O - R - A - N - G - E" },
    { id: "pudding", en: "Pudding", vi: "Bánh pudding mềm", phonetic: "/ˈpʊdɪŋ/", emoji: "🍮", colorHex: "#F59E0B", bgTint: "#FEF3C7", phrase: ["Jiggly pudding", "Pudding mềm núng nính"], sentence: ["Caramel pudding melts in mouth.", "Bánh pudding caramen tan mềm trong miệng."], letter: "P", spelling: "P - U - D - D - I - N - G" },
    { id: "waffle", en: "Waffle", vi: "Bánh quế thơm", phonetic: "/ˈwɑːfl/", emoji: "🧇", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Golden waffle", "Bánh quế vàng óng"], sentence: ["Warm waffle smells like sweet honey.", "Bánh quế thơm ngậy vị mật ong mật."], letter: "W", spelling: "W - A - F - F - L - E" }
  ],
  "colors": [
    { id: "brown-color", en: "Brown", vi: "Màu nâu gỗ", phonetic: "/braʊn/", emoji: "🟤", colorHex: "#9A3412", bgTint: "#FFEDD5", phrase: ["Warm brown", "Nâu ấm áp"], sentence: ["The teddy bear is soft brown.", "Chú gấu bông có bộ lông màu nâu ấm."], letter: "B", spelling: "B - R - O - W - N" },
    { id: "black", en: "Black", vi: "Màu đen tuyền", phonetic: "/blæk/", emoji: "⚫", colorHex: "#1E293B", bgTint: "#F1F5F9", phrase: ["Shiny black", "Đen nhánh đáng yêu"], sentence: ["The little kitten has shiny black paws.", "Chú mèo có đôi chân đen tuyền xinh."], letter: "B", spelling: "B - L - A - C - K" },
    { id: "gray", en: "Gray", vi: "Màu xám bạc", phonetic: "/ɡreɪ/", emoji: "🔘", colorHex: "#64748B", bgTint: "#F1F5F9", phrase: ["Gentle gray", "Xám bạc êm ái"], sentence: ["The big elephant has gray skin.", "Bác voi to lớn khoác áo xám hiền lành."], letter: "G", spelling: "G - R - A - Y" },
    { id: "gold", en: "Gold", vi: "Màu vàng kim", phonetic: "/ɡoʊld/", emoji: "🪙", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Shining gold", "Vàng kim lấp lánh"], sentence: ["The star shines with golden light.", "Ngôi sao lấp lánh sắc vàng ấm áp."], letter: "G", spelling: "G - O - L - D" },
    { id: "silver", en: "Silver", vi: "Màu ánh bạc", phonetic: "/ˈsɪlvər/", emoji: "🥈", colorHex: "#94A3B8", bgTint: "#F8FAFC", phrase: ["Bright silver", "Ánh bạc sáng trong"], sentence: ["The moon sparkles in silver rays.", "Ánh trăng rằm tỏa sáng màu bạc êm."], letter: "S", spelling: "S - I - L - V - E - R" },
    { id: "rainbow-color", en: "Rainbow Color", vi: "Sắc cầu vồng", phonetic: "/ˈreɪnboʊ/", emoji: "🌈", colorHex: "#8B5CF6", bgTint: "#F3E8FF", phrase: ["Seven colors", "Bảy sắc lung linh"], sentence: ["The rainbow ribbon dances in wind.", "Dải lụa bảy sắc uốn lượn trong gió."], letter: "R", spelling: "R - A - I - N - B - O - W" },
    { id: "sky-blue", en: "Sky Blue", vi: "Màu xanh da trời", phonetic: "/skaɪ bluː/", emoji: "🩵", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Bright sky blue", "Xanh biếc dịu dàng"], sentence: ["The morning sky is clear and blue.", "Bầu trời sớm mai trong vắt xanh biếc."], letter: "S", spelling: "S - K - Y" },
    { id: "lime-green", en: "Lime Green", vi: "Màu xanh lá non", phonetic: "/laɪm ɡriːn/", emoji: "💚", colorHex: "#65A30D", bgTint: "#ECFCCB", phrase: ["Fresh lime green", "Xanh mầm non mới"], sentence: ["The tiny plant sprouts fresh green.", "Mầm cây tí hon hé nở màu xanh non."], letter: "L", spelling: "L - I - M - E" }
  ],
  "shapes": [
    { id: "crescent", en: "Crescent", vi: "Hình trăng khuyết", phonetic: "/ˈkresnt/", emoji: "🌙", colorHex: "#F59E0B", bgTint: "#FEF3C7", phrase: ["Curved crescent", "Trăng khuyết cong cong"], sentence: ["The moon looks like a sleepy banana.", "Mảnh trăng khuyết như chiếc võng êm."], letter: "C", spelling: "C - R - E - S - C - E - N - T" },
    { id: "pentagon", en: "Pentagon", vi: "Hình ngũ giác", phonetic: "/ˈpentəɡɑːn/", emoji: "⬟", colorHex: "#10B981", bgTint: "#D1FAE5", phrase: ["Five-sided pentagon", "Ngũ giác năm cạnh"], sentence: ["A soccer ball has many pentagons.", "Trái bóng đá có các miếng ngũ giác."], letter: "P", spelling: "P - E - N - T - A - G - O - N" },
    { id: "hexagon", en: "Hexagon", vi: "Hình lục giác", phonetic: "/ˈheksəɡɑːn/", emoji: "⬢", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Honey hexagon", "Lục giác tổ ong"], sentence: ["Bees build honeycombs in hexagons.", "Bạn ong xây tổ thành các ô lục giác."], letter: "H", spelling: "H - E - X - A - G - O - N" },
    { id: "octagon", en: "Octagon", vi: "Hình bát giác", phonetic: "/ˈɑːktəɡɑːn/", emoji: "🛑", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["Red octagon", "Bát giác tám cạnh"], sentence: ["The stop sign is a red octagon.", "Biển báo dừng có hình bát giác đỏ."], letter: "O", spelling: "O - C - T - A - G - O - N" },
    { id: "cross-shape", en: "Cross", vi: "Hình dấu cộng", phonetic: "/krɔːs/", emoji: "➕", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Plus cross", "Dấu cộng quen thuộc"], sentence: ["First aid box has a red cross.", "Hộp cứu thương có dấu cộng màu đỏ."], letter: "C", spelling: "C - R - O - S - S" },
    { id: "arrow-shape", en: "Arrow", vi: "Hình mũi tên", phonetic: "/ˈæroʊ/", emoji: "➡️", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Pointing arrow", "Mũi tên chỉ đường"], sentence: ["The green arrow shows the way forward.", "Mũi tên xanh chỉ đường bé đi đúng hướng."], letter: "A", spelling: "A - R - R - O - W" },
    { id: "spiral-shape", en: "Spiral", vi: "Hình xoắn ốc", phonetic: "/ˈspaɪrəl/", emoji: "🌀", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Spinning spiral", "Đường xoắn ốc xinh"], sentence: ["Snail carries a shell with a spiral.", "Chú ốc sên mang vỏ xoắn ốc diệu kỳ."], letter: "S", spelling: "S - P - I - R - A - L" },
    { id: "ring-shape", en: "Ring", vi: "Hình vòng xuyến", phonetic: "/rɪŋ/", emoji: "💍", colorHex: "#E11D48", bgTint: "#FFE4E6", phrase: ["Round ring", "Chiếc vòng tròn xinh"], sentence: ["The donut is a sweet little ring.", "Chiếc bánh rán vòng tròn ngọt lịm."], letter: "R", spelling: "R - I - N - G" }
  ],
  "numbers": [
    { id: "nine", en: "Nine", vi: "Số chín (9)", phonetic: "/naɪn/", emoji: "9️⃣", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Number nine", "Số chín tròn trĩnh"], sentence: ["I have nine colorful crayons.", "Bé có chín cây bút chì màu sáp."], letter: "N", spelling: "N - I - N - E" },
    { id: "ten", en: "Ten", vi: "Số mười (10)", phonetic: "/ten/", emoji: "🔟", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["Number ten", "Số mười tròn vẹn"], sentence: ["I have ten little fingers.", "Bé có mười ngón tay nhỏ xinh."], letter: "T", spelling: "T - E - N" },
    { id: "zero", en: "Zero", vi: "Số không (0)", phonetic: "/ˈzɪroʊ/", emoji: "0️⃣", colorHex: "#64748B", bgTint: "#F1F5F9", phrase: ["Round zero", "Số không tròn quay"], sentence: ["Zero means nothing in the basket.", "Số không tròn quay như quả trứng."], letter: "Z", spelling: "Z - E - R - O" },
    { id: "eleven", en: "Eleven", vi: "Số mười một (11)", phonetic: "/ɪˈlevn/", emoji: "1️⃣", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Number eleven", "Số mười một vui"], sentence: ["Eleven stars are shining in the sky.", "Mười một vì sao đang nhấp nháy."], letter: "E", spelling: "E - L - E - V - E - N" },
    { id: "twelve", en: "Twelve", vi: "Số mười hai (12)", phonetic: "/twelv/", emoji: "1️⃣", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Number twelve", "Số mười hai đầy đủ"], sentence: ["The clock has twelve numbers.", "Mặt đồng hồ có đủ mười hai con số."], letter: "T", spelling: "T - W - E - L - V - E" },
    { id: "pair", en: "Pair", vi: "Một đôi hai bạn", phonetic: "/per/", emoji: "👯", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["A pair of shoes", "Một đôi giày xinh"], sentence: ["A pair means two best friends.", "Một đôi là hai chiếc luôn đi cùng nhau."], letter: "P", spelling: "P - A - I - R" },
    { id: "many", en: "Many", vi: "Rất nhiều bạn", phonetic: "/ˈmeni/", emoji: "🌟", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["So many stars", "Thật nhiều bạn tốt"], sentence: ["There are many stars in the night sky.", "Có rất nhiều ngôi sao lung linh."], letter: "M", spelling: "M - A - N - Y" },
    { id: "few", en: "Few", vi: "Một vài bạn", phonetic: "/fjuː/", emoji: "✨", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["A few toys", "Một vài món đồ"], sentence: ["I have a few blocks to build a tower.", "Bé xếp vài khối gỗ thành tòa lâu đài."], letter: "F", spelling: "F - E - W" }
  ],
  "alphabet": [
    { id: "letter-i", en: "Letter I", vi: "Chữ cái I", phonetic: "/aɪ/", emoji: "ℹ️", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Letter I for Igloo", "Chữ I trong Igloo"], sentence: ["Letter I is tall with a little dot.", "Chữ I có một chấm nhỏ trên đầu."], letter: "I", spelling: "I - G - L - O - O" },
    { id: "letter-j", en: "Letter J", vi: "Chữ cái J", phonetic: "/dʒeɪ/", emoji: "🪝", colorHex: "#16A34A", bgTint: "#DCFCE7", phrase: ["Letter J for Jam", "Chữ J trong Jam"], sentence: ["Letter J curves up like a hook.", "Chữ J cong cong như chiếc lưỡi câu."], letter: "J", spelling: "J - A - M" },
    { id: "letter-k", en: "Letter K", vi: "Chữ cái K", phonetic: "/keɪ/", emoji: "🪁", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Letter K for Kite", "Chữ K trong Kite"], sentence: ["Letter K flies a kite in the wind.", "Chữ K dang hai tay thả diều vi vu."], letter: "K", spelling: "K - I - T - E" },
    { id: "letter-l", en: "Letter L", vi: "Chữ cái L", phonetic: "/el/", emoji: "🍋", colorHex: "#EAB308", bgTint: "#FEF9C3", phrase: ["Letter L for Lemon", "Chữ L trong Lemon"], sentence: ["Letter L stands straight and proud.", "Chữ L đứng thẳng hàng như cây cột."], letter: "L", spelling: "L - E - M - O - N" },
    { id: "letter-m", en: "Letter M", vi: "Chữ cái M", phonetic: "/em/", emoji: "🐒", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Letter M for Monkey", "Chữ M trong Monkey"], sentence: ["Letter M has two friendly humps.", "Chữ M như hai ngọn núi nhấp nhô."], letter: "M", spelling: "M - O - N - K - E - Y" },
    { id: "letter-n", en: "Letter N", vi: "Chữ cái N", phonetic: "/en/", emoji: "🪹", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Letter N for Nest", "Chữ N trong Nest"], sentence: ["Letter N has a safe little nest.", "Chữ N như mái vòm tổ ấm bình yên."], letter: "N", spelling: "N - E - S - T" },
    { id: "letter-o", en: "Letter O", vi: "Chữ cái O", phonetic: "/oʊ/", emoji: "🍊", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Letter O for Orange", "Chữ O trong Orange"], sentence: ["Letter O is round like an orange.", "Chữ O tròn xoe như quả cam mọng."], letter: "O", spelling: "O - R - A - N - G - E" },
    { id: "letter-p", en: "Letter P", vi: "Chữ cái P", phonetic: "/piː/", emoji: "🐼", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Letter P for Panda", "Chữ P trong Panda"], sentence: ["Letter P carries a cute round balloon.", "Chữ P mang một chiếc bóng bay xinh."], letter: "P", spelling: "P - A - N - D - A" }
  ],
  "body-parts": [
    { id: "tummy", en: "Tummy", vi: "Chiếc bụng tròn", phonetic: "/ˈtʌmi/", emoji: "🤰", colorHex: "#F59E0B", bgTint: "#FEF3C7", phrase: ["Full tummy", "Bụng no ấm áp"], sentence: ["Warm milk fills baby's little tummy.", "Sữa ấm làm chiếc bụng nhỏ no căng."], letter: "T", spelling: "T - U - M - M - Y" },
    { id: "cheek", en: "Cheek", vi: "Đôi má phúng phính", phonetic: "/tʃiːk/", emoji: "😊", colorHex: "#EC4899", bgTint: "#FCE7F3", phrase: ["Rosy cheek", "Má hồng hào"], sentence: ["Mom kisses baby's soft pink cheek.", "Mẹ thơm lên đôi má hồng phúng phính của bé."], letter: "C", spelling: "C - H - E - E - K" },
    { id: "arm", en: "Arm", vi: "Cánh tay khỏe", phonetic: "/ɑːrm/", emoji: "💪", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Strong arm", "Cánh tay chắc khỏe"], sentence: ["Baby stretches arms up to the sky.", "Bé vươn hai cánh tay chạm trời xanh."], letter: "A", spelling: "A - R - M" },
    { id: "leg", en: "Leg", vi: "Đôi chân dài", phonetic: "/leɡ/", emoji: "🦵", colorHex: "#16A34A", bgTint: "#DCFCE7", phrase: ["Fast legs", "Đôi chân nhanh nhẹn"], sentence: ["Two strong legs help baby run and jump.", "Đôi chân giúp bé nhảy nhót thật vui."], letter: "L", spelling: "L - E - G" },
    { id: "knee", en: "Knee", vi: "Đầu gối tròn", phonetic: "/niː/", emoji: "🧎", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Bendy knee", "Đầu gối gập gập"], sentence: ["My knees bend when I squat down.", "Đầu gối nhún nhảy theo điệu nhạc."], letter: "K", spelling: "K - N - E - E" },
    { id: "finger", en: "Finger", vi: "Ngón tay xinh", phonetic: "/ˈfɪŋɡər/", emoji: "🖐️", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Wiggle fingers", "Ngón tay ngo ngoe"], sentence: ["Ten fingers draw a pretty picture.", "Mười ngón tay khéo vẽ bức tranh đẹp."], letter: "F", spelling: "F - I - N - G - E - R" },
    { id: "toe", en: "Toe", vi: "Ngón chân nhỏ", phonetic: "/toʊ/", emoji: "🦶", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Tiny toes", "Ngón chân tí hon"], sentence: ["Baby wiggles little toes in water.", "Bé lắc lắc ngón chân nghịch nước mát."], letter: "T", spelling: "T - O - E" },
    { id: "shoulder", en: "Shoulder", vi: "Bờ vai ngoan", phonetic: "/ˈʃoʊldər/", emoji: "🎽", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Broad shoulder", "Bờ vai nhỏ xinh"], sentence: ["Touch your head and touch your shoulder.", "Chạm tay vào đầu rồi chạm vào vai nhé."], letter: "S", spelling: "S - H - O - U - L - D - E - R" }
  ],
  "family": [
    { id: "uncle", en: "Uncle", vi: "Chú bác tốt bụng", phonetic: "/ˈʌŋkl/", emoji: "👨", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Kind uncle", "Chú bác hiền lành"], sentence: ["Uncle plays catch with me.", "Chú cùng bé chơi chuyền bóng trên cỏ."], letter: "U", spelling: "U - N - C - L - E" },
    { id: "aunt", en: "Aunt", vi: "Cô dì dịu dàng", phonetic: "/ænt/", emoji: "👩", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Sweet aunt", "Cô dì hiền hậu"], sentence: ["Aunt tells fairy tales softly.", "Cô dịu dàng kể chuyện cổ tích cho bé."], letter: "A", spelling: "A - U - N - T" },
    { id: "cousin", en: "Cousin", vi: "Anh chị em họ", phonetic: "/ˈkʌzn/", emoji: "👧", colorHex: "#10B981", bgTint: "#D1FAE5", phrase: ["Fun cousin", "Anh chị em họ vui vẻ"], sentence: ["My cousins and I share sweet treats.", "Anh chị em cùng chia kẹo và xếp hình."], letter: "C", spelling: "C - O - U - S - I - N" },
    { id: "pet", en: "Pet Dog", vi: "Bạn cún cưng", phonetic: "/pet/", emoji: "🐕", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Loyal pet", "Bạn cún trung thành"], sentence: ["Our pet dog wags its fluffy tail.", "Bạn cún vẫy đuôi mừng bé đi học về."], letter: "P", spelling: "P - E - T" },
    { id: "sweet-home", en: "Sweet Home", vi: "Ngôi nhà tổ ấm", phonetic: "/swiːt hoʊm/", emoji: "🏡", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Cozy home", "Mái nhà ấm áp"], sentence: ["Home is full of laughter and love.", "Ngôi nhà rộn vang tiếng cười gia đình."], letter: "H", spelling: "H - O - M - E" },
    { id: "warm-hug", en: "Warm Hug", vi: "Vòng tay ôm ấm", phonetic: "/wɔːrm hʌɡ/", emoji: "🫂", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Big hug", "Cái ôm thật chặt"], sentence: ["Mom gives baby a warm big hug.", "Mẹ ôm bé thật ấm áp trước khi ngủ."], letter: "H", spelling: "H - U - G" },
    { id: "sweet-kiss", en: "Sweet Kiss", vi: "Nụ hôn thương yêu", phonetic: "/swiːt kɪs/", emoji: "💋", colorHex: "#E11D48", bgTint: "#FFE4E6", phrase: ["Gentle kiss", "Nụ hôn thơm ngọt"], sentence: ["Dad gives a bedtime kiss on forehead.", "Bố thơm lên trán chúc bé ngủ say."], letter: "K", spelling: "K - I - S - S" },
    { id: "family-love", en: "Love", vi: "Tình thương yêu", phonetic: "/lʌv/", emoji: "❤️", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["True love", "Yêu thương vô bờ"], sentence: ["We love each other every single day.", "Gia đình ta luôn yêu thương gắn bó."], letter: "L", spelling: "L - O - V - E" }
  ],
  "clothes": [
    { id: "scarf", en: "Scarf", vi: "Khăn quàng cổ", phonetic: "/skɑːrf/", emoji: "🧣", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["Warm scarf", "Khăn len ấm áp"], sentence: ["A red scarf keeps baby cozy in winter.", "Chiếc khăn len đỏ giữ ấm cổ cho bé."], letter: "S", spelling: "S - C - A - R - F" },
    { id: "boots", en: "Boots", vi: "Đôi ủng đi mưa", phonetic: "/buːts/", emoji: "👢", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Rain boots", "Ủng đi mưa xinh"], sentence: ["Yellow boots splash in water puddles.", "Đôi ủng vàng giẫm nước mưa vui quá."], letter: "B", spelling: "B - O - O - T - S" },
    { id: "pajamas", en: "Pajamas", vi: "Bộ đồ ngủ ấm", phonetic: "/pəˈdʒɑːməz/", emoji: "👘", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Soft pajamas", "Bộ đồ ngủ êm ái"], sentence: ["Baby wears cozy pajamas to sleep.", "Bé mặc bộ pijama mềm mại đi ngủ."], letter: "P", spelling: "P - A - J - A - M - A - S" },
    { id: "belt", en: "Belt", vi: "Thắt lưng gọn gàng", phonetic: "/belt/", emoji: "🥋", colorHex: "#475569", bgTint: "#F1F5F9", phrase: ["Neat belt", "Dây nịt gọn gàng"], sentence: ["The belt fits nicely around shorts.", "Chiếc thắt lưng giữ quần bé gọn gàng."], letter: "B", spelling: "B - E - L - T" },
    { id: "sunglasses", en: "Sunglasses", vi: "Kính mát mùa hè", phonetic: "/ˈsʌnɡlæsɪz/", emoji: "🕶️", colorHex: "#1E293B", bgTint: "#F8FAFC", phrase: ["Cool sunglasses", "Kính râm sành điệu"], sentence: ["Sunglasses protect eyes from bright sun.", "Kính râm che nắng cho đôi mắt sáng."], letter: "S", spelling: "S - U - N - G - L - A - S - S - E - S" },
    { id: "raincoat", en: "Raincoat", vi: "Áo mưa che mưa", phonetic: "/ˈreɪnkoʊt/", emoji: "🧥", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Yellow raincoat", "Áo mưa vàng rực"], sentence: ["Baby stays dry in the cute raincoat.", "Áo mưa che giọt nước cho bé khô ráo."], letter: "R", spelling: "R - A - I - N - C - O - A - T" },
    { id: "slippers", en: "Slippers", vi: "Dép đi trong nhà", phonetic: "/ˈslɪpərz/", emoji: "🩴", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Comfy slippers", "Dép bông êm chân"], sentence: ["Soft slippers keep feet warm indoors.", "Đôi dép êm giữ chân bé luôn ấm áp."], letter: "S", spelling: "S - L - I - P - P - E - R - S" },
    { id: "swimsuit", en: "Swimsuit", vi: "Bộ đồ bơi xinh", phonetic: "/ˈswɪmsuːt/", emoji: "🩱", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Colorful swimsuit", "Đồ bơi sặc sỡ"], sentence: ["Baby wears swimsuit to play in pool.", "Bé mặc đồ bơi tập đạp chân trong hồ."], letter: "S", spelling: "S - W - I - M - S - U - I - T" }
  ],
  "toys": [
    { id: "toy-train", en: "Toy Train", vi: "Tàu hỏa đồ chơi", phonetic: "/tɔɪ treɪn/", emoji: "🚂", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Choo choo train", "Tàu hỏa tu tu"], sentence: ["The wooden train rolls along tracks.", "Đoàn tàu hỏa gỗ chạy xình xịch trên ray."], letter: "T", spelling: "T - R - A - I - N" },
    { id: "toy-car", en: "Toy Car", vi: "Xe ô tô đồ chơi", phonetic: "/tɔɪ kɑːr/", emoji: "🚗", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["Fast toy car", "Xe ô tô đỏ"], sentence: ["Vroom vroom goes the little red car.", "Chiếc ô tô đồ chơi bon bon trên sàn nhà."], letter: "C", spelling: "C - A - R" },
    { id: "toy-drum", en: "Toy Drum", vi: "Chiếc trống đồ chơi", phonetic: "/tɔɪ drʌm/", emoji: "🥁", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Little drum", "Trống gõ tùng tùng"], sentence: ["Boom boom goes the little toy drum.", "Tùng tùng cắc tùng, tiếng trống rộn rã."], letter: "D", spelling: "D - R - U - M" },
    { id: "water-gun", en: "Water Toy", vi: "Đồ chơi phun nước", phonetic: "/ˈwɔːtər tɔɪ/", emoji: "🔫", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Splash water toy", "Đồ chơi bắn nước"], sentence: ["Splashing water makes summer cool.", "Nước bắn mát rượi trong ngày hè."], letter: "W", spelling: "W - A - T - E - R" },
    { id: "soap-bubbles", en: "Bubbles", vi: "Bong bóng xà phòng", phonetic: "/ˈbʌblz/", emoji: "🫧", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Shiny bubbles", "Bong bóng bay bay"], sentence: ["Shiny bubbles float in the breeze.", "Bong bóng bảy sắc bay lơ lửng trong gió."], letter: "B", spelling: "B - U - B - B - L - E - S" },
    { id: "spinning-top", en: "Spinning Top", vi: "Con quay tít", phonetic: "/ˈspɪnɪŋ tɑːp/", emoji: "🪅", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Twirling top", "Con quay xoay tròn"], sentence: ["The wooden top spins round and round.", "Con quay gỗ xoay tít mù trên mặt bàn."], letter: "S", spelling: "S - P - I - N" },
    { id: "toy-airplane", en: "Toy Airplane", vi: "Máy bay mô hình", phonetic: "/tɔɪ ˈerpleɪn/", emoji: "🛩️", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Flying toy plane", "Máy bay vút cao"], sentence: ["The toy plane swoops through the air.", "Chiếc máy bay lượn vòng trên tay bé."], letter: "P", spelling: "P - L - A - N - E" },
    { id: "marbles", en: "Marbles", vi: "Viên bi ve lấp lánh", phonetic: "/ˈmɑːrblz/", emoji: "🔮", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Glass marbles", "Viên bi trong veo"], sentence: ["Colorful marbles roll across floor.", "Những viên bi tròn lăn lông lốc."], letter: "M", spelling: "M - A - R - B - L - E - S" }
  ],
  "my-house": [
    { id: "bookshelf", en: "Bookshelf", vi: "Giá sách nhỏ", phonetic: "/ˈbʊkʃelf/", emoji: "📚", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Tidy bookshelf", "Kệ sách gọn gàng"], sentence: ["Colorful storybooks sit on the shelf.", "Những cuốn truyện tranh xếp ngay ngắn trên giá."], letter: "B", spelling: "B - O - O - K" },
    { id: "mirror", en: "Mirror", vi: "Chiếc gương soi", phonetic: "/ˈmɪrər/", emoji: "🪞", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Shiny mirror", "Gương soi sáng bóng"], sentence: ["Baby smiles at the face in mirror.", "Bé cười toe toét nhìn mình trong gương."], letter: "M", spelling: "M - I - R - R - O - R" },
    { id: "pillow", en: "Pillow", vi: "Chiếc gối ôm", phonetic: "/ˈpɪloʊ/", emoji: "🛌", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Soft pillow", "Gối ôm êm mềm"], sentence: ["The fluffy pillow supports baby's head.", "Chiếc gối mềm ôm ấp giấc ngủ của bé."], letter: "P", spelling: "P - I - L - L - O - W" },
    { id: "blanket", en: "Blanket", vi: "Chiếc chăn ấm", phonetic: "/ˈblæŋkɪt/", emoji: "🧶", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Warm blanket", "Chăn bông ấm cúng"], sentence: ["Cozy blanket covers baby all night.", "Chiếc chăn ấm đắp cho bé giấc ngủ ngon."], letter: "B", spelling: "B - L - A - N - K - E - T" },
    { id: "fridge", en: "Refrigerator", vi: "Tủ lạnh mát rượi", phonetic: "/rɪˈfrɪdʒəreɪtər/", emoji: "🧊", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Cool fridge", "Tủ lạnh mát lành"], sentence: ["The fridge keeps fruits and milk fresh.", "Tủ lạnh giữ sữa và quả ngọt luôn tươi."], letter: "F", spelling: "F - R - I - D - G - E" },
    { id: "fan", en: "Fan", vi: "Chiếc quạt mát", phonetic: "/fæn/", emoji: "🪭", colorHex: "#16A34A", bgTint: "#DCFCE7", phrase: ["Breezy fan", "Quạt gió mát lành"], sentence: ["The fan spins and blows gentle air.", "Chiếc quạt quay đều ru làn gió mát."], letter: "F", spelling: "F - A - N" },
    { id: "garden", en: "Garden", vi: "Khu vườn xanh", phonetic: "/ˈɡɑːrdn/", emoji: "🏡", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Green garden", "Vườn cây hoa lá"], sentence: ["Red flowers bloom in our home garden.", "Những bông hoa đua nở trong vườn nhà."], letter: "G", spelling: "G - A - R - D - E - N" },
    { id: "roof", en: "Roof", vi: "Mái ngói đỏ", phonetic: "/ruːf/", emoji: "🏠", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["Red roof", "Mái nhà che mưa"], sentence: ["The red roof keeps the house safe.", "Mái ngói đỏ che chở ngôi nhà bình yên."], letter: "R", spelling: "R - O - O - F" }
  ],
  "jobs": [
    { id: "nurse", en: "Nurse", vi: "Cô y tá hiền", phonetic: "/nɜːrs/", emoji: "🧑‍⚕️", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Caring nurse", "Y tá chăm sóc"], sentence: ["The nurse takes good care of patients.", "Cô y tá dịu dàng chăm sóc người ốm."], letter: "N", spelling: "N - U - R - S - E" },
    { id: "singer", en: "Singer", vi: "Ca sĩ hát hay", phonetic: "/ˈsɪŋər/", emoji: "🎤", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Sweet singer", "Ca sĩ giọng trong"], sentence: ["The singer sings lovely songs.", "Cô ca sĩ cất giọng hát ngọt ngào."], letter: "S", spelling: "S - I - N - G - E - R" },
    { id: "driver", en: "Driver", vi: "Bác tài xế", phonetic: "/ˈdraɪvər/", emoji: "🚌", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Safe driver", "Bác tài cẩn thận"], sentence: ["The bus driver drives safely to school.", "Bác tài xế lái xe buýt đưa đón học sinh."], letter: "D", spelling: "D - R - I - V - E - R" },
    { id: "police-officer", en: "Police Officer", vi: "Chú cảnh sát", phonetic: "/pəˈliːs ˈɔːfɪsər/", emoji: "👮", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Brave officer", "Chú cảnh sát nghiêm trang"], sentence: ["Police officer helps kids cross the street safely.", "Chú cảnh sát dắt các bé qua đường an toàn."], letter: "P", spelling: "P - O - L - I - C - E" },
    { id: "builder", en: "Builder", vi: "Chú thợ xây", phonetic: "/ˈbɪldər/", emoji: "👷", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Strong builder", "Thợ xây khéo tay"], sentence: ["The builder builds tall houses.", "Chú thợ xây xây nên những ngôi nhà đẹp."], letter: "B", spelling: "B - U - I - L - D - E - R" },
    { id: "baker", en: "Baker", vi: "Thợ làm bánh", phonetic: "/ˈbeɪkər/", emoji: "🧑‍🍳", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Sweet baker", "Bác thợ bánh thơm"], sentence: ["The baker bakes warm crusty bread.", "Bác làm ra những chiếc bánh mì thơm lừng."], letter: "B", spelling: "B - A - K - E - R" },
    { id: "gardener", en: "Gardener", vi: "Người làm vườn", phonetic: "/ˈɡɑːrdnər/", emoji: "🧑‍🌾", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Green gardener", "Người chăm sóc cây"], sentence: ["Gardener waters plants with love.", "Bác làm vườn tưới tắm cho hoa thơm."], letter: "G", spelling: "G - A - R - D - E - N - E - R" },
    { id: "scientist", en: "Scientist", vi: "Nhà khoa học", phonetic: "/ˈsaɪəntɪst/", emoji: "🧑‍🔬", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Clever scientist", "Nhà thông thái tò mò"], sentence: ["Scientist discovers amazing new things.", "Nhà khoa học khám phá những điều kỳ diệu."], letter: "S", spelling: "S - C - I - E - N - T - I - S - T" }
  ],
  "weather-seasons": [
    { id: "winter", en: "Winter", vi: "Mùa đông lạnh", phonetic: "/ˈwɪntər/", emoji: "❄️", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Chilly winter", "Mùa đông se lạnh"], sentence: ["Winter comes with warm wool coats.", "Mùa đông về bé mặc thêm áo len ấm."], letter: "W", spelling: "W - I - N - T - E - R" },
    { id: "thunder", en: "Thunder", vi: "Tiếng sấm rền", phonetic: "/ˈθʌndər/", emoji: "⚡", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Rumbling thunder", "Sấm chớp ầm ầm"], sentence: ["Thunder rumbles before fresh rain.", "Tiếng sấm rền báo hiệu cơn mưa rào."], letter: "T", spelling: "T - H - U - N - D - E - R" },
    { id: "spring-season", en: "Spring", vi: "Mùa xuân ấm áp", phonetic: "/sprɪŋ/", emoji: "🌸", colorHex: "#EC4899", bgTint: "#FCE7F3", phrase: ["Warm spring", "Mùa xuân hoa nở"], sentence: ["Spring brings sweet blossoms and birds.", "Mùa xuân ấm áp trăm hoa đua nở."], letter: "S", spelling: "S - P - R - I - N - G" },
    { id: "fog", en: "Fog", vi: "Làn sương mù", phonetic: "/fɔːɡ/", emoji: "🌫️", colorHex: "#64748B", bgTint: "#F1F5F9", phrase: ["Misty fog", "Sương sớm bồng bềnh"], sentence: ["Gentle fog blankets morning mountains.", "Màn sương sớm giăng mờ trên đỉnh núi."], letter: "F", spelling: "F - O - G" },
    { id: "breeze", en: "Breeze", vi: "Làn gió mát", phonetic: "/briːz/", emoji: "🍃", colorHex: "#10B981", bgTint: "#D1FAE5", phrase: ["Gentle breeze", "Gió thoảng mát lành"], sentence: ["Cool breeze sways the leafy trees.", "Làn gió mát đung đưa những tán lá cây."], letter: "B", spelling: "B - R - E - E - Z - E" },
    { id: "puddle", en: "Puddle", vi: "Vũng nước mưa", phonetic: "/ˈpʌdl/", emoji: "💧", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Water puddle", "Vũng nước trong veo"], sentence: ["Little duck swims near the puddle.", "Vũng nước trong phản chiếu mây trời."], letter: "P", spelling: "P - U - D - D - L - E" },
    { id: "snowflake", en: "Snowflake", vi: "Bông tuyết trắng", phonetic: "/ˈsnoʊfleɪk/", emoji: "❄️", colorHex: "#38BDF8", bgTint: "#F0F9FF", phrase: ["Tiny snowflake", "Bông tuyết nhẹ rơi"], sentence: ["Each snowflake has a pretty pattern.", "Bông tuyết lấp lánh như viên pha lê."], letter: "S", spelling: "S - N - O - W" },
    { id: "sunbeam", en: "Sunbeam", vi: "Tia nắng sớm", phonetic: "/ˈsʌnbiːm/", emoji: "☀️", colorHex: "#F59E0B", bgTint: "#FEF3C7", phrase: ["Warm sunbeam", "Tia nắng ấm áp"], sentence: ["Golden sunbeams wake up sleeping birds.", "Tia nắng ấm đánh thức chim non dậy."], letter: "S", spelling: "S - U - N" }
  ],
  "emotions": [
    { id: "peaceful", en: "Peaceful", vi: "Bình yên thư thái", phonetic: "/ˈpiːsfl/", emoji: "🕊️", colorHex: "#10B981", bgTint: "#D1FAE5", phrase: ["Quiet and peaceful", "Thư thái êm dịu"], sentence: ["Listening to birds makes baby feel peaceful.", "Tiếng chim hót líu lo mang lại cảm giác bình yên."], letter: "P", spelling: "P - E - A - C - E" },
    { id: "joyful", en: "Joyful", vi: "Vui sướng reo ca", phonetic: "/ˈdʒɔɪfl/", emoji: "🥳", colorHex: "#F59E0B", bgTint: "#FEF3C7", phrase: ["Joyful smile", "Vui tươi rạng rỡ"], sentence: ["Playing with friends brings joyful moments.", "Chơi cùng bạn bè mang lại niềm vui sướng ngập tràn."], letter: "J", spelling: "J - O - Y" },
    { id: "curious", en: "Curious", vi: "Tò mò khám phá", phonetic: "/ˈkjʊriəs/", emoji: "🤔", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Curious baby", "Bé ham học hỏi"], sentence: ["Baby is curious about how bees fly.", "Bé tò mò muốn biết cách chú ong bay."], letter: "C", spelling: "C - U - R - I - O - U - S" },
    { id: "shy", en: "Shy", vi: "Bẽn lẽn thẹn thùng", phonetic: "/ʃaɪ/", emoji: "😳", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["A little shy", "Hơi ngượng ngùng"], sentence: ["Baby smiles shyly behind mommy.", "Bé nép sau lưng mẹ cười bẽn lẽn."], letter: "S", spelling: "S - H - Y" },
    { id: "brave", en: "Brave", vi: "Dũng cảm tự tin", phonetic: "/breɪv/", emoji: "🦁", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Brave like lion", "Dũng cảm như sư tử"], sentence: ["You are brave when trying new things.", "Bé thật dũng cảm khi tự xúc ăn."], letter: "B", spelling: "B - R - A - V - E" },
    { id: "proud", en: "Proud", vi: "Tự hào hãnh diện", phonetic: "/praʊd/", emoji: "🥰", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["So proud", "Thật tự hào"], sentence: ["Mom is proud of baby's kind heart.", "Bố mẹ rất tự hào vì bé biết chia sẻ."], letter: "P", spelling: "P - R - O - U - D" },
    { id: "grateful", en: "Grateful", vi: "Biết ơn cảm ơn", phonetic: "/ˈɡreɪtfl/", emoji: "🙏", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Say thank you", "Biết nói lời cảm ơn"], sentence: ["We feel grateful for yummy meals.", "Bé biết ơn mẹ đã nấu cơm ngon."], letter: "G", spelling: "G - R - A - T - E - F - U - L" },
    { id: "cheerful", en: "Cheerful", vi: "Hoan hỉ phấn khởi", phonetic: "/ˈtʃɪrfl/", emoji: "😄", colorHex: "#E11D48", bgTint: "#FFE4E6", phrase: ["Bright cheerful", "Phấn chấn yêu đời"], sentence: ["A cheerful song brightens everyone's day.", "Bài hát vui tươi làm bừng sáng cả ngày."], letter: "C", spelling: "C - H - E - E - R - F - U - L" }
  ],
  "daily-habits": [
    { id: "drink-milk", en: "Drink Milk", vi: "Uống sữa tươi", phonetic: "/drɪŋk mɪlk/", emoji: "🥛", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Warm milk cup", "Ly sữa ấm thơm"], sentence: ["A glass of milk makes bones grow strong.", "Một ly sữa ấm giúp xương bé chắc khỏe."], letter: "M", spelling: "M - I - L - K" },
    { id: "put-on-shoes", en: "Put On Shoes", vi: "Tự xỏ giày", phonetic: "/pʊt ɑːn ʃuːz/", emoji: "👟", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Fast shoes", "Xỏ giày nhanh nhẹn"], sentence: ["Baby learns to put on shoes by self.", "Bé tự xỏ đôi giày xinh đi dạo."], letter: "S", spelling: "S - H - O - E - S" },
    { id: "tidy-room", en: "Tidy Room", vi: "Dọn phòng ngăn nắp", phonetic: "/ˈtaɪdi ruːm/", emoji: "🧹", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Clean room", "Phòng ốc tinh tươm"], sentence: ["Baby helps mommy tidy the bedroom.", "Bé giúp mẹ quét dọn phòng gọn gàng."], letter: "T", spelling: "T - I - D - Y" },
    { id: "say-hello", en: "Say Hello", vi: "Khoanh tay chào hỏi", phonetic: "/seɪ həˈloʊ/", emoji: "🙋", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Polite hello", "Khoanh tay chào ngoan"], sentence: ["Baby greets grandma with a warm hello.", "Bé khoanh tay chào bà khi đi học về."], letter: "H", spelling: "H - E - L - L - O" },
    { id: "say-thanks", en: "Say Thank You", vi: "Nói lời cảm ơn", phonetic: "/seɪ θæŋk juː/", emoji: "💝", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Sweet thanks", "Cảm ơn lịch sự"], sentence: ["Always say thank you when given a gift.", "Bé nhận quà bằng hai tay và nói cảm ơn."], letter: "T", spelling: "T - H - A - N - K" },
    { id: "exercise", en: "Exercise", vi: "Tập thể dục sáng", phonetic: "/ˈeksərsaɪz/", emoji: "🤸", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Morning stretch", "Vươn vai tập thể dục"], sentence: ["Morning exercise makes muscles strong.", "Tập thể dục buổi sáng giúp bé dẻo dai."], letter: "E", spelling: "E - X - E - R - C - I - S - E" },
    { id: "water-plants", en: "Water Plants", vi: "Tưới cây xanh", phonetic: "/ˈwɔːtər plænts/", emoji: "🪴", colorHex: "#10B981", bgTint: "#D1FAE5", phrase: ["Care for trees", "Chăm sóc mầm xanh"], sentence: ["Baby helps water flowers in garden.", "Bé cầm bình tưới nhỏ tưới cho luống hoa."], letter: "W", spelling: "W - A - T - E - R" },
    { id: "wash-face", en: "Wash Face", vi: "Rửa mặt sạch mát", phonetic: "/wɑːʃ feɪs/", emoji: "🧼", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Clean face", "Mặt sạch sáng ngời"], sentence: ["Cool water makes baby's face sparkle.", "Nước mát rửa mặt cho bé tỉnh táo."], letter: "W", spelling: "W - A - S - H" }
  ],
  "festivals": [
    { id: "christmas-tree", en: "Christmas Tree", vi: "Cây thông Noel", phonetic: "/ˈkrɪsməs triː/", emoji: "🎄", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Shining pine tree", "Cây thông rực rỡ"], sentence: ["Bright ornaments twinkle on the pine tree.", "Những quả cầu lấp lánh đung đưa trên cây thông."], letter: "T", spelling: "T - R - E - E" },
    { id: "santa-claus", en: "Santa Claus", vi: "Ông già Noel", phonetic: "/ˈsæntə klɔːz/", emoji: "🎅", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["Jolly Santa", "Ông già tuyết vui tính"], sentence: ["Santa brings smiles and cheer to all children.", "Ông già Noel đem niềm vui và tiếng cười đến muôn nhà."], letter: "S", spelling: "S - A - N - T - A" },
    { id: "pumpkin-lantern", en: "Halloween Pumpkin", vi: "Quả bí ngô đèn lồng", phonetic: "/ˈpʌmpkɪn ˈlæntərn/", emoji: "🎃", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Smiling pumpkin", "Bí ngô cười toe"], sentence: ["The orange pumpkin glows warmly in autumn.", "Quả bí ngô vàng rực thắp đèn ấm áp."], letter: "P", spelling: "P - U - M - P - K - I - N" },
    { id: "candy-cane", en: "Candy Cane", vi: "Chiếc kẹo gậy", phonetic: "/ˈkændi keɪn/", emoji: "🍬", colorHex: "#E11D48", bgTint: "#FFE4E6", phrase: ["Striped candy", "Kẹo gậy sọc đỏ trắng"], sentence: ["Sweet mint candy cane is delicious.", "Chiếc kẹo gậy sọc đỏ thơm ngọt ngào."], letter: "C", spelling: "C - A - N - D - Y" },
    { id: "frog-drum", en: "Mid-Autumn Drum", vi: "Chiếc trống ếch", phonetic: "/drʌm/", emoji: "🥁", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Rhythmic drum", "Trống gõ tùng tùng"], sentence: ["Tung tung goes the festive drum on autumn night.", "Tiếng trống tùng cắc rộn ràng đêm rằm."], letter: "D", spelling: "D - R - U - M" },
    { id: "green-rice-cake", en: "Square Rice Cake", vi: "Bánh chưng xanh", phonetic: "/skwer raɪs keɪk/", emoji: "🟩", colorHex: "#16A34A", bgTint: "#DCFCE7", phrase: ["Tet rice cake", "Bánh chưng ngày Tết"], sentence: ["Square green cake wraps the love of ancestors.", "Bánh chưng vuông vắn thơm hương nếp mới."], letter: "C", spelling: "C - A - K - E" },
    { id: "lucky-money", en: "Lucky Money", vi: "Bao lì xì đỏ", phonetic: "/ˈlʌki ˈmʌni/", emoji: "🧧", colorHex: "#B91C1C", bgTint: "#FEE2E2", phrase: ["New year luck", "Lì xì may mắn"], sentence: ["Red envelope carries wishes for health and growth.", "Bao lì xì đỏ thắm mang lời chúc bé mau lớn."], letter: "L", spelling: "L - U - C - K" },
    { id: "party-hat", en: "Party Hat", vi: "Chiếc nón sinh nhật", phonetic: "/ˈpɑːrti hæt/", emoji: "🥳", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Cone hat", "Nón chóp xinh tươi"], sentence: ["Baby wears cone hat to blow birthday candle.", "Bé đội nón chóp xinh cùng thổi nến mừng tuổi mới."], letter: "H", spelling: "H - A - T" }
  ],
  "space-planets": [
    { id: "mars", en: "Mars", vi: "Sao Hỏa đỏ", phonetic: "/mɑːrz/", emoji: "🔴", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["Red planet", "Hành tinh đỏ rực"], sentence: ["Mars is known as the red planet.", "Sao Hỏa là hành tinh đỏ trong vũ trụ."], letter: "M", spelling: "M - A - R - S" },
    { id: "jupiter", en: "Jupiter", vi: "Sao Mộc khổng lồ", phonetic: "/ˈdʒuːpɪtər/", emoji: "🪐", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Giant Jupiter", "Hành tinh to lớn nhất"], sentence: ["Jupiter is the biggest planet of all.", "Sao Mộc là người anh cả to lớn nhất."], letter: "J", spelling: "J - U - P - I - T - E - R" },
    { id: "saturn", en: "Saturn", vi: "Sao Thổ vành đai", phonetic: "/ˈsætɜːrn/", emoji: "🪐", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Ringed Saturn", "Vành đai sao Thổ"], sentence: ["Saturn wears beautiful icy rings.", "Sao Thổ đeo chiếc vòng tròn lấp lánh."], letter: "S", spelling: "S - A - T - U - R - N" },
    { id: "mercury", en: "Mercury", vi: "Sao Thủy nhỏ xinh", phonetic: "/ˈmɜːrkjəri/", emoji: "⚪", colorHex: "#64748B", bgTint: "#F1F5F9", phrase: ["Smallest planet", "Hành tinh gần mặt trời"], sentence: ["Mercury is closest to the bright sun.", "Sao Thủy bé nhỏ nằm gần mặt trời nhất."], letter: "M", spelling: "M - E - R - C - U - R - Y" },
    { id: "shooting-star", en: "Shooting Star", vi: "Mưa sao băng", phonetic: "/ˈʃuːtɪŋ stɑːr/", emoji: "🌠", colorHex: "#8B5CF6", bgTint: "#F3E8FF", phrase: ["Make a wish", "Nguyện ước sao băng"], sentence: ["Make a wish on the shooting star.", "Bé hãy ước một điều khi thấy sao băng nhé."], letter: "S", spelling: "S - T - A - R" },
    { id: "galaxy", en: "Galaxy", vi: "Dải ngân hà", phonetic: "/ˈɡæləksi/", emoji: "🌌", colorHex: "#6366F1", bgTint: "#EEF2FF", phrase: ["Starry galaxy", "Dải ngân hà huyền ảo"], sentence: ["Billions of stars live in the galaxy.", "Ngân hà chứa hàng triệu triệu vì sao tinh tú."], letter: "G", spelling: "G - A - L - A - X - Y" },
    { id: "satellite", en: "Satellite", vi: "Vệ tinh bay", phonetic: "/ˈsætəlaɪt/", emoji: "🛰️", colorHex: "#64748B", bgTint: "#F1F5F9", phrase: ["Orbiting satellite", "Vệ tinh nhân tạo"], sentence: ["The satellite orbits around Earth.", "Vệ tinh bay xung quanh Trái Đất xanh."], letter: "S", spelling: "S - A - T - E - L - L - I - T - E" },
    { id: "alien-friend", en: "Alien Friend", vi: "Bạn ngoài hành tinh", phonetic: "/ˈeɪliən/", emoji: "👽", colorHex: "#10B981", bgTint: "#D1FAE5", phrase: ["Friendly alien", "Người bạn vũ trụ"], sentence: ["The green alien waves with a smile.", "Bạn nhỏ ngoài không gian tươi cười vẫy tay."], letter: "A", spelling: "A - L - I - E - N" }
  ],
  "dinosaurs": [
    { id: "spinosaurus", en: "Spinosaurus", vi: "Khủng long gai lưng", phonetic: "/ˌspaɪnoʊˈsɔːrəs/", emoji: "🦖", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Big sail dinosaur", "Gai lưng hình cánh buồm"], sentence: ["Spinosaurus loves to swim in water.", "Khủng long gai lưng rất giỏi bơi lội."], letter: "S", spelling: "S - A - I - L" },
    { id: "parasaurolophus", en: "Parasaur", vi: "Khủng long mào dài", phonetic: "/ˌpærəsɔːr/", emoji: "🦕", colorHex: "#16A34A", bgTint: "#DCFCE7", phrase: ["Horn head dinosaur", "Mào kèn trên đầu"], sentence: ["It blows sounds through its long crest.", "Mào sừng của nó tạo ra âm thanh như tiếng kèn."], letter: "P", spelling: "P - A - R - A - S - A - U - R" },
    { id: "diplodocus", en: "Diplodocus", vi: "Khủng long đuôi roi", phonetic: "/dɪˈplɑːdəkəs/", emoji: "🦕", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Long tail dinosaur", "Chiếc đuôi dài ngoẵng"], sentence: ["Its long whip tail kept it safe.", "Chiếc đuôi dài giúp nó giữ thăng bằng."], letter: "D", spelling: "D - I - P - L - O" },
    { id: "triceratops", en: "Triceratops", vi: "Khủng long ba sừng", phonetic: "/traɪˈserətɑːps/", emoji: "🦏", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Three horns", "Ba chiếc sừng khỏe"], sentence: ["Triceratops has three sharp horns.", "Khủng long ba sừng có chiếc khiên đầu rất vững."], letter: "T", spelling: "T - R - I - C - E - R - A" },
    { id: "stegosaurus", en: "Stegosaurus", vi: "Khủng long phiến sừng", phonetic: "/ˌsteɡəˈsɔːrəs/", emoji: "🦕", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Plated back", "Hàng phiến trên lưng"], sentence: ["Stegosaurus has pointy plates on back.", "Khủng long có những chiếc gai phiến xếp dọc sống lưng."], letter: "S", spelling: "S - T - E - G - O" },
    { id: "pterodactyl", en: "Pterodactyl", vi: "Thằn lằn bay có cánh", phonetic: "/ˌterəˈdæktl/", emoji: "🦅", colorHex: "#B45309", bgTint: "#FEF3C7", phrase: ["Flying dino", "Đôi cánh lượn gió"], sentence: ["Pterodactyl soars through prehistoric skies.", "Thằn lằn bay sải cánh lượn trên bầu trời cổ đại."], letter: "P", spelling: "P - T - E - R - O" },
    { id: "ankylosaurus", en: "Ankylosaur", vi: "Khủng long giáp cứng", phonetic: "/ˌæŋkɪloʊˈsɔːr/", emoji: "🐢", colorHex: "#059669", bgTint: "#D1FAE5", phrase: ["Heavy armor", "Áo giáp như đá"], sentence: ["Its club tail protects it from dangers.", "Chiếc đuôi chùy bảo vệ nó trước kẻ thù."], letter: "A", spelling: "A - N - K - Y - L - O" },
    { id: "prehistoric-jungle", en: "Jungle", vi: "Rừng cây nguyên sinh", phonetic: "/ˈdʒʌŋɡl/", emoji: "🌴", colorHex: "#059669", bgTint: "#D1FAE5", phrase: ["Ancient jungle", "Cây xanh cổ đại"], sentence: ["Giant ferns grew tall in the dinosaur forest.", "Cây cổ thụ cao lớn trong khu rừng khủng long."], letter: "J", spelling: "J - U - N - G - L - E" }
  ],
  "playground": [
    { id: "spring-rider", en: "Spring Rider", vi: "Thú nhún lò xo", phonetic: "/sprɪŋ ˈraɪdər/", emoji: "🐴", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Bouncy horse", "Ngựa nhún nhấp nhô"], sentence: ["Baby rocks back and forth on horse.", "Bé cưỡi chú ngựa gỗ nhún nhảy nhịp nhàng."], letter: "S", spelling: "S - P - R - I - N - G" },
    { id: "trampoline", en: "Trampoline", vi: "Bạt lò xo nhảy", phonetic: "/ˈtræmpəliːn/", emoji: "🎪", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Jump high", "Bật nhảy tưng tưng"], sentence: ["Jump up high to touch the clouds.", "Bé bật nhảy tưng tưng trên mặt đệm êm."], letter: "T", spelling: "T - R - A - M - P - O - L - I - N - E" },
    { id: "tunnel", en: "Play Tunnel", vi: "Đường hầm chui", phonetic: "/ˈtʌnl/", emoji: "🚇", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Crawl through", "Chui qua đường hầm"], sentence: ["Baby crawls through the red tunnel.", "Bé khéo léo bò chui qua đường hầm màu sắc."], letter: "T", spelling: "T - U - N - N - E - L" },
    { id: "climbing-net", en: "Climbing Net", vi: "Lưới leo trèo", phonetic: "/ˈklaɪmɪŋ net/", emoji: "🧗", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Strong rope net", "Lưới thừng leo núi"], sentence: ["Hold tight and step step up.", "Bé nắm chắc dây thừng từng bước leo lên."], letter: "C", spelling: "C - L - I - M - B" },
    { id: "merry-go-round", en: "Merry-Go-Round", vi: "Vòng quay ngựa gỗ", phonetic: "/ˈmeri ɡoʊ raʊnd/", emoji: "🎠", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Spinning carousel", "Vòng xoay ngựa gỗ"], sentence: ["Horses go up and down to pleasant music.", "Những chú ngựa gỗ xoay tròn theo điệu nhạc."], letter: "M", spelling: "M - E - R - R - Y" },
    { id: "grass-lawn", en: "Green Grass", vi: "Bãi cỏ xanh mát", phonetic: "/ɡriːn ɡræs/", emoji: "🌾", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Soft lawn", "Thảm cỏ mềm mại"], sentence: ["Children run barefoot on soft green lawn.", "Các bé tung tăng chạy nhảy trên thảm cỏ non."], letter: "G", spelling: "G - R - A - S - S" },
    { id: "ball-pit", en: "Ball Pit", vi: "Nhà bóng sắc màu", phonetic: "/bɔːl pɪt/", emoji: "🔴", colorHex: "#E11D48", bgTint: "#FFE4E6", phrase: ["Ocean of balls", "Biển bóng rực rỡ"], sentence: ["Baby dives into thousand colorful balls.", "Bé ngụp lặn giữa muôn vàn trái bóng tròn."], letter: "B", spelling: "B - A - L - L" },
    { id: "ice-cream-cart", en: "Ice Cream Cart", vi: "Xe kem mát lạnh", phonetic: "/aɪs kriːm kɑːrt/", emoji: "🍦", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Sweet cold treat", "Cây kem mát rượi"], sentence: ["Vanilla ice cream tastes refreshing.", "Cây kem vani ngọt lịm tan chảy mát lạnh."], letter: "I", spelling: "I - C - E" }
  ],
  "supermarket": [
    { id: "shelf", en: "Shelf", vi: "Kệ để hàng hóa", phonetic: "/ʃelf/", emoji: "🥫", colorHex: "#B45309", bgTint: "#FEF3C7", phrase: ["Tidy shelf", "Kệ hàng ngăn nắp"], sentence: ["Rows of jars sit neatly on shelves.", "Các hộp sữa xếp ngay ngắn trên kệ hàng."], letter: "S", spelling: "S - H - E - L - F" },
    { id: "price-tag", en: "Price Tag", vi: "Thẻ giá tiền", phonetic: "/praɪs tæɡ/", emoji: "🏷️", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["Yellow tag", "Nhãn giá nhỏ xinh"], sentence: ["Each fruit has a price tag attached.", "Mỗi món đồ đều có thẻ giá rõ ràng."], letter: "P", spelling: "P - R - I - C - E" },
    { id: "paper-bag", en: "Shopping Bag", vi: "Túi đựng đồ", phonetic: "/ˈʃɑːpɪŋ bæɡ/", emoji: "🛍️", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Eco bag", "Túi giấy thân thiện"], sentence: ["Mom packs groceries into a paper bag.", "Mẹ xếp rau củ vào chiếc túi giấy xinh."], letter: "B", spelling: "B - A - G" },
    { id: "scale", en: "Scale", vi: "Cái cân hoa quả", phonetic: "/skeɪl/", emoji: "⚖️", colorHex: "#475569", bgTint: "#F1F5F9", phrase: ["Weigh apples", "Cân ký hoa quả"], sentence: ["The scale measures weight of apples.", "Chiếc cân đo xem chùm nho nặng bao nhiêu."], letter: "S", spelling: "S - C - A - L - E" },
    { id: "yogurt-pot", en: "Yogurt Pot", vi: "Hộp sữa chua dâu", phonetic: "/ˈjoʊɡərt pɑːt/", emoji: "🍨", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Berry yogurt", "Sữa chua thơm ngon"], sentence: ["Baby picks strawberry yogurt cup.", "Bé tự chọn một hộp sữa chua dâu ngọt mát."], letter: "Y", spelling: "Y - O - G - U - R - T" },
    { id: "fresh-fish", en: "Fresh Fish", vi: "Con cá tươi", phonetic: "/freʃ fɪʃ/", emoji: "🐟", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Swimming fish", "Cá tươi ngon lành"], sentence: ["Fresh fish will make delicious soup.", "Cá tươi sẽ được mẹ nấu bát canh chua ngon."], letter: "F", spelling: "F - I - S - H" },
    { id: "cereal", en: "Cereal Box", vi: "Hộp ngũ cốc", phonetic: "/ˈsɪriəl bɑːks/", emoji: "🥣", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Crisp cereal", "Ngũ cốc giòn tan"], sentence: ["Corn flakes go crunch with warm milk.", "Bé trộn ngũ cốc giòn rụm với sữa tươi."], letter: "C", spelling: "C - E - R - E - A - L" },
    { id: "receipt", en: "Receipt", vi: "Hóa đơn mua hàng", phonetic: "/rɪˈsiːt/", emoji: "🧾", colorHex: "#64748B", bgTint: "#F8FAFC", phrase: ["Long receipt", "Giấy tính tiền"], sentence: ["Cashier hands mom the paper receipt.", "Cô thu ngân trao phiếu thanh toán cho mẹ."], letter: "R", spelling: "R - E - C - E - I - P - T" }
  ],
  "opposites": [
    { id: "heavy-rock", en: "Heavy", vi: "Nặng trĩu", phonetic: "/ˈhevi/", emoji: "🪨", colorHex: "#475569", bgTint: "#F1F5F9", phrase: ["Heavy rock", "Hòn đá nặng trĩu"], sentence: ["The stone is heavy and hard to lift.", "Tảng đá nặng cần hai tay mới nhấc nổi."], letter: "H", spelling: "H - E - A - V - Y" },
    { id: "light-feather", en: "Light", vi: "Nhẹ tênh", phonetic: "/laɪt/", emoji: "🪶", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Light feather", "Chiếc lông chim nhẹ"], sentence: ["A soft feather floats in the breeze.", "Chiếc lông chim nhẹ bay lượn trong gió."], letter: "L", spelling: "L - I - G - H - T" },
    { id: "clean-sparkle", en: "Clean", vi: "Sạch bong tươm tất", phonetic: "/kliːn/", emoji: "✨", colorHex: "#10B981", bgTint: "#D1FAE5", phrase: ["Sparkling clean", "Sạch sẽ tinh tươm"], sentence: ["Washed hands are clean and fresh.", "Đôi bàn tay rửa xong sạch bong sáng bóng."], letter: "C", spelling: "C - L - E - A - N" },
    { id: "dirty-mud", en: "Dirty", vi: "Lấm lem bùn đất", phonetic: "/ˈdɜːrti/", emoji: "🐾", colorHex: "#9A3412", bgTint: "#FFEDD5", phrase: ["Muddy paws", "Bàn chân lấm lem"], sentence: ["Wash dirty boots after playing outside.", "Bé nhớ rửa sạch ủng lấm lem sau khi chơi."], letter: "D", spelling: "D - I - R - T - Y" },
    { id: "soft-cloud", en: "Soft", vi: "Mềm mại như bông", phonetic: "/sɔːft/", emoji: "☁️", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Soft cotton", "Mềm như bông gòn"], sentence: ["The teddy bear is plush and soft.", "Bạn gấu bông ôm vào thấy thật mềm mại."], letter: "S", spelling: "S - O - F - T" },
    { id: "hard-nut", en: "Hard", vi: "Cứng cáp chắc nịch", phonetic: "/hɑːrd/", emoji: "🌰", colorHex: "#78716C", bgTint: "#F5F5F4", phrase: ["Hard shell", "Vỏ hạt cứng cáp"], sentence: ["The walnut has a solid hard shell.", "Vỏ hạt dẻ cứng bảo vệ nhân bùi bên trong."], letter: "H", spelling: "H - A - R - D" },
    { id: "near-close", en: "Near", vi: "Ở thật gần", phonetic: "/nɪr/", emoji: "🤏", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Right here", "Ngay bên cạnh"], sentence: ["Mom is near and holding baby's hand.", "Mẹ luôn ở thật gần nắm chặt tay bé."], letter: "N", spelling: "N - E - A - R" },
    { id: "far-away", en: "Far", vi: "Ở tít xa xôi", phonetic: "/fɑːr/", emoji: "🔭", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Faraway star", "Ngôi sao nơi xa"], sentence: ["The shining airplane flies far away.", "Chiếc máy bay trắng bay mãi tận phương xa."], letter: "F", spelling: "F - A - R" }
  ],
  "music-instruments": [
    { id: "xylophone", en: "Xylophone", vi: "Đàn phiến mộc", phonetic: "/ˈzaɪləfoʊn/", emoji: "🪵", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Tinkling xylophone", "Gõ đàn phiến gỗ"], sentence: ["Hit the colorful bars to play tunes.", "Gõ từng thanh gỗ sắc màu nghe tiếng ting tong."], letter: "X", spelling: "X - Y - L - O - P - H - O - N - E" },
    { id: "triangle-inst", en: "Triangle", vi: "Thanh kẻng tam giác", phonetic: "/ˈtraɪæŋɡl/", emoji: "📐", colorHex: "#EAB308", bgTint: "#FEF9C3", phrase: ["Ting ting triangle", "Tiếng chuông tam giác"], sentence: ["Ting ting goes the bright silver triangle.", "Leng keng tiếng thanh kẻng tam giác trong trẻo."], letter: "T", spelling: "T - R - I - A - N - G - L - E" },
    { id: "tambourine", en: "Tambourine", vi: "Trống lắc tay tròn", phonetic: "/ˌtæmbəˈriːn/", emoji: "🪘", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Shake tambourine", "Lắc trống leng keng"], sentence: ["Shake and tap the tambourine to rhythm.", "Vừa lắc vừa gõ trống theo nhịp chân bước."], letter: "T", spelling: "T - A - M - B - O - U - R - I - N - E" },
    { id: "harmonica", en: "Harmonica", vi: "Kèn Ac-mô-ni-ca", phonetic: "/hɑːrˈmɑːnɪkə/", emoji: "🎷", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Blow harmonica", "Thổi kèn réo rắt"], sentence: ["Blow gently to make a merry song.", "Thổi nhẹ hơi tạo nên giai điệu vui tươi."], letter: "H", spelling: "H - A - R - M - O - N - I - C - A" },
    { id: "harp", en: "Harp", vi: "Đàn hạc êm dịu", phonetic: "/hɑːrp/", emoji: "🪕", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Gentle harp", "Tiếng đàn thánh thót"], sentence: ["The harp strings whisper sweet lullabies.", "Từng dây đàn ngân nga khúc ru êm đềm."], letter: "H", spelling: "H - A - R - P" },
    { id: "cymbals", en: "Cymbals", vi: "Chũm chọe vang rền", phonetic: "/ˈsɪmblz/", emoji: "🥁", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Clash cymbals", "Tiếng chõng chọe rộn"], sentence: ["Clash clash announce the marching band.", "Xoang xoang rộn rã đón đoàn diễu hành."], letter: "C", spelling: "C - Y - M - B - A - L - S" },
    { id: "microphone", en: "Microphone", vi: "Micro ca hát", phonetic: "/ˈmaɪkrəfoʊn/", emoji: "🎙️", colorHex: "#475569", bgTint: "#F1F5F9", phrase: ["Sing in mic", "Cất giọng hát vang"], sentence: ["Sing through microphone for everyone to hear.", "Bé cầm micro hát vang bài ca yêu thích."], letter: "M", spelling: "M - I - C" },
    { id: "music-notes", en: "Music Note", vi: "Nốt nhạc du dương", phonetic: "/ˈmjuːzɪk noʊt/", emoji: "🎵", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Happy melody", "Giai điệu rộn ràng"], sentence: ["Music notes dance all around the room.", "Những nốt nhạc nhảy múa ngập tràn căn phòng."], letter: "N", spelling: "N - O - T - E" }
  ],
  "school-items": [
    { id: "scissors", en: "Safety Scissors", vi: "Cây kéo thủ công", phonetic: "/ˈsɪzərz/", emoji: "✂️", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Snip scissors", "Cắt dán thủ công"], sentence: ["Baby cuts colorful paper stars carefully.", "Bé cẩn thận cắt hình ngôi sao giấy."], letter: "S", spelling: "S - C - I - S - S - O - R - S" },
    { id: "glue", en: "Glue Stick", vi: "Hồ dán giấy", phonetic: "/ɡluː stɪk/", emoji: "🧴", colorHex: "#10B981", bgTint: "#D1FAE5", phrase: ["Sticky glue", "Hồ dán chắc chắn"], sentence: ["Glue pastes colorful leaves into the album.", "Hồ dán giúp gắn chiếc lá khô vào vở."], letter: "G", spelling: "G - L - U - E" },
    { id: "notebook", en: "Notebook", vi: "Cuốn vở vẽ", phonetic: "/ˈnoʊtbʊk/", emoji: "📒", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Clean notebook", "Trang vở trắng tinh"], sentence: ["Baby draws a sunny house on clean pages.", "Bé vẽ ngôi nhà ấm áp vào trang vở xinh."], letter: "N", spelling: "N - O - T - E - B - O - O - K" },
    { id: "paintbrush", en: "Paintbrush", vi: "Cây cọ vẽ tranh", phonetic: "/ˈpeɪntbrʌʃ/", emoji: "🖌️", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Dip paintbrush", "Cọ vẽ lướt êm"], sentence: ["The paintbrush dips in blue water color.", "Cây cọ chấm màu xanh vẽ bầu trời biếc."], letter: "P", spelling: "P - A - I - N - T" },
    { id: "palette", en: "Color Palette", vi: "Khay pha màu", phonetic: "/ˈpælət/", emoji: "🎨", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Bright palette", "Bảng màu rực rỡ"], sentence: ["Mix red and yellow to make bright orange.", "Bé trộn màu đỏ và vàng tạo màu cam tươi."], letter: "P", spelling: "P - A - L - E - T - T - E" },
    { id: "blackboard", en: "Blackboard", vi: "Bảng đen lớp học", phonetic: "/ˈblækbɔːrd/", emoji: "📋", colorHex: "#1E293B", bgTint: "#F1F5F9", phrase: ["Green board", "Bảng phấn lớp học"], sentence: ["Teacher writes numbers on the board.", "Cô giáo viết những con số xinh lên bảng."], letter: "B", spelling: "B - O - A - R - D" },
    { id: "clock-school", en: "Wall Clock", vi: "Đồng hồ báo giờ", phonetic: "/klɑːk/", emoji: "⏰", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["Tick-tock clock", "Đồng hồ tích tắc"], sentence: ["Tick-tock clock tells when play time begins.", "Đồng hồ tích tắc báo giờ ra chơi vui vẻ."], letter: "C", spelling: "C - L - O - C - K" },
    { id: "chair-study", en: "Study Chair", vi: "Chiếc ghế ngồi học", phonetic: "/tʃer/", emoji: "🪑", colorHex: "#B45309", bgTint: "#FEF3C7", phrase: ["Comfy chair", "Ghế ngồi ngay ngắn"], sentence: ["Sit up straight on the wooden chair.", "Bé ngồi ngay ngắn trên chiếc ghế gỗ."], letter: "C", spelling: "C - H - A - I - R" }
  ],
  "nature-camping": [
    { id: "camping-backpack", en: "Backpack", vi: "Balo dã ngoại", phonetic: "/ˈbækpæk/", emoji: "🎒", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Sturdy backpack", "Balo đi dã ngoại"], sentence: ["Backpack carries water bottle and fruit snacks.", "Balo đựng bình nước và quả ngọt cho bé."], letter: "B", spelling: "B - A - C - K - P - A - C - K" },
    { id: "flashlight", en: "Flashlight", vi: "Đèn pin soi sáng", phonetic: "/ˈflæʃlaɪt/", emoji: "🔦", colorHex: "#CA8A04", bgTint: "#FEF9C3", phrase: ["Bright beam", "Đèn pin sáng rực"], sentence: ["Flashlight shows path through dark woods.", "Đèn pin soi sáng lối đi trong đêm trại."], letter: "F", spelling: "F - L - A - S - H - L - I - G - H - T" },
    { id: "compass", en: "Compass", vi: "La bàn chỉ hướng", phonetic: "/ˈkʌmpəs/", emoji: "🧭", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Magic compass", "Kim la bàn chỉ bắc"], sentence: ["The compass needle always points north.", "Kim la bàn giúp bé biết phương hướng."], letter: "C", spelling: "C - O - M - P - A - S - S" },
    { id: "sleeping-bag", en: "Sleeping Bag", vi: "Túi ngủ ấm áp", phonetic: "/ˈsliːpɪŋ bæɡ/", emoji: "⛺", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Warm sleeping bag", "Túi ngủ êm ấm"], sentence: ["Snuggle inside sleeping bag under the stars.", "Bé nằm ấm áp trong túi ngủ ngắm sao."], letter: "S", spelling: "S - L - E - E - P" },
    { id: "water-canteen", en: "Water Canteen", vi: "Bình nước dã ngoại", phonetic: "/ˈwɔːtər kænˈtiːn/", emoji: "🫙", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Fresh water bottle", "Bình nước mát lạnh"], sentence: ["Drink clean water when climbing hills.", "Uống nước mát khi leo dốc giúp bé khỏe khoắn."], letter: "W", spelling: "W - A - T - E - R" },
    { id: "waterfall", en: "Waterfall", vi: "Thác nước tung bọt", phonetic: "/ˈwɔːtərfɔːl/", emoji: "🌊", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Splashing waterfall", "Thác nước trắng xóa"], sentence: ["White waterfall tumbles down steep rocks.", "Dòng thác đổ bọt trắng xóa mát rượi."], letter: "W", spelling: "W - A - T - E - R - F - A - L - L" },
    { id: "pinecone", en: "Pinecone", vi: "Quả thông rừng", phonetic: "/ˈpaɪnkoʊn/", emoji: "🌲", colorHex: "#9A3412", bgTint: "#FFEDD5", phrase: ["Brown pinecone", "Quả thông nâu rơi"], sentence: ["Baby picks brown pinecones on forest path.", "Bé nhặt những quả thông rơi dưới gốc cây."], letter: "P", spelling: "P - I - N - E - C - O - N - E" },
    { id: "binoculars", en: "Binoculars", vi: "Ống nhòm ngắm chim", phonetic: "/bɪˈnɑːkjələrz/", emoji: "🔭", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Look far", "Ống nhòm nhìn xa"], sentence: ["Look through binoculars to spot eagles.", "Nhìn qua ống nhòm thấy đàn chim bay xa."], letter: "B", spelling: "B - I - N - O - C - U - L - A - R - S" }
  ],
  "sports-actions": [
    { id: "hop", en: "Hop", vi: "Nhảy lò cò", phonetic: "/hɑːp/", emoji: "🦘", colorHex: "#EA580C", bgTint: "#FFEDD5", phrase: ["Hop on one foot", "Lò cò một chân"], sentence: ["Hop hop like a happy bunny in garden.", "Bé nhảy lò cò như chú thỏ con trên cỏ."], letter: "H", spelling: "H - O - P" },
    { id: "climb", en: "Climb", vi: "Leo trèo khéo léo", phonetic: "/klaɪm/", emoji: "🧗", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Climb up", "Leo trèo an toàn"], sentence: ["Baby climbs short wooden steps carefully.", "Bé khéo léo bước lên bậc thang gỗ."], letter: "C", spelling: "C - L - I - M - B" },
    { id: "throw", en: "Throw", vi: "Ném bóng xa", phonetic: "/θroʊ/", emoji: "⚾", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Throw ball", "Ném bóng cho bạn"], sentence: ["Throw soft ball to daddy's open arms.", "Bé ném trái bóng mềm cho bố bắt."], letter: "T", spelling: "T - H - R - O - W" },
    { id: "crawl", en: "Crawl", vi: "Bò nhanh thoăn thoắt", phonetic: "/krɔːl/", emoji: "👶", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Fast crawl", "Bò nhanh thoăn thoắt"], sentence: ["Baby crawls across soft floor mat.", "Bé bò thoăn thoắt trên thảm êm."], letter: "C", spelling: "C - R - A - W - L" },
    { id: "roll", en: "Roll", vi: "Lăn tròn nhào lộn", phonetic: "/roʊl/", emoji: "🤸", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Roll like ball", "Lăn tròn vui nhộn"], sentence: ["Baby rolls safely over grass like a ball.", "Bé lăn tròn trên thảm cỏ cười giòn tan."], letter: "R", spelling: "R - O - L - L" },
    { id: "balance", en: "Balance", vi: "Giữ thăng bằng", phonetic: "/ˈbæləns/", emoji: "🤹", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Keep balance", "Đứng vững thăng bằng"], sentence: ["Walk along straight line with arms wide.", "Bé giang hai tay giữ thăng bằng bước thẳng."], letter: "B", spelling: "B - A - L - A - N - C - E" },
    { id: "wave-hand", en: "Wave", vi: "Vẫy tay chào vui", phonetic: "/weɪv/", emoji: "👋", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Wave hello", "Vẫy tay chào bạn"], sentence: ["Wave hand goodbye to friendly friends.", "Bé vẫy tay chào tạm biệt các bạn nhỏ."], letter: "W", spelling: "W - A - V - E" },
    { id: "skate", en: "Skate", vi: "Trượt patin lướt gió", phonetic: "/skeɪt/", emoji: "⛸️", colorHex: "#0284C7", bgTint: "#E0F2FE", phrase: ["Glide smooth", "Trượt lướt nhẹ nhàng"], sentence: ["Skating feels like flying with wings.", "Trượt patin nhẹ nhàng như lướt trong gió."], letter: "S", spelling: "S - K - A - T - E" }
  ],
  "health-hygiene": [
    { id: "shampoo", en: "Shampoo", vi: "Dầu gội thơm", phonetic: "/ʃæmˈpuː/", emoji: "🧴", colorHex: "#2563EB", bgTint: "#DBEAFE", phrase: ["Fragrant shampoo", "Dầu gội thơm ngát"], sentence: ["Shampoo cleans hair with soft white bubbles.", "Dầu gội tạo bọt trắng thơm gội sạch tóc bé."], letter: "S", spelling: "S - H - A - M - P - O - O" },
    { id: "comb-brush", en: "Comb", vi: "Chiếc lược xinh", phonetic: "/koʊm/", emoji: "🪮", colorHex: "#7C3AED", bgTint: "#EDE9FE", phrase: ["Smooth comb", "Lược chải suôn mượt"], sentence: ["The comb keeps baby's hair smooth.", "Chiếc lược chải tóc cho bé thật mượt mà."], letter: "C", spelling: "C - O - M - B" },
    { id: "tissue", en: "Tissue", vi: "Khăn giấy mềm", phonetic: "/ˈtɪʃuː/", emoji: "🧻", colorHex: "#64748B", bgTint: "#F8FAFC", phrase: ["Soft tissue", "Khăn giấy lau tay"], sentence: ["Wipe sneezes with a clean soft tissue.", "Bé dùng khăn giấy mềm lau mũi sạch sẽ."], letter: "T", spelling: "T - I - S - S - U - E" },
    { id: "nail-clipper", en: "Nail Clipper", vi: "Kìm bấm móng tay", phonetic: "/ˈneɪl klɪpər/", emoji: "💅", colorHex: "#DB2777", bgTint: "#FCE7F3", phrase: ["Clean nails", "Bấm móng sạch sẽ"], sentence: ["Trim nails short so dirt stays away.", "Mẹ bấm móng tay ngắn để tay luôn sạch."], letter: "N", spelling: "N - A - I - L" },
    { id: "sunscreen", en: "Sunscreen", vi: "Kem chống nắng", phonetic: "/ˈsʌnskriːn/", emoji: "🧴", colorHex: "#D97706", bgTint: "#FEF3C7", phrase: ["Sun cream", "Kem thoa bảo vệ"], sentence: ["Sunscreen keeps baby's skin safe in sun.", "Thoa kem chống nắng bảo vệ làn da của bé."], letter: "S", spelling: "S - U - N" },
    { id: "healthy-fruit", en: "Fresh Fruit", vi: "Trái cây thơm ngon", phonetic: "/freʃ fruːt/", emoji: "🍎", colorHex: "#DC2626", bgTint: "#FEE2E2", phrase: ["Juicy fruit", "Hoa quả tươi ngon"], sentence: ["Eating fresh fruit gives body energy.", "Ăn nhiều hoa quả tươi cho bé nhiều đề kháng."], letter: "F", spelling: "F - R - U - I - T" },
    { id: "hand-gel", en: "Hand Sanitizer", vi: "Gel rửa tay khô", phonetic: "/hænd ˈsænɪtaɪzər/", emoji: "🧼", colorHex: "#0D9488", bgTint: "#CCFBF1", phrase: ["Clean gel", "Gel khử khuẩn thơm"], sentence: ["Rub hands with sanitizer to kill germs.", "Xoa gel sạch khuẩn bảo vệ bàn tay bé."], letter: "H", spelling: "H - A - N - D" },
    { id: "healthy-stretch", en: "Morning Stretch", vi: "Vươn vai khỏe khoắn", phonetic: "/stretʃ/", emoji: "🤸", colorHex: "#15803D", bgTint: "#DCFCE7", phrase: ["Reach high", "Vươn vai khỏe khoắn"], sentence: ["Stretch your arms wide to grow big and strong.", "Bé vươn vai chào ngày mới cao lớn từng ngày."], letter: "S", spelling: "S - T - R - E - T - C - H" }
  ]
};

// Apply newItemsMap to topics
let updatedCount = 0;
for (const [topicId, items] of Object.entries(newItemsMap)) {
  const topic = data.topics.find(t => t.id === topicId);
  if (!topic) {
    console.warn(`Topic not found: ${topicId}`);
    continue;
  }
  // Keep first 8 items
  const baseItems = topic.vocabulary.slice(0, 8);
  const enrichedItems = items.map(it => ({
    id: it.id,
    en: it.en,
    vi: it.vi,
    phonetic: it.phonetic,
    emoji: it.emoji,
    colorHex: it.colorHex,
    bgTint: it.bgTint,
    soundEffect: "bell",
    soundLabelVi: `${it.vi}!`,
    phrase2To3y: {
      en: it.phrase[0],
      vi: it.phrase[1]
    },
    sentence3To4y: {
      en: it.sentence[0],
      vi: it.sentence[1]
    },
    phonics4To5y: {
      letter: it.letter,
      sound: `chữ ${it.letter}`,
      spelling: it.spelling,
      questionEn: `Which word starts with letter ${it.letter}?`,
      questionVi: `Đố bé từ nào bắt đầu bằng chữ ${it.letter}?`
    }
  }));

  topic.vocabulary = [...baseItems, ...enrichedItems];
  updatedCount++;
}

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Successfully updated ${updatedCount} topics in lessonsData.json!`);
