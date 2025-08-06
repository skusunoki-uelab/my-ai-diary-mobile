import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // CORSの事前確認リクエストには、これまで通り応答する
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 設定した秘密情報（環境変数）を読み込んでみる
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')

    // 読み込んだ内容を、そのままフロントエンドに返信する
    return new Response(
      JSON.stringify({
        message: '環境変数を読み込みました。',
        SUPABASE_URL_IS_SET: !!supabaseUrl, // URLが設定されていればtrue
        SUPABASE_ANON_KEY_IS_SET: !!supabaseAnonKey, // ANONキーが設定されていればtrue
        OPENAI_API_KEY_IS_SET: !!openaiApiKey, // OpenAIキーが設定されていればtrue
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // 成功を返す
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})