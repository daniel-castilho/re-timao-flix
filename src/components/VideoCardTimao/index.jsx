import styled from 'styled-components';

const CardLink = styled.a`
    flex: 0 0 auto;
    width: 240px;
    text-decoration: none;
    color: var(--color-gray-light);
`;

const Thumb = styled.img`
    display: block;
    width: 100%;
    border-radius: 4px;
    background-color: var(--color-black-dark);
    transition: transform 0.2s ease;

    ${CardLink}:hover & {
        transform: scale(1.03);
    }
`;

const CardTitle = styled.h3`
    font-size: 14rem;
    font-weight: bold;
    margin-top: 8rem;
    line-height: 1.3;
`;

function VideoCardTimao({ video }) {
  return (
    <CardLink href={video.url} target="_blank" rel="noreferrer">
      <Thumb src={video.thumb} alt={video.titulo} />
      <CardTitle>{video.titulo}</CardTitle>
    </CardLink>
  );
}

export default VideoCardTimao;
