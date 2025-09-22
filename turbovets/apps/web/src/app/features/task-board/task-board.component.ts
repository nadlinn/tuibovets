import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Task, TaskStatus } from '../../store/task/task.model';
import * as TaskActions from '../../store/task/task.actions';
import * as TaskSelectors from '../../store/task/task.selectors';
import { MatDialog } from '@angular/material/dialog';
import { TaskDialogComponent } from '../task-dialog/task-dialog.component';

@Component({
  selector: 'app-task-board',
  templateUrl: './task-board.component.html',
  styleUrls: ['./task-board.component.scss'],
})
export class TaskBoardComponent implements OnInit {
  tasksByStatus$: Observable<{ [key in TaskStatus]: Task[] }>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;
  TaskStatus = TaskStatus;

  constructor(
    private store: Store,
    private dialog: MatDialog
  ) {
    this.tasksByStatus$ = this.store.select(TaskSelectors.selectTasksByStatus);
    this.loading$ = this.store.select(TaskSelectors.selectTasksLoading);
    this.error$ = this.store.select(TaskSelectors.selectTasksError);
  }

  ngOnInit(): void {
    this.store.dispatch(TaskActions.loadTasks());
  }

  onDrop(event: CdkDragDrop<Task[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const task = event.container.data[event.currentIndex];
      const newStatus = event.container.id as TaskStatus;

      this.store.dispatch(
        TaskActions.updateTask({
          id: task.id,
          changes: { status: newStatus },
        })
      );
    }
  }

  onTaskSelect(taskId: string): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: {
        task: taskId ? this.findTaskById(taskId) : null,
      },
    });

    dialogRef.afterClosed().subscribe(() => {
      this.store.dispatch(TaskActions.loadTasks());
    });
  }

  private findTaskById(taskId: string): Task | null {
    let foundTask: Task | null = null;
    this.tasksByStatus$.subscribe((tasksByStatus) => {
      Object.values(tasksByStatus).forEach((tasks) => {
        const task = tasks.find((t) => t.id === taskId);
        if (task) {
          foundTask = task;
        }
      });
    });
    return foundTask;
  }

  getStatusLabel(status: TaskStatus): string {
    return status.replace('_', ' ').toUpperCase();
  }
}