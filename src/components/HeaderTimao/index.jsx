import styled from 'styled-components';
import ButtonTimao from '../ButtonTimao';
import LogoTimao from '../LogoTimao';

const HeaderTimao = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 30px 40px;
    background-color: var(--color-black-dark);
    border-bottom: 4px solid var(--color-primary-medium);

    @media(max-width: 800px) {
        justify-content: center;
        padding: 15px 16px;

        & > ${LogoTimao} {
            height: 35px;
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