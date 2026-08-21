import styled from 'styled-components';
import HighlightTimao from '../../components/HighlightTimao';
import VideoSectionTimao from '../../components/VideoSectionTimao';
import videos, { groupVideosByCategory } from '../../data/videos';

const HomeSection = styled.section`
  flex: 1;
  padding: 2.5rem 0 1.25rem;
  background-color: var(--color-black-dark);
  color: var(--color-gray-light);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.75rem;
  padding: 0 2.5rem;
`;

const Tagline = styled.p`
  margin-bottom: 1.5rem;
  padding: 0 2.5rem;
`;

const sections = groupVideosByCategory(videos);

function Home() {
  return (
    <HomeSection>
      <Title>TimãoFlix</Title>
      <Tagline>
        Os melhores momentos do <HighlightTimao>Timão</HighlightTimao> em um só
        lugar.
      </Tagline>

      {sections.map(({ category, videos: sectionVideos }) => (
        <VideoSectionTimao
          key={category}
          title={category}
          videos={sectionVideos}
        />
      ))}
    </HomeSection>
  );
}

export default Home;
