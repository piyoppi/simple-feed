const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const dayjs = require('dayjs');


const pluginName = 'BuildFeedWebpackPlugin';

class BuildFeedWebpackPlugin {
  constructor() {
    this.distPath = './dist'
    this.charCode = 'utf-8'
    this.articlePath = './assets/markdown'
    this.articlesPerPage = 5
  }

  apply(compiler) {
    compiler.hooks.run.tap(pluginName, compilation => {
      const articles = this._articles()

      if(!fs.existsSync(this.distPath)) {
        fs.mkdirSync(this.distPath)
      }

      const articlesJson = JSON.stringify(articles)
      fs.writeFileSync(path.join(this.distPath, 'feed.json'), articlesJson, (err) => {
        if (err) throw err
      })

      const paginations = this._paginations(articles)
      const paginationsJson = JSON.stringify(paginations)
      fs.writeFileSync(path.join(this.distPath, 'pagination.json'), paginationsJson, (err) => {
        if (err) throw err
      })
    })
  }

  _paginations(articles) {
    return articles.reduce((acc, val, index) => {
      const pageNumber = Math.floor(index / this.articlesPerPage)
      let articlesInPage = acc[pageNumber]

      if( !articlesInPage ) {
        articlesInPage = []
        acc.push(articlesInPage)
      }

      articlesInPage.push(val)

      return acc
    }, [])
  }

  _articles() {
    const filenames = fs.readdirSync(this.articlePath)
      .filter(filename => filename.match(/^.*\.md$/))

    return filenames.map( filename => {
      const fileContent = fs.readFileSync(path.join(this.articlePath, filename), this.charCode)
      return this._extractYamlFrontmatter(fileContent)
    }).sort((a, b) => {
      if( !a.date || !b.date ) {
        return -1
      }
      const dateA = dayjs(a.date)
      const dateB = dayjs(b.date)

      return dateA.isBefore(dateB) ? 1 : -1
    });
  }

  _extractYamlFrontmatter(content) {
    const lines = content.split('\n')
    const separator = '---'
    let frontmatter = {}

    if( lines.length > 2 && lines[0] === separator) {
      const endOfYamlLineIndex = lines.indexOf(separator, 1)

      if( endOfYamlLineIndex > 1 ) {
        const frontmatterYaml = lines.slice(1, endOfYamlLineIndex).join('\n')
        frontmatter = yaml.load(frontmatterYaml)
      }
    }

    return frontmatter
  }
}

module.exports = BuildFeedWebpackPlugin
