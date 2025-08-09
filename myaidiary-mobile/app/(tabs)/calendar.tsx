import { Link } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';

export default function CalendarScreen() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [diaries, setDiaries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [markedDates, setMarkedDates] = useState<any>({});

  useEffect(() => {
    fetchAllDiaries();
  }, []);

  const fetchAllDiaries = async () => {
    try {
      const res = await fetch('https://pppyyqecubjsliyaqzdj.supabase.co/functions/v1/get-all-diaries');
      const data = await res.json();
      console.log('取得データ', data);
      
      //日記データから日付ごとのマーカーを作成
      if (data && data.diaries && Array.isArray(data.diaries)) {
        const marked: any = {};

        //各日記から日付を抽出してマーカ設定
        data.diaries.forEach((diary: any) => {
          if (diary.created_at) {
            //日付部分だけ抽出
            const dateStr = diary.created_at.split('T')[0];
            marked[dateStr] = {
              marked: true,
              dotColor: '#61dafb', // マーカーの色
            };
          }
       });
        setMarkedDates(marked);
      }
    } catch (e) {
      console.error('日記データの取得エラー:', e);
      // エラーの詳細を表示
        if (e instanceof Error) {
          console.error('エラーメッセージ:', e.message);
        }
    }
  };
  const handleDayPress = async (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setLoading(true);
    setDiaries([]);
    setModalVisible(true); // ← 追加
    try {
      const res = await fetch(
        'https://pppyyqecubjsliyaqzdj.supabase.co/functions/v1/get-all-diaries?date=' + day.dateString
      );
      const data = await res.json();
      //選択した日付の日記をsetDiariesに設定
      const filteredDiaries = (data.diaries || []).filter((diary: any) => diary.created_at.split('T')[0] === day.dateString);

      setDiaries(filteredDiaries);
      console.log('取得データ:', filteredDiaries); // ここでレスポンスの内容を確認

    } catch (e) {
      setDiaries([]);
    }
    setLoading(false);
  };

  const closeModal = () => { // ← 追加
    setModalVisible(false);
    setDiaries([]);
    setSelectedDate(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>日記カレンダー</Text>
        <Calendar
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 10 }}
          theme={{
            backgroundColor: '#282c34',
            calendarBackground: '#282c34',
            textSectionTitleColor: '#b0b0b0',
            selectedDayBackgroundColor: '#61dafb',
            todayTextColor: '#61dafb',
            dayTextColor: 'white',
            textDisabledColor: '#555',
            monthTextColor: 'white',
          }}
          onDayPress={handleDayPress}
          markedDates={{
            ...markedDates,
            ...(selectedDate ? {
              [selectedDate]: {
                selected: true,
                marked: markedDates[selectedDate]?.marked,
                dotColor: markedDates[selectedDate]?.dotColor
              }
            } : {})
          }}
        />

        {/* モーダル表示に変更 */}
        <>
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={closeModal}
            style={styles.modal}
            //swipeDirection="down"
            //onSwipeComplete={closeModal}
            backdropOpacity={0.5}
            animationInTiming={300}
            animationOutTiming={300}
            useNativeDriverForBackdrop={true}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalBar} />
              <Text style={styles.diaryTitle}>{selectedDate} の日記</Text>
              {loading ? (
                <ActivityIndicator color="#61dafb" />
              ) : (
                <View style={{ height: 350 }}>
                  <FlatList
                    data={diaries}
                    keyExtractor={(_, i) => i.toString()}
                    renderItem={({ item, index }) => (
                      <View style={styles.diaryCard}>
                        <Text style={styles.diaryContent}>
                          {item.content || JSON.stringify(item)}
                        </Text>
                        {item.created_at && (
                          <Text style={styles.diaryTime}>
                            {new Date(item.created_at).toLocaleTimeString('ja-JP', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </Text>
                        )}
                      </View>
                    )}
                    ListEmptyComponent={
                      <View style={styles.diaryCard}>
                        <Text style={styles.diaryContent}>日記がありません</Text>
                      </View>
                    }
                    showsVerticalScrollIndicator={true}
                    windowSize={5}
                    maxToRenderPerBatch={5}
                    updateCellsBatchingPeriod={50}
                    removeClippedSubviews={true}
                  />
                </View>
              )}
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>閉じる</Text>
              </TouchableOpacity>
            </View>
          </Modal>

          <Link href="/" asChild>
            <Text style={styles.link}>ホームに戻る</Text>
          </Link>
        </>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#282c34',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  link: {
    marginTop: 20,
    color: '#61dafb',
    fontSize: 16,
  },
  // モーダル用スタイル
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: '#333',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 20,
    minHeight: 300,
    maxHeight: '80%',
  },
  modalBar: {
    width: 40,
    height: 5,
    backgroundColor: '#888',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 15,
  },
  closeButton: {
    marginTop: 16,
    alignItems: 'center',
    paddingVertical: 12,
  },
  closeButtonText: {
    color: '#61dafb',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // 既存のスタイル（一部調整）
  diaryTitle: {
    color: '#61dafb',
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
    textAlign: 'center',
  },
  diaryContent: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 6,
  },
  diaryCard: {
    backgroundColor: '#444',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#61dafb',
  },
  diaryTime: {
    color: '#888',
    fontSize: 11,
    textAlign: 'right',
  },
  // 削除されるスタイル（もう使わない）
  // diaryContainer: { ... }
  // diaryIndex: { ... }
});