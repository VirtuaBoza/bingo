import React, { useLayoutEffect } from 'react';
import { Text } from 'react-native';
import { PageContainer } from '../../components';

export const GameBoardScreen: React.FC<any> = ({ navigation, ...props }) => {
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: null,
    });
  }, []);

  return (
    <PageContainer>
      <Text>Game Board</Text>
    </PageContainer>
  );
};

export default GameBoardScreen;
