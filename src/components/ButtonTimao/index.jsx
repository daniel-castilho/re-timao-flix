import styled from 'styled-components';

const ButtonTimao = styled.button`
  padding: 0.875rem 2.1875rem;
  background-color: var(--color-black-dark);
  color: var(--color-gray-light);
  border: 1px solid var(--color-gray-light);
  border-radius: 4px;
  font-size: 1.125rem;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

export default ButtonTimao;
