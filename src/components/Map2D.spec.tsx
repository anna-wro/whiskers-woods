import React from 'react';
import 'jest-canvas-mock';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Map2D from './Map2D';

describe('Map2D Component', () => {
  it('should render without crashing', () => {
    const { container } = render(<Map2D />);
    expect(container.querySelector('.container')).toBeInTheDocument();
  });

  it('should display the initial tip', () => {
    const { getByText } = render(<Map2D />);
    expect(
      getByText(/I'm a little bit shy, try pressing the arrows!/),
    ).toBeInTheDocument();
  });

  it('should update the tip after key press', () => {
    const { getByText } = render(<Map2D />);
    fireEvent.keyDown(document, { key: 'ArrowUp' });
    expect(getByText(/Awww, you found me! Wanna walk/)).toBeInTheDocument();
  });

  it('should render the canvas', () => {
    const { container } = render(<Map2D />);
    expect(container.querySelector('canvas')).toBeInTheDocument();
  });

  it('should not update the tip for non-arrow keys', () => {
    const { getByText } = render(<Map2D />);
    fireEvent.keyDown(document, { key: 'A' });
    expect(
      getByText(/I'm a little bit shy, try pressing the arrows!/),
    ).toBeInTheDocument();
  });

  it('should handle arrow keys correctly', () => {
    const { getByText } = render(<Map2D />);
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    arrowKeys.forEach(key => {
      fireEvent.keyDown(document, { key });
      expect(getByText(/Awww, you found me! Wanna walk/)).toBeInTheDocument();
    });
  });
});
