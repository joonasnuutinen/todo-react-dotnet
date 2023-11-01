import { render, screen } from '@testing-library/react';
import App from './App';

test('renders basic inputs and buttons on new to-do list', () => {
  render(<App />);
  const titleElement = screen.getByPlaceholderText("To-do list title");
  expect(titleElement).toBeInTheDocument();

  const addButton = screen.getByText("Add new item");
  expect(addButton).toBeInTheDocument();

  const saveButton = screen.getByText("Save changes");
  expect(saveButton).toBeInTheDocument();
});
