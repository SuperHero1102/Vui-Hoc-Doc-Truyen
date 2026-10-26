import type { StoryBookItem } from '../types/learning';
import { STORIES_0_TO_2 } from './stories/storiesGroup0to2';
import { STORIES_2_TO_4 } from './stories/storiesGroup2to4';
import { STORIES_4_TO_5_PART1 } from './stories/storiesGroup4to5Part1';
import { STORIES_4_TO_5_PART2 } from './stories/storiesGroup4to5Part2';

/**
 * Kho dữ liệu 53 truyện thiếu nhi đầy đủ từ đầu đến cuối cho ứng dụng "ABC Vui Học Đọc Truyện"
 * Chia theo 3 độ tuổi:
 *  - 0-2 tuổi: Đồng dao ru con, sách tranh lặp từ, thơ ca ngắn (Stories 1 - 11)
 *  - 2-4 tuổi: Ngụ ngôn con vật, thế giới diệu kỳ, phát triển nhân cách (Stories 12 - 29)
 *  - 4-5 tuổi: Cổ tích Việt Nam và Cổ tích kinh điển thế giới (Stories 30 - 53)
 *
 * Mọi câu chuyện đều được bổ sung nội dung đầy đủ từ đầu đến cuối bằng tiếng Việt có dấu,
 * giọng người kể ấm áp chậm rãi, lời thoại nhân vật sinh động có từ tượng thanh và cảm xúc,
 * các đoạn sợ hãi hay buồn bã được làm dịu nhẹ nhàng, và luôn có bài học giáo dục ý nghĩa cho bé ở cuối truyện.
 */
export const STORY_BOOKS_DATA: StoryBookItem[] = [
  ...STORIES_0_TO_2,
  ...STORIES_2_TO_4,
  ...STORIES_4_TO_5_PART1,
  ...STORIES_4_TO_5_PART2,
];
