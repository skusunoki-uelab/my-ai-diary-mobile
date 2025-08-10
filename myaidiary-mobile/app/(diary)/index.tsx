import React from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Button, TextInput, Appbar } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function DiaryEntryScreen() {
  const [text, setText] = React.useState('');
  const router = useRouter();

  const handleNext = () => {
    // 次の画面（メタデータ入力）へ遷移する
    router.push({ pathname: '/(diary)/metadata', params: { content: text } });
    console.log('入力内容:', text);
    console.log('次の画面へ進みます');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="日記を書く" />
      </Appbar.Header>
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="今日の出来事、感じたこと..."
          value={text}
          onChangeText={setText}
        />
        <Button mode="contained" onPress={handleNext} style={styles.button}>
          次へ
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f1faee', // ホーム画面のプレートの色と合わせる
  },
  appbar: {
    backgroundColor: '#f1faee',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  textInput: {
    flex: 1,
    backgroundColor: 'white',
    fontSize: 16,
    textAlignVertical: 'top', // Androidで上から入力できるように
  },
  button: {
    marginTop: 20,
    paddingVertical: 8,
    backgroundColor: '#457b9d', // ホーム画面のボタンの色と合わせる
  },
});