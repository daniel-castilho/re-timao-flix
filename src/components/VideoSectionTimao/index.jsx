import styled from 'styled-components';
import VideoCardTimao from '../VideoCardTimao';

const Section = styled.section`
    padding: 20rem 40px;
`;

const SectionTitle = styled.h2`
    font-size: 24rem;
    color: var(--color-gray-light);
    margin-bottom: 16rem;
`;

const Row = styled.ul`
    display: flex;
    gap: 16rem;
    overflow-x: auto;
    list-style: none;
    padding-bottom: 12rem;
`;

function VideoSectionTimao({ titulo, videos }) {
  return (
    <Section>
      <SectionTitle>{titulo}</SectionTitle>
      <Row>
        {videos.map((video) => (
          <li key={video.id}>
            <VideoCardTimao video={video} />
          </li>
        ))}
      </Row>
    </Section>
  );
}

export default VideoSectionTimao;
