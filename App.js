import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import words from './assets/words/고유어.json';

export default function App() {
  const [current, setCurrent] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState([]);

  const question = words[current];
  const total = words.length;

  useEffect(() => {
    if (question) {
      const options = [question.answer];
      const others = words
        .filter((w) => w.answer !== question.answer)
        .map((w) => w.answer);
      while (options.length < 4 && others.length) {
        const rand = others.splice(Math.floor(Math.random() * others.length), 1)[0];
        if (!options.includes(rand)) options.push(rand);
      }
      setShuffledOptions(shuffleArray(options));
    }
  }, [current]);

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const checkAnswer = (selected) => {
    const correct = question.answer;
    if (selected === correct) {
      Alert.alert('🎯 정답입니다!');
    } else {
      Alert.alert(`❌ 오답! 정답은: ${correct}`);
    }

    setTimeout(() => {
      if (current + 1 < total) {
        setCurrent(current + 1);
      } else {
        Alert.alert("✅ 퀴즈 완료!", "모든 문제를 풀었습니다!");
        setCurrent(0);
      }
    }, 800);
  };

  if (!question) return <Text>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 고유어 퀴즈</Text>
      <Text style={styles.question}>{question.question}</Text>

      {shuffledOptions.map((opt, index) => (
        <TouchableOpacity
          key={index}
          style={styles.option}
          onPress={() => checkAnswer(opt)}
        >
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}

      <Text style={styles.progress}>
        {current + 1} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: '#00ffd5',
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  question: {
    fontSize: 22,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    backgroundColor: '#222',
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
  },
  optionText: {
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
  },
  progress: {
    marginTop: 30,
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
});
