import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { OpenAI } from 'https://esm.sh/openai@4'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // フロントエンドから送られてきた日記のテキストを受け取る
    const { content, tags, photo_url } = await req.json()
    if (!content) {
      throw new Error('日記のテキスト（content）が入力されていません。')
    }
    if (!tags) {
      throw new Error('タグ（tags）が入力されていません。')
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    )
    const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY')! })

    // OpenAI APIでテキストをベクトルに変換
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: content,
    })
    const embedding = embeddingResponse.data[0].embedding

    // Supabaseの 'diaries' テーブルにテキストとベクトルを保存
    const { error } = await supabaseClient
      .from('diaries')
      .insert({ content: content, embedding: embedding, tags: tags, photo_url: photo_url })
    
    if (error) {
      throw error
    }

    // 成功したことをフロントエンドに返す
    return new Response(JSON.stringify({ message: '日記を保存しました。' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})