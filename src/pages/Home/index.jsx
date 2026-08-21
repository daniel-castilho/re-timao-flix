import styled from 'styled-components';
import HighlightTimao from '../../components/HighlightTimao';

const HomeSection = styled.section`
    flex: 1;
    padding: 40px;
    background-color: var(--color-black-dark);
    color: var(--color-gray-light);
`;

const Title = styled.h1`
    font-size: 32rem;
    margin-bottom: 12rem;
`;

function Home() {
  return (
    <HomeSection>
      <Title>TimãoFlix</Title>
      <p>
        Os melhores momentos do <HighlightTimao>Timão</HighlightTimao> em um só lugar.
      </p>
    </HomeSection>
  );
}

export default Home;
