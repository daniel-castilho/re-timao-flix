import { useState } from 'react';
import styled from 'styled-components';
import videos from '../../data/videos';

const STORAGE_KEY = 'timaoflix:userVideos';

const categories = [...new Set(videos.map((video) => video.category))];

const PageSection = styled.section`
  flex: 1;
  padding: 2.5rem;
  background-color: var(--color-black-dark);
  color: var(--color-gray-light);
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: var(--color-gray-muted);
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 32rem;
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 0.875rem;
`;

const Input = styled.input`
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--color-surface-border);
  border-radius: 0.25rem;
  background-color: var(--color-surface);
  color: var(--color-gray-light);
  font-size: 1rem;

  &:focus {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 1px;
  }
`;

const Select = styled.select`
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--color-surface-border);
  border-radius: 0.25rem;
  background-color: var(--color-surface);
  color: var(--color-gray-light);
  font-size: 1rem;

  &:focus {
    outline: 3px solid var(--color-primary-medium);
    outline-offset: 1px;
  }
`;

const Error = styled.p`
  color: #ff6b6b;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  align-self: flex-start;
  padding: 0.625rem 1.5rem;
  border: 0;
  border-radius: 0.25rem;
  font-weight: bold;
  font-size: 1rem;
  color: #fff;
  background-color: var(--color-primary-medium);
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: var(--color-primary-light);
  }

  &:focus-visible {
    outline: 3px solid var(--color-primary-light);
    outline-offset: 2px;
  }
`;

const ListHeading = styled.h2`
  margin-top: 2.5rem;
  font-size: 1.25rem;
  font-weight: bold;
`;

const List = styled.ul`
  margin-top: 1rem;
  display: grid;
  gap: 0.75rem;
  max-width: 32rem;
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-surface-border);
  border-radius: var(--radius-card);
`;

const ListTitle = styled.span`
  font-weight: bold;
  font-size: 0.9375rem;
`;

const ListCategory = styled.span`
  font-size: 0.8125rem;
  color: var(--color-gray-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

function loadUserVideos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUserVideos(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function extractYouTubeId(url) {
  const match = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{6,})/,
  );
  return match ? match[1] : null;
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function NovoVideo() {
  const [userVideos, setUserVideos] = useState(loadUserVideos);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedUrl = url.trim();
    const videoId = extractYouTubeId(trimmedUrl);

    if (!trimmedTitle) {
      setError('Informe o título do vídeo.');
      return;
    }
    if (!videoId) {
      setError(
        'Informe uma URL válida do YouTube (youtube.com/watch?v=… ou youtu.be/…).',
      );
      return;
    }

    const next = [
      {
        id: `${slugify(trimmedTitle)}-${Date.now()}`,
        title: trimmedTitle,
        category,
        url: trimmedUrl,
        thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      },
      ...userVideos,
    ];

    setUserVideos(next);
    saveUserVideos(next);
    setTitle('');
    setUrl('');
    setError('');
  };

  return (
    <PageSection>
      <Title>Novo vídeo</Title>
      <Subtitle>Adicione um vídeo do Timão à sua lista.</Subtitle>

      <Form onSubmit={handleSubmit} noValidate>
        <Field>
          <Label htmlFor="novo-video-titulo">Título</Label>
          <Input
            id="novo-video-titulo"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex.: Melhores momentos da Libertadores"
          />
        </Field>

        <Field>
          <Label htmlFor="novo-video-categoria">Categoria</Label>
          <Select
            id="novo-video-categoria"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        </Field>

        <Field>
          <Label htmlFor="novo-video-url">URL do YouTube</Label>
          <Input
            id="novo-video-url"
            type="url"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
          />
        </Field>

        {error && <Error role="alert">{error}</Error>}

        <SubmitButton type="submit">Adicionar vídeo</SubmitButton>
      </Form>

      {userVideos.length > 0 && (
        <>
          <ListHeading>Seus vídeos</ListHeading>
          <List aria-label="Seus vídeos">
            {userVideos.map((video) => (
              <ListItem key={video.id}>
                <ListTitle>{video.title}</ListTitle>
                <ListCategory>{video.category}</ListCategory>
              </ListItem>
            ))}
          </List>
        </>
      )}
    </PageSection>
  );
}

export default NovoVideo;
