// get participant from url and check whether is exists -> display form
// on user join make participant online -> show is online
// on user leave make participant disconnected -> show is offline

import { KeyboardEvent, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
// import classNames from "classnames";


import { AuthContext } from '../../context/AuthContext';
import { ConversationModel } from "../../models/Conversation";
import { MessageModel } from "../../models/Message";
import { Message } from "../Message";
import { extractParticipationName } from "../../utils";

function Chat() {
  const { user } = useContext(AuthContext);
  const [participant, setParticipant] = useState<string>('');
  const [participantIsOnline, setParticipantIsOnline] = useState<boolean>(false);
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const [conversation, setConversation] = useState<ConversationModel | null>(null);
  const [message, setMessage] = useState("");
  const { conversationName } = useParams();

  const wsLink = new URL(`ws/chat/${conversationName}`, process.env.REACT_APP_BASE_WS_URL).href;
  const { readyState, sendJsonMessage } = useWebSocket(user ? wsLink : null, {
    queryParams: {
      token: user ? user.token : "",
    },

    onOpen: () => {
      console.log("Connected!");
    },

    onClose: (e) => {
      console.log("Disconnected!");
    },

    onMessage: (e) => {
      const data = JSON.parse(e.data);
      console.log(data);

      switch (data.type) {
        case "chat_message_echo":
          setMessageHistory((prev: any) => prev.concat(data.message));
          break;
        case "last_50_messages":
          setMessageHistory(data.messages);
          break;
        case "user_join":
          handleUserStatusChange(data.user, true);
          break;
        case "user_leave":
          console.log('Leave', data.user);

          handleUserStatusChange(data.user, false);
          break;
        case "online_user_list":
          // setParticipants(data.users);
          break;
        default:
          console.error("Unknown message type!");
          break;
      }
    }
  });

  useEffect(() => {
    setParticipant(extractParticipationName(conversationName, user?.username))
  }, [conversationName])

  // const connectionStatus = {
  //   [ReadyState.CONNECTING]: "Connecting",
  //   [ReadyState.OPEN]: "Open",
  //   [ReadyState.CLOSING]: "Closing",
  //   [ReadyState.CLOSED]: "Closed",
  //   [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  // }[readyState];

  function handleChangeMessage(e: any) {
    setMessage(e.target.value);
  }

  const handleSubmit = () => {
    sendJsonMessage({
      type: "chat_message",
      message,
    });
    setMessage("");
  };

  const handleKeypress = (e: KeyboardEvent) => {
    if (e.charCode === 13) {
      handleSubmit();
    }
  };

  const handleUserStatusChange = (username: string, isOnline: boolean) => {
    if (user?.username !== username && conversationName?.includes(username)) {
      setParticipantIsOnline(isOnline && readyState == ReadyState.OPEN);
    }
  }

  return (
    <div className="border border-slate-300 p-4">
      <div className="flex items-center space-x-6">
        <img className="shrink-0 h-12 w-12 rounded-full" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1361&q=80" alt="Picture in future here" />
        <p className="text-sm font-large text-slate-300 ml-2">{participant}</p>
        {participantIsOnline && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
      </div>
      <hr />
      {messageHistory.map((message: MessageModel) => (
        <Message key={message.id} message={message} />
      ))}
      <div className="flex items-center space-x-6">
        <input
          name="message"
          placeholder="Message"
          onChange={handleChangeMessage}
          value={message}
          onKeyPress={handleKeypress}
          className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400"
        />
        <button className="px-4 py-1 rounded-full border bg-sky-500" onClick={handleSubmit}>
          Send
        </button>
      </div>
    </div>
  )
};


export default Chat;