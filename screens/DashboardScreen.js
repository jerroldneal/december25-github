import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PollComponent from '../components/PollComponent';

export default function DashboardScreen({ navigation }) {
  const [user, setUser] = useState('');
  const [queueData, setQueueData] = useState([
    { id: '1', position: '5th', estWait: '15 min', airport: 'SFO' },
    // Mock data; in real app, fetch from shared API
  ]);

  useEffect(() => {
    async function getUser() {
      const storedUser = await AsyncStorage.getItem('user');
      setUser(storedUser);
    }
    getUser();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user}</Text>
      <Text style={styles.subtitle}>Current Airport Queue</Text>
      <FlatList
        data={queueData}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Airport: {item.airport}</Text>
            <Text>Position: {item.position}</Text>
            <Text>Est. Wait: {item.estWait}</Text>
          </View>
        )}
      />
      <PollComponent />
      <Button title="Join Discussion" onPress={() => navigation.navigate('Chat')} />
      <Button title="Share Queue Position" onPress={() => {/* Mock share logic */}} color="green" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 20, marginBottom: 10 },
  subtitle: { fontSize: 16, marginTop: 10 },
  item: { padding: 10, borderBottomWidth: 1 },
});
