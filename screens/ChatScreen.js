import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';

export default function ChatScreen() {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Queue at LAX is rigged!', user: 'Anon1' },
    // Mock; real: fetch from encrypted channel
  ]);
  const [newMessage, setNewMessage] = useState('');

  const sendMessage = () => {
    if (newMessage) {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: newMessage, user: 'You' }]);
      setNewMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.message}>
            <Text>{item.user}: {item.text}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        placeholder="Type message anonymously..."
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  message: { padding: 10, borderBottomWidth: 1 },
  input: { borderWidth: 1, marginBottom: 10, padding: 10 },
});
