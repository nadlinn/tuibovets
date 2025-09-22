import { createReducer, on } from '@ngrx/store';
import { TaskState } from './task.model';
import * as TaskActions from './task.actions';

export const initialState: TaskState = {
  tasks: {},
  loading: false,
  error: null,
  selectedTaskId: null,
};

export const taskReducer = createReducer(
  initialState,

  on(TaskActions.loadTasks, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(TaskActions.loadTasksSuccess, (state, { tasks }) => ({
    ...state,
    loading: false,
    tasks: tasks.reduce((acc, task) => ({
      ...acc,
      [task.id]: task,
    }), {}),
  })),

  on(TaskActions.loadTasksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(TaskActions.createTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: {
      ...state.tasks,
      [task.id]: task,
    },
  })),

  on(TaskActions.updateTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: {
      ...state.tasks,
      [task.id]: task,
    },
  })),

  on(TaskActions.deleteTaskSuccess, (state, { id }) => {
    const { [id]: removed, ...tasks } = state.tasks;
    return {
      ...state,
      tasks,
      selectedTaskId: state.selectedTaskId === id ? null : state.selectedTaskId,
    };
  }),

  on(TaskActions.selectTask, (state, { id }) => ({
    ...state,
    selectedTaskId: id,
  })),

  on(TaskActions.assignTaskSuccess, (state, { task }) => ({
    ...state,
    tasks: {
      ...state.tasks,
      [task.id]: task,
    },
  })),

  on(
    TaskActions.createTaskFailure,
    TaskActions.updateTaskFailure,
    TaskActions.deleteTaskFailure,
    TaskActions.assignTaskFailure,
    (state, { error }) => ({
      ...state,
      error,
    })
  )
);
