// This file is only a local getPlatformProxy entrypoint. It exposes no route
// and is not deployed; the operator script uses the DB binding directly.
export default {
  fetch() {
    return new Response('Not found', { status: 404 })
  },
}
