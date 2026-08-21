import styled from 'styled-components';
import HeroTimao from '../../components/HeroTimao';
import VideoSectionTimao from '../../components/VideoSectionTimao';
import videos, { groupVideosByCategory } from '../../data/videos';

const HomeSection = styled.section`
  flex: 1;
  padding: 2rem 0 1.25rem;
  background-color: var(--color-black-dark);
  color: var(--color-gray-light);
`;

const sections = groupVideosByCategory(videos);
const featured = videos.find((video) => video.featured) ?? videos[0];

function Home() {
  return (
    <HomeSection>
      <HeroTimao video={featured} />

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
