import { Board } from "../models/game";
import GameCell from "./GameCell";

export type GameBoardProps = {
  board: Board;
  onCellClick?: (row: number, col: number) => void;
};

function GameBoard({ board, onCellClick }: GameBoardProps) {
  return (
    <div className="grid">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <GameCell
            key={`${rowIndex}-${colIndex}`}
            cell={cell}
            onClick={() => onCellClick && onCellClick(rowIndex, colIndex)}
          />
        ))
      )}
    </div>
  );
}

export default GameBoard;