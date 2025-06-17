export interface ResponseAPIListBankLinking {
  content: ItemBankLinking[];
  number: number;
  size: number;
  totalElements: number;
  numberOfElements: number;
  totalPages: number;
  hasContent: boolean;
  first: boolean;
  last: boolean;
}

export interface ItemBankLinking {
  id: number;
  name: string;
  code: string;
  status: number;
  description: string;
  logo: string;
}

// login
export enum ELinkBankStatus {
  SUCCESS = 0, // Thành công
  FAILED = 1, // Lỗi chung, thử lại
  USER_NOT_EXIT = 2, //Không tồn tại người dùng
  BANK_NOT_EXIT = 3, // Ngân hàng đã được liên kết
}
