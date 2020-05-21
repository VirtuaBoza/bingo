import { BoardVariant } from '../enums/BoardVariant.enum';

export function getRequiredTermsLength(variant: BoardVariant): number {
  switch (variant) {
    case BoardVariant.Lesser:
      return 8;
    case BoardVariant.Andean:
      return 9;
    case BoardVariant.Chilean:
      return 16;
    case BoardVariant.Caribbean:
      return 24;
    case BoardVariant.Greater:
      return 25;
    default:
      throw new Error('Invalid size passed to getRequiredTermsLength');
  }
}

export function getBoardSize(variant: BoardVariant): [number, boolean] {
  switch (variant) {
    case BoardVariant.Lesser:
      return [3, true];
    case BoardVariant.Andean:
      return [3, false];
    case BoardVariant.Chilean:
      return [4, false];
    case BoardVariant.Caribbean:
      return [5, true];
    case BoardVariant.Greater:
    default:
      return [5, false];
  }
}

export function createGameBoard(
  termIds: string[],
  variant: BoardVariant
): string[][] {
  const [size, freeSpace] = getBoardSize(variant);
  const remainingTermIds = [...termIds];
  const board: string[][] = [];

  function isFreeSpace(rowIndex: number, colIndex: number): boolean {
    if (!freeSpace || size % 2 === 0 || rowIndex !== colIndex) {
      return false;
    }

    const middleIndex = Math.floor(size / 2);
    if (middleIndex === rowIndex && middleIndex === colIndex) {
      return true;
    }

    return false;
  }

  function getRandomTermId(): string {
    const index = Math.floor(Math.random() * remainingTermIds.length);
    return remainingTermIds.splice(index, 1)[0];
  }

  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    board.push([]);
    for (let colIndex = 0; colIndex < size; colIndex++) {
      if (isFreeSpace(rowIndex, colIndex)) {
        board[rowIndex].push(null);
      } else {
        board[rowIndex].push(getRandomTermId());
      }
    }
  }

  return board;
}
