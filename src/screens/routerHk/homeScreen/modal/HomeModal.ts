// src/enums/roomEnums.ts

/**
 * Trạng thái dọn phòng của Housekeeping (HK)
 */
export enum CleaningStatus {
  Clean = 'Clean', // Chổi xanh dương
  Inspected = 'Inspected', // Chổi xanh lá
  Pickup = 'Pickup', // Chổi vàng
  Dirty = 'Dirty', // Chổi đỏ
  None = 'None', // Không có trạng thái dọn phòng cụ thể
}

/**
 * Trạng thái tổng quát của phòng (từ chấm màu)
 */
export enum RoomOccupancyStatus {
  Reserved = 'Reserved', // Chấm xanh lá (Đặt phòng)
  Empty = 'Empty', // Chấm xanh dương (Phòng trống)
  Occupied = 'Occupied', // Chấm cam (Có người)
  None = 'None', // Không có trạng thái chiếm dụng cụ thể
}

/**
 * Trạng thái của phòng liên quan đến khách (check-in/check-out)
 */
export enum GuestStatus {
  CheckOutAndCheckIn = 'CheckOutAndCheckIn', // Có khách check out & check in (2 người đổi chiều)
  CheckIn = 'CheckIn', // Có khách check in (người xanh lá)
  CheckOut = 'CheckOut', // Có khách check out (người đỏ)
  None = 'None', // Không có trạng thái khách cụ thể
  Lock = 'Lock', // Khóa phòng
}

/**
 * Trạng thái khóa phòng
 */
export enum LockStatus {
  Locked = 'Locked', // Khóa phòng
  Unlocked = 'Unlocked', // Không khóa
}

/**
 * Trạng thái chờ check out
 */
export enum PendingCheckoutStatus {
  Pending = 'Pending', // Cờ cam (Phòng chờ check out)
  None = 'None', // Không chờ check out
}

/**
 * Interface cho một phòng cụ thể
 */
export interface RoomData {
  id: string;
  roomNumber: string; // Ví dụ: "101 - DL1" hoặc "F01-R01"
  floor: string; // Ví dụ: "Tầng 1"
  numberOfGuests?: number; // Số khách (ví dụ: (02)), có thể là undefined

  // Các trạng thái chi tiết sử dụng enum
  cleaningStatus: CleaningStatus;
  occupancyStatus: RoomOccupancyStatus;
  guestStatus: GuestStatus;
  lockStatus: LockStatus;
  pendingCheckoutStatus: PendingCheckoutStatus;
  isFlag: boolean;
}

/**
 * Interface cho một tầng, chứa một mảng các phòng
 */
export interface FloorData {
  floorNumber: number; // Số tầng (ví dụ: 1, 2, ..., 29)
  floorName: string; // Tên hiển thị của tầng (ví dụ: "Tầng 1")
  rooms: RoomData[]; // Mảng các phòng thuộc tầng này
}

/**
 * Interface cho phản hồi API có phân trang
 */
export interface PaginatedFloorResponse {
  data: FloorData[]; // Mảng các tầng được trả về cho trang hiện tại
  currentPage: number; // Trang hiện tại
  totalPages: number; // Tổng số trang
  totalFloors: number; // Tổng số tầng có sẵn
  floorsPerPage: number; // Số tầng trên mỗi trang (limit)
}

/**
 * Hàm sinh dữ liệu cho một phòng cụ thể.
 * Sẽ chọn ngẫu nhiên các trạng thái từ các enum để tạo ra sự đa dạng.
 *
 * @param floorNumber Số tầng hiện tại (1 đến numberOfFloors)
 * @param roomIndex Index của phòng trên tầng (0 đến roomsPerFloor - 1)
 * @returns Một đối tượng RoomData được tạo ra.
 */
function generateSingleRoom(floorNumber: number, roomIndex: number): RoomData {
  const floorName = `Tầng ${floorNumber}`;
  // Tạo số phòng dạng "F01-R01" để đảm bảo duy nhất và dễ đọc
  const id = `${floorNumber}${roomIndex < 10 ? '0' : ''}${roomIndex + 1}`;

  // Chọn ngẫu nhiên các trạng thái từ các enum
  const cleaningStatus =
    Object.values(CleaningStatus)[Math.floor(Math.random() * Object.values(CleaningStatus).length)];
  const occupancyStatus =
    Object.values(RoomOccupancyStatus)[
      Math.floor(Math.random() * Object.values(RoomOccupancyStatus).length)
    ];
  const guestStatus =
    Object.values(GuestStatus)[Math.floor(Math.random() * Object.values(GuestStatus).length)];
  // Giảm tỷ lệ ra locked xuống còn 20%
  const lockStatus = Math.random() < 0.2 ? LockStatus.Locked : LockStatus.Unlocked;
  Object.values(LockStatus)[Math.floor(Math.random() * Object.values(LockStatus).length)];
  const pendingCheckoutStatus =
    Object.values(PendingCheckoutStatus)[
      Math.floor(Math.random() * Object.values(PendingCheckoutStatus).length)
    ];

  // Số khách ngẫu nhiên, chỉ hiển thị nếu có trạng thái chiếm dụng hoặc khách
  let numberOfGuests: number | undefined;
  if (occupancyStatus === RoomOccupancyStatus.Occupied || guestStatus !== GuestStatus.None) {
    numberOfGuests = `(0${Math.floor(Math.random() * 4) + 1})`; // 1 đến 4 khách
  } else {
    numberOfGuests = undefined;
  }

  // Để đảm bảo có một số mẫu giống hệt ảnh, chúng ta có thể thêm logic ở đây
  // Ví dụ: Đảm bảo một số phòng nhất định có trạng thái cụ thể
  // Tuy nhiên, với yêu cầu "không hardcode" và "ngẫu nhiên", chúng ta sẽ để nó ngẫu nhiên hoàn toàn.
  // Nếu bạn muốn các mẫu cụ thể xuất hiện thường xuyên hơn, chúng ta có thể điều chỉnh trọng số.

  return {
    id: id,
    roomNumber: '101 - DL1', // Giữ nguyên "101 - DL1" như trong ảnh cho tất cả các thẻ
    floor: floorName,
    numberOfGuests: numberOfGuests,
    cleaningStatus: cleaningStatus,
    occupancyStatus: occupancyStatus,
    guestStatus: guestStatus,
    lockStatus: lockStatus,
    pendingCheckoutStatus: pendingCheckoutStatus,
    isFlag: Math.random() < 0.2,
  };
}

/**
 * Hàm sinh dữ liệu cho tất cả các tầng và phòng.
 *
 * @param totalFloors Tổng số tầng cần sinh.
 * @param roomsPerFloor Số phòng trên mỗi tầng.
 * @returns Mảng chứa tất cả các đối tượng FloorData.
 */
function generateAllFloors(totalFloors: number, roomsPerFloor: number): FloorData[] {
  const allFloors: FloorData[] = [];
  for (let i = 1; i <= totalFloors; i++) {
    const roomsInFloor: RoomData[] = [];
    for (let j = 0; j < roomsPerFloor; j++) {
      roomsInFloor.push(generateSingleRoom(i, j));
    }
    allFloors.push({
      floorNumber: i,
      floorName: `Tầng ${i}`,
      rooms: roomsInFloor,
    });
  }
  return allFloors;
}

// Biến lưu trữ tất cả dữ liệu tầng (được sinh ra một lần)
let cachedAllFloors: FloorData[] | null = null;
const TOTAL_FLOORS = 29;
const ROOMS_PER_FLOOR = 50;

/**
 * Hàm chính để lấy dữ liệu tầng có phân trang.
 *
 * @param page Số trang cần lấy (bắt đầu từ 1).
 * @param limit Số lượng tầng trên mỗi trang.
 * @returns Promise chứa đối tượng PaginatedFloorResponse.
 */
export const fetchPaginatedFloorData = async (
  page: number,
  limit: number = 5, // Mặc định 5 tầng mỗi trang để dễ test phân trang
): Promise<PaginatedFloorResponse> => {
  // Mô phỏng độ trễ của API
  await new Promise(resolve => setTimeout(resolve, 500));

  // Sinh dữ liệu toàn bộ tầng nếu chưa có
  if (!cachedAllFloors) {
    cachedAllFloors = generateAllFloors(TOTAL_FLOORS, ROOMS_PER_FLOOR);
    console.log(
      `Đã sinh tổng cộng ${cachedAllFloors.length} tầng và ${
        TOTAL_FLOORS * ROOMS_PER_FLOOR
      } phòng.`,
    );
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedFloors = cachedAllFloors.slice(startIndex, endIndex);

  const totalPages = Math.ceil(TOTAL_FLOORS / limit);
  console.log('API: ', {
    data: paginatedFloors,
    currentPage: page,
    totalPages: totalPages,
    totalFloors: TOTAL_FLOORS,
    floorsPerPage: limit,
  });
  return {
    data: paginatedFloors,
    currentPage: page,
    totalPages: totalPages,
    totalFloors: TOTAL_FLOORS,
    floorsPerPage: limit,
  };
};
