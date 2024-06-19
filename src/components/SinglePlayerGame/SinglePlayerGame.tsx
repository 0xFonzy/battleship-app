import React, { useState } from 'react';
import './SinglePlayerGame.css';

type Coordinate = [number, number];

interface Ship {
  name: string;
  size: number;
  coordinates: Coordinate[];
}

const shipData: Ship[] = [
  { name: 'Carrier', size: 5, coordinates: [] },
  { name: 'Battleship', size: 4, coordinates: [] },
  { name: 'Cruiser', size: 3, coordinates: [] },
  { name: 'Submarine', size: 3, coordinates: [] },
  { name: 'Destroyer', size: 2, coordinates: [] },
];

const createBoard = (ships: Map<string, Ship>): Map<string, string> => {
  const board = new Map<string, string>();
  shipData.forEach((ship) => {
    let placed = false;
    while (!placed) {
      const direction = Math.random() < 0.5 ? 'horizontal' : 'vertical';
      const row = Math.floor(Math.random() * 10);
      const col = Math.floor(Math.random() * 10);
      if (canPlaceShip(board, ship, row, col, direction)) {
        placeShip(board, ships, ship, row, col, direction);
        placed = true;
      }
    }
  });
  return board;
};

const canPlaceShip = (
  board: Map<string, string>,
  ship: Ship,
  row: number,
  col: number,
  direction: string
): boolean => {
  if (direction === 'horizontal') {
    if (col + ship.size > 10) return false;
    for (let i = 0; i < ship.size; i++) {
      if (board.has(`${row}-${col + i}`)) return false;
    }
  } else {
    if (row + ship.size > 10) return false;
    for (let i = 0; i < ship.size; i++) {
      if (board.has(`${row + i}-${col}`)) return false;
    }
  }
  return true;
};

const placeShip = (
  board: Map<string, string>,
  ships: Map<string, Ship>,
  ship: Ship,
  row: number,
  col: number,
  direction: string
): void => {
  const shipCoordinates: Coordinate[] = [];
  for (let i = 0; i < ship.size; i++) {
    if (direction === 'horizontal') {
      board.set(`${row}-${col + i}`, ship.name);
      shipCoordinates.push([row, col + i]);
    } else {
      board.set(`${row + i}-${col}`, ship.name);
      shipCoordinates.push([row + i, col]);
    }
  }
  ships.set(ship.name, { ...ship, coordinates: shipCoordinates });
};

const SinglePlayerGame: React.FC = () => {
  const [ships, setShips] = useState<Map<string, Ship>>(new Map());
  const [board, setBoard] = useState<Map<string, string>>(createBoard(ships));
  const [shots, setShots] = useState<Map<string, string>>(new Map());
  const [message, setMessage] = useState<string>('');

  const fireShot = (row: number, col: number): void => {
    const coord = `${row}-${col}`;
    if (shots.has(coord)) {
      setMessage('You already shot here!');
      return;
    }

    const newShots = new Map(shots);
    if (board.has(coord)) {
      newShots.set(coord, 'hit');
      const hitShipName = board.get(coord) as string;
      const ship = ships.get(hitShipName) as Ship;
      const hitCoordinates = ship.coordinates.find(
        (c) => c[0] === row && c[1] === col
      );
      ship.coordinates = ship.coordinates.filter(
        (coord) => coord !== hitCoordinates
      );
      ships.set(hitShipName, ship);
      if (ship.coordinates.length === 0) {
        setMessage(`You sunk the ${hitShipName}!`);
        if (Array.from(ships.values()).every((ship) => ship.coordinates.length === 0)) {
          setMessage('You won!');
        }
      } else {
        setMessage('Hit!');
      }
    } else {
      newShots.set(coord, 'miss');
      setMessage('Miss!');
    }
    setShots(newShots);
  };

  const renderBoard = (): JSX.Element[] => {
    const grid: JSX.Element[] = [];
    for (let row = 0; row < 10; row++) {
      const rowCells: JSX.Element[] = [];
      for (let col = 0; col < 10; col++) {
        const coord = `${row}-${col}`;
        const isShot = shots.has(coord);
        rowCells.push(
          <div
            key={coord}
            className={`cell ${isShot ? shots.get(coord) : ''}`}
            onClick={() => fireShot(row, col)}
          >
            {isShot && (shots.get(coord) === 'hit' ? 'X' : 'O')}
          </div>
        );
      }
      grid.push(
        <div key={row} className="row">
          {rowCells}
        </div>
      );
    }
    return grid;
  };

  return (
    <div className="App">
      <h1>Battleship</h1>
      <div className="board">{renderBoard()}</div>
      <p>{message}</p>
    </div>
  );
};

export default SinglePlayerGame;