import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AdminProtect from '@/components/common/AdminProtect';

// ─────────────────────────────────────────────
// Mocks
// ─────────────────────────────────────────────

vi.mock('@/api/auth.service', () => ({
  authService: {
    getAdminProfile: vi.fn(),
  },
}));

import { authService } from '@/api/auth.service';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem:    (key)        => store[key] ?? null,
    setItem:    (key, value) => { store[key] = String(value); },
    removeItem: (key)        => { delete store[key]; },
    clear:      ()           => { store = {}; },
  };
})();
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const makeQueryClient = () =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } });

const RenderWithProviders = ({ token, children }) => {
  const qc = makeQueryClient();
  if (token) localStorage.setItem('adminToken', token);
  return (
    <QueryClientProvider client={qc}>
      <MemoryRouter initialEntries={['/admin/dashboard']}>
        <Routes>
          <Route path="/admin/login" element={<div data-testid="login-page">Login Page</div>} />
          <Route path="/admin/dashboard" element={
            <AdminProtect>{children}</AdminProtect>
          } />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
};

// ─────────────────────────────────────────────
// Tests
// ─────────────────────────────────────────────
describe('AdminProtect — Auth Guard', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('redirects to /admin/login when no token is stored', () => {
    render(<RenderWithProviders><div data-testid="protected">Dashboard</div></RenderWithProviders>);
    expect(screen.getByTestId('login-page')).toBeInTheDocument();
    expect(screen.queryByTestId('protected')).not.toBeInTheDocument();
  });

  it('redirects to /admin/login when token is present but profile fetch fails', async () => {
    authService.getAdminProfile.mockRejectedValueOnce(new Error('Unauthorized'));
    render(<RenderWithProviders token="bad-token"><div>Dashboard</div></RenderWithProviders>);
    await screen.findByTestId('login-page');
  });

  it('renders children when token is present and profile is loaded', async () => {
    authService.getAdminProfile.mockResolvedValueOnce({ id: '1', name: 'Test Admin' });
    render(
      <RenderWithProviders token="valid-token">
        <div data-testid="protected">Dashboard Content</div>
      </RenderWithProviders>
    );
    await screen.findByTestId('protected');
    expect(screen.getByTestId('protected')).toBeInTheDocument();
  });
});
