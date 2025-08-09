// ▼▼▼ あなた自身の情報に書き換える ▼▼▼
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwcHl5cWVjdWJqc2xpeWFxemRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNzA3MjcsImV4cCI6MjA2OTk0NjcyN30.jMADvhsUhAUTRd7fwBvdj-nRhsuawzXPwePhxA6jg0A'

// 3つのAPIのURLをここで一括管理する
const API_URLS = {
  addDiary: 'https://pppyyqecubjsliyaqzdj.supabase.co/functions/v1/add-diary-entry',
  findSimilar: 'https://pppyyqecubjsliyaqzdj.supabase.co/functions/v1/find-similar-diary',
  getAll: 'https://pppyyqecubjsliyaqzdj.supabase.co/functions/v1/add-diary-entry'
}
// ▲▲▲ あなた自身の情報に書き換える ▲▲▲

// APIを呼び出す際の共通設定
const headers = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json'
}

/**
 * 新しい日記をデータベースに保存する関数
 * @param {string} diaryText - 保存したい日記のテキスト
 */
export const addDiaryEntry = async (diaryText) => {
  const response = await fetch(API_URLS.addDiary, {
    method: 'POST',
    headers,
    body: JSON.stringify({ diaryText })
  })
  if (!response.ok) {
    throw new Error('日記の保存に失敗しました。')
  }
  return await response.json()
}

/**
 * 悩みに似ている過去の日記を探す関数
 * @param {string} problem - 相談したい悩みのテキスト
 */
export const findSimilarDiary = async (problem) => {
  const response = await fetch(API_URLS.findSimilar, {
    method: 'POST',
    headers,
    body: JSON.stringify({ problem })
  })
  if (!response.ok) {
    throw new Error('AIへの相談に失敗しました。')
  }
  return await response.json()
}

/**
 * 全ての日記を取得する関数
 */
export const getAllDiaries = async () => {
  const response = await fetch(API_URLS.getAll, {
    method: 'GET',
    headers
  })
  if (!response.ok) {
    throw new Error('日記の読み込みに失敗しました。')
  }
  return await response.json()
}
