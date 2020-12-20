      import { Feed } from './../../src/main.js'

      async function main() {
        const feed = new Feed('/example/dist/')
        const body = await feed.fetchAll()

        console.log(body)
      }

      main()
