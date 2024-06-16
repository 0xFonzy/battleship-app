import { useCallback, useEffect, useState } from 'react';
import { Board, Cell, Ship } from './models/game';
import { boardSize, ships } from './data/game';
import GameBoard from './components/GameBoard';
import './App.css';

function App() {
  const [playerBoard, setPlayerBoard] = useState<Board>(createBoard(boardSize));
  const [enemyBoard, setEnemyBoard] = useState<Board>(createBoard(boardSize));

  const [gameMessage, setGameMessage] = useState('');

  function createBoard(size: number): Cell[][] {
    const board: Cell[][] = [];
    for (let i = 0; i < size; i++) {
      const row: Cell[] = [];
      for (let j = 0; j < size; j++) {
        row.push({ ship: null, hit: false });
      }
      board.push(row);
    }
    return board;
  }

  const placeShipsRandomly = useCallback((board: Board, ships: Ship[]) => {
    ships.forEach(ship => {
      let placed = false;
      while (!placed) {
        const direction = Math.random() < 0.5;
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);

        if (canPlaceShip(board, ship, row, col, direction)) {
          placeShip(board, ship, row, col, direction);
          placed = true;
        }
      }
    });
  }, []);

  function canPlaceShip(board: Board, ship: Ship, row: number, col: number, horizontal: boolean) {
    if (horizontal) {
      if (col + ship.size > boardSize) return false;
      for (let i = 0; i < ship.size; i++) {
        if (board[row][col + i].ship) return false;
      }
    } else {
      if (row + ship.size > boardSize) return false;
      for (let i = 0; i < ship.size; i++) {
        if (board[row + i][col].ship) return false;
      }
    }
    return true;
  }

  function placeShip(board: Board, ship: Ship, row: number, col: number, horizontal: boolean) {
    for (let i = 0; i < ship.size; i++) {
      if (horizontal) {
        board[row][col + i].ship = ship;
      } else {
        board[row + i][col].ship = ship;
      }
    }
  }

  function handleEnemyGridClick(row: number, col: number) {
    const newEnemyBoard = [...enemyBoard];
    const cell = newEnemyBoard[row][col];

    if (cell.hit) return;

    cell.hit = true;
    if (cell.ship) {
      setGameMessage('Hit!');
    } else {
      setGameMessage('Miss!');
    }
    setEnemyBoard(newEnemyBoard);
  }

  useEffect(() => {
    placeShipsRandomly(playerBoard, ships);
    placeShipsRandomly(enemyBoard, ships);
  }, [enemyBoard, placeShipsRandomly, playerBoard]);

  return (
    <div className="App">
      <h1>Battleship Game</h1>
      <div className="grids">
        <GameBoard board={playerBoard} />
        <GameBoard board={enemyBoard} onCellClick={handleEnemyGridClick} />
      </div>
      <p>{gameMessage}</p>
    </div>
  );
}

export default App;