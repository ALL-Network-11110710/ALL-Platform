import { render, screen } from '@testing-library/react';
import ErrorBoundary from '@/components/ErrorBoundary';

// Safe component for testing
const SafeComponent = () => <div>Safe content</div>;

describe('ErrorBoundary - Basic Tests', () => {
  let originalConsoleError: typeof console.error;

  beforeAll(() => {
    originalConsoleError = console.error;
    console.error = jest.fn();
  });

  afterAll(() => {
    console.error = originalConsoleError;
  });

  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Safe content')).toBeInTheDocument();
  });

  it('error boundary component exists and exports correctly', () => {
    // Basic test that the component is properly exported
    expect(ErrorBoundary).toBeDefined();
    expect(typeof ErrorBoundary).toBe('function');
  });
});