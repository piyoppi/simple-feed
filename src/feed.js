export class Feed {
  constructor(baseUrl) {
    this.baseUrl = baseUrl
  }

  get feedUrl() {
    return this.baseUrl + 'feed.json'
  }

  get paginationUrl() {
    return this.baseUrl + 'pagination.json'
  }

  async fetchAll() {
    const response = await fetch(this.feedUrl)
    return (await response.json())
  }

  async fetchPaginate() {
    const response = await fetch(this.paginationUrl)
    return (await response.json())
  }
}
