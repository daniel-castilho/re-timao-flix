import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { toEmbedUrl } from '../../lib/youtube';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgba(0, 0, 0, 0.82);
`;

const Dialog = styled.div`
  width: 100%;
  max-width: 56rem;
  background-color: var(--color-black-light);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-card);
  overflow: hidden;
  box-shadow: var(--shadow-card-hover);
`;

const Frame = styled.iframe`
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  border: 0;
  background-color: #000;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.25rem;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: bold;
  color: var(--color-gray-light);
  line-height: 1.3;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const ExternalLink = styled.a`
  font-size: 0.875rem;
  color: var(--color-primary-light);
  text-decoration: none;
  font-weight: bold;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

const CloseButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-surface-border);
  border-radius: 0.25rem;
  background-color: var(--color-surface);
  color: var(--color-gray-light);
  font-weight: bold;
  font-size: 0.875rem;
  cursor: pointer;

  &:hover {
    background-color: var(--color-surface-hover);
  }

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

function VideoModalTimao({ video, onClose }) {
  const closeRef = useRef(null);
  const embedUrl = toEmbedUrl(video.url);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <Overlay onClick={onClose}>
      <Dialog
        role="dialog"
        aria-modal="true"
        aria-label={video.title}
        onClick={(event) => event.stopPropagation()}
      >
        <Frame
          title={`Vídeo: ${video.title}`}
          src={embedUrl}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
        <Footer>
          <Title>{video.title}</Title>
          <Actions>
            <ExternalLink href={video.url} target="_blank" rel="noreferrer">
              Abrir no YouTube
            </ExternalLink>
            <CloseButton ref={closeRef} type="button" onClick={onClose}>
              Fechar
            </CloseButton>
          </Actions>
        </Footer>
      </Dialog>
    </Overlay>
  );
}

export default VideoModalTimao;
