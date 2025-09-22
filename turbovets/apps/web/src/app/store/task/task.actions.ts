import { createAction, props } from '@ngrx/store';
import { Task } from './task.model';

export const loadTasks = createAction('[Task] Load Tasks');

export const loadTasksSuccess = createAction(
  '[Task] Load Tasks Success',
  props<{ tasks: Task[] }>()
);

export const loadTasksFailure = createAction(
  '[Task] Load Tasks Failure',
  props<{ error: string }>()
);

export const createTask = createAction(
  '[Task] Create Task',
  props<{
    title: string;
    description: string;
    priority: string;
    assigneeId?: string;
    dueDate?: Date;
  }>()
);

export const createTaskSuccess = createAction(
  '[Task] Create Task Success',
  props<{ task: Task }>()
);

export const createTaskFailure = createAction(
  '[Task] Create Task Failure',
  props<{ error: string }>()
);

export const updateTask = createAction(
  '[Task] Update Task',
  props<{
    id: string;
    changes: Partial<Task>;
  }>()
);

export const updateTaskSuccess = createAction(
  '[Task] Update Task Success',
  props<{ task: Task }>()
);

export const updateTaskFailure = createAction(
  '[Task] Update Task Failure',
  props<{ error: string }>()
);

export const deleteTask = createAction(
  '[Task] Delete Task',
  props<{ id: string }>()
);

export const deleteTaskSuccess = createAction(
  '[Task] Delete Task Success',
  props<{ id: string }>()
);

export const deleteTaskFailure = createAction(
  '[Task] Delete Task Failure',
  props<{ error: string }>()
);

export const selectTask = createAction(
  '[Task] Select Task',
  props<{ id: string }>()
);

export const assignTask = createAction(
  '[Task] Assign Task',
  props<{ taskId: string; assigneeId: string }>()
);

export const assignTaskSuccess = createAction(
  '[Task] Assign Task Success',
  props<{ task: Task }>()
);

export const assignTaskFailure = createAction(
  '[Task] Assign Task Failure',
  props<{ error: string }>()
);
