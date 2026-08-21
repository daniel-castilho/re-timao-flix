import styled from 'styled-components';

const SkipLinkTimao = styled.a`
  position: absolute;
  left: -9999px;
  z-index: 10;
  padding: 0.5rem 1rem;
  background-color: var(--color-black-dark);
  color: var(--color-gray-light);

  &:focus {
    left: 0.5rem;
    top: 0.5rem;
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

export default SkipLinkTimao;
