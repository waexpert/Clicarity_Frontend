import { createSlice } from '@reduxjs/toolkit';

const tableSlice = createSlice({
  name: 'tables',
  initialState: {
    data: {}, 
    loading: false,
    error: null
  },
  reducers: {
    setDynamicData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    clearDynamicData: (state) => {
      state.data = {};
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { 
  setDynamicData, 
  clearDynamicData,
  setLoading,
  setError 
} = tableSlice.actions;

export default tableSlice.reducer;