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

const WatchLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.25rem;
  text-decoration: none;
  font-weight: bold;
  font-size: 1rem;
  color: #fff;
  background-color: var(--color-primary-medium);
  transition:
    background-color 0.15s ease,
    transform 0.15s ease;

  &:hover {
    background-color: var(--color-primary-light);
  }

  &:focus-visible {
    outline: 3px solid var(--color-primary-light);
    outline-offset: 2px;
  }
`;

function HeroTimao({ video }) {
  const gold = video?.category === 'Conquistas';

  return (
    <Hero aria-label="Vídeo em destaque">
      <HeroBackground $image={video?.thumbnailUrl} aria-hidden="true" />
      <HeroScrim aria-hidden="true" />
      <HeroContent>
        <Brand>TimãoFlix</Brand>
        <Tagline>Os melhores momentos do Timão em um só lugar.</Tagline>
        {video && (
          <>
            <BadgeTimao gold={gold}>{video.category}</BadgeTimao>
            <FeaturedTitle>{video.title}</FeaturedTitle>
            <WatchLink href={video.url} target="_blank" rel="noreferrer">
              ▶ Assistir
            </WatchLink>
          </>
        )}
      </HeroContent>
    </Hero>
  );
}

export default HeroTimao;
