import styled from 'styled-components';
import BadgeTimao from '../BadgeTimao';

const CardButton = styled.button`
  display: block;
  position: relative;
  flex: 0 0 auto;
  width: 15rem;
  padding: 0;
  border: 0;
  background: none;
  text-align: left;
  font: inherit;
  cursor: pointer;
  color: var(--color-gray-light);

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
    border-radius: var(--radius-card);
  }
`;

const ThumbWrap = styled.div`
  position: relative;
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-card);

  @media (prefers-reduced-motion: no-preference) {
    transition:
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }

  ${CardButton}:hover & {
    box-shadow: var(--shadow-card-hover);
    transform: translateY(-2px);
  }
`;

const Thumb = styled.img`
  display: block;
  width: 100%;
  background-color: var(--color-black-light);
`;

// Play overlay revealed on hover / keyboard focus.
const PlayOverlay = styled.span`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(11, 13, 15, 0.45);
  opacity: 0;

  @media (prefers-reduced-motion: no-preference) {
    transition: opacity 0.2s ease;
  }

  ${CardButton}:hover &,
  ${CardButton}:focus-visible & {
    opacity: 1;
  }
`;

const PlayIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background-color: rgba(42, 122, 228, 0.9);
  color: #fff;
  font-size: 1.125rem;
`;

const CardBadge = styled(BadgeTimao)`
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
`;

const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: bold;
  margin-top: 0.625rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

function VideoCardTimao({ video, onOpen }) {
  const gold = video.category === 'Conquistas';

  return (
    <CardButton
      type="button"
      aria-label={`Assistir: ${video.title}`}
      onClick={() => onOpen(video)}
    >
      <ThumbWrap>
        <Thumb src={video.thumbnailUrl} alt="" />
        <PlayOverlay aria-hidden="true">
          <PlayIcon>▶</PlayIcon>
        </PlayOverlay>
        {video.category && <CardBadge gold={gold}>{video.category}</CardBadge>}
      </ThumbWrap>
      <CardTitle>{video.title}</CardTitle>
    </CardButton>
  );
}

export default VideoCardTimao;
