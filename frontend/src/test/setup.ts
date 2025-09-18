import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock window.history for testing
Object.defineProperty(window, 'history', {
  value: {
    pushState: vi.fn(),
    replaceState: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  },
  writable: true,
});

// Mock window.location for testing
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000/',
    pathname: '/',
    search: '',
    hash: '',
    assign: vi.fn(),
    replace: vi.fn(),
    reload: vi.fn(),
  },
  writable: true,
});