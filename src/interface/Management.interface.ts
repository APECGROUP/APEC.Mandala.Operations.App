export interface ResponseAPIManagementMoney {
  content: detailSourceMoney[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: any[];
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface detailSourceMoney {
  user: User;

  id: number;
  userId: number;
  bankId: number;
  bank: Bank | null;
  token: string;
  cardNumber: string;
  accountNo: null;
  status: number;
  subscriptionType: string;
  cardType: null;
  subscriptionSrc: string;
  subDate: Date;
  expiryDate: Date;
}

export interface Bank {
  id: number;
  name: string;
  code: string;
  status: number;
  description: string;
  logo: string;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: any[];
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface User {
  id: number;
  email: string;
  mobile: string;
  firstName: null;
  lastName: null;
  fullName: string;
  gender: null;
  address: null;
  emailVerificationDate: null;
  profileVerificationDate: null;
  dob: Date;
  occupation: string;
  jobPosition: string;
  emailVerified: boolean;
  verified: boolean;
  pinSet: boolean;
  ssn: null;
  language: null;
  district: null;
  city: null;
  country: null;
  postalCode: null;
  currency: null;
  ssnType: null;
}
