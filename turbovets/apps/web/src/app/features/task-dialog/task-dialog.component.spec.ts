import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { TaskDialogComponent } from './task-dialog.component';
import { SharedModule } from '../../shared/shared.module';
import { Task, TaskStatus, TaskPriority } from '../../store/task/task.model';
import * as TaskActions from '../../store/task/task.actions';

describe('TaskDialogComponent', () => {
  let component: TaskDialogComponent;
  let fixture: ComponentFixture<TaskDialogComponent>;
  let store: MockStore;
  let dialogRef: jasmine.SpyObj<MatDialogRef<TaskDialogComponent>>;

  const mockTask: Task = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    creatorId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [TaskDialogComponent],
      imports: [SharedModule, BrowserAnimationsModule],
      providers: [
        provideMockStore(),
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { task: null } },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<TaskDialogComponent>>;
  });

  describe('Create Mode', () => {
    beforeEach(() => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { task: null } });
      fixture = TestBed.createComponent(TaskDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize in create mode', () => {
      expect(component.isEditMode).toBeFalse();
      expect(component.taskForm.get('status')?.disabled).toBeTrue();
    });

    it('should initialize form with default values', () => {
      expect(component.taskForm.get('title')?.value).toBe('');
      expect(component.taskForm.get('description')?.value).toBe('');
      expect(component.taskForm.get('priority')?.value).toBe(TaskPriority.MEDIUM);
    });

    it('should dispatch createTask action on valid form submission', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      const formValue = {
        title: 'New Task',
        description: 'New Description',
        priority: TaskPriority.HIGH,
        status: TaskStatus.TODO,
        dueDate: new Date(),
      };

      component.taskForm.patchValue(formValue);
      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        TaskActions.createTask(formValue)
      );
      expect(dialogRef.close).toHaveBeenCalled();
    });

    it('should not submit invalid form', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      component.onSubmit();
      expect(dispatchSpy).not.toHaveBeenCalled();
      expect(dialogRef.close).not.toHaveBeenCalled();
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      TestBed.overrideProvider(MAT_DIALOG_DATA, { useValue: { task: mockTask } });
      fixture = TestBed.createComponent(TaskDialogComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should initialize in edit mode', () => {
      expect(component.isEditMode).toBeTrue();
      expect(component.taskForm.get('status')?.enabled).toBeTrue();
    });

    it('should initialize form with task values', () => {
      expect(component.taskForm.get('title')?.value).toBe(mockTask.title);
      expect(component.taskForm.get('description')?.value).toBe(mockTask.description);
      expect(component.taskForm.get('priority')?.value).toBe(mockTask.priority);
      expect(component.taskForm.get('status')?.value).toBe(mockTask.status);
    });

    it('should dispatch updateTask action on valid form submission', () => {
      const dispatchSpy = spyOn(store, 'dispatch');
      const formValue = {
        title: 'Updated Task',
        description: 'Updated Description',
        priority: TaskPriority.LOW,
        status: TaskStatus.IN_PROGRESS,
        dueDate: new Date(),
      };

      component.taskForm.patchValue(formValue);
      component.onSubmit();

      expect(dispatchSpy).toHaveBeenCalledWith(
        TaskActions.updateTask({
          id: mockTask.id,
          changes: formValue,
        })
      );
      expect(dialogRef.close).toHaveBeenCalled();
    });
  });

  it('should close dialog on cancel', () => {
    fixture = TestBed.createComponent(TaskDialogComponent);
    component = fixture.componentInstance;
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    fixture = TestBed.createComponent(TaskDialogComponent);
    component = fixture.componentInstance;
    
    expect(component.taskForm.valid).toBeFalse();
    
    component.taskForm.patchValue({
      title: 'Test',
      description: 'Test',
      priority: TaskPriority.MEDIUM,
    });
    
    expect(component.taskForm.valid).toBeTrue();
  });
});
