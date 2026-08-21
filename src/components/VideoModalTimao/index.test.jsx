import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
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

// Tab navigation is asserted with raw keydown events: jsdom does not implement
// tabbing, and @testing-library/user-event walks the DOM itself, bypassing
// custom traps (https://github.com/jsdom/jsdom/issues/2102).
test('moves focus to the close button when it opens', () => {
  render(<VideoModalTimao video={video} onClose={() => {}} />);

  expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();
});

test('wraps forward Tab from the last focusable to the first inside the dialog', () => {
  const backgroundButton = document.createElement('button');
  document.body.appendChild(backgroundButton);
  render(<VideoModalTimao video={video} onClose={() => {}} />);

  const frame = screen.getByTitle(`Vídeo: ${video.title}`);
  const closeButton = screen.getByRole('button', { name: 'Fechar' });
  fireEvent.keyDown(closeButton, { key: 'Tab' });

  expect(frame).toHaveFocus();
  expect(backgroundButton).not.toHaveFocus();

  backgroundButton.remove();
});

test('wraps Shift+Tab from the first focusable to the last inside the dialog', () => {
  render(<VideoModalTimao video={video} onClose={() => {}} />);

  const frame = screen.getByTitle(`Vídeo: ${video.title}`);
  const closeButton = screen.getByRole('button', { name: 'Fechar' });
  fireEvent.keyDown(frame, { key: 'Tab', shiftKey: true });

  expect(closeButton).toHaveFocus();
});

test('restores focus to the trigger element when it closes', async () => {
  const user = userEvent.setup();
  function Page() {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <>
        <button type="button" onClick={() => setIsOpen(true)}>
          Assistir
        </button>
        {isOpen && (
          <VideoModalTimao video={video} onClose={() => setIsOpen(false)} />
        )}
      </>
    );
  }
  render(<Page />);

  const trigger = screen.getByRole('button', { name: 'Assistir' });
  await user.click(trigger);
  expect(screen.getByRole('button', { name: 'Fechar' })).toHaveFocus();

  await user.click(screen.getByRole('button', { name: 'Fechar' }));

  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(trigger).toHaveFocus();
});
