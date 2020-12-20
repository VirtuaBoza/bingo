import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { PageContainer } from '../../components';
import Colors from '../../constants/Colors';
import { useClearHeaderButton } from '../../hooks';

export const GameBuildingScreen: React.FC<any> = ({ navigation, ...props }) => {
  useClearHeaderButton(navigation);
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
