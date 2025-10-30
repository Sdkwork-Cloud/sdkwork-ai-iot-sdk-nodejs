import type { ConversationVO } from "@/services";

/**
 * 检查两个会话ID是否匹配
 * 支持id和uuid的比较，处理空值情况
 */
export const isConversationIdMatch = (id1: string | null | undefined, id2: string | null | undefined): boolean => {
  if (!id1 || !id2) {
    return false;
  }
  return id1 === id2;
};

/**
 * 检查会话对象是否匹配给定的会话ID
 * 支持id和uuid的比较，处理空值情况
 */
export const isConversationMatch = (conversation: ConversationVO|any, targetId: string | null | undefined): boolean => {
  if (!conversation || !targetId) {
    return false;
  }
  return isConversationIdMatch(conversation.id, targetId) || 
         isConversationIdMatch(conversation.uuid, targetId);
};

/**
 * 检查两个会话对象是否相同
 * 支持id和uuid的比较，处理空值情况
 */
export const isSameConversation = (c1: ConversationVO | any, c2: ConversationVO | any): boolean => {
  if (!c1 || !c2) {
    return false;
  }
  return isConversationIdMatch(c1.id, c2.id) || 
         isConversationIdMatch(c1.uuid, c2.uuid) ||
         isConversationIdMatch(c1.id, c2.uuid) ||
         isConversationIdMatch(c1.uuid, c2.id);
};

/**
 * 统一时间格式化函数
 */
export const formatDateTime = (date: Date): string => {
  const pad = (num: number) => num.toString().padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`;
};