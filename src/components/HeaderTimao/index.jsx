import styled from 'styled-components';
import ButtonTimao from '../ButtonTimao';
import LogoTimao from '../LogoTimao';

const HeaderTimao = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.875rem 2.5rem;
  background-color: var(--color-black-dark);
  border-bottom: 4px solid var(--color-primary-medium);

  @media (max-width: 800px) {
    justify-content: center;
    padding: 0.9375rem 1rem;

    & > ${LogoTimao} {
      height: 2.1875rem;
    }

    & > ${ButtonTimao} {
      background-color: var(--color-primary-medium);
      border-radius: 0;
      border: 0;
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw;
    }
  }
`;

export default HeaderTimao;
