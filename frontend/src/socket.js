import useWebSocket, { ReadyState } from 'react-use-websocket';

const createSocket = (roomName) => {
  const path = `ws/chat/${roomName}/`;

  const webSocket = useWebSocket(`ws://localhost:8000/${path}`);

  return webSocket;
};

export { createSocket };
