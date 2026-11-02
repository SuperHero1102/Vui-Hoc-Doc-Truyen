import charDoctor from '../assets/characters/char_doctor.jpg';
import charFirefighter from '../assets/characters/char_firefighter.jpg';
import charChef from '../assets/characters/char_chef.jpg';
import charPilot from '../assets/characters/char_pilot.jpg';
import charAstronaut from '../assets/characters/char_astronaut.jpg';
import charArtist from '../assets/characters/char_artist.jpg';
import charSinger from '../assets/characters/char_singer.jpg';
import charTeacher from '../assets/characters/char_teacher.jpg';
import charFarmer from '../assets/characters/char_farmer.jpg';
import charPolice from '../assets/characters/char_police.jpg';
import charBaker from '../assets/characters/char_baker.jpg';
import charGardener from '../assets/characters/char_gardener.jpg';
import charBuilder from '../assets/characters/char_builder.jpg';
import charDriver from '../assets/characters/char_driver.jpg';
import charNurse from '../assets/characters/char_nurse.jpg';
import charBaby from '../assets/characters/char_baby.jpg';
import charSister from '../assets/characters/char_sister.jpg';
import charBrother from '../assets/characters/char_brother.jpg';
import charPet from '../assets/characters/char_pet.jpg';
import charTeddy from '../assets/characters/char_teddy.jpg';

export interface PuzzleCharacterDef {
  id: string;
  nameVi: string;
  nameEn: string;
  taglineVi: string;
  imageUrl: string;
  bgColor: string;
}

export const PUZZLE_CHARACTERS_DATA: PuzzleCharacterDef[] = [
  {
    id: 'char-doctor',
    nameVi: 'Bác Sĩ Tí Hon',
    nameEn: 'Little Doctor',
    taglineVi: 'Bác sĩ nhí chăm sóc sức khỏe cho mọi người',
    imageUrl: charDoctor,
    bgColor: '#E0F2FE',
  },
  {
    id: 'char-firefighter',
    nameVi: 'Lính Cứu Hỏa Dũng Cảm',
    nameEn: 'Brave Firefighter',
    taglineVi: 'Chiến sĩ dũng cảm bảo vệ an toàn',
    imageUrl: charFirefighter,
    bgColor: '#FEE2E2',
  },
  {
    id: 'char-chef',
    nameVi: 'Đầu Bếp Nhí',
    nameEn: 'Little Chef',
    taglineVi: 'Đầu bếp nhí nấu những món ăn thơm ngon',
    imageUrl: charChef,
    bgColor: '#FEF3C7',
  },
  {
    id: 'char-pilot',
    nameVi: 'Phi Công Nhí',
    nameEn: 'Little Pilot',
    taglineVi: 'Phi công nhí bay lượn trên bầu trời xanh',
    imageUrl: charPilot,
    bgColor: '#E0E7FF',
  },
  {
    id: 'char-astronaut',
    nameVi: 'Nhà Du Hành Vũ Trụ',
    nameEn: 'Little Astronaut',
    taglineVi: 'Khám phá mặt trăng và các vì sao lấp lánh',
    imageUrl: charAstronaut,
    bgColor: '#EDE9FE',
  },
  {
    id: 'char-artist',
    nameVi: 'Họa Sĩ Nhí',
    nameEn: 'Little Artist',
    taglineVi: 'Vẽ nên những bức tranh rực rỡ sắc màu',
    imageUrl: charArtist,
    bgColor: '#FCE7F3',
  },
  {
    id: 'char-singer',
    nameVi: 'Ca Sĩ Nhí Vui Vẻ',
    nameEn: 'Little Singer',
    taglineVi: 'Hát vang những giai điệu vui tươi yêu đời',
    imageUrl: charSinger,
    bgColor: '#FDF4FF',
  },
  {
    id: 'char-teacher',
    nameVi: 'Cô Giáo Nhí',
    nameEn: 'Little Teacher',
    taglineVi: 'Dạy bé bao điều hay và những câu chuyện bổ ích',
    imageUrl: charTeacher,
    bgColor: '#ECFDF5',
  },
  {
    id: 'char-farmer',
    nameVi: 'Bác Nông Dân Chăm Chỉ',
    nameEn: 'Cheerful Farmer',
    taglineVi: 'Trồng cây trái ngọt lành và rau củ tươi ngon',
    imageUrl: charFarmer,
    bgColor: '#FEF9C3',
  },
  {
    id: 'char-police',
    nameVi: 'Cảnh Sát Giao Thông',
    nameEn: 'Police Officer',
    taglineVi: 'Giữ trật tự bình yên cho phố phường',
    imageUrl: charPolice,
    bgColor: '#DBEAFE',
  },
  {
    id: 'char-baker',
    nameVi: 'Thợ Làm Bánh Ngọt',
    nameEn: 'Sweet Baker',
    taglineVi: 'Làm những chiếc bánh kem ngọt ngào thơm phức',
    imageUrl: charBaker,
    bgColor: '#FFF7ED',
  },
  {
    id: 'char-gardener',
    nameVi: 'Bạn Làm Vườn Nhí',
    nameEn: 'Little Gardener',
    taglineVi: 'Chăm sóc vườn hoa khoe sắc rực rỡ',
    imageUrl: charGardener,
    bgColor: '#F0FDF4',
  },
  {
    id: 'char-builder',
    nameVi: 'Kỹ Sư Xây Dựng',
    nameEn: 'Little Builder',
    taglineVi: 'Xây những ngôi nhà xinh xắn và vững chắc',
    imageUrl: charBuilder,
    bgColor: '#FEF08A',
  },
  {
    id: 'char-driver',
    nameVi: 'Bác Tài Xế Vui Tính',
    nameEn: 'Friendly Driver',
    taglineVi: 'Đưa đón bé đi học và đi chơi an toàn',
    imageUrl: charDriver,
    bgColor: '#CFFAFE',
  },
  {
    id: 'char-nurse',
    nameVi: 'Y Tá Dịu Dàng',
    nameEn: 'Caring Nurse',
    taglineVi: 'Chăm sóc người bệnh chu đáo và ân cần',
    imageUrl: charNurse,
    bgColor: '#FFE4E6',
  },
  {
    id: 'char-baby',
    nameVi: 'Em Bé Mũm Mĩm',
    nameEn: 'Cute Baby',
    taglineVi: 'Em bé má hồng đáng yêu và hay cười',
    imageUrl: charBaby,
    bgColor: '#FDF2F8',
  },
  {
    id: 'char-sister',
    nameVi: 'Chị Gái Duyên Dáng',
    nameEn: 'Sweet Sister',
    taglineVi: 'Chị gái đảm đang luôn yêu thương em nhỏ',
    imageUrl: charSister,
    bgColor: '#FCE7F3',
  },
  {
    id: 'char-brother',
    nameVi: 'Anh Trai Năng Động',
    nameEn: 'Active Brother',
    taglineVi: 'Anh trai chơi đùa và giúp đỡ gia đình',
    imageUrl: charBrother,
    bgColor: '#E0F2FE',
  },
  {
    id: 'char-pet',
    nameVi: 'Cún Cưng Trung Thành',
    nameEn: 'Loyal Puppy',
    taglineVi: 'Người bạn nhỏ bốn chân luôn vẫy đuôi mừng rỡ',
    imageUrl: charPet,
    bgColor: '#FEF3C7',
  },
  {
    id: 'char-teddy',
    nameVi: 'Gấu Bông Đất Sét',
    nameEn: 'Clay Teddy Bear',
    taglineVi: 'Bạn gấu bông êm ái cùng bé ngủ ngon',
    imageUrl: charTeddy,
    bgColor: '#FED7AA',
  },
];
