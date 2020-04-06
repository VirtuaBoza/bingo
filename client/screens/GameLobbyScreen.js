import { AntDesign } from '@expo/vector-icons';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button, Label, PageContainer, Title } from '../components';
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
  const [editingTermId, setEditingTermId] = useState(null);
  const [localTerms, setLocalTerms] = useState(game.terms);

  useEffect(() => {
    gameService.getGame(game._id).then((game) => {
      updateGame(game);
      setLocalTerms(game.terms);
    });
  }, []);

  useLayoutEffect(() => {
    function handleKeyboardHide() {
      setEditingTermId(null);
      // gameService.getGame(game._id).then((game) => {
      //   updateGame(game);
      //   setLocalTerms(game.terms);
      // });
    }
    Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

    return () => {
      Keyboard.removeListener('keyboardDidHide', handleKeyboardHide);
    };
  });

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

  function handleAddTermClick() {
    const id = uuid();
    setLocalTerms([...localTerms, { id, text: '' }]);
    setEditingTermId(id);
  }

  function handleSubmitTerm(term) {
    if (term.text.trim()) {
      // gameService.addTermToGame(game._id, term).then((terms) => {
      //   setGameTerms(game._id, terms);
      //   const id = uuid();
      //   setLocalTerms([...terms, { id, text: '' }]);
      //   setEditingTermId(id);
      // });
    } else {
      // gameService.getGame(game._id).then((game) => {
      //   updateGame(game);
      //   setLocalTerms(game.terms);
      // });
    }
  }

  function handleTermPressed(term) {
    setEditingTermId(term.id);
  }

  const readyPlayerCount = game.players.filter((player) => player.ready).length;
  return (
    <PageContainer style={styles.container}>
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
      <Label text="Terms" />
      {localTerms.length && game.terms.length < 8 ? (
        <Text style={{ fontFamily: 'Work-Sans', fontSize: 13 }}>
          Add {`${8 - game.terms.length}`} or more terms.
        </Text>
      ) : null}
      <View
        style={{
          marginVertical: 10,
          flex: 1,
        }}
      >
        <FlatList
          data={localTerms}
          renderItem={({ item }) =>
            item.id === editingTermId ? (
              <EditingTerm term={item} onSubmit={handleSubmitTerm} />
            ) : (
              <Term term={item} onPress={handleTermPressed} />
            )
          }
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={{ fontFamily: 'Work-Sans', fontSize: 13 }}>
              Add at least 8 terms.
            </Text>
          }
          ItemSeparatorComponent={() => <View style={styles.divider}></View>}
          contentContainerStyle={[
            {
              flexGrow: 1,
            },
            !localTerms.length && {
              justifyContent: 'center',
              alignItems: 'center',
            },
          ]}
          removeClippedSubviews={false}
        />
      </View>
      <Button title="Add Term" onPress={handleAddTermClick} />
    </PageContainer>
  );
}

const Term = ({ term, onPress }) => {
  function handlePress() {
    onPress(term);
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <Text style={styles.term}>{term.text}</Text>
    </TouchableOpacity>
  );
};

const EditingTerm = ({ term, onSubmit }) => {
  const [localTermText, setLocalTermText] = useState(term.text);

  function handleSubmitTerm() {
    onSubmit({ ...term, text: localTermText });
  }

  return (
    <TextInput
      value={localTermText}
      onChangeText={setLocalTermText}
      onSubmitEditing={handleSubmitTerm}
      style={styles.term}
      autoFocus
    />
  );
};

function Player() {
  return (
    <TouchableOpacity
      onPress={() => {}}
      style={{
        width: 50,
        alignItems: 'center',
      }}
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
      <Text style={{ fontFamily: 'Work-Sans', textAlign: 'center' }}>
        Invite Players
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  term: {
    fontFamily: 'Work-Sans',
    fontSize: 17,
    color: '#F38BA6',
    padding: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  },
});
