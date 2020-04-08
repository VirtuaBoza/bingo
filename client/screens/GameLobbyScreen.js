import { AntDesign } from '@expo/vector-icons';
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
import gameService from '../services/gameService';
import { connect, selectGameById } from '../store';
import {
  createGameUpertedAction,
  createSetGameTermsAction,
} from '../store/reducers/gamesReducer';
import uuid from '../utils/uuid';

export default connect(
  ({ route }) => {
    const { gameId } = route.params;
    const gameSelector = selectGameById(gameId);
    return { game: gameSelector };
  },
  {
    setGameTerms: createSetGameTermsAction,
    updateGame: createGameUpertedAction,
  }
)(GameLobbyScreen);

export function GameLobbyScreen({
  navigation,
  game,
  setGameTerms,
  updateGame,
}) {
  const [editingTermKey, setEditingTermKey] = useState(null);
  const [localTerms, setLocalTerms] = useState(game.terms);
  const [showAddButton, setShowAddButton] = useState(true);
  const listRef = useRef(null);

  useLayoutEffect(() => {
    let timeout;
    if (Platform.OS === 'ios') {
      timeout = setTimeout(() => {
        if (listRef.current && editingTermKey) {
          const item = localTerms.find((t) => t.key === editingTermKey);
          if (item) {
            listRef.current.scrollToItem({ animated: false, item });
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

  usePromise(
    [],
    () => gameService.getGame(game._id),
    (game) => {
      updateGame(game);
      setLocalTerms(game.terms);
    }
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Start"
          onPress={() => {}}
          style={{ paddingRight: 20 }}
          disabled={game.terms.length < 8}
          borderless
        />
      ),
    });
  }, [game.terms]);

  function handleKeyboardDismissed() {
    setEditingTermKey(null);
    setLocalTerms(localTerms.filter((term) => term.text.trim() || term._id));
    setShowAddButton(true);
  }

  useKeyboardEvent('keyboardDidHide', () => {
    if (Platform.OS === 'android') {
      handleKeyboardDismissed();
    }
  });

  function createNewTerm() {
    const newTerm = { key: uuid(), text: '' };
    setLocalTerms([...localTerms, newTerm]);
    setEditingTermKey(newTerm.key);
  }

  function handleAddTermClick() {
    setShowAddButton(false);
    createNewTerm();
  }

  function handleSubmitTerm(term) {
    if (term.text.trim()) {
      createNewTerm();
      // gameService.addTermToGame(game._id, term).then((terms) => {
      //   setGameTerms(game._id, terms);
      //   const id = uuid();
      //   setLocalTerms([...terms, { id, text: '' }]);
      //   setEditingTermId(id);
      // });
    } else {
      handleKeyboardDismissed();
    }
  }

  function handleTermPressed(term) {
    setShowAddButton(false);
    setEditingTermKey(term.key);
  }

  function handleEditingTermTextChange(text) {
    setLocalTerms(
      localTerms.map((t) => (t.key === editingTermKey ? { ...t, text } : t))
    );
  }

  function handleEditingTermBlur() {
    if (Platform.OS === 'ios') {
      handleKeyboardDismissed();
    }
  }

  const readyPlayerCount = game.players.filter((player) => player.ready).length;
  return (
    <PageContainer>
      <Title text={game.name} />
      <Label
        style={{ alignSelf: 'center' }}
        text={
          game.players.length
            ? readyPlayerCount === game.players.length
              ? 'All Plyers Ready!'
              : `${readyPlayerCount}/${game.players.length} Players Ready`
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
          <Player />
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
            getItemLayout={(data, index) => ({
              length: LIST_ITEM_HEIGHT,
              offset: LIST_ITEM_HEIGHT * index,
              index,
            })}
            data={localTerms}
            renderItem={({ item: term }) =>
              term.key === editingTermKey ? (
                <EditingTerm
                  term={term}
                  onSubmit={handleSubmitTerm}
                  onChange={handleEditingTermTextChange}
                  onBlur={handleEditingTermBlur}
                />
              ) : (
                <Term term={term} onPress={handleTermPressed} />
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
}

const Term = React.memo(
  React.forwardRef(({ term, onPress }, ref) => {
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

const EditingTerm = React.forwardRef(
  ({ term, onSubmit, onChange, onBlur }, ref) => {
    const externalRef = ref;
    const myRef = React.useRef();
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
          externalRef.current = ref;
        }}
      />
    );
  }
);

function Player() {
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
