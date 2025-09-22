import { createFeatureSelector, createSelector } from '@ngrx/store';
import { TaskState, TaskStatus } from './task.model';

export const selectTaskState = createFeatureSelector<TaskState>('tasks');

export const selectAllTasks = createSelector(
  selectTaskState,
  (state) => Object.values(state.tasks)
);

export const selectTasksLoading = createSelector(
  selectTaskState,
  (state) => state.loading
);

export const selectTasksError = createSelector(
  selectTaskState,
  (state) => state.error
);

export const selectSelectedTaskId = createSelector(
  selectTaskState,
  (state) => state.selectedTaskId
);

export const selectSelectedTask = createSelector(
  selectTaskState,
  selectSelectedTaskId,
  (state, selectedId) => selectedId ? state.tasks[selectedId] : null
);

export const selectTasksByStatus = createSelector(
  selectAllTasks,
  (tasks) => {
    const tasksByStatus = {
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    tasks.forEach((task) => {
      tasksByStatus[task.status].push(task);
    });

    return tasksByStatus;
  }
);

export const selectTasksByAssignee = createSelector(
  selectAllTasks,
  (tasks) => {
    return tasks.reduce((acc, task) => {
      const assigneeId = task.assigneeId || 'unassigned';
      return {
        ...acc,
        [assigneeId]: [...(acc[assigneeId] || []), task],
      };
    }, {});
  }
);
