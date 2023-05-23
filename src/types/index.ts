export interface IPaginationParam {
  page?: number;
  per_page?: number;
}

export interface ISearchParam {
  query?: string;
}

export interface IPagination<T> {
  list: T;
  page: number;
  per_page: number;
  count: number;
}

export interface IIdentifier {
  id: string;
}

export interface IUserId {
  user_id: string;
}

export interface Params<T> {
  data: T;
}
