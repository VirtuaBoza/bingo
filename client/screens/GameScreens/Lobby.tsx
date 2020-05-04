import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationProp } from '@react-navigation/native';
import { Linking } from 'expo';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Button, Label, PageContainer, Title } from '../../components';
import Routes from '../../constants/Routes';
import { useKeyboardEvent } from '../../hooks';
import { Game, GamePlayer, Term, User } from '../../models';
import { gameService } from '../../services';
import { connect, selectGameById, selectUser } from '../../store';
import {
  createGameUpsertedAction,
  createRemoveTermAction,
  createTogglePlayerReadyAction,
  createUpsertTermAction,
  GameUpsertedActionCreator,
  RemoveTermActionCreator,
  TogglePlayerActionCreator,
  UpserTermActionCreator,
} from '../../store/reducers/gamesReducer';
import uuid from '../../utils/uuid';

let animationIsRunning = false;
let updating = false;

export const GameLobbyScreen: React.FC<{
  game: Game;
  user: User;
  navigation: NavigationProp<any>;
  updateGameInStore: GameUpsertedActionCreator;
  upsertTermInStore: UpserTermActionCreator;
  removeTermFromStore: RemoveTermActionCreator;
  togglePlayerReadyInStore: TogglePlayerActionCreator;
}> = ({
  navigation,
  game,
  updateGameInStore,
  user,
  upsertTermInStore,
  removeTermFromStore,
  togglePlayerReadyInStore,
}) => {
  // const [updating, setUpdating] = useState(false);
  const [editingTerm, setEditingTerm] = useState<Term | null>(null);
  const [showAddButton, setShowAddButton] = useState(true);
  const listRef = useRef<any>(null);

  useLayoutEffect(() => {
    const subscription = gameService.subscribeToGame(game.id).subscribe(
      (g) => {
        if (!updating) {
          updateGameInStore(g);
        }
      },
      (err) => {
        console.log(err);
      }
    );
    return () => {
      subscription.unsubscribe();
    };
  });

  useEffect(() => {
    if (Platform.OS === 'ios' && listRef.current && editingTerm) {
      const index = game.terms.findIndex((t) => t.id === editingTerm.id);
      if (index > -1) {
        listRef.current!.scrollToIndex({ animated: false, index });
      } else {
        listRef.current!.scrollToIndex({
          animated: false,
          index: game.terms.length,
        });
      }
    }
  });

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        game.game_master_id === user.id ? (
          <Button
            title="Start"
            onPress={() => {}}
            style={{ paddingRight: 20 }}
            disabled={game.terms.length < 8}
            borderless
          />
        ) : (
          <Button
            title="Toggle Ready"
            onPress={handleToggleReady}
            style={{ paddingRight: 20 }}
            borderless
          />
        ),
    });
  }, [game.terms]);

  function handleKeyboardDismissed() {
    if (editingTerm) {
      if (editingTerm.text.trim()) {
        upsertTerm(editingTerm);
      } else {
        removeTerm(editingTerm);
      }
    }
    setEditingTerm(null);
    setShowAddButton(true);
  }

  useKeyboardEvent('keyboardDidHide', () => {
    if (Platform.OS === 'android') {
      handleKeyboardDismissed();
    }
  });

  function createNewTerm() {
    const newTerm = { id: uuid(), text: '' } as Term;
    setEditingTerm(newTerm);
  }

  function handleAddTermClick() {
    setShowAddButton(false);
    createNewTerm();
  }

  function handleSubmitTerm(term: Term) {
    if (term.text.trim()) {
      createNewTerm();
      upsertTerm(term);
    } else {
      handleKeyboardDismissed();
    }
  }

  function upsertTerm(term: Term) {
    upsertTermInStore(game.id, term);
    gameService.upsertTerm(game.id, term).catch((err) => console.log(err));
  }

  function removeTerm(term: Term) {
    updating = true;
    removeTermFromStore(game.id, term.id);
    gameService
      .deleteTerm(game.id, term.id)
      .then(() => {
        updating = false;
      })
      .catch((err) => {
        updating = false;
        console.log(err);
      });
  }

  function handleTermPressed(term: Term) {
    setShowAddButton(false);
    setEditingTerm(term);
  }

  function handleEditingTermTextChange(text: string) {
    setEditingTerm({ ...editingTerm, text } as Term);
  }

  function handleEditingTermBlur() {
    if (Platform.OS === 'ios') {
      handleKeyboardDismissed();
    }
  }

  function handleToggleReady() {
    // setUpdating(true);
    updating = true;
    togglePlayerReadyInStore(game.id, user.id);
    const ready = game.game_players.find((gp) => gp.player.id === user.id)!
      .ready;
    gameService
      .upsertGamePlayer(game.id, user.id, !ready)
      .then(() => {
        // setUpdating(false);
        updating = false;
      })
      .catch((err) => {
        console.log(err);
        // setUpdating(false);
        updating = false;
      });
  }

  const readyPlayerCount = game.game_players.filter((player) => player.ready)
    .length;
  const localTerms =
    editingTerm && game.terms.find((t) => t.id === editingTerm.id)
      ? game.terms
      : editingTerm
      ? [...game.terms, editingTerm!]
      : game.terms;
  const rowTranslateAnimatedValues = localTerms.reduce<{
    [key: string]: Animated.Value;
  }>((a, c) => {
    a[c.id] = new Animated.Value(1);
    return a;
  }, {});
  return (
    <PageContainer>
      <Title text={game.name} />
      <Label
        style={{ alignSelf: 'center' }}
        text={
          game.game_players.length > 1
            ? readyPlayerCount === game.game_players.length
              ? 'All Plyers Ready!'
              : `${readyPlayerCount}/${game.game_players.length} Players Ready`
            : 'No Players'
        }
      />
      <View>
        <ScrollView
          horizontal
          contentContainerStyle={{
            justifyContent: 'center',
            minWidth: '100%',
            paddingVertical: 20,
          }}
        >
          <GameMasterIcon
            gameMaster={
              game.game_players.find(
                (gp) => gp.player.id === game.game_master_id
              )!.player
            }
            userId={user.id}
          />
          {game.game_players
            .filter((gp) => gp.player.id !== game.game_master_id)
            .map((gp) => (
              <PlayerIcon
                key={gp.player.id}
                gamePlayer={gp}
                userId={user.id}
                onToggleReady={handleToggleReady}
              />
            ))}
          <InvitePlayerIcon gameId={game.id} />
        </ScrollView>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <Label text="Terms" />
        {game.terms.length < 8 ? (
          <Text style={styles.subLabel}>
            Add {`${8 - game.terms.length}`} or more terms.
          </Text>
        ) : null}
        <View style={{ flex: 1, paddingVertical: 10 }}>
          <SwipeListView
            disableRightSwipe
            rightOpenValue={-Dimensions.get('window').width}
            listViewRef={(ref) => (listRef.current = ref)}
            getItemLayout={(data: any, index: any) => ({
              length: LIST_ITEM_HEIGHT,
              offset: LIST_ITEM_HEIGHT * index,
              index,
            })}
            data={localTerms}
            keyExtractor={(item: Term) => item.id}
            renderItem={({ item }) =>
              item.id === editingTerm?.id ? (
                <EditingTerm
                  term={editingTerm}
                  onSubmit={handleSubmitTerm}
                  onChange={handleEditingTermTextChange}
                  onBlur={handleEditingTermBlur}
                />
              ) : (
                <ReadonlyTerm
                  term={item}
                  onPress={handleTermPressed}
                  rowTranslateAnimatedValues={rowTranslateAnimatedValues}
                />
              )
            }
            renderHiddenItem={() => <View></View>}
            onSwipeValueChange={(swipeData) => {
              const { key, value } = swipeData;
              if (
                value < -Dimensions.get('window').width &&
                !animationIsRunning
              ) {
                animationIsRunning = true;
                Animated.timing(rowTranslateAnimatedValues[key], {
                  toValue: 0,
                  duration: 200,
                } as any).start(() => {
                  removeTerm(game.terms.find((t) => t.id === key)!);
                  animationIsRunning = false;
                });
              }
            }}
            ListEmptyComponent={
              <Text style={styles.subLabel}>Add at least 8 terms.</Text>
            }
            ItemSeparatorComponent={() => <View style={styles.divider}></View>}
            contentContainerStyle={[
              {
                flexGrow: 1,
                paddingVertical: 10,
              },
              !editingTerm &&
                !game.terms.length && {
                  justifyContent: 'center',
                  alignItems: 'center',
                },
            ]}
            removeClippedSubviews={false}
          />
        </View>
        {showAddButton && (
          <Button
            style={{ marginVertical: 10 }}
            title="Add Term"
            onPress={handleAddTermClick}
          />
        )}
      </View>
    </PageContainer>
  );
};

export default connect(
  ({ route }) => {
    const { gameId } = route.params;
    const gameSelector = selectGameById(gameId);
    return { game: gameSelector, user: selectUser };
  },
  {
    updateGameInStore: createGameUpsertedAction,
    upsertTermInStore: createUpsertTermAction,
    removeTermFromStore: createRemoveTermAction,
    togglePlayerReadyInStore: createTogglePlayerReadyAction,
  }
)(GameLobbyScreen);

const ReadonlyTerm = React.forwardRef<
  any,
  {
    term: Term;
    onPress: any;
    rowTranslateAnimatedValues: { [key: string]: Animated.Value };
  }
>(({ term, onPress, rowTranslateAnimatedValues }, ref) => {
  function handlePress() {
    onPress(term);
  }

  return (
    <Animated.View
      style={[
        styles.termContainer,
        {
          height: rowTranslateAnimatedValues[term.id].interpolate({
            inputRange: [0, 1],
            outputRange: [0, LIST_ITEM_HEIGHT],
          }),
        },
      ]}
    >
      <TouchableHighlight
        onPress={handlePress}
        ref={ref}
        underlayColor="rgba(128, 128, 128, 0.05)"
        style={[styles.termContainer, { height: '100%' }]}
      >
        <View>
          <Text style={styles.term}>{term.text}</Text>
        </View>
      </TouchableHighlight>
    </Animated.View>
  );
});

const EditingTerm = React.forwardRef<any, any>(
  ({ term, onSubmit, onChange, onBlur }, ref) => {
    const externalRef = ref as any;
    const myRef = React.useRef<any>();
    useLayoutEffect(() => {
      if (myRef.current) {
        myRef.current.focus();
      }
    });

    function handleSubmitTerm() {
      onSubmit(term);
    }

    return (
      <TextInput
        value={term.text}
        onChangeText={onChange}
        onSubmitEditing={handleSubmitTerm}
        blurOnSubmit={false}
        onBlur={onBlur}
        style={[
          styles.termContainer,
          styles.term,
          {
            height: LIST_ITEM_HEIGHT,
          },
        ]}
        ref={(ref) => {
          myRef.current = ref;
          if (externalRef) {
            externalRef.current = ref;
          }
        }}
      />
    );
  }
);

const GameMasterIcon: React.FC<{ gameMaster: User; userId: string }> = ({
  gameMaster,
  userId,
}) => {
  return (
    <View style={styles.playerContainer}>
      <View
        style={{
          backgroundColor: '#FDF1F1',
          height: 32,
          width: 32,
          borderRadius: 50,
          borderColor: userId === gameMaster.id ? '#F38BA6' : '#F7BDC9',
          borderWidth: 2.3,
        }}
      ></View>
      <View style={{ position: 'absolute', marginTop: 3 }}>
        <MaterialCommunityIcons
          name="crown"
          size={24}
          color={userId === gameMaster.id ? '#F38BA6' : '#F7BDC9'}
        />
      </View>
      <Text
        style={[
          styles.subLabel,
          {
            textAlign: 'center',
          },
        ]}
      >
        {gameMaster.username}
      </Text>
    </View>
  );
};

const PlayerIcon: React.FC<{
  gamePlayer: GamePlayer;
  userId: string;
  onToggleReady: () => void;
}> = ({ gamePlayer, userId, onToggleReady }) => {
  return (
    <TouchableOpacity
      onPress={onToggleReady}
      style={styles.playerContainer}
      disabled={userId !== gamePlayer.player.id}
    >
      <View
        style={{
          backgroundColor: '#FDF1F1',
          height: 32,
          width: 32,
          borderRadius: 50,
        }}
      ></View>
      <View style={{ position: 'absolute' }}>
        {gamePlayer.ready ? (
          <AntDesign
            name="checkcircleo"
            size={32}
            color={userId === gamePlayer.player.id ? '#F38BA6' : '#F7BDC9'}
          />
        ) : (
          <AntDesign
            name="closecircleo"
            size={32}
            color={userId === gamePlayer.player.id ? '#F38BA6' : '#F7BDC9'}
          />
        )}
      </View>
      <Text
        style={[
          styles.subLabel,
          {
            textAlign: 'center',
          },
        ]}
      >
        {gamePlayer.player.username}
      </Text>
    </TouchableOpacity>
  );
};

const InvitePlayerIcon: React.FC<{ gameId: string }> = ({ gameId }) => {
  function handleInvitePlayerClick() {
    updating = true;
    Share.share({
      message: Linking.makeUrl(
        `${Routes.JoinGame}?gameId=${encodeURIComponent(gameId)}`
      ),
    })
      .then(() => {
        updating = false;
      })
      .catch((err) => {
        updating = false;
        console.log(err);
      });
  }
  return (
    <TouchableOpacity
      onPress={handleInvitePlayerClick}
      style={styles.playerContainer}
    >
      <View
        style={{
          backgroundColor: '#FDF1F1',
          height: 32,
          width: 32,
          borderRadius: 50,
        }}
      ></View>
      <View style={{ position: 'absolute' }}>
        <AntDesign name="pluscircleo" size={32} color="#F38BA6" />
      </View>
      <Text
        style={[
          styles.subLabel,
          {
            textAlign: 'center',
          },
        ]}
      >
        Invite Players
      </Text>
    </TouchableOpacity>
  );
};

const LIST_ITEM_HEIGHT = 42;

const styles = StyleSheet.create({
  termContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  term: {
    fontFamily: 'Work-Sans',
    fontSize: 17,
    color: '#F38BA6',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
  playerContainer: {
    width: 60,
    alignItems: 'center',
  },
  subLabel: {
    fontFamily: 'Work-Sans',
    fontSize: 13,
    color: '#646464',
  },
});
