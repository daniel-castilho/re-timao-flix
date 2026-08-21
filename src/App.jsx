import { Routes, Route } from 'react-router';
import LogoTimao from './components/LogoTimao';
import HeaderTimao from './components/HeaderTimao';
import ButtonLinkTimao from './components/ButtonLinkTimao';
import FooterTimao from './components/FooterTimao';
import HighlightTimao from './components/HighlightTimao';
import LinkTimao from './components/LinkTimao';
import Home from './pages/Home';
import NovoVideo from './pages/NovoVideo';

function App() {
  return (
    <>
      <HeaderTimao>
        <LogoTimao />

        <ButtonLinkTimao to="/novo-video">Novo vídeo</ButtonLinkTimao>
      </HeaderTimao>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/novo-video" element={<NovoVideo />} />
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
