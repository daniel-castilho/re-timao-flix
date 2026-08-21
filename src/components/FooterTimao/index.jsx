import styled from 'styled-components';
import LogoTimao from '../LogoTimao';

const FooterTimao = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 1rem;
  background-color: var(--color-black-dark);
  color: var(--color-gray-light);
  padding: 1.25rem 0;
  border-top: 4px solid var(--color-primary-medium);

  & > ${LogoTimao} {
    margin-bottom: 1.25rem;
  }
`;

export default FooterTimao;
