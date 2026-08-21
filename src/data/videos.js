// Catalog of curated Corinthians videos (official channels and documented
// productions). Thumbnails use YouTube's public image endpoint.
const videos = [
  {
    id: 'libertadores-2012-campanha',
    title: 'Melhores momentos da campanha campeã — Libertadores 2012',
    category: 'Conquistas',
    url: 'https://www.youtube.com/watch?v=Bui2mO6AbxA',
    thumbnailUrl: 'https://img.youtube.com/vi/Bui2mO6AbxA/hqdefault.jpg',
  },
  {
    id: 'bicampeao-mundial-fox-sports',
    title: 'Bicampeão Mundial — a trajetória no Japão (Fox Sports)',
    category: 'Conquistas',
    url: 'https://www.youtube.com/watch?v=C9ycvHsKBm8',
    thumbnailUrl: 'https://img.youtube.com/vi/C9ycvHsKBm8/hqdefault.jpg',
  },
  {
    id: 'america-em-preto-e-branco',
    title: 'América em Preto e Branco — 5 anos da Libertadores',
    category: 'Conquistas',
    url: 'https://www.youtube.com/watch?v=dJ7mH55Qu78',
    thumbnailUrl: 'https://img.youtube.com/vi/dJ7mH55Qu78/hqdefault.jpg',
  },
  {
    id: 'mundial-2000-15-anos',
    title: '15 anos do Mundial de 2000 (Globo Esporte)',
    category: 'Conquistas',
    url: 'https://www.youtube.com/watch?v=z1btmrYcurs',
    thumbnailUrl: 'https://img.youtube.com/vi/z1btmrYcurs/hqdefault.jpg',
  },
  {
    id: 'invasao-maracana-1976',
    title: 'Especial Invasão do Maracanã 1976 (TV Cultura)',
    category: 'História',
    url: 'https://www.youtube.com/watch?v=Eg2j_iySDwU',
    thumbnailUrl: 'https://img.youtube.com/vi/Eg2j_iySDwU/hqdefault.jpg',
  },
  {
    id: 'democracia-corinthiana-detalhes',
    title: 'Democracia Corinthiana — os detalhes (Corinthians TV)',
    category: 'História',
    url: 'https://www.youtube.com/watch?v=lbgyHs1PsJI',
    thumbnailUrl: 'https://img.youtube.com/vi/lbgyHs1PsJI/hqdefault.jpg',
  },
  {
    id: 'ser-campeao-e-detalhe',
    title: 'Ser Campeão é Detalhe: Democracia Corinthiana',
    category: 'História',
    url: 'https://www.youtube.com/watch?v=MNyRGt95cWw',
    thumbnailUrl: 'https://img.youtube.com/vi/MNyRGt95cWw/hqdefault.jpg',
  },
  {
    id: 'marcelinho-carioca-53-gols',
    title: 'Marcelinho Carioca — 53 gols de falta pelo Timão',
    category: 'História',
    url: 'https://www.youtube.com/watch?v=ZR7AfMr_ZYM',
    thumbnailUrl: 'https://img.youtube.com/vi/ZR7AfMr_ZYM/hqdefault.jpg',
  },
  {
    id: 'fundo-do-poco-ao-topo',
    title: 'Do fundo do poço ao topo do mundo (2007–2012)',
    category: 'Documentários',
    url: 'https://www.youtube.com/watch?v=MdqMpn9EiJw',
    thumbnailUrl: 'https://img.youtube.com/vi/MdqMpn9EiJw/hqdefault.jpg',
  },
  {
    id: 'a-liga-libertadores-2012',
    title: 'A Liga — especial Libertadores 2012 (Band)',
    category: 'Documentários',
    url: 'https://www.youtube.com/watch?v=2CIPG4wtFfg',
    thumbnailUrl: 'https://img.youtube.com/vi/2CIPG4wtFfg/hqdefault.jpg',
  },
  {
    id: 'vai-filme-torcida',
    title: 'Vai! — filme sobre a torcida do Corinthians',
    category: 'Documentários',
    url: 'https://www.youtube.com/watch?v=PPMHZezjVnU',
    thumbnailUrl: 'https://img.youtube.com/vi/PPMHZezjVnU/hqdefault.jpg',
  },
  {
    id: 'tetra-copa-do-brasil-2025',
    title: 'Tetra! Bastidores da Copa do Brasil 2025 (Corinthians TV)',
    category: 'Documentários',
    url: 'https://www.youtube.com/watch?v=6W5VeZxx9YE',
    thumbnailUrl: 'https://img.youtube.com/vi/6W5VeZxx9YE/hqdefault.jpg',
  },
];

export default videos;

export function groupVideosByCategory(videoList) {
  return [...new Set(videoList.map((video) => video.category))].map(
    (category) => ({
      category,
      videos: videoList.filter((video) => video.category === category),
    }),
  );
}
