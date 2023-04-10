import React from 'react';
import ChatHeader from './ChatHeader';
import NewMessageBox from './NewMessageBox';
import Messages from './Messages';

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
