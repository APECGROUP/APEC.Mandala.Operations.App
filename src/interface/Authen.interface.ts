export interface ResponseAPILogin {
  status: number;
  message: string;
  data: Data;
}

export interface Data {
  token: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
  tokenType: string;
  scope: string;
  user: TypeUser;
}

export interface TypeUser {
  isApprove: boolean;
  id: number;
  userName: string;
  authId: string;
  status: string;
  profile: TypeProfile;
}
export interface TypeProfile {
  id: number;
  email: string;
  mobile: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string;
  gender: string;
  address: string;
  emailVerificationDate: null;
  profileVerificationDate: Date;
  dob: string;
  occupation: string;
  avatar: string;
  jobPosition: string;
  emailVerified: boolean;
  verified: boolean;
  pinSet: boolean;
  ssn: string;
  ssnIssueDate: Date;
  ssnIssuePlace: string;
  language: null;
  district: null;
  city: null;
  country: string;
  postalCode: null;
  currency: null;
  ssnType: null;
}

// login
export enum ELoginStatus {
  SUCCESS = 0, // Thành công
  INVALID_USERNAME_OR_PASSWORD = 1, // tk hoặc mk không đúng
  LOCKED_OUT = 2, // tài khoản bị khoá
  FAILED = 3, // các lỗi khác từ uaa
}

// reset password
export enum EResetPasswordStatus {
  SUCCESS = 0, // Thành công
  USERNAME_NOT_FOUND = 1, // user không tồn tại
  FAILED = 2, // lỗi khác từ uaa
}

// update profile / get profile
export enum EProfileStatus {
  SUCCESS = 0, // Thành công
  FAILED = 1, // lỗi khác từ uaa
}

// verify account
export enum EVerifyAccountStatus {
  SUCCESS = 0, // Thành công
  FILE_NOT_FOUND = 1, // file không được để trống
  MAX_SIZE_EXCEEDED = 2, // file vượt quá size
  FAILED = 3, // lỗi khác từ file service
}
