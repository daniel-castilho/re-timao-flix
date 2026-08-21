import styled from 'styled-components';

const CardLink = styled.a`
  flex: 0 0 auto;
  width: 15rem;
  text-decoration: none;
  color: var(--color-gray-light);

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

const Thumb = styled.img`
  display: block;
  width: 100%;
  border-radius: 4px;
  background-color: var(--color-black-dark);

  @media (prefers-reduced-motion: no-preference) {
    transition: transform 0.2s ease;
  }

  ${CardLink}:hover & {
    transform: scale(1.03);
  }
`;

const NewTabHint = styled.span`
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

const CardTitle = styled.h3`
  font-size: 0.875rem;
  font-weight: bold;
  margin-top: 0.5rem;
  line-height: 1.3;
`;

function VideoCardTimao({ video }) {
  return (
    <CardLink href={video.url} target="_blank" rel="noreferrer">
      <Thumb src={video.thumbnailUrl} alt="" />
      <CardTitle>{video.title}</CardTitle>
      <NewTabHint>(abre em uma nova aba)</NewTabHint>
    </CardLink>
  );
}

export default VideoCardTimao;
