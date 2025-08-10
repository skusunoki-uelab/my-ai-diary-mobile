import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { Button, Appbar } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase'; // Supabaseの設定をインポート

//　事前に定義しておく基本タグのリスト
const PRESET_TAGS = ['#仕事', '#人間関係', '#健康', '#趣味', '#旅行'];

export default function MetadataScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const diaryContent = params.content;
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handlePress = (tag: string) => {
    //すでに選択されていたら解除、されていなければ追加する
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // 「＋新規」ボタンが押された時の処理
  const handleAddNewTag = () => {
    Alert.prompt(
      '新しいタグを追加',
      'タグ名を入力してください（＃は不要です）',
      (text) => {
        if (text) {
          const newTag = '#${text}';
          if (newTag && !selectedTags.includes(newTag)) {
            setSelectedTags([...selectedTags, newTag]);
          }
        }

      }
    );
  };

  const handlePickImage = async () => {
    // まず、ライブラリへのアクセスを求める
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert('写真ライブラリへのアクセスが許可されていません。');
      return;
    }

    //　イメージピッカーを起動
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });
    if (!result.canceled) {
      // 選択された画像のURIを保存
      setImageUri(result.assets[0].uri);
    } 
  }

  const handleSave = async () => {
    setIsUploading(true);
    let photoUrl: string | null = null;
    try {
      // 画像が選択されていれば、アップロード処理を行う
      if (imageUri) {
        // file プレフィックスを削除
        const arraybuffer = await fetch(imageUri).then(res => res.arrayBuffer());
        const fileExt = imageUri.split('.').pop()?.toLowerCase() ?? 'jpeg';
        const path = '${Date.now()}.${fileExt}';

        const { data: uploadData, error: uploadError } = await supabase.storage
        .from('diary-photo')
        .upload(path, arraybuffer, {
          contentType: 'image/${fileExt}',
        });
        if (uploadError) {
          throw new Error('写真のアップロードに失敗しました: ${uploadError.message}');
        }

        //　アップロードした写真の公開URLを取得
        const { data: urlData } = supabase.storage
        .from('diary-photo')
        .getPublicUrl(uploadData.path);

        photoUrl = urlData.publicUrl;

      }

      // ここでSupabaseのFunctionを呼び出して、日記をDBに保存します
      const response = await fetch('https://pppyyqecubjsliyaqzdj.supabase.co/functions/v1/add-diary-entry', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: diaryContent,
          tags: selectedTags
          // 他のメタデータもここで追加できます
        }),
      });

      if (!response.ok) {
        //もしエラーが返ってきたら
        const errorData = await response.json();
        throw new Error(errorData.error || '日記の保存に失敗しました');
      }

      //成功した場合    // 保存後、タブのホーム画面に戻る
      Alert.alert('保存完了', '日記が保存されました！');
      router.back(); // 1枚目の画面に戻る
      router.back(); // ホーム画面に戻る
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        Alert.alert('保存失敗', error.message);
      } else {
        Alert.alert('保存失敗', '予期しないエラーが発生しました。');
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Appbar.Header style={styles.appbar}>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="情報を追加" />
      </Appbar.Header>
      <ScrollView style={styles.container}>
        {/* 感情のパレットセクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>今の気分は？</Text>
          <TextInput
            style={styles.emotionInput}
            placeholder="言葉で表現すると、AIが自動で色付きタグを提案します..."
            placeholderTextColor="#888"
          />
          <View style={styles.tagContainer}>
            {/* ここにAIが提案したタグが表示されます */}
          </View>
        </View>

        {/* タグセクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>タグを追加</Text>
          <View style={styles.tagContainer}>
          {PRESET_TAGS.map(tag => (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, selectedTags.includes(tag) && styles.tagSelected]}
              onPress={() => handlePress(tag)}
            >
              <Text style={selectedTags.includes(tag) ? styles.tagTextSelected : styles.tagText}>
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
            {/* 新規追加ボタン */}
            <TouchableOpacity style={styles.tag} onPress ={handleAddNewTag}>
              <Text style={styles.tagText}>＋新規</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 写真セクション */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>写真を追加</Text>
          <TouchableOpacity style={styles.photoButton} onPress={handlePickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
            <Text>写真を選択</Text>
            )}
          </TouchableOpacity>
        </View>

        <Button mode="contained" onPress={handleSave} style={styles.button}>
          日記を保存する
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f1faee' },
  appbar: { backgroundColor: '#f1faee' },
  container: { flex: 1, padding: 20 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1d3557', marginBottom: 15 },
  emotionInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    margin: 5,
  },
  tagSelected: {
    backgroundColor: '#1d3357',
  },
  tagText: {
    color: '#000',
  },
  tagTextSelected: {
    color: '#fff'
  },

  photoButton: {
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#aaa',
  },
  button: { marginTop: 20, paddingVertical: 8, backgroundColor: '#e63946' }, // 保存ボタンは目立つ色に
});
