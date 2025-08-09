import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // CORSの事前確認リクエストに対応するためのおまじない
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Supabaseに接続するためのクライアントを作成する
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!
    )

    
    // 'diaries'テーブルから、id, content, created_atの列を全て取得する
    // created_atが新しい順に並び替える
    const { data, error } = await supabaseClient
      .from('diaries')
      .select('id, content, created_at')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    // 成功した場合、取得した日記データをJSON形式でフロントエンドに返す
    return new Response(JSON.stringify({ diaries: data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    // エラーが発生した場合、エラーメッセージをJSON形式で返す
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})