export type Board = Cell[][];

export type Ship = {
  name: string;
  size: number;
};

export type Cell = {
  ship: Ship | null;
  hit: boolean;
};
