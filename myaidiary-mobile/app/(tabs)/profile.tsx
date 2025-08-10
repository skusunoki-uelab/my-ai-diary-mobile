import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Avatar, Switch, Divider, List } from 'react-native-paper'; // 使う部品を追加

// コンポーネントの名前を ProfileScreen に変更します
export default function ProfileScreen() {
  // 設定用のstate（状態）を準備します
  const [isNotificationsEnabled, setIsNotificationsEnabled] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          
          {/* プロフィールヘッダー */}
          <View style={styles.profileHeader}>
            <Avatar.Icon size={80} icon="account" style={styles.avatar} />
            <Text style={styles.userName}>あなたの名前</Text>
            <Text style={styles.userEmail}>your-email@example.com</Text>
          </View>

          {/* 設定セクション */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>設定</Text>
            <List.Section>
              <List.Item
                title="通知"
                left={() => <List.Icon icon="bell" />}
                right={() => (
                  <Switch 
                    value={isNotificationsEnabled} 
                    onValueChange={setIsNotificationsEnabled} 
                  />
                )}
              />
              <Divider />
              <List.Item
                title="ダークモード"
                left={() => <List.Icon icon="theme-light-dark" />}
                right={() => (
                  <Switch
                    value={isDarkMode}
                    onValueChange={setIsDarkMode}
                  />
                )}
              />
            </List.Section>
          </View>
          
          {/* データ管理セクション */}
          <View style={styles.settingsSection}>
            <Text style={styles.sectionTitle}>データ管理</Text>
            <List.Section>
               <List.Item
                title="日記データを書き出す"
                left={() => <List.Icon icon="export" />}
                onPress={() => console.log('Export data')}
              />
            </List.Section>
          </View>

          {/* ログアウトボタン */}
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>ログアウト</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// スタイルもプロフィール画面用に調整します
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#121212', // ダークモード用の背景色
  },
  container: {
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    backgroundColor: '#444',
  },
  userName: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    marginTop: 5,
    fontSize: 16,
    color: '#aaa',
  },
  settingsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  logoutButton: {
    marginTop: 30,
    backgroundColor: '#a83232', // ログアウトは危険な操作なので赤色に
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});