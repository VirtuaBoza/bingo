import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PageContainer } from '../../components';
import Colors from '../../constants/Colors';

export const GameBuildingScreen: React.FC<any> = ({ ...props }) => {
  return (
    <PageContainer>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator
          animating={true}
          size="large"
          color={Colors.primary}
        />
      </View>
    </PageContainer>
  );
};

export default GameBuildingScreen;
