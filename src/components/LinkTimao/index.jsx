import styled from 'styled-components';

const LinkTimao = styled.a`
  text-decoration: none;
  font-weight: bold;
  color: var(--color-primary-medium);
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

export default LinkTimao;
