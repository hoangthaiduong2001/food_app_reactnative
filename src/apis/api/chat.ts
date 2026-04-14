import api from "@/config/axios";
import {
  BaseRes,
  Conversation,
  CreateConversationBody,
  GetUsersResType,
  Message,
  SendMessageBody,
} from "@/types/chat";
import { AxiosError } from "axios";

type ErrorType = {
  message: string;
};

export const getChatUsersApi = async (): Promise<GetUsersResType> => {
  try {
    const res = await api.get("/chat/chat-users");
    return res.data;
  } catch (error) {
    const axiosError = error as AxiosError<ErrorType>;
    throw (
      axiosError.response?.data ?? {
        message: axiosError.message,
      }
    );
  }
};

export const getConversationsApi = async (): Promise<
  BaseRes<Conversation[]>
> => {
  try {
    const res = await api.get("/chat/conversations");
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorType>;
    throw err.response?.data ?? { message: err.message };
  }
};

export const createConversationApi = async (
  body: CreateConversationBody,
): Promise<BaseRes<Conversation>> => {
  try {
    const res = await api.post("/chat/conversation", body);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorType>;
    throw err.response?.data ?? { message: err.message };
  }
};

export const getMessagesApi = async (
  conversationId: string,
): Promise<BaseRes<Message[]>> => {
  try {
    const res = await api.get(`/chat/messages/${conversationId}`);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorType>;
    throw err.response?.data ?? { message: err.message };
  }
};

export const sendMessageApi = async (
  body: SendMessageBody,
): Promise<BaseRes<Message>> => {
  try {
    const res = await api.post("/chat/message", body);
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorType>;
    throw err.response?.data ?? { message: err.message };
  }
};
