// @ts-nocheck
import { useContext, useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import axios from "../axios";
import { AuthContext } from "../context/AuthContext";
import { ConversationModel } from "../models/Conversation";
import { formatMessageTimestamp } from "../utils";

const ActiveConversations = () => {
  const { user } = useContext(AuthContext);
  const [conversations, setActiveConversations] = useState<ConversationModel[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const { data } = await axios.get('api/conversations/', {
        headers: {
          Authorization: `Token ${user?.token}`
        }
      })

      setActiveConversations(data);
    }
    fetchUsers();
  }, [user])

  return (
    <div>
      {conversations.map((conversation) => {
        const conversationLink = `/chat/${conversation.name}`;
        return (
          <Link
            to={conversationLink}
            key={conversation.other_user.username}
          >
            <div className="border border-gray-200 w-full p-3">
              <h3 className="text-xl font-semibold text-gray-800">{conversation.other_user.username}</h3>
              <div className="flex justify-between">
                <p className="text-gray-700">{conversation.last_message?.content}</p>
                <p className="text-gray-700">{formatMessageTimestamp(conversation.last_message?.timestamp)}</p>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  );
}

export default ActiveConversations;