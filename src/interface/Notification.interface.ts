export interface ResponseAPIListNotification {
  content: ContentNotification[];
  pageable: Pageable;
  totalElements: number;
  totalPages: number;
  last: boolean;
  size: number;
  number: number;
  sort: Sort[];
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

export interface ContentNotification {
  id: number;
  title: Title;
  content: string;
  type: Type;
  accountId: string;
  createdAt: Date;
  updatedAt: Date;
  read: boolean;
}

export enum Title {
  WalletAccountGeneratePIN = 'Wallet account generate PIN',
}

export enum Type {
  General = 'GENERAL',
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
