import { render, screen } from '@testing-library/react';
import FooterTimao from '.';

test('renders a footer element wrapping its content', () => {
  render(
    <FooterTimao>
      <span>Feito na #ImersãoReact da Alura</span>
    </FooterTimao>,
  );
  expect(screen.getByText(/Alura/).closest('footer')).toBeInTheDocument();
});
