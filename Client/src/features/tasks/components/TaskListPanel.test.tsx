import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { TaskModel } from '@types';
import { mapTaskModelToUiTask } from '../types';
import { TaskListPanel } from './TaskListPanel';

function createTaskModel(overrides: Partial<TaskModel> = {}): TaskModel {
  const date = new Date(2026, 10, 25, 10, 30);

  return {
    id: 12,
    userId: 1,
    title: 'Підготувати вечерю',
    type: 'home',
    visibility: 'personal',
    status: true,
    date,
    createdAt: date,
    updatedAt: date,
    ...overrides,
  };
}

function renderTaskList(
  overrides: Partial<React.ComponentProps<typeof TaskListPanel>> = {}
) {
  const props = {
    title: 'Мої справи',
    description: 'Список справ',
    visibleTasks: [],
    filter: 'Всі',
    setFilter: vi.fn(),
    showComposer: true,
    setShowComposer: vi.fn(),
    newTask: 'Спланувати подорож',
    setNewTask: vi.fn(),
    addTask: vi.fn(),
    editTask: vi.fn(),
    deleteTask: vi.fn(),
    toggleTask: vi.fn(),
    isSavingTask: false,
    isDeleting: false,
    ...overrides,
  };

  render(<TaskListPanel {...props} />);
  return props;
}

describe('TaskListPanel task form', () => {
  it('opens the creation form and submits the entered type and date', async () => {
    const user = userEvent.setup();
    const props = renderTaskList();

    await user.click(screen.getByRole('button', { name: 'Додати' }));

    expect(
      screen.getByRole('heading', { name: 'Нова справа' })
    ).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Тип справи'), 'travel');
    fireEvent.change(screen.getByLabelText('Дата і час'), {
      target: { value: '2026-12-01T09:15' },
    });
    await user.click(screen.getByRole('button', { name: 'Додати справу' }));

    expect(props.addTask).toHaveBeenCalledWith(
      {
        title: 'Спланувати подорож',
        type: 'travel',
        visibility: 'shared',
        date: new Date('2026-12-01T09:15'),
      },
      expect.any(Function)
    );
  });

  it('opens an existing task for editing and keeps its status and visibility', async () => {
    const user = userEvent.setup();
    const task = createTaskModel();
    const props = renderTaskList({
      visibleTasks: [mapTaskModelToUiTask(task)],
      showComposer: false,
    });

    await user.click(
      screen.getByRole('button', {
        name: `Редагувати справу: ${task.title}`,
      })
    );

    expect(
      screen.getByRole('heading', { name: 'Редагувати справу' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Назва')).toHaveValue(task.title);

    await user.clear(screen.getByLabelText('Назва'));
    await user.type(screen.getByLabelText('Назва'), 'Приготувати сніданок');
    await user.selectOptions(screen.getByLabelText('Тип справи'), 'family');
    await user.click(screen.getByRole('button', { name: 'Зберегти зміни' }));

    expect(props.editTask).toHaveBeenCalledWith(
      task.id,
      {
        title: 'Приготувати сніданок',
        type: 'family',
        visibility: task.visibility,
        status: task.status,
        date: task.date,
      },
      expect.any(Function)
    );
  });

  it('confirms deletion of an existing task and closes after success', async () => {
    const user = userEvent.setup();
    const task = createTaskModel();
    const deleteTask = vi.fn(
      (_id: number, onSuccess?: () => void) => onSuccess?.()
    );
    renderTaskList({
      visibleTasks: [mapTaskModelToUiTask(task)],
      showComposer: false,
      deleteTask,
    });

    await user.click(
      screen.getByRole('button', {
        name: `Редагувати справу: ${task.title}`,
      })
    );
    await user.click(screen.getByRole('button', { name: 'Видалити справу' }));

    expect(
      screen.getByText('Ви дійсно хочете видалити цю справу?')
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Так, видалити' }));

    expect(deleteTask).toHaveBeenCalledWith(task.id, expect.any(Function));
    expect(
      screen.queryByRole('heading', { name: 'Редагувати справу' })
    ).not.toBeInTheDocument();
  });

  it('closes the task form from the modal close button', async () => {
    const user = userEvent.setup();
    renderTaskList();

    await user.click(screen.getByRole('button', { name: 'Додати' }));
    await user.click(screen.getByRole('button', { name: 'Закрити' }));

    expect(
      screen.queryByRole('heading', { name: 'Нова справа' })
    ).not.toBeInTheDocument();
  });

  it('closes the task form when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    renderTaskList();

    await user.click(screen.getByRole('button', { name: 'Додати' }));

    const backdrop = screen.getByRole('dialog').parentElement;
    if (!backdrop) throw new Error('Modal backdrop was not rendered');
    fireEvent.mouseDown(backdrop);

    expect(
      screen.queryByRole('heading', { name: 'Нова справа' })
    ).not.toBeInTheDocument();
  });
});
