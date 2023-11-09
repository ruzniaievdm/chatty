import { AuthContextProvider } from "./context/AuthContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { Chat } from "./components/Chat";
import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { Conversations } from "./components/Conversations";
import { ProtectedRoute } from "./components/ProtectedRoute";
import ActiveConversations from "./components/ActiveConversations";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <AuthContextProvider>
              {<Navbar />}
            </AuthContextProvider>
          }
        >
          <Route path="" element={
            <ProtectedRoute>
              <Conversations />
            </ProtectedRoute>
          } />
          <Route path="chat/:conversationName" element={<Chat />} />
          <Route path="conversations/" element={
            <ProtectedRoute>
              <ActiveConversations />
            </ProtectedRoute>
          } />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter >
  );
}