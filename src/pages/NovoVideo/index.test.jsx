import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NovoVideo from '.';
import { USER_VIDEOS_STORAGE_KEY } from '../../lib/userVideos';

beforeEach(() => {
  localStorage.clear();
});

// jsdom does not implement the Blob download flow; stub the object-URL pair
// and capture what would be downloaded.
const createdUrls = [];
const originalCreateObjectURL = URL.createObjectURL;
const originalRevokeObjectURL = URL.revokeObjectURL;

beforeEach(() => {
  createdUrls.length = 0;
  URL.createObjectURL = (blob) => {
    createdUrls.push(blob);
    return `blob:mock-${createdUrls.length}`;
  };
  URL.revokeObjectURL = () => {};
});

afterEach(() => {
  URL.createObjectURL = originalCreateObjectURL;
  URL.revokeObjectURL = originalRevokeObjectURL;
});

test('renders the new video heading', () => {
  render(<NovoVideo />);
  expect(
    screen.getByRole('heading', { name: 'Novo vídeo' }),
  ).toBeInTheDocument();
});

test('adds a video to the list on submit', async () => {
  const user = userEvent.setup();
  render(<NovoVideo />);

  await user.type(screen.getByLabelText(/título/i), 'Gols da final de 2012');
  await user.type(
    screen.getByLabelText(/url do youtube/i),
    'https://www.youtube.com/watch?v=Bui2mO6AbxA',
  );
  await user.click(screen.getByRole('button', { name: /adicionar/i }));

  expect(await screen.findByText('Gols da final de 2012')).toBeInTheDocument();
  // The added video is rendered as a list item under "Seus vídeos".
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  expect(
    screen.getByRole('heading', { name: 'Seus vídeos' }),
  ).toBeInTheDocument();
});

test('shows a validation error for an invalid YouTube URL', async () => {
  const user = userEvent.setup();
  render(<NovoVideo />);

  await user.type(screen.getByLabelText(/título/i), 'Vídeo inválido');
  await user.type(screen.getByLabelText(/url do youtube/i), 'not-a-url');
  await user.click(screen.getByRole('button', { name: /adicionar/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/url/i);
});

test('shows a validation error for an empty title', async () => {
  const user = userEvent.setup();
  render(<NovoVideo />);

  await user.type(
    screen.getByLabelText(/url do youtube/i),
    'https://youtu.be/Bui2mO6AbxA',
  );
  await user.click(screen.getByRole('button', { name: /adicionar/i }));

  expect(await screen.findByRole('alert')).toHaveTextContent(/título/i);
});

test('disables export while the personal list is empty', () => {
  render(<NovoVideo />);

  expect(screen.getByRole('button', { name: /exportar/i })).toBeDisabled();
});

test('exports the personal list as a versioned JSON download', async () => {
  const user = userEvent.setup();
  render(<NovoVideo />);

  await user.type(screen.getByLabelText(/título/i), 'Gols da final');
  await user.type(
    screen.getByLabelText(/url do youtube/i),
    'https://www.youtube.com/watch?v=Bui2mO6AbxA',
  );
  await user.click(screen.getByRole('button', { name: /adicionar/i }));

  // jsdom would navigate on anchor clicks; the download flow only needs the
  // click to happen.
  const clickSpy = vi
    .spyOn(HTMLAnchorElement.prototype, 'click')
    .mockImplementation(() => {});
  try {
    await user.click(screen.getByRole('button', { name: /exportar/i }));
  } finally {
    clickSpy.mockRestore();
  }

  const [blob] = createdUrls;
  expect(blob).toBeInstanceOf(Blob);
  const payload = JSON.parse(await blob.text());
  expect(payload.version).toBe(1);
  expect(payload.videos).toHaveLength(1);
  expect(payload.videos[0].title).toBe('Gols da final');
});

test('imports videos from an exported JSON file and merges by id', async () => {
  const user = userEvent.setup();
  localStorage.setItem(
    USER_VIDEOS_STORAGE_KEY,
    JSON.stringify({
      version: 1,
      videos: [
        {
          id: 'local-1',
          title: 'Video local',
          url: 'https://youtu.be/local1',
        },
      ],
    }),
  );
  render(<NovoVideo />);

  const file = new File(
    [
      JSON.stringify({
        version: 1,
        videos: [
          {
            id: 'local-1',
            title: 'Versão importada',
            url: 'https://youtu.be/local1',
          },
          {
            id: 'importado-1',
            title: 'Video importado',
            url: 'https://youtu.be/imp1',
          },
        ],
      }),
    ],
    'videos.json',
    { type: 'application/json' },
  );

  await user.upload(
    screen.getByLabelText(/importar vídeos de um arquivo/i),
    file,
  );

  expect(await screen.findByText('Video importado')).toBeInTheDocument();
  expect(screen.queryByText('Versão importada')).not.toBeInTheDocument();
  const stored = JSON.parse(localStorage.getItem(USER_VIDEOS_STORAGE_KEY));
  expect(stored.videos.map((video) => video.id)).toEqual([
    'local-1',
    'importado-1',
  ]);
});

test('shows an alert when the imported file has no valid videos', async () => {
  const user = userEvent.setup();
  render(<NovoVideo />);

  const file = new File(['{isso não é json'], 'quebrado.json', {
    type: 'application/json',
  });

  await user.upload(
    screen.getByLabelText(/importar vídeos de um arquivo/i),
    file,
  );

  expect(await screen.findByRole('alert')).toHaveTextContent(
    /não foi possível importar/i,
  );
});
