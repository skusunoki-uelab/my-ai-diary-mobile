import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  // 今日の日付を取得してフォーマット
  const today = new Date();
  const dateString = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
  
  // 画面遷移のためのルーターを準備
  const router = useRouter();

  const handlePressWriteButton = () => {
    // 日記の入力画面に遷移する（今はまだ画面がないので、後で実装します）
    // router.push('/diary/new'); 
    router.push('/(diary)/index'); // ここで日記入力画面に遷移します
  };

  return (
    // 全体を「表紙」と見立てます
    <View style={styles.cover}>

      {/* 飾りの「ゴムバンド」 */}
      <View style={styles.elasticBand} />

      {/* 中央の「タイトルプレート」 */}
      <View style={styles.titlePlate}>
        <Text style={styles.titleText}>My Diary</Text>
        <Text style={styles.dateText}>{dateString}</Text>
        
        <Button 
          icon="pencil"
          mode="contained"
          onPress={handlePressWriteButton}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          日記を書く
        </Button>
      </View>

    </View>
  );
}

// スタイル定義
const styles = StyleSheet.create({
  cover: {
    flex: 1,
    backgroundColor: '#1d3557', // 落ち着いた紺色
    justifyContent: 'center',
    alignItems: 'center',
  },
  titlePlate: {
    width: '85%',
    padding: 30,
    backgroundColor: '#f1faee', // 少しクリームがかった白色
    borderRadius: 8,
    alignItems: 'center',
    // プレートに影をつけて立体感を出す
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  titleText: {
    fontSize: 18,
    color: '#457b9d',
    marginBottom: 10,
  },
  dateText: {
    color: '#1d3557',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  button: {
    width: '80%',
    paddingVertical: 8,
    backgroundColor: '#457b9d',
  },
  buttonLabel: {
    fontSize: 18,
  },
  elasticBand: {
    position: 'absolute',
    right: 30,
    top: 0,
    bottom: 0,
    width: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  }
});