import React from 'react';
import LogoTimao from './components/LogoTimao';
import HeaderTimao from './components/HeaderTimao';
import ButtonTimao from './components/ButtonTimao';
import FooterTimao from './components/FooterTimao';
import HighlightTimao from './components/HighlightTimao';
import LinkTimao from './components/LinkTimao';

// JSX = (J)ava(S)cript (X)ML
function App() {
  return (
    <>
      <HeaderTimao>
        <LogoTimao />

        <ButtonTimao>Novo vídeo</ButtonTimao>
      </HeaderTimao>

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
