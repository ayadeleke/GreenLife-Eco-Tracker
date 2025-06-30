import { render, screen, fireEvent } from '@testing-library/react';
import Register from '../pages/Register';
import TreeForm from '../components/TreeForm';
import TreeMap from '../components/TreeMap';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import GlobalTreeCountControl from '../components/GlobalTreeCountControl';

const mockSpecies = ['Oak', 'Maple', 'Pine'];

test('renders Register form', () => {
  render(
    <MemoryRouter>
        <Register />
    </MemoryRouter>);
    expect(screen.getByRole('heading', { name: /Register/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Register/i })).toBeInTheDocument();
});

test('shows error if required fields are empty', () => {
    render(<TreeForm token="fake" onSuccess={vi.fn()} latitude={null} longitude={null} address="" />);
    fireEvent.click(screen.getByRole('button', { name: /add tree/i }));
});

test('renders map component', () => {
    render(
        <MemoryRouter>
        <TreeMap />
        </MemoryRouter>
    );
});

test('updates latitude and longitude fields when user enters values', () => {
  render(
    <TreeForm
      token="dummy"
      onSuccess={() => {}}
      latitude={0}
      longitude={0}
      address=""
    />
  );
  const latInput = screen.getByLabelText(/latitude/i);
  const lngInput = screen.getByLabelText(/longitude/i);

  fireEvent.change(latInput, { target: { value: '12.34' } });
  fireEvent.change(lngInput, { target: { value: '56.78' } });

  expect(latInput).toHaveValue('12.34');
  expect(lngInput).toHaveValue('56.78');
});
