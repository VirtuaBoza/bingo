import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { BoardVariant } from '../enums/BoardVariant.enum';
import { gameService } from '../services';
import RoundedSquare from '../svg/RoundedSquare';

function getCellSize(boardSize: number, thumbnailSize: number) {
  return (thumbnailSize - 2 * boardSize) / boardSize;
}

export interface BoardThumbnailProps {
  variant: BoardVariant;
  size?: number;
  opacity?: number;
}

const BoardThumbnail: React.FC<BoardThumbnailProps> = ({
  variant,
  size = 72,
  opacity = 1,
}) => {
  const [boardSize, freeSpace] = gameService.getBoardSize(variant);
  const cellSize = getCellSize(boardSize, size);
  const arr = Array(boardSize).fill(1);
  return (
    <View style={[styles.container, { height: size, width: size }]}>
      {arr.map((_, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {arr.map((_, colIndex) => (
            <View key={colIndex} style={styles.cell}>
              <RoundedSquare
                fill="#F7BDC9"
                fillOpacity={
                  freeSpace &&
                  boardSize % 2 !== 0 &&
                  colIndex === Math.floor(boardSize / 2) &&
                  rowIndex === colIndex
                    ? 0
                    : opacity
                }
                height={cellSize}
                width={cellSize}
              />
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

export default BoardThumbnail;

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: 'row',
  },
  cell: {
    margin: 1,
  },
});
