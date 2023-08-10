import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Header from './Header';

test('renders title', () => {
  const { getByText } = render(<Header />);
  const titleElement = getByText(/Whiskers in the woods/i);
  expect(titleElement).toBeInTheDocument();
});
