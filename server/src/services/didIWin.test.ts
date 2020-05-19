import Board from 'src/models/Board.model';
import didIWin from './didIWin';

describe('didIWin', () => {
  describe('3x3 with free space', () => {
    const board: Board = [
      ['one', 'two', 'three'],
      ['four', null, 'five'],
      ['six', 'seven', 'eight'],
    ];

    test('returns true for first row win', () => {
      // prettier-ignore
      const termsMap = {
        one: true, two: true, three: true,
        four: false, five: false,
        six: false, seven: false, eight: false,
      };

      expect(didIWin(board, termsMap)).toBe(true);
    });

    test('returns true for second row (with free space) win', () => {
      // prettier-ignore
      const termsMap = {
        one: false, two: false, three: false,
        four: true, five: true,
        six: false, seven: false, eight: false,
      };

      expect(didIWin(board, termsMap)).toBe(true);
    });

    test('returns true for third row win', () => {
      // prettier-ignore
      const termsMap = {
        one: false, two: false, three: false,
        four: false, five: false,
        six: true, seven: true, eight: true,
      };

      expect(didIWin(board, termsMap)).toBe(true);
    });

    test('returns false for first row partial', () => {
      // prettier-ignore
      const termsMap = {
        one: true, two: false, three: true,
        four: false, five: false,
        six: false, seven: false, eight: false,
      };

      expect(didIWin(board, termsMap)).toBe(false);
    });

    test('returns false for second row partial', () => {
      // prettier-ignore
      const termsMap = {
        one: false, two: false, three: false,
        four: true, five: false,
        six: false, seven: false, eight: false,
      };

      expect(didIWin(board, termsMap)).toBe(false);
    });

    test('returns false for third row partial', () => {
      // prettier-ignore
      const termsMap = {
        one: false, two: false, three: false,
        four: false, five: false,
        six: false, seven: false, eight: true,
      };

      expect(didIWin(board, termsMap)).toBe(false);
    });

    test('returns true for first column win', () => {
      // prettier-ignore
      const termsMap = {
        one: true, two: false, three: false,
        four: true, five: false,
        six: true, seven: false, eight: false,
      };

      expect(didIWin(board, termsMap)).toBe(true);
    });

    test('returns true for second column (with free space) win', () => {
      // prettier-ignore
      const termsMap = {
        one: false, two: true, three: false,
        four: false, five: false,
        six: false, seven: true, eight: false,
      };

      expect(didIWin(board, termsMap)).toBe(true);
    });

    test('returns true for third column win', () => {
      // prettier-ignore
      const termsMap = {
        one: false, two: false, three: true,
        four: false, five: true,
        six: false, seven: false, eight: true,
      };

      expect(didIWin(board, termsMap)).toBe(true);
    });

    test('returns false for first column partial', () => {
      // prettier-ignore
      const termsMap = {
        one: false, two: false, three: false,
        four: true, five: false,
        six: true, seven: false, eight: false,
      };

      expect(didIWin(board, termsMap)).toBe(false);
    });

    test('returns false for second column partial', () => {
      // prettier-ignore
      const termsMap = {
        one: false, two: true, three: false,
        four: false, five: false,
        six: false, seven: false, eight: false,
      };

      expect(didIWin(board, termsMap)).toBe(false);
    });

    test('returns false for third column partial', () => {
      // prettier-ignore
      const termsMap = {
        one: false, two: false, three: true,
        four: false, five: true,
        six: false, seven: false, eight: false,
      };

      expect(didIWin(board, termsMap)).toBe(false);
    });

    test('returns true for diag (top left to bottom right with free space) win', () => {
      // prettier-ignore
      const termsMap = {
        one: true, two: false, three: false,
        four: false, five: false,
        six: false, seven: false, eight: true,
      };

      expect(didIWin(board, termsMap)).toBe(true);
    });

    test('returns true for diag (top right to bottom left with free space) win', () => {
      // prettier-ignore
      const termsMap = {
        one: false, two: false, three: true,
        four: false, five: false,
        six: true, seven: false, eight: false,
      };

      expect(didIWin(board, termsMap)).toBe(true);
    });
  });
});
