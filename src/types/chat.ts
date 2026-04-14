export type Conversation = {
  _id: string;
  members: string[];
  createdAt: string;
  updatedAt: string;
};

export type ChatUserType = {
  _id: string;
  username: string;
  email: string;
  img: string;
};

export type Message = {
  _id: string;
  conversationId: string;
  senderId: string;
  text: string;
  createdAt: string;
};

export type BaseRes<T> = {
  message: string;
  data: T;
};

export type GetUsersResType = {
  message: string;
  data: ChatUserType[];
};

export type PaginationRes<T> = BaseRes<T[]>;

export type CreateConversationBody = {
  receiverId: string;
};

export type SendMessageBody = {
  conversationId: string;
  text: string;
};
