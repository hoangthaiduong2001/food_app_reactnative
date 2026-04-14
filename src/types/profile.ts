export interface IProfile {
  _id: string;
  username: string;
  email: string;
  role: string;
  address: string;
  phone: string;
  img: string;
  provider: string;
  updatedAt: string;
}

export interface GetProfileResType {
  message: string;
  data: IProfile;
}

export interface UpdateProfileBodyType {
  username?: string;
  address?: string;
  phone?: string;
  img?: string;
}

export interface UpdateProfileResType {
  message: string;
}

export interface UploadImageResType {
  message: string;
  url: string;
}

export interface GetProfileErrorType {
  message: string;
}

export interface UpdateProfileErrorType {
  message: string;
}

export interface UploadImageErrorType {
  message: string;
}
