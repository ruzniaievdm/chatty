export function createConversationName(fromUsername: string, toUsername: string) {
  const namesAlph = [fromUsername, toUsername].sort();
  return `${namesAlph[0]}__${namesAlph[1]}`;
}

export function extractParticipationName(conversationName?: string, activeUsername?: string) {
  if (!conversationName) return '';
  const parts = conversationName.split("__");
  return parts.filter(part => part !== activeUsername)[0];
}

export function formatMessageTimestamp(timestamp?: string) {
  if (!timestamp) return;

  const data = new Date(timestamp);
  return data.toLocaleDateString();
}