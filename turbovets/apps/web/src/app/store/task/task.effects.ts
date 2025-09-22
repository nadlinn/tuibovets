import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';
import { TaskService } from '../../services/task.service';
import * as TaskActions from './task.actions';

@Injectable()
export class TaskEffects {
  loadTasks$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.loadTasks),
      mergeMap(() =>
        this.taskService.getTasks().pipe(
          map((tasks) => TaskActions.loadTasksSuccess({ tasks })),
          catchError((error) =>
            of(TaskActions.loadTasksFailure({ error: error.message }))
          )
        )
      )
    )
  );

  createTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.createTask),
      mergeMap((action) =>
        this.taskService
          .createTask({
            title: action.title,
            description: action.description,
            priority: action.priority,
            assigneeId: action.assigneeId,
            dueDate: action.dueDate,
          })
          .pipe(
            map((task) => TaskActions.createTaskSuccess({ task })),
            catchError((error) =>
              of(TaskActions.createTaskFailure({ error: error.message }))
            )
          )
      )
    )
  );

  updateTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.updateTask),
      mergeMap((action) =>
        this.taskService.updateTask(action.id, action.changes).pipe(
          map((task) => TaskActions.updateTaskSuccess({ task })),
          catchError((error) =>
            of(TaskActions.updateTaskFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.deleteTask),
      mergeMap((action) =>
        this.taskService.deleteTask(action.id).pipe(
          map(() => TaskActions.deleteTaskSuccess({ id: action.id })),
          catchError((error) =>
            of(TaskActions.deleteTaskFailure({ error: error.message }))
          )
        )
      )
    )
  );

  assignTask$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TaskActions.assignTask),
      switchMap((action) =>
        this.taskService.assignTask(action.taskId, action.assigneeId).pipe(
          map((task) => TaskActions.assignTaskSuccess({ task })),
          catchError((error) =>
            of(TaskActions.assignTaskFailure({ error: error.message }))
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private taskService: TaskService
  ) {}
}
