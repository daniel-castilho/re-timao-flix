import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import VideoCardTimao from '.';

const video = {
  id: 'libertadores-2012-campanha',
  title: 'Melhores momentos da campanha campeã',
  url: 'https://www.youtube.com/watch?v=Bui2mO6AbxA',
  thumbnailUrl: 'https://img.youtube.com/vi/Bui2mO6AbxA/hqdefault.jpg',
};

test('renders a button with the video title and thumbnail', () => {
  render(<VideoCardTimao video={video} onOpen={() => {}} />);

  const button = screen.getByRole('button', {
    name: `Assistir: ${video.title}`,
  });
  expect(button.tagName).toBe('BUTTON');
  expect(screen.getByRole('img')).toHaveAttribute('alt', '');
  expect(screen.getByText(video.title)).toBeInTheDocument();
});

test('calls onOpen with the video when clicked', async () => {
  const user = userEvent.setup();
  const onOpen = vi.fn();
  render(<VideoCardTimao video={video} onOpen={onOpen} />);

  await user.click(screen.getByRole('button', { name: /assistir:/i }));
  expect(onOpen).toHaveBeenCalledWith(video);
});
