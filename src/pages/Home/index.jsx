import { useState } from 'react';
import styled from 'styled-components';
import HeroTimao from '../../components/HeroTimao';
import VideoSectionTimao from '../../components/VideoSectionTimao';
import VideoModalTimao from '../../components/VideoModalTimao';
import videos, { groupVideosByCategory } from '../../data/videos';
import { normalizeText } from '../../lib/text';

const HomeSection = styled.section`
  flex: 1;
  padding: 2rem 0 1.25rem;
  background-color: var(--color-black-dark);
  color: var(--color-gray-light);
`;

const SearchWrap = styled.div`
  padding: 0 2.5rem 1.25rem;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 24rem;
  padding: 0.625rem 0.875rem;
  border: 1px solid var(--color-surface-border);
  border-radius: 999px;
  background-color: var(--color-surface);
  color: var(--color-gray-light);
  font-size: 0.9375rem;

  &::placeholder {
    color: var(--color-gray-muted);
  }

  &:focus {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 1px;
  }
`;

const VisuallyHiddenLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

const NoResults = styled.p`
  padding: 2.5rem;
  color: var(--color-gray-muted);
  text-align: center;
`;

const featuredVideos = videos.filter((video) => video.featured);

function Home() {
  const [query, setQuery] = useState('');
  const [openVideo, setOpenVideo] = useState(null);

  const normalizedQuery = normalizeText(query.trim());
  const filteredVideos = normalizedQuery
    ? videos.filter((video) =>
        normalizeText(video.title).includes(normalizedQuery),
      )
    : videos;
  const sections = groupVideosByCategory(filteredVideos);
  const searching = normalizedQuery.length > 0;

  return (
    <HomeSection>
      <SearchWrap>
        <VisuallyHiddenLabel htmlFor="busca-videos">
          Buscar vídeos
        </VisuallyHiddenLabel>
        <SearchInput
          id="busca-videos"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Buscar por título..."
        />
      </SearchWrap>

      {!searching && (
        <HeroTimao videos={featuredVideos} onPlay={setOpenVideo} />
      )}

      {searching && sections.length === 0 && (
        <NoResults role="status">
          Nenhum vídeo encontrado para “{query.trim()}”.
        </NoResults>
      )}

      {sections.map(({ category, videos: sectionVideos }) => (
        <VideoSectionTimao
          key={category}
          title={category}
          videos={sectionVideos}
          onOpen={setOpenVideo}
        />
      ))}

      {openVideo && (
        <VideoModalTimao video={openVideo} onClose={() => setOpenVideo(null)} />
      )}
    </HomeSection>
  );
}

export default Home;
