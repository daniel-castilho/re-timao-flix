import { useEffect, useState } from 'react';
import styled from 'styled-components';
import BadgeTimao from '../BadgeTimao';

const Hero = styled.section`
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 24rem;
  margin-bottom: 2.5rem;
`;

// Decorative background image (aria-hidden — the video title is real text).
const HeroBackground = styled.div`
  position: absolute;
  inset: 0;
  background-image: url(${(props) => props.$image});
  background-size: cover;
  background-position: center 30%;
`;

const HeroScrim = styled.div`
  position: absolute;
  inset: 0;
  background: var(--gradient-hero);
`;

const HeroContent = styled.div`
  position: relative;
  padding: 1.25rem 2.5rem 2rem;
  max-width: 40rem;
`;

const Brand = styled.h1`
  font-size: 2.25rem;
  font-weight: bold;
  letter-spacing: 0.02em;
  margin-bottom: 0.5rem;
  color: var(--color-gray-light);
`;

const Tagline = styled.p`
  font-size: 1rem;
  color: var(--color-gray-muted);
  margin-bottom: 1.5rem;
`;

const FeaturedTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: bold;
  line-height: 1.2;
  margin: 0.75rem 0 0.75rem;
  color: var(--color-gray-light);
`;

const WatchButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.625rem 1.25rem;
  border: 0;
  border-radius: 0.25rem;
  font-weight: bold;
  font-size: 1rem;
  color: var(--color-black-dark);
  background-color: var(--color-primary-light);
  cursor: pointer;
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background-color: var(--color-gray-light);
  }

  &:focus-visible {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 2px;
  }
`;

const HeroNav = styled.div`
  position: absolute;
  right: 2.5rem;
  bottom: 1.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const HeroArrow = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.25rem;
  height: 2.25rem;
  border: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 50%;
  background-color: rgba(11, 13, 15, 0.55);
  color: #fff;
  font-size: 1.125rem;
  cursor: pointer;

  &:hover {
    background-color: var(--color-primary-medium);
    border-color: var(--color-primary-medium);
  }

  &:focus-visible {
    outline: 3px solid var(--color-primary-light);
    outline-offset: 2px;
  }
`;

const Dots = styled.div`
  display: flex;
  gap: 0.375rem;
`;

const Dot = styled.button`
  width: 0.625rem;
  height: 0.625rem;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background-color: ${(props) =>
    props.$active ? 'var(--color-primary-medium)' : 'rgba(255, 255, 255, 0.4)'};
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid var(--color-primary-light);
    outline-offset: 2px;
  }
`;

const ROTATE_MS = 6000;

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  );
}

function HeroTimao({ videos, onPlay }) {
  const [index, setIndex] = useState(0);
  const count = videos.length;

  useEffect(() => {
    if (count <= 1 || prefersReducedMotion()) return undefined;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % count);
    }, ROTATE_MS);
    return () => clearInterval(timer);
  }, [count]);

  const video = videos[index % count];

  const goTo = (next) => setIndex(((next % count) + count) % count);

  return (
    <Hero aria-label="Vídeo em destaque">
      <HeroBackground $image={video?.thumbnailUrl} aria-hidden="true" />
      <HeroScrim aria-hidden="true" />
      <HeroContent>
        <Brand>TimãoFlix</Brand>
        <Tagline>Os melhores momentos do Timão em um só lugar.</Tagline>
        {video && (
          <>
            <BadgeTimao gold={video.category === 'Conquistas'}>
              {video.category}
            </BadgeTimao>
            <FeaturedTitle>{video.title}</FeaturedTitle>
            <WatchButton type="button" onClick={() => onPlay(video)}>
              ▶ Assistir
            </WatchButton>
          </>
        )}
      </HeroContent>

      {count > 1 && (
        <HeroNav aria-label="Destaques">
          <Dots>
            {videos.map((item, dotIndex) => (
              <Dot
                key={item.id}
                type="button"
                $active={dotIndex === index}
                aria-label={`Destaque ${dotIndex + 1}: ${item.title}`}
                aria-current={dotIndex === index ? 'true' : undefined}
                onClick={() => goTo(dotIndex)}
              />
            ))}
          </Dots>
          <HeroArrow
            type="button"
            aria-label="Destaque anterior"
            onClick={() => goTo(index - 1)}
          >
            ‹
          </HeroArrow>
          <HeroArrow
            type="button"
            aria-label="Próximo destaque"
            onClick={() => goTo(index + 1)}
          >
            ›
          </HeroArrow>
        </HeroNav>
      )}
    </Hero>
  );
}

export default HeroTimao;
