// models/notificationModel.ts

/**
 * Interface định nghĩa 1 notification.
 */
export interface ContentNotification {
  id: number;
  title: string;
  body: string;
  read: boolean;
  date: string; // ISO string (ví dụ: '2025-06-02T09:30:00Z')
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
  {length: TOTAL_NOTIFICATIONS},
  (_, idx) => {
    const id = idx + 1;
    // Sinh ngày ngẫu nhiên giữa 2025-05-01 và 2025-06-30
    const randomTimestamp =
      new Date(2025, 4, 1).getTime() +
      Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000;
    const date = new Date(randomTimestamp).toISOString();

    return {
      id,
      title: `Chờ Kế toán trưởng duyệt #${id}`,
      body: `Bạn có đơn hàng PR20250409#0003 chờ KTT duyệt ${id}.`,
      read: false,
      date,
    };
  },
);

/**
 * Giả lập gọi API, trả về một “trang” notifications (limit = 10).
 *
 * @param pageNumber 1-based index
 * @param limit số phần tử/trang (mặc định 10)
 * @returns Promise<{ data: ContentNotification[]; lastPage: boolean }>
 */
export function fetchNotificationData(
  pageNumber: number,
  limit: number = 10,
): Promise<{data: ContentNotification[]; lastPage: boolean}> {
  console.log('API', pageNumber);
  return new Promise(resolve => {
    setTimeout(() => {
      const start = (pageNumber - 1) * limit;
      const end = Math.min(start + limit, ALL_FAKE_NOTIFICATIONS.length);
      const pageData = ALL_FAKE_NOTIFICATIONS.slice(start, end);
      const lastPage = end >= ALL_FAKE_NOTIFICATIONS.length;
      resolve({data: pageData, lastPage});
    }, 800); // Giả lập độ trễ 800ms
  });
}
