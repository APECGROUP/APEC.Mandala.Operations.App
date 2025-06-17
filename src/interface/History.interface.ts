export interface ListTitleHistory {
  id: number;
  name: string;
  description: null;
  status: number;
  createBy: null | string;
  updateBy: null;
}
export interface ResponseAPIListHistory {
  content: ContentHistory[];
  pageable: Pageable;
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort[];
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}

export interface ContentHistory {
  id: number;
  fromWallet: null;
  toWallet: null;
  amount: number;
  fee: null;
  totalAmount: null;
  currencyCode: string;
  transDate: Date;
  transId: null;
  description: string;
  paymentSource: string;
  respCode: string;
  respMsg: string;
  preBalance: null;
  postBalance: null;
  status: number;
  transType: ListTitleHistory;
}

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: Sort[];
  offset: number;
  paged: boolean;
  unpaged: boolean;
}

export interface Sort {
  direction: string;
  property: string;
  ignoreCase: boolean;
  nullHandling: string;
  ascending: boolean;
  descending: boolean;
}
