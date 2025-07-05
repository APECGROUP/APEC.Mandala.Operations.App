// models/notificationModel.ts

import {
  fakeBodyNotification,
  fakeData,
  fakeDataHotel,
  fakeNote,
  fakeTitleNotification,
  mockDepartments,
  mockRequesters,
} from '@/data/DataFake';

/**
 * Interface định nghĩa 1 notification.
 */
export interface ContentNotification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  date: string; // ISO string (ví dụ: '2025-06-02T09:30:00Z')
  location: { id: string; name: string };
  department: { id: string; name: string };
  requester: { id: string; name: string };
  prNo: string;
  content: string;
  note: string;
}

/**
 * Tổng số notification “giả” để trang. Ở đây giả lập 50 item.
 */
const TOTAL_NOTIFICATIONS = 50;

/**
 * Tạo mảng 50 notifications giả lập. Mỗi item có:
 * - id: 1..50
 * - title: “Notification #<id>”
 * - body: “Đây là nội dung thông báo #<id>”
 * - read: false ban đầu
 * - date: random trong tháng 5–6/2025
 */
const ALL_FAKE_NOTIFICATIONS: ContentNotification[] = Array.from(
  { length: TOTAL_NOTIFICATIONS },
  (_, idx) => {
    const id = idx + 1;
    // Sinh ngày ngẫu nhiên giữa 2025-05-01 và 2025-06-30
    const randomTimestamp =
      new Date(2025, 4, 1).getTime() + Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000;
    const date = new Date(randomTimestamp).toISOString();

    // Lấy index từ 0-3 để đảm bảo title và body khớp nhau
    const notificationIndex = idx % 4;
    const prNo = `PR20240624#${String(Math.floor(Math.random() * 10000) + 1).padStart(4, '0')}`;

    const randomDepartment = mockDepartments[Math.floor(Math.random() * mockDepartments.length)];
    const randomRequester = mockRequesters[Math.floor(Math.random() * mockRequesters.length)];

    return {
      prNo: prNo,
      id,
      title: fakeTitleNotification[notificationIndex],
      body: fakeBodyNotification[notificationIndex],
      content: fakeBodyNotification[notificationIndex],
      read: idx % 3 === 0,
      date,
      note: fakeNote[Math.floor(Math.random() * fakeNote.length)],
      department: randomDepartment,
      requester: randomRequester,
      location: fakeDataHotel[Math.floor(Math.random() * fakeDataHotel.length)],
      createdAt: date, // Giả định ngày tạo cố định
      estimateDate: date, // Giả định ngày ước tính cố định
    };
  },
);

// Cache để tránh gọi API trùng lặp
const cache = new Map<string, ContentNotification[]>();

function getCacheKey(page: number, limit: number, key: string = ''): string {
  return `${page}_${limit}_${key}`;
}

/**
 * Giả lập gọi API, trả về một “trang” notifications (limit = 10).
 *
 * @param pageNumber 1-based index
 * @param limit số phần tử/trang (mặc định 10)
 * @param key search key (không dùng ở đây, để tương thích)
 * @returns Promise<ContentNotification[]>
 */
export async function fetchNotificationData(
  pageNumber: number,
  limit: number = 10,
  key: string = '',
): Promise<ContentNotification[]> {
  const cacheKey = getCacheKey(pageNumber, limit, key);
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)!;
  }
  // Giả lập delay
  await new Promise(resolve => setTimeout(resolve, 800));
  const start = (pageNumber - 1) * limit;
  const end = Math.min(start + limit, ALL_FAKE_NOTIFICATIONS.length);
  const pageData = ALL_FAKE_NOTIFICATIONS.slice(start, end);
  cache.set(cacheKey, pageData);
  // Giới hạn cache size để tránh memory leak
  if (cache.size > 100) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  return pageData;
}

export const clearNotificationCache = () => {
  cache.clear();
};
