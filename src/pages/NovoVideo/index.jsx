import styled from 'styled-components';
import HighlightTimao from '../../components/HighlightTimao';

const NovoVideoSection = styled.section`
  flex: 1;
  padding: 2.5rem;
  background-color: var(--color-black-dark);
  color: var(--color-gray-light);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.75rem;
`;

function NovoVideo() {
  return (
    <NovoVideoSection>
      <Title>Novo vídeo</Title>
      <p>
        Cadastro de vídeos <HighlightTimao>em breve</HighlightTimao>.
      </p>
    </NovoVideoSection>
  );
}

export default NovoVideo;
