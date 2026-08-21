import styled from 'styled-components';
import ButtonTimao from '../ButtonTimao';
import LogoTimao from '../LogoTimao';

const HeaderTimao = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1.125rem 2.5rem;
  background-color: var(--color-header-bg);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-bottom: 2px solid var(--color-primary-medium);

  @media (max-width: 800px) {
    justify-content: space-between;
    padding: 0.75rem 1rem;

    & > ${LogoTimao} {
      height: 2rem;
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
