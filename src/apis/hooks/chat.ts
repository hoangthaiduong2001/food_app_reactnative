import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createConversationApi,
  getChatUsersApi,
  getConversationsApi,
  getMessagesApi,
  sendMessageApi,
} from "../api/chat";

export const useGetConversations = () => {
  return useQuery({
    queryKey: ["conversations"],
    queryFn: getConversationsApi,
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createConversationApi,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
};

export const useGetMessages = (conversationId: string) => {
  return useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => getMessagesApi(conversationId),
    enabled: !!conversationId,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: sendMessageApi,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["messages", variables.conversationId],
      });
    },
  });
};

export const useGetChatUsers = () => {
  return useQuery({
    queryKey: ["chat-users"],
    queryFn: getChatUsersApi,
  });
};
