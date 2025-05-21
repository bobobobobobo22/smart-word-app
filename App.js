import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import words from './assets/words/고유어.json';

export default function App() {
  const [index, setIndex] = useState(0);
  const [shuffled, setShuffled] = useState([]);
  const question = words[index];

  useEffect(() => {
    const answers = [question.answer];
    const other = words.filter(w => w.answer !== question.answer).map(w => w.answer);
    while (answers.length < 4 && other.length) {
      const choice = other.splice(Math.floor(Math.random() * other.length), 1)[0];
      if (!answers.includes(choice)) answers.push(choice);
    }
    setShuffled(shuffleArray(answers));
  }, [index]);

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const check = (ans) => {
    if (ans === question.answer) {
      alert('✅ 정답입니다!');
    } else {
      alert(`❌ 오답! 정답은 ${question.answer}`);
    }

    setTimeout(() => {
      if (index + 1 < words.length) {
        setIndex(index + 1);
      } else {
        alert("🎉 퀴즈 완료!");
        setIndex(0);
      }
    }, 600);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧠 고유어 퀴즈</Text>
      <Text style={styles.question}>{question.question}</Text>
      {shuffled.map((opt, i) => (
        <TouchableOpacity key={i} onPress={() => check(opt)} style={styles.option}>
          <Text style={styles.optionText}>{opt}</Text>
        </TouchableOpacity>
      ))}
      <Text style={styles.progress}>{index + 1} / {words.length}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '#111',
    flex: 1
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#00ffd5',
    marginBottom: 20,
    textAlign: 'center'
  },
  question: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center'
  },
  option: {
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10
  },
  optionText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center'
  },
  progress: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center'
  }
});