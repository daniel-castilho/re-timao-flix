import { useRef } from 'react';
import styled from 'styled-components';
import VideoCardTimao from '../VideoCardTimao';

const Section = styled.section`
  padding: 1.25rem 2.5rem;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-gray-light);
`;

const Controls = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ArrowButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid var(--color-surface-border);
  border-radius: 50%;
  background-color: var(--color-surface);
  color: var(--color-gray-light);
  font-size: 1.125rem;
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;

  &:hover {
    background-color: var(--color-primary-medium);
    color: #fff;
  }

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

const Row = styled.ul`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  list-style: none;
  padding-bottom: 0.75rem;
  scroll-behavior: smooth;
  scroll-snap-type: x proximity;
`;

function VideoSectionTimao({ title, videos }) {
  const rowRef = useRef(null);

  const scrollByCards = (direction) => {
    rowRef.current?.scrollBy({
      left: direction * 264,
      behavior: 'smooth',
    });
  };

  return (
    <Section aria-label={title}>
      <SectionHeader>
        <SectionTitle>{title}</SectionTitle>
        <Controls>
          <ArrowButton
            type="button"
            aria-label={`Anterior: ${title}`}
            onClick={() => scrollByCards(-1)}
          >
            ‹
          </ArrowButton>
          <ArrowButton
            type="button"
            aria-label={`Próximo: ${title}`}
            onClick={() => scrollByCards(1)}
          >
            ›
          </ArrowButton>
        </Controls>
      </SectionHeader>
      <Row ref={rowRef}>
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
