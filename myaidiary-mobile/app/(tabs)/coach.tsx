import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

// コンポーネントの名前を CalendarScreen から CoachScreen に変更します
export default function CoachScreen() {
  // コーチ画面で使うstate（状態）を後でここに追加していきます
  // const [question, setQuestion] = useState('');
  // const [answer, setAnswer] = useState('');
  // const [loading, setLoading] = useState(false);

  return (
    // SafeAreaView と基本的なコンテナはそのまま使います
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* タイトル部分 */}
        <View style={styles.header}>
          <Text style={styles.title}>AIコーチ</Text>
          <Text style={styles.subtitle}>過去のあなたは、未来のあなたの最高の味方です。</Text>
        </View>

        {/* AIの回答が表示されるエリア（今は空っぽ） */}
        <View style={styles.answerContainer}>
          <Text style={styles.answerText}>ここにAIからのヒントが表示されます...</Text>
        </View>

        {/* 質問を入力するエリア */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="今、何に悩んでいますか？"
            placeholderTextColor="#888"
            // value={question}
            // onChangeText={setQuestion}
          />
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>送信</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// スタイルもコーチ画面用に調整します
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1e1e1e', // 背景色を少し変えてみる
  },
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginTop: 8,
  },
  answerContainer: {
    flex: 1, // このエリアが画面の大部分を占める
    padding: 20,
    justifyContent: 'center',
  },
  answerText: {
    color: '#ddd',
    fontSize: 16,
    fontStyle: 'italic',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#444',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: 'white',
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#61dafb',
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  sendButtonText: {
    color: '#1e1e1e',
    fontWeight: 'bold',
    fontSize: 16,
  },
});