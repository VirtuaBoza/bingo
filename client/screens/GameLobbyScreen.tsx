import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useLayoutEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Button, Label, PageContainer, Title } from '../components';
import { useKeyboardEvent, usePromise } from '../hooks';
import { Game, Term, User } from '../models';
import { gameService } from '../services';
import { connect, selectGameById, selectUser } from '../store';
import {
  createGameUpsertedAction,
  createRemoveTermAction,
  createUpsertTermAction,
} from '../store/reducers/gamesReducer';
import uuid from '../utils/uuid';

export const GameLobbyScreen: React.FC<{
  game: Game;
  user: User;
  navigation: any;
  updateGame: any;
  upsertTermToGame: any;
  removeTermFromGame: any;
}> = ({
  navigation,
  game,
  updateGame,
  upsertTermToGame,
  removeTermFromGame,
  user,
}) => {
  const [editingTermKey, setEditingTermKey] = useState<string | null>(null);
  const [localTerms, setLocalTerms] = useState<Term[]>(game.terms);
  const [showAddButton, setShowAddButton] = useState(true);
  const listRef = useRef<any>(null);

  usePromise(
    [],
    () => gameService.getGame(game.id),
    (returnedGame) => {
      console.log('loaded game', returnedGame);
      updateGame(returnedGame);
      setLocalTerms(returnedGame.terms);
    }
  );

  useLayoutEffect(() => {
    let timeout: NodeJS.Timeout;
    if (Platform.OS === 'ios') {
      timeout = setTimeout(() => {
        if (listRef.current && editingTermKey) {
          const item = localTerms.find((t) => t.id === editingTermKey);
          if (item) {
            listRef.current!.scrollToItem({ animated: false, item });
          }
        }
      }, 100);
    }
    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
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
            title="Ready"
            onPress={() => {}}
            style={{ paddingRight: 20 }}
            borderless
          />
        ),
    });
  }, [game.terms]);

  function handleKeyboardDismissed() {
    const term = localTerms.find((term) => term.id === editingTermKey);
    if (term) {
      if (term.text.trim()) {
        upsertTerm(term);
      } else if (term.id) {
        gameService
          .deleteTerm(game.id, term.id)
          .then(() => {
            removeTermFromGame(game.id, term.id);
          })
          .catch((err) => console.log(err));
      }
    }
    setEditingTermKey(null);
    setLocalTerms(localTerms.filter((term) => term.text.trim()));
    setShowAddButton(true);
  }

  useKeyboardEvent('keyboardDidHide', () => {
    if (Platform.OS === 'android') {
      handleKeyboardDismissed();
    }
  });

  function createNewTerm() {
    const newTerm = { id: uuid(), text: '' } as Term;
    setLocalTerms([...localTerms, newTerm]);
    setEditingTermKey(newTerm.id);
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
    gameService
      .upsertTerm(game.id, term)
      .then((savedTerm) => {
        if (savedTerm) {
          upsertTermToGame(game.id, term);
        }
      })
      .catch((err) => console.log(err));
  }

  function handleTermPressed(term: Term) {
    setShowAddButton(false);
    setEditingTermKey(term.id);
  }

  function handleEditingTermTextChange(text: string) {
    setLocalTerms(
      localTerms.map((t) => (t.id === editingTermKey ? { ...t, text } : t))
    );
  }

  function handleEditingTermBlur() {
    if (Platform.OS === 'ios') {
      handleKeyboardDismissed();
    }
  }

  const readyPlayerCount = game.game_players.filter((player) => player.ready)
    .length;
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
            username={
              game.game_players.find(
                (gp) => gp.player.id === game.game_master_id
              )!.player.username
            }
          />
          {game.game_players
            .filter((gp) => gp.player.id !== game.game_master_id)
            .map((gp) => (
              <PlayerIcon
                key={gp.player.id}
                username={gp.player.username}
                ready={gp.ready}
              />
            ))}
          <InvitePlayerIcon />
        </ScrollView>
      </View>
      <View
        style={{
          flex: 1,
        }}
      >
        <Label text="Terms" />
        {localTerms.length && game.terms.length < 8 ? (
          <Text style={styles.subLabel}>
            Add {`${8 - game.terms.length}`} or more terms.
          </Text>
        ) : null}
        <View style={{ flex: 1, paddingVertical: 10 }}>
          <SwipeListView
            listViewRef={(ref) => (listRef.current = ref)}
            getItemLayout={(data: any, index: any) => ({
              length: LIST_ITEM_HEIGHT,
              offset: LIST_ITEM_HEIGHT * index,
              index,
            })}
            data={localTerms}
            renderItem={({ item: term }) =>
              term.id === editingTermKey ? (
                <EditingTerm
                  term={term}
                  onSubmit={handleSubmitTerm}
                  onChange={handleEditingTermTextChange}
                  onBlur={handleEditingTermBlur}
                />
              ) : (
                <ReadonlyTerm term={term} onPress={handleTermPressed} />
              )
            }
            ListEmptyComponent={
              <Text style={styles.subLabel}>Add at least 8 terms.</Text>
            }
            ItemSeparatorComponent={() => <View style={styles.divider}></View>}
            contentContainerStyle={[
              {
                flexGrow: 1,
                paddingVertical: 10,
              },
              !localTerms.length && {
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}
            removeClippedSubviews={false}
            disableRightSwipe
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
    updateGame: createGameUpsertedAction,
    upsertTermToGame: createUpsertTermAction,
    removeTermFromGame: createRemoveTermAction,
  }
)(GameLobbyScreen);

const ReadonlyTerm = React.memo<any>(
  React.forwardRef<any, any>(({ term, onPress }, ref) => {
    function handlePress() {
      onPress(term);
    }

    return (
      <TouchableWithoutFeedback onPress={handlePress} ref={ref}>
        <View style={styles.termContainer}>
          <Text style={styles.term}>{term.text}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }),
  ({ term: prevTerm }, { term: nextTerm }) => prevTerm.key === nextTerm.key
);

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
        style={[styles.termContainer, styles.term]}
        ref={(ref) => {
          myRef.current = ref;
          externalRef!.current = ref;
        }}
      />
    );
  }
);

const GameMasterIcon: React.FC<{ username: string }> = ({ username }) => {
  return (
    <View style={styles.playerContainer}>
      <View
        style={{
          backgroundColor: '#FDF1F1',
          height: 32,
          width: 32,
          borderRadius: 50,
          borderColor: '#F38BA6',
          borderWidth: 2.3,
        }}
      ></View>
      <View style={{ position: 'absolute', marginTop: 2 }}>
        <MaterialCommunityIcons name="crown" size={24} color="#F38BA6" />
      </View>
      <Text
        style={[
          styles.subLabel,
          {
            textAlign: 'center',
          },
        ]}
      >
        {username}
      </Text>
    </View>
  );
};

const PlayerIcon: React.FC<{ ready: boolean; username: string }> = ({
  ready,
  username,
}) => {
  return (
    <View style={styles.playerContainer}>
      <View
        style={{
          backgroundColor: '#FDF1F1',
          height: 32,
          width: 32,
          borderRadius: 50,
        }}
      ></View>
      <View style={{ position: 'absolute' }}>
        {ready ? (
          <AntDesign name="checkcircleo" size={32} color="#F7BDC9" />
        ) : (
          <AntDesign name="closecircleo" size={32} color="#F7BDC9" />
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
        {username}
      </Text>
    </View>
  );
};

function InvitePlayerIcon() {
  return (
    <TouchableOpacity onPress={() => {}} style={styles.playerContainer}>
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
        Send Invite
      </Text>
    </TouchableOpacity>
  );
}

const LIST_ITEM_HEIGHT = 42;

const styles = StyleSheet.create({
  termContainer: {
    backgroundColor: '#fff',
    height: LIST_ITEM_HEIGHT,
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
    width: 50,
    alignItems: 'center',
  },
  subLabel: {
    fontFamily: 'Work-Sans',
    fontSize: 13,
    color: '#646464',
  },
});
