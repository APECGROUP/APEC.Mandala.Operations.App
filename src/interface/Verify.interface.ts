import { TypeUser } from './Authen.interface';

export interface ResponseImageElement {
  originalPath: string;
  base64: string;
  type: string;
  height: number;
  width: number;
  filename: string;
  fileSize: number;
  uri: string;
  sourceURL?: string;
  path?: string;
  mime?: string;
}

// verify account / register card
export enum EVerifyRegisterCardStatus {
  SUCCESS = 0, // Thành công
  FAILED = 1, // Lỗi chung, thử lại
  SESSION_INVALID = 3, // session id không hợp lệ
  IMAGE_CARD_INVALID = 4, // ảnh không hợp lệ
  RESOURCE_EXISTS = 6, // tài nguyên đã tồn tại rồi
  POOR_IMAGE_QUALITY = 7, // chất lượng hình ảnh tải lên kém
  IMAGE_FAKE = 8, // ảnh giấy tờ tùy thân có ảnh chân dung nghi ngờ giả mạo
}

// verify account / register face
export enum EVerifyRegisterFaceStatus {
  SUCCESS = 0, // Thành công
  FAILED = 1, // Lỗi chung, thử lại
  SESSION_INVALID = 3, // session id không hợp lệ
  IMAGE_NOT_MATCH = 4, // 2 ảnh không khớp với nhau
  IMAGE_INVALID = 5, // ảnh không hợp lệ
}

// verify account / submit
export enum EVerifySubmitStatus {
  SUCCESS = 0, // Thành công
  FAILED = 1, // Lỗi chung, thử lại
  SESSION_INVALID = 3, // session id không hợp lệ
}

export interface ResponseAPISubmitVerify {
  status: number;
  message: string;
  data: Data;
}

export interface Data {
  id: string;
  customer: string;
  userId: string;
  reviewStatus: string;
  status: string;
  metadata: Metadata;
  result: Result;
  user: TypeUser;
  success: boolean;
}

export interface Metadata {
  is_sdk: boolean;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Result {}
