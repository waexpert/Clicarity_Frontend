import { createSlice } from '@reduxjs/toolkit';

const jobStatusSlice = createSlice({
  name: 'job_status',
  initialState: {
    data: {}, 
    loading: false,
    error: null
  },
  reducers: {
    setDynamicData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    addDynamicField: (state, action) => {
      const { key, value } = action.payload;
      state.data[key] = value;
    },
    updateDynamicField: (state, action) => {
      const { key, value } = action.payload;
      if (state.data[key] !== undefined) {
        state.data[key] = value;
      }
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
  addDynamicField, 
  updateDynamicField, 
  clearDynamicData,
  setLoading,
  setError 
} = jobStatusSlice.actions;

export default jobStatusSlice.reducer;