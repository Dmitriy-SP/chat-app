import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import leoProfanity from 'leo-profanity';
import { closeModal } from '../store/modalSlice.js';
import { useChatApi } from '../context/index.jsx';
import { setCurrentChannelId, channelsAdapter } from '../store/channelsSlice.js';

const channelNameValidationSchema = (channels) => yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('validation.required')
    .min(3, 'validation.requirements')
    .max(20, 'validation.requirements')
    .notOneOf(channels, 'validation.uniq'),
});

const AddNewChannel = ({ handleClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { api } = useChatApi();
  const channels = useSelector((state) => channelsAdapter
    .getSelectors((storeState) => storeState.channels)
    .selectAll(state)
    .map((channel) => channel.name));

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: channelNameValidationSchema(channels),
    onSubmit: async ({ name }, actions) => {
      const filteredName = leoProfanity.clean(name);
      const newChannel = { name: filteredName };
      try {
        const data = await api.createChannel(newChannel);
        dispatch(setCurrentChannelId(data.id));
        toast.success(t('toast.created'));
        handleClose();
      } catch (e) {
        actions.setSubmitting(false);
        toast.error(t('errors.network'));
        throw e;
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.add')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              disabled={formik.isSubmitting}
              placeholder={t('modals.channelName')}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={formik.errors.name && formik.touched.name}
              name="name"
              id="name"
              autoFocus
            />
            <Form.Label
              className="visually-hidden"
              htmlFor="name"
            >
              {t('modals.channelName')}
            </Form.Label>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.name)}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                className="me-2"
                variant="secondary"
                onClick={handleClose}
              >
                {t('modals.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {t('modals.submit')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

const RenameChannel = ({ handleClose }) => {
  const { t } = useTranslation();
  const { api } = useChatApi();
  const channels = useSelector((state) => channelsAdapter
    .getSelectors((storeState) => storeState.channels)
    .selectAll(state)
    .map((channel) => channel.name));
  const channelId = useSelector((state) => state.modal.channelId);
  const channel = useSelector((state) => channelsAdapter
    .getSelectors((storeState) => storeState.channels)
    .selectById(state, channelId));
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      name: channel.name,
    },
    validationSchema: channelNameValidationSchema(channels),
    onSubmit: async ({ name }, actions) => {
      const filteredName = leoProfanity.clean(name);
      const renamedChannel = { name: filteredName, id: channelId };
      try {
        await api.renameChannel(renamedChannel);
        toast.success(t('toast.renamed'));
        handleClose();
      } catch (e) {
        inputRef.current.select();
        actions.setSubmitting(false);
        toast.error(t('errors.network'));
        throw e;
      }
    },
    validateOnBlur: false,
    validateOnChange: false,
  });

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.rename')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              className="mb-2"
              disabled={formik.isSubmitting}
              placeholder={t('modals.newChannelName')}
              ref={inputRef}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              isInvalid={formik.errors.name && formik.touched.name}
              name="name"
              id="name"
            />
            <Form.Label
              className="visually-hidden"
              htmlFor="name"
            >
              {t('modals.newChannelName')}
            </Form.Label>
            <Form.Control.Feedback type="invalid">
              {t(formik.errors.name)}
            </Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button
                className="me-2"
                variant="secondary"
                onClick={handleClose}
              >
                {t('modals.cancel')}
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={formik.isSubmitting}
              >
                {t('modals.submit')}
              </Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </>
  );
};

const RemoveChannel = ({ handleClose }) => {
  const { t } = useTranslation();
  const [sending, setSending] = useState(false);
  const { api } = useChatApi();
  const channelId = useSelector((state) => state.modal.channelId);
  const deleteButtonRef = useRef(null);
  const handleRemove = async () => {
    setSending(true);
    try {
      await api.removeChannel({ id: channelId });
      toast.success(t('toast.removed'));
      handleClose();
    } catch (e) {
      setSending(false);
      toast.error(t('errors.network'));
      throw e;
    }
  };

  useEffect(() => {
    deleteButtonRef.current.focus();
  }, []);

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.remove')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="lead">{t('modals.confirmation')}</p>
        <div className="d-flex justify-content-end">
          <Button
            className="me-2"
            variant="secondary"
            onClick={handleClose}
            disabled={sending}
          >
            {t('modals.cancel')}
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={handleRemove}
            disabled={sending}
            ref={deleteButtonRef}
          >
            {t('modals.delete')}
          </Button>
        </div>
      </Modal.Body>
    </>
  );
};

const getModalWindow = (modalType) => {
  switch (modalType) {
    case 'adding':
      return AddNewChannel;
    case 'rename':
      return RenameChannel;
    case 'remove':
      return RemoveChannel;
    default:
  }
  return '';
};

const Modals = () => {
  const dispatch = useDispatch();
  const { isOpened, modalType } = useSelector((state) => state.modal);
  const ModalWindow = getModalWindow(modalType);
  const handleClose = () => {
    dispatch(closeModal());
  };

  return (
    <Modal show={isOpened} onHide={handleClose} centered>
      {ModalWindow && <ModalWindow handleClose={handleClose} />}
    </Modal>
  );
};

export default Modals;
