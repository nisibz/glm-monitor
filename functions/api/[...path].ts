interface Env {
  ZAI_API_KEY: string
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)
  const target = `https://api.z.ai/api${url.pathname.replace(/^\/api/, '')}${url.search}`
  const headers = new Headers(context.request.headers)
  headers.set('Authorization', `Bearer ${context.env.ZAI_API_KEY}`)
  return fetch(target, {
    method: context.request.method,
    headers,
    body: context.request.body,
  })
}
