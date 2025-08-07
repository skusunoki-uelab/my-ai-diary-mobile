import { Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, Button, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
// 以前作成したAPI関数をインポートする
import { addDiaryEntry, findSimilarDiary } from '../../src/api/SupabaseAPI';

// --- 日記入力コンポーネント（変更なし） ---
function DiaryEntry() {
  const [diaryText, setDiaryText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveDiary = async () => {
    if (!diaryText.trim()) return;
    setIsLoading(true);
    try {
      await addDiaryEntry(diaryText);
      Alert.alert('成功', '日記を保存しました！');
      setDiaryText('');
    } catch (error) {
      Alert.alert('エラー', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.subtitle}>今日の日記を書く</Text>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="今日の出来事や感じたことを記録しよう..."
        placeholderTextColor="#999"
        value={diaryText}
        onChangeText={setDiaryText}
      />
      <Button
        title={isLoading ? '保存中...' : '日記を保存する'}
        onPress={handleSaveDiary}
        color="#61dafb"
        disabled={isLoading}
      />
    </View>
  );
}


// --- ▼▼▼ 新しいAI相談コンポーネント ▼▼▼ ---
function AICoach() {
  const [problem, setProblem] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleConsult = async () => {
    if (!problem.trim()) return;
    setIsLoading(true);
    setResult('');
    try {
      const data = await findSimilarDiary(problem);
      if (data.similarDiary) {
        setResult(`ヒント：『${data.similarDiary.content}』`);
      } else {
        setResult('似ている日記は見つかりませんでした。');
      }
    } catch (error) {
      setResult(`エラー: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.subtitle}>AIに相談する</Text>
      <TextInput
        style={styles.textInput}
        multiline
        placeholder="ここに悩みを入力してください..."
        placeholderTextColor="#999"
        value={problem}
        onChangeText={setProblem}
      />
      <Button
        title={isLoading ? '相談中...' : 'AIに相談する'}
        onPress={handleConsult}
        color="#61dafb"
        disabled={isLoading}
      />
      {result ? (
        <View style={styles.resultArea}>
          <Text style={styles.resultTitle}>AIからのヒント</Text>
          <Text style={styles.resultText}>{result}</Text>
        </View>
      ) : null}
    </View>
  );
}

// --- ▼▼▼ 全体をまとめるメインコンポーネントを改造 ▼▼▼ ---
export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.container}>
        <Text style={styles.title}>AIパーソナルコーチ日記</Text>
        <Link href="/calendar" asChild>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>カレンダーを見る</Text>
          </TouchableOpacity>
        </Link>
        <DiaryEntry />
        <View style={styles.divider} />
        <AICoach />
        <StatusBar style="light" />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- スタイル指定（追加・修正あり） ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#282c34' },
  scrollView: { flex: 1 },
  container: {
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginVertical: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 10,
  },
  textInput: {
    backgroundColor: '#3a3f4a',
    color: 'white',
    height: 150,
    padding: 10,
    borderRadius: 8,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
  },
  divider: {
    height: 1,
    width: '90%',
    backgroundColor: '#444',
    marginVertical: 10,
  },
  resultArea: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#3a3f4a',
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 16,
    color: '#61dafb',
    fontWeight: 'bold',
  },
  resultText: {
    fontSize: 16,
    color: 'white',
    marginTop: 5,
  },
   button: {
    backgroundColor: '#61dafb',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#282c34',
    fontSize: 16,
    fontWeight: 'bold',
  },
});