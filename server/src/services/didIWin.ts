import Board from 'src/models/Board.model';

export default function didIWin(
  board: Board,
  termsMap: { [id: string]: boolean }
): boolean {
  function checkRows() {
    for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
      if (checkRow(board[rowIndex])) {
        return true;
      }
    }

    return false;

    function checkRow(row: string[]) {
      for (let colIndex = 0; colIndex < board.length; colIndex++) {
        if (row[colIndex] && !termsMap[row[colIndex]]) {
          return false;
        }
      }
      return true;
    }
  }

  function checkColumns() {
    for (let colIndex = 0; colIndex < board.length; colIndex++) {
      if (checkColumn(colIndex)) {
        return true;
      }
    }
    return false;

    function checkColumn(colIndex: number) {
      for (let rowIndex = 0; rowIndex < board.length; rowIndex++) {
        if (board[rowIndex][colIndex] && !termsMap[board[rowIndex][colIndex]]) {
          return false;
        }
      }

      return true;
    }
  }

  function checkDiagonals() {
    let win = true;
    for (let i = 0; i < board.length; i++) {
      if (board[i][i] && !termsMap[board[i][i]]) {
        win = false;
      }
    }

    if (win) return true;

    for (let i = 0; i < board.length; i++) {
      if (
        board[i][board.length - 1 - i] &&
        !termsMap[board[i][board.length - 1 - i]]
      ) {
        return false;
      }
    }

    return true;
  }

  return checkRows() || checkColumns() || checkDiagonals();
}
