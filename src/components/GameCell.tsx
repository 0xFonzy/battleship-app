import { Cell } from "../models/game";

export type GameCellProps = {
  cell: Cell;
  onClick?: () => void;
};

function GameCell({ cell, onClick }: GameCellProps) {
  const className = `cell ${cell.hit ? (cell.ship ? 'hit' : 'miss') : ''} ${cell.ship ? 'ship' : ''}`;
  return <div className={className} onClick={onClick}></div>;
}

export default GameCell;