import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { messagesAdapter } from '../../../store/slices/messagesSlice';

const getMessagesForCurrentChannel = (state) => {
  const { currentChannelId } = state.channels;
  const messages = messagesAdapter.getSelectors((state) => state.messages).selectAll(state);
  return messages.filter((message) => message.channelId === currentChannelId);
};

const getMessagesCount = (state) => {
  const messages = getMessagesForCurrentChannel(state);
  return messages.length;
};

const getCurrentChannelName = (state) => {
  const { entities, currentChannelId } = state.channels;
  return entities[currentChannelId]?.name;
};

const ChatHeader = () => {
  const { t } = useTranslation();
  const currentChannelName = useSelector(getCurrentChannelName);
  const messagesCount = useSelector(getMessagesCount);

  return (
    <div className="bg-light mb-4 p-3 shadow-sm small">
      <p className="m-0">
        <b>
          {`# ${currentChannelName}`}
        </b>
      </p>
      <span className="text-muted">
        {`${messagesCount} ${t('chat.messageCount', { count: messagesCount })}`}
      </span>
    </div>
  );
};

export default ChatHeader;
