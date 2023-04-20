import { createAsyncThunk, miniSerializeError } from '@reduxjs/toolkit';
import axios from 'axios';
import routes from '../routes';

const fetchAuthData = createAsyncThunk(
  'fetchAuthData',
  async (token, { rejectWithValue }) => {
    try {
      const response = await axios.get(routes.data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      if (error.isAxiosError) {
        return rejectWithValue({ body: 'AxiosError', status: error.response.status });
      }
      if (error.response) {
        return rejectWithValue({ body: miniSerializeError(error), status: error.response.status });
      }
      return rejectWithValue({ body: miniSerializeError(error), status: 'unknown' });
    }
  },
);

export default fetchAuthData;
