import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function PollComponent() {
  const [vote, setVote] = useState(null);
  const [results, setResults] = useState({ yes: 0, no: 0 }); // Mock; real: sync with backend

  const handleVote = (choice) => {
    setVote(choice);
    setResults(prev => ({ ...prev, [choice]: prev[choice] + 1 }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Union Pricing Poll: Min $20 Airport Fare?</Text>
      <Button title="Yes" onPress={() => handleVote('yes')} disabled={!!vote} />
      <Button title="No" onPress={() => handleVote('no')} disabled={!!vote} color="red" />
      {vote && <Text>Your vote: {vote}</Text>}
      <Text>Results: Yes {results.yes} | No {results.no}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20, padding: 10, borderWidth: 1, borderRadius: 5 },
  title: { fontSize: 16, marginBottom: 10 },
});
