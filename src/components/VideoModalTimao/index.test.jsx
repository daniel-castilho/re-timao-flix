import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VideoModalTimao from '.';

const video = {
  id: 'libertadores-2012-campanha',
  title: 'Melhores momentos da campanha campeã',
  url: 'https://www.youtube.com/watch?v=Bui2mO6AbxA',
  thumbnailUrl: 'https://img.youtube.com/vi/Bui2mO6AbxA/hqdefault.jpg',
};

test('renders a dialog with an embedded player and the video title', () => {
  render(<VideoModalTimao video={video} onClose={() => {}} />);

  expect(screen.getByRole('dialog', { name: video.title })).toBeInTheDocument();
  const frame = screen.getByTitle(`Vídeo: ${video.title}`);
  expect(frame.tagName).toBe('IFRAME');
  expect(frame).toHaveAttribute(
    'src',
    'https://www.youtube-nocookie.com/embed/Bui2mO6AbxA',
  );
});

test('closes the dialog when the close button is clicked', async () => {
  const user = userEvent.setup();
  const onClose = vi.fn();
  render(<VideoModalTimao video={video} onClose={onClose} />);

  await user.click(screen.getByRole('button', { name: 'Fechar' }));
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('closes the dialog when Escape is pressed', async () => {
  const user = userEvent.setup();
  const onClose = vi.fn();
  render(<VideoModalTimao video={video} onClose={onClose} />);

  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
});
