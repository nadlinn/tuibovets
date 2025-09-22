import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { TaskBoardComponent } from './task-board.component';
import { SharedModule } from '../../shared/shared.module';
import { Task, TaskStatus, TaskPriority } from '../../store/task/task.model';
import * as TaskActions from '../../store/task/task.actions';
import * as TaskSelectors from '../../store/task/task.selectors';

describe('TaskBoardComponent', () => {
  let component: TaskBoardComponent;
  let fixture: ComponentFixture<TaskBoardComponent>;
  let store: MockStore;
  let dialog: jasmine.SpyObj<MatDialog>;

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

  const initialState = {
    tasks: {
      tasks: { [mockTask.id]: mockTask },
      loading: false,
      error: null,
      selectedTaskId: null,
    },
  };

  beforeEach(async () => {
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogSpy.open.and.returnValue({
      afterClosed: () => of(true),
    });

    await TestBed.configureTestingModule({
      declarations: [TaskBoardComponent],
      imports: [SharedModule, BrowserAnimationsModule],
      providers: [
        provideMockStore({ initialState }),
        { provide: MatDialog, useValue: dialogSpy },
      ],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadTasks action on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(TaskActions.loadTasks());
  });

  it('should update task status', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.onTaskStatusChange(mockTask, TaskStatus.IN_PROGRESS);
    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.updateTask({
        id: mockTask.id,
        changes: { status: TaskStatus.IN_PROGRESS },
      })
    );
  });

  it('should open task dialog when selecting a task', () => {
    component.onTaskSelect(mockTask.id);
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should format status label correctly', () => {
    const label = component.getStatusLabel(TaskStatus.IN_PROGRESS);
    expect(label).toBe('IN PROGRESS');
  });

  it('should handle drag and drop between columns', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    const event = {
      previousContainer: {
        data: [mockTask],
      },
      container: {
        data: [],
        id: TaskStatus.IN_PROGRESS,
      },
      previousIndex: 0,
      currentIndex: 0,
    } as any;

    component.onDrop(event);
    expect(dispatchSpy).toHaveBeenCalledWith(
      TaskActions.updateTask({
        id: mockTask.id,
        changes: { status: TaskStatus.IN_PROGRESS },
      })
    );
  });

  it('should select tasks by status', (done) => {
    store.overrideSelector(TaskSelectors.selectTasksByStatus, {
      [TaskStatus.TODO]: [mockTask],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.REVIEW]: [],
      [TaskStatus.DONE]: [],
    });
    store.refreshState();

    component.tasksByStatus$.subscribe((tasksByStatus) => {
      expect(tasksByStatus[TaskStatus.TODO].length).toBe(1);
      expect(tasksByStatus[TaskStatus.TODO][0]).toEqual(mockTask);
      done();
    });
  });

  it('should handle loading state', (done) => {
    store.setState({
      tasks: {
        ...initialState.tasks,
        loading: true,
      },
    });

    component.loading$.subscribe((loading) => {
      expect(loading).toBe(true);
      done();
    });
  });

  it('should handle error state', (done) => {
    const errorMessage = 'Test error';
    store.setState({
      tasks: {
        ...initialState.tasks,
        error: errorMessage,
      },
    });

    component.error$.subscribe((error) => {
      expect(error).toBe(errorMessage);
      done();
    });
  });
});
