import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { OpenAI } from 'https://esm.sh/openai@4'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // POST以外のリクエストはCORS用の事前確認（preflight）とみなし、OKを返す
  if (req.method !== 'POST') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // --- 1. 入力：フロントエンドからのリクエストを受け取る ---
    const { problem } = await req.json()
    if (!problem) {
      throw new Error('悩み（problem）が入力されていません。')
    }

    // --- 2. 処理の核心部分（ここはtest.jsとほぼ同じ） ---
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
    )
    const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY')! })

    // 悩みのテキストをベクトルに変換
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: problem,
    })
    const problemEmbedding = embeddingResponse.data[0].embedding

    // Supabaseの関数を呼び出して、ベクトルが最も近い日記を探す
    const { data, error: rpcError } = await supabaseClient.rpc('match_diaries', {
      query_embedding: problemEmbedding,
      match_threshold: 0.5, // 類似度のしきい値
      match_count: 1,      // 見つける数
    })

    if (rpcError) {
      throw rpcError
    }

    // --- 3. 出力：フロントエンドに結果を返す ---
    return new Response(JSON.stringify({ similarDiary: data[0] || null }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    // エラーが発生した場合も、フロントエンドにエラー情報を返す
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})