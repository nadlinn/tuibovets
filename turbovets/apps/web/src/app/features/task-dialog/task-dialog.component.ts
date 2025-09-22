import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Task, TaskPriority, TaskStatus } from '../../store/task/task.model';
import * as TaskActions from '../../store/task/task.actions';

@Component({
  selector: 'app-task-dialog',
  templateUrl: './task-dialog.component.html',
  styleUrls: ['./task-dialog.component.scss'],
})
export class TaskDialogComponent {
  taskForm: FormGroup;
  isEditMode: boolean;
  priorities = Object.values(TaskPriority);
  statuses = Object.values(TaskStatus);

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TaskDialogComponent>,
    private store: Store,
    @Inject(MAT_DIALOG_DATA) public data: { task: Task | null }
  ) {
    this.isEditMode = !!data.task;
    this.taskForm = this.fb.group({
      title: [data.task?.title || '', [Validators.required]],
      description: [data.task?.description || '', [Validators.required]],
      priority: [data.task?.priority || TaskPriority.MEDIUM, [Validators.required]],
      status: [data.task?.status || TaskStatus.TODO],
      dueDate: [data.task?.dueDate || null],
    });

    if (!this.isEditMode) {
      this.taskForm.get('status')?.disable();
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      if (this.isEditMode && this.data.task) {
        this.store.dispatch(
          TaskActions.updateTask({
            id: this.data.task.id,
            changes: this.taskForm.value,
          })
        );
      } else {
        this.store.dispatch(
          TaskActions.createTask(this.taskForm.value)
        );
      }
      this.dialogRef.close();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
