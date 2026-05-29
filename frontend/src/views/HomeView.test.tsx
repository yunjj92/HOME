import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { HomeView } from './HomeView';
import { useAuthStore } from '../hooks/authentication/authStore';

afterEach(() => {
  cleanup();
});

beforeEach(() => {
  useAuthStore.setState({
    userName: null,
    isLoggedIn: false,
  });
});

describe('HomeView', () => {
  it('login button updates Zustand state', async () => {
    const user = userEvent.setup();

    render(<HomeView />);

    const input = screen.getByPlaceholderText('사용자 이름 입력');
    const loginButton = screen.getByRole('button', { name: '로그인' });

    await user.type(input, '명혁');
    await user.click(loginButton);

    expect(screen.getByText('명혁 님 로그인 상태')).toBeInTheDocument();
  });

  it('logout button resets Zustand state', async () => {
    const user = userEvent.setup();

    render(<HomeView />);

    const input = screen.getByPlaceholderText('사용자 이름 입력');
    const loginButton = screen.getByRole('button', { name: '로그인' });
    const logoutButton = screen.getByRole('button', { name: '로그아웃' });

    await user.type(input, '명혁');
    await user.click(loginButton);
    await user.click(logoutButton);

    expect(screen.getByText('비로그인 상태')).toBeInTheDocument();
  });

  it('zod validation runs when button clicked', async () => {
    const user = userEvent.setup();

    render(<HomeView />);

    const testButton = screen.getByRole('button', { name: 'Zod 검사 실행' });

    await user.click(testButton);

    expect(screen.getByText(/"success": true/i)).toBeInTheDocument();
  });
});