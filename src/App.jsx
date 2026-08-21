import { Routes, Route } from 'react-router';
import styled from 'styled-components';
import LogoTimao from './components/LogoTimao';
import HeaderTimao from './components/HeaderTimao';
import ButtonLinkTimao from './components/ButtonLinkTimao';
import NavLinkTimao from './components/NavLinkTimao';
import FooterTimao from './components/FooterTimao';
import HighlightTimao from './components/HighlightTimao';
import LinkTimao from './components/LinkTimao';
import SkipLinkTimao from './components/SkipLinkTimao';
import Home from './pages/Home';
import NovoVideo from './pages/NovoVideo';
import VideoDetail from './pages/VideoDetail';

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

function App() {
  return (
    <>
      <SkipLinkTimao href="#main-content">Pular para o conteúdo</SkipLinkTimao>

      <HeaderTimao>
        <LogoTimao />

        <Nav aria-label="Navegação principal">
          <NavLinkTimao to="/" end>
            Início
          </NavLinkTimao>
          <ButtonLinkTimao to="/novo-video">Novo vídeo</ButtonLinkTimao>
        </Nav>
      </HeaderTimao>

      <main id="main-content" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/novo-video" element={<NovoVideo />} />
          <Route path="/video/:id" element={<VideoDetail />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>

      <FooterTimao>
        <LogoTimao />
        <p>
          Site feito na <HighlightTimao>#ImersãoReact</HighlightTimao> da &nbsp;
          <LinkTimao href="https://alura.com.br">Alura</LinkTimao>
        </p>
      </FooterTimao>
    </>
  );
}

export default App;
