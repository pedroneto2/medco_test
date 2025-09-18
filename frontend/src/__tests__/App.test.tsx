import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppRoutes } from '../App';
import { AuthProvider } from '../AuthContext';

// Mock the API module
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

// Mock the page components
vi.mock('../pages/Home', () => ({
  default: () => <div data-testid="home-page">Home Page</div>,
}));

vi.mock('../pages/Login', () => ({
  default: () => <div data-testid="login-page">Login Page</div>,
}));

vi.mock('../pages/Register', () => ({
  default: () => <div data-testid="register-page">Register Page</div>,
}));

vi.mock('../pages/Tasks', () => ({
  default: () => <div data-testid="tasks-page">Tasks Page</div>,
}));

vi.mock('../pages/CreateTask', () => ({
  default: () => <div data-testid="create-task-page">Create Task Page</div>,
}));

// Mock the AuthContext
const mockAuthContext = {
  user: null,
  loading: false,
  login: vi.fn(),
  logout: vi.fn(),
};

vi.mock('../AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
  useAuth: () => mockAuthContext,
}));

// Helper function to render AppRoutes with MemoryRouter
const renderAppRoutes = (initialEntries: string[] = ['/']) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </MemoryRouter>
  );
};

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset auth context to default state
    mockAuthContext.user = null;
    mockAuthContext.loading = false;
  });

  describe('Route Navigation', () => {
    it('should render Home page for root path', async () => {
      renderAppRoutes(['/']);
      
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('should render Login page for /login path', async () => {
      renderAppRoutes(['/login']);
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });
    });

    it('should render Register page for /register path', async () => {
      renderAppRoutes(['/register']);
      
      await waitFor(() => {
        expect(screen.getByTestId('register-page')).toBeInTheDocument();
      });
    });

    it('should render Tasks page for /tasks path when user is authenticated', async () => {
      mockAuthContext.user = { userId: '1', name: 'Test User', email: 'test@example.com' } as any;
      renderAppRoutes(['/tasks']);
      
      await waitFor(() => {
        expect(screen.getByTestId('tasks-page')).toBeInTheDocument();
      });
    });

    it('should render CreateTask page for /tasks/new path when user is authenticated', async () => {
      mockAuthContext.user = { userId: '1', name: 'Test User', email: 'test@example.com' } as any;
      renderAppRoutes(['/tasks/new']);
      
      await waitFor(() => {
        expect(screen.getByTestId('create-task-page')).toBeInTheDocument();
      });
    });
  });

  describe('Authentication Guards', () => {
    it('should redirect to login when accessing protected route without authentication', async () => {
      mockAuthContext.user = null;
      renderAppRoutes(['/tasks']);
      
      await waitFor(() => {
        expect(screen.getByTestId('login-page')).toBeInTheDocument();
      });
    });

    it('should redirect to tasks when accessing public route while authenticated', async () => {
      mockAuthContext.user = { userId: '1', name: 'Test User', email: 'test@example.com' } as any;
      renderAppRoutes(['/login']);
      
      await waitFor(() => {
        expect(screen.getByTestId('tasks-page')).toBeInTheDocument();
      });
    });

    it('should show loading state when auth is loading', async () => {
      mockAuthContext.loading = true;
      renderAppRoutes(['/tasks']);
      
      await waitFor(() => {
        expect(screen.getByText('Loading...')).toBeInTheDocument();
      });
    });
  });

  describe('Catch-all Route', () => {
    it('should redirect to home page for invalid routes', async () => {
      renderAppRoutes(['/invalid-route']);
      
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('should redirect to home page for deeply nested invalid routes', async () => {
      renderAppRoutes(['/some/deep/invalid/route']);
      
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });

    it('should redirect to home page for routes with special characters', async () => {
      renderAppRoutes(['/route-with-special-chars!@#$%']);
      
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });
  });

  describe('Component Structure', () => {
    it('should render AuthProvider wrapper', () => {
      const { container } = renderAppRoutes();
      expect(container.firstChild).toBeTruthy();
    });

    it('should have proper route structure', async () => {
      renderAppRoutes();
      
      // Test that the app renders without crashing
      await waitFor(() => {
        expect(screen.getByTestId('home-page')).toBeInTheDocument();
      });
    });
  });

  describe('Route Components', () => {
    it('should export AppRoutes component', () => {
      expect(AppRoutes).toBeDefined();
      expect(typeof AppRoutes).toBe('function');
    });

    it('should export PrivateRoute component', async () => {
      const { PrivateRoute } = await import('../App');
      expect(PrivateRoute).toBeDefined();
      expect(typeof PrivateRoute).toBe('function');
    });

    it('should export PublicRoute component', async () => {
      const { PublicRoute } = await import('../App');
      expect(PublicRoute).toBeDefined();
      expect(typeof PublicRoute).toBe('function');
    });
  });
});