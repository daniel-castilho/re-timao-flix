import styled from 'styled-components';
import VideoCardTimao from '../VideoCardTimao';

const Section = styled.section`
  padding: 1.25rem 2.5rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: var(--color-gray-light);
  margin-bottom: 1rem;
`;

const Row = styled.ul`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  list-style: none;
  padding-bottom: 0.75rem;
`;

function VideoSectionTimao({ title, videos }) {
  return (
    <Section>
      <SectionTitle>{title}</SectionTitle>
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
