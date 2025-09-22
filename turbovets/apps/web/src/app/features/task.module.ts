import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared.module';
import { TaskBoardComponent } from './task-board/task-board.component';
import { TaskDialogComponent } from './task-dialog/task-dialog.component';
import { taskReducer } from '../store/task/task.reducer';
import { TaskEffects } from '../store/task/task.effects';

@NgModule({
  declarations: [
    TaskBoardComponent,
    TaskDialogComponent,
  ],
  imports: [
    SharedModule,
    StoreModule.forFeature('tasks', taskReducer),
    EffectsModule.forFeature([TaskEffects]),
  ],
  exports: [
    TaskBoardComponent,
  ],
})
export class TaskModule {}
