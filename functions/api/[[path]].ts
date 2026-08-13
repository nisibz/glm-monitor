interface Env {
  ZAI_API_KEY: string
}

// Past-day usage never changes; quota changes slowly. Cache at the edge so
// frequent client polling never hammers api.z.ai.
const cacheTtlOf = (pathname: string) =>
  pathname.includes('/monitor/usage/quota') ? 60 : 7200

export const onRequest: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url)

  if (context.request.method === 'GET') {
    const cache = caches.default
    const cached = await cache.match(url)
    if (cached) return cached

    const res = await proxy(context.request, context.env)
    if (res.ok) {
      const headers = new Headers(res.headers)
      headers.delete('Content-Encoding')
      headers.set(
        'Cache-Control',
        `public, max-age=${cacheTtlOf(url.pathname)}`,
      )
      const resWithTtl = new Response(res.body, {
        status: res.status,
        statusText: res.statusText,
        headers,
      })
      context.waitUntil(cache.put(url, resWithTtl.clone()))
      return resWithTtl
    }
    return res
  }

  return proxy(context.request, context.env)
}

const proxy = async (request: Request, env: Env) => {
  const url = new URL(request.url)
  const target = `https://api.z.ai/api${url.pathname.replace(/^\/api/, '')}${url.search}`
  const headers = new Headers(request.headers)
  headers.set('Authorization', `Bearer ${env.ZAI_API_KEY}`)
  return fetch(target, {
    method: request.method,
    headers,
    body: request.body,
  })
}
