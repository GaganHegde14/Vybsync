import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ChatPage from "./pages/ChatPage";
import JoyMessagesTemplate from "./pages/chattemplate/App";
import JoySignInSideTemplate from "./components/Athentication/Login";
import JoyOrderDashboardTemplate from "./pages/ProfilePage/App";
import SignUp from "./components/Athentication/SignUp";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Redirect '/' to '/login' */}
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<JoySignInSideTemplate />} />
        <Route path="/join" element={<SignUp />} />
        <Route path="/ChatPage" element={<ChatPage />} />
        <Route
          path="/Chathome"
          element={<JoyMessagesTemplate section="home" />}
        />
        <Route path="/home" element={<JoyMessagesTemplate section="home" />} />
        <Route path="/work" element={<JoyMessagesTemplate section="work" />} />
        <Route
          path="/groups"
          element={<JoyMessagesTemplate section="groups" />}
        />
        <Route
          path="/unread"
          element={<JoyMessagesTemplate section="unread" />}
        />
        <Route path="/Myprofile" element={<JoyOrderDashboardTemplate />} />
        <Route
          path="/profile/:userId"
          element={<JoyOrderDashboardTemplate />}
        />
      </Routes>
    </div>
  );
}

export default App;
