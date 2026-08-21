import styled from 'styled-components';
import HighlightTimao from '../../components/HighlightTimao';
import VideoSectionTimao from '../../components/VideoSectionTimao';
import videos, { groupVideosByCategory } from '../../data/videos';

const HomeSection = styled.section`
  flex: 1;
  padding: 40px 0 20rem;
  background-color: var(--color-black-dark);
  color: var(--color-gray-light);
`;

const Title = styled.h1`
  font-size: 32rem;
  margin-bottom: 12rem;
  padding: 0 40px;
`;

const Tagline = styled.p`
  margin-bottom: 24rem;
  padding: 0 40px;
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
