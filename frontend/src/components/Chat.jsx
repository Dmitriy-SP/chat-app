import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'react-bootstrap';
import ChatBox from './ChatBox.jsx';
import ChannelsBox from './ChannelsBox.jsx';
import Modals from './Modals.jsx';
import fetchAuthData from '../store/fetchAuthData.js';
import { useAuth } from '../context/index.jsx';

const Chat = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { logOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchAuthData(user.token))
      .then(() => setLoading(false))
      .catch((error) => {
        switch (error.status) {
          case 'AxiosError':
            toast.error(t('errors.network'));
            return;
          case '401':
            logOut();
            break;
          case 'unknown':
          default:
        }
        toast.error(t('errors.unknown'));
      });
  }, [dispatch, user, logOut, t]);

  return loading ? (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">{t('loading')}</span>
      </Spinner>
    </div>
  ) : (
    <>
      <Modals />
      <div className="container h-100 my-4 overflow-hidden rounded shadow">
        <div className="row h-100 bg-white flex-md-row">
          <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
            <ChannelsBox />
          </div>
          <div className="col p-0 h-100">
            <ChatBox />
          </div>
        </div>
      </div>
    </>
  );
};

export default Chat;
