import { Link, Navigate, useParams } from 'react-router';
import styled from 'styled-components';
import BadgeTimao from '../../components/BadgeTimao';
import videosData from '../../data/videos';
import { loadUserVideos } from '../../lib/userVideos';
import { toEmbedUrl } from '../../lib/youtube';

const PageSection = styled.section`
  flex: 1;
  padding: 2.5rem 2.5rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 800px) {
    padding: 1.25rem 1rem 2rem;
  }
`;

const Frame = styled.iframe`
  display: block;
  width: 100%;
  max-width: 56rem;
  aspect-ratio: 16 / 9;
  border: 0;
  border-radius: var(--radius-card);
  background-color: #000;
  box-shadow: var(--shadow-card);
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: bold;
  line-height: 1.2;
  color: var(--color-gray-light);
  max-width: 56rem;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
`;

const ActionLink = styled.a`
  font-weight: bold;
  color: var(--color-primary-light);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

const BackLink = styled(Link)`
  align-self: flex-start;
  padding: 0.625rem 1.25rem;
  border: 1px solid var(--color-gray-light);
  border-radius: 4px;
  color: var(--color-gray-light);
  font-size: 1.125rem;
  text-decoration: none;

  &:hover {
    background-color: var(--color-surface-hover);
  }

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

function VideoDetail() {
  const { id } = useParams();

  // The detail page resolves ids across the curated catalog and the videos
  // added through the "Novo vídeo" form.
  const video = [...videosData, ...loadUserVideos()].find(
    (entry) => entry.id === id,
  );

  if (!video) {
    // Unknown ids (including stale deep links) fall back to the home page.
    return <Navigate to="/" replace />;
  }

  return (
    <PageSection>
      <Frame
        title={`Vídeo: ${video.title}`}
        src={toEmbedUrl(video.url)}
        allow="autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
      <Title>{video.title}</Title>
      <Meta>
        {video.category && (
          <BadgeTimao gold={video.category === 'Conquistas'}>
            {video.category}
          </BadgeTimao>
        )}
      </Meta>
      <Actions>
        <ActionLink href={video.url} target="_blank" rel="noreferrer">
          Assistir no YouTube
        </ActionLink>
        <BackLink to="/">Voltar para a home</BackLink>
      </Actions>
    </PageSection>
  );
}

export default VideoDetail;
