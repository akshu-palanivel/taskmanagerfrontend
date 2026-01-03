import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { tasksAPI } from '../services/api';

const initialState = {
  tasks: [],
  currentTask: null,
  stats: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  filters: {
    status: '',
    priority: '',
    search: '',
    sortBy: 'createdAt',
    order: 'DESC',
  },
  isLoading: false,
  isStatsLoading: false,
  error: null,
};

// Fetch all tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchAll',
  async (params, { rejectWithValue, getState }) => {
    try {
      const { filters, pagination } = getState().tasks;
      const queryParams = {
        ...filters,
        ...params,
        page: params?.page || pagination.page,
        limit: params?.limit || pagination.limit,
      };
      
      // Remove empty filters
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null) {
          delete queryParams[key];
        }
      });

      const response = await tasksAPI.getAll(queryParams);
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch tasks';
      return rejectWithValue(message);
    }
  }
);

// Fetch single task
export const fetchTask = createAsyncThunk(
  'tasks/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const response = await tasksAPI.getOne(id);
      return response.data.data.task;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch task';
      return rejectWithValue(message);
    }
  }
);

// Create task
export const createTask = createAsyncThunk(
  'tasks/create',
  async (taskData, { rejectWithValue }) => {
    try {
      const response = await tasksAPI.create(taskData);
      return response.data.data.task;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      return rejectWithValue(message);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await tasksAPI.update(id, data);
      return response.data.data.task;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      return rejectWithValue(message);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/delete',
  async (id, { rejectWithValue }) => {
    try {
      await tasksAPI.delete(id);
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      return rejectWithValue(message);
    }
  }
);

// Fetch task statistics
export const fetchStats = createAsyncThunk(
  'tasks/fetchStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await tasksAPI.getStats();
      return response.data.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch stats';
      return rejectWithValue(message);
    }
  }
);

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1;
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    clearCurrentTask: (state) => {
      state.currentTask = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch tasks
      .addCase(fetchTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload.tasks;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch single task
      .addCase(fetchTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTask = action.payload;
      })
      .addCase(fetchTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Create task
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Update task
      .addCase(updateTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.tasks.findIndex(t => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
        if (state.currentTask?.id === action.payload.id) {
          state.currentTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Delete task
      .addCase(deleteTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = state.tasks.filter(t => t.id !== action.payload);
        state.pagination.total -= 1;
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Fetch stats
      .addCase(fetchStats.pending, (state) => {
        state.isStatsLoading = true;
      })
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.isStatsLoading = false;
        state.stats = action.payload;
      })
      .addCase(fetchStats.rejected, (state, action) => {
        state.isStatsLoading = false;
        state.error = action.payload;
      });
  },
});

export const { setFilters, clearFilters, setPage, clearCurrentTask, clearError } = tasksSlice.actions;
export default tasksSlice.reducer;
