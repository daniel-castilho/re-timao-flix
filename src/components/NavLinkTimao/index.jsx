import { NavLink } from 'react-router';
import styled from 'styled-components';

const NavLinkTimao = styled(NavLink)`
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  color: var(--color-gray-light);
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  transition:
    color 0.15s ease,
    background-color 0.15s ease;

  &:hover {
    color: var(--color-primary-light);
  }

  &.active {
    color: var(--color-primary-light);
    background-color: rgba(42, 122, 228, 0.12);
  }

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

export default NavLinkTimao;
