export interface Profile {
  name: string;
}

export interface Payload {
  sub: string;
  username: string;
  changePassword: boolean;
  app_origin: string;
  profile: Profile;
}

export interface dataPaginationResponse {
  total: number;
  page: number;
  limit: number;
  data: any[];
}
