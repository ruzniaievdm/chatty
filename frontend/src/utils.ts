export function createConversationName(from_username: string, to_username: string) {
  const namesAlph = [from_username, to_username].sort();
  return `${namesAlph[0]}__${namesAlph[1]}`;
}

export function formatMessageTimestamp(timestamp?: string) {
  if (!timestamp) return;

  const data = new Date(timestamp);
  return data.toLocaleTimeString().slice(0, 5);
}