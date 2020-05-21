import { NavigationProp } from '@react-navigation/native';
import { Game, GameStatus as Status, Term } from 'mafingo-core';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, PageContainer, Stack, Text, Title } from '../../components';
import Colors from '../../constants/Colors';
import Layout from '../../constants/Layout';
import Routes from '../../constants/Routes';
import { useClearHeaderButton } from '../../hooks';
import { User } from '../../models';
import { gameService } from '../../services';
import { connect, selectGameById, selectUser } from '../../store';
import Mafingo from '../../svg/Mafingo';
import RoundedSquare from '../../svg/RoundedSquare';

export const GameBoardScreen: React.FC<{
  navigation: NavigationProp<any>;
  game: Game;
  user: User;
  setUpdating: (updating: boolean) => any;
}> = ({ navigation, game, user, setUpdating }) => {
  useClearHeaderButton(navigation);

  React.useLayoutEffect(() => {
    if (game.status === Status.Finished) {
      navigation.setOptions({
        headerLeft: null,
      });
    }
  }, [game.status]);

  const myBoard = game.game_players.find((gp) => gp.player.id === user.id)
    ?.board;

  return (
    <PageContainer>
      <Modal
        visible={game.status === Status.Finished}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modal,
              {
                height: Layout.window.height / 2,
                width: 300,
              },
            ]}
          >
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text font="display">Game Over</Text>
              <Text font="display" size={34} color={Colors.primary}>
                You{' '}
                {game.game_players.find((gp) => gp.player.id === user.id)
                  ?.winner
                  ? 'Won!'
                  : 'Lost'}
              </Text>
            </View>
            <Stack>
              <Button
                borderless
                title="Main Menu"
                onPress={() => navigation.navigate(Routes.Home)}
                style={{ alignSelf: 'center' }}
              />
            </Stack>
          </View>
        </View>
      </Modal>
      <Title text={game.name} />
      <View style={styles.boardContainer}>
        {myBoard!.map((row, i) => (
          <View key={i} style={styles.row}>
            {row.map((termId) => (
              <View key={termId} style={styles.square}>
                {termId ? (
                  <Square
                    id={termId}
                    terms={game.terms}
                    userId={user.id}
                    setUpdating={setUpdating}
                  />
                ) : (
                  <View style={{ padding: 5 }}>
                    <Mafingo />
                  </View>
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.markedTermsContainer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text font="display">Marked Terms</Text>
          <Text font="display">
            {game.terms.filter((t) => t.marked_by).length}/{game.terms.length}
          </Text>
        </View>
        <FlatList
          data={game.terms.filter((t) => t.marked_by)}
          renderItem={({ item }) => (
            <View style={styles.markedTermRow}>
              <Text>{item.updated_at}</Text>
              <Text>{item.text}</Text>
              <Text>{item.marked_by}</Text>
            </View>
          )}
          keyExtractor={(term) => term.id}
        />
      </View>
    </PageContainer>
  );
};

export default connect(({ route }) => {
  const { gameId } = route.params;
  const gameSelector = selectGameById(gameId);
  return { game: gameSelector, user: selectUser };
})(GameBoardScreen);

const Square: React.FC<{
  id: string;
  terms: Term[];
  userId: string;
  setUpdating: (updating: boolean) => any;
}> = ({ id, terms, userId, setUpdating }) => {
  const [modalVisible, setModalVisible] = useState(false);

  function handleMarkTermPressed() {
    setUpdating(true);
    gameService
      .markTerm(id, userId)
      .then(() => {
        setUpdating(false);
        setModalVisible(false);
      })
      .catch((err) => {
        setUpdating(false);
        setModalVisible(false);
        console.log(err);
      });
  }

  const term = terms.find((t) => t.id === id);

  return (
    <View>
      <Modal
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
        visible={modalVisible}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modal,
              {
                height: Layout.window.height / 2,
                width: 300,
              },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text>{term?.text}</Text>
            </View>
            <Stack>
              {!term?.marked_by && (
                <Button
                  title="Mark"
                  onPress={handleMarkTermPressed}
                  style={{ alignSelf: 'center' }}
                />
              )}

              <Button
                borderless
                title="Cancel"
                onPress={() => setModalVisible(false)}
                style={{ alignSelf: 'center' }}
              />
            </Stack>
          </View>
        </View>
      </Modal>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <RoundedSquare
          fill={term?.marked_by ? Colors.secondary : Colors.lightPink}
          width="100%"
          height="100%"
        />
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'flex-start',
            padding: 10,
            overflow: 'hidden',
          }}
        >
          <View style={{ overflow: 'hidden', height: '100%' }}>
            <Text color={term?.marked_by ? Colors.offWhite : Colors.gray}>
              {term?.text}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    flex: 1,
  },
  square: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  modal: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'stretch',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markedTermsContainer: {
    marginTop: 10,
    flex: 1,
  },
  markedTermRow: {
    flexDirection: 'row',
  },
});
