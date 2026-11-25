import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Header } from './Header';

const { logoutMutate } = vi.hoisted(() => ({
  logoutMutate: vi.fn(
    (_variables: unknown, options?: { onSuccess?: () => void }) =>
      options?.onSuccess?.()
  ),
}));

vi.mock('@hooks', () => ({
  useCurrentUserQuery: () => ({
    user: { name: 'Олена Коваль', avatar: null },
  }),
  useFamilyQuery: () => ({ family: { members: [] } }),
}));

vi.mock('@features/search', () => ({
  HeaderSearch: () => null,
}));

vi.mock('@features/auth', () => ({
  useLogout: () => ({ mutate: logoutMutate, isPending: false }),
}));

function CurrentPath() {
  const location = useLocation();
  return <span data-testid="current-path">{location.pathname}</span>;
}

function renderHeader() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Header activeNav="Огляд" />
      <CurrentPath />
    </MemoryRouter>
  );
}

describe('Header profile menu', () => {
  beforeEach(() => {
    logoutMutate.mockClear();
  });

  it('opens the menu and navigates to settings', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole('button', { name: 'Меню профілю' }));
    expect(
      screen.getByRole('menuitem', { name: 'Налаштування' })
    ).toBeVisible();

    await user.click(screen.getByRole('menuitem', { name: 'Налаштування' }));

    expect(screen.getByTestId('current-path')).toHaveTextContent('/settings');
    expect(
      screen.queryByRole('menuitem', { name: 'Налаштування' })
    ).not.toBeInTheDocument();
  });

  it('logs out and navigates to login', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole('button', { name: 'Меню профілю' }));
    await user.click(screen.getByRole('menuitem', { name: 'Вийти' }));

    expect(logoutMutate).toHaveBeenCalledWith(
      undefined,
      expect.objectContaining({ onSuccess: expect.any(Function) })
    );
    expect(screen.getByTestId('current-path')).toHaveTextContent('/login');
  });

  it('closes the menu with Escape and an outside click', async () => {
    const user = userEvent.setup();
    renderHeader();

    await user.click(screen.getByRole('button', { name: 'Меню профілю' }));
    await user.keyboard('{Escape}');
    expect(
      screen.queryByRole('menuitem', { name: 'Налаштування' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Меню профілю' }));
    await user.click(
      screen.getByRole('heading', { name: 'Вітаємо, Олена Коваль!' })
    );
    expect(
      screen.queryByRole('menuitem', { name: 'Налаштування' })
    ).not.toBeInTheDocument();
  });
});
