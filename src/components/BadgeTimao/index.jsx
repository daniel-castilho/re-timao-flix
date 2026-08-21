import styled from 'styled-components';

const Badge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.625rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: bold;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-black-dark);
  background-color: var(--color-primary-medium);

  /* Gold accent for the club's trophy category */
  ${(props) =>
    props.$gold &&
    `
    color: #1a1403;
    background-color: var(--color-gold);
  `}
`;

function BadgeTimao({ children, gold = false }) {
  return <Badge $gold={gold}>{children}</Badge>;
}

export default BadgeTimao;
