import { BoardVariant } from '../enums';

export default function getBoardSize(variant: BoardVariant): [number, boolean] {
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
