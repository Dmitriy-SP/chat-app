import React from 'react';
import ChatHeader from './ChatHeader.jsx';
import NewMessageBox from './NewMessageBox.jsx';
import Messages from './Messages.jsx';

const ChatBox = () => (
  <div className="d-flex flex-column h-100">
    <ChatHeader />
    <Messages />
    <div className="mt-auto px-5 py-3">
      <NewMessageBox />
    </div>
  </div>
);

export default ChatBox;
