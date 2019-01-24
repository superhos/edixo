import moment from 'moment'
import Store from 'electron-store'
import CONSTANT from '../../common/constant'
import router from '../../renderer/router'
const fs = require('fs')
const path = require('path')
const isChinese = require('is-chinese')
const pinyin = require('chinese-to-pinyin')
const rimraf = require('rimraf')

export default class Post {
  constructor (options, sourcePath) {
    this.title = options.title || router.app.$t('message.unnamed')
    this._content = options._content || ''
    this.source = options.source || ''
    this.raw = options.raw || ''
    this.slug = options.slug || ''
    this.published = options.published || 0
    this.date = options.date || ''
    this.updated = options.updated || ''
    this.comments = options.comments || 0
    this.layout = options.layout || ''
    this.photos = options.photos || []
    this.link = options.link || ''
    this._id = options._id || ''
    this.content = options.content || ''
    this.site = options.site || {}
    this.excerpt = options.excerpt || ''
    this.more = options.more || ''

    // this._id = paths
    this.path = path.resolve(sourcePath, this.source)
    // this.fileName = paths ? paths.substring(paths.lastIndexOf('/') + 1, paths.lastIndexOf('.')) : ''
    // this.content = ''
    // this.title = ''
    // this.date = ''
    this.staticDir = this.path ? this.path.replace('.md', '') : ''
    this.tags = []
    this.db = new Store()
    // if (content) {
    //   const pasers = this.explain(content)
    //   Object.keys(pasers).forEach(e => {
    //     this[e] = pasers[e]
    //   })
    // }

    if (typeof this.tags === 'string') this.tags = this.tags.split(',').filter(e => e.length > 0)
  }

  save () {
    if (!this._id) {
      const hexoProjPath = this.db.get(CONSTANT.HEXO_PROJ_PATH)
      const doc = this.db.get(CONSTANT.CONFIG)
      const paths = `${hexoProjPath}${path.sep}${doc.source_dir}${path.sep}_posts`
      this.fileName = this.title.toLowerCase().replace(/\s/g, '_').split('').map(e => {
        if (isChinese(e)) {
          e = pinyin(e, {noTone: true})
        }
        return e
      }).join('')
      this.staticDir = `${paths}${path.sep}${this.fileName}`
      const postPath = `${paths}${path.sep}${this.fileName}.md`
      this._id = postPath
      this.path = postPath
    }

    let format = '---\ntitle: {title}\ndate: {date}\ntags: {tags}\n---'
    let content = format.replace('{title}', this.title).replace('{date}', moment().format('YYYY-MM-DD HH:mm:ss')).replace('{tags}', this.tags ? this.tags.join(',') : '') + (this.content.substring(0, 2) === '\n' ? this.content : '\n' + this.content)
    content = this.imgPaser(content, false)
    fs.writeFileSync(this.path, content)
  }

  addImg (img) {
    // Check the static file first
    const doc = this.db.get(CONSTANT.CONFIG)
    const hexoProjPath = this.db.get(CONSTANT.HEXO_PROJ_PATH)

    // if post_asset_folder is true
    const imageFolder = doc.post_asset_folder ? this.staticDir : `${hexoProjPath}${path.sep}${doc.source_dir}${path.sep}images`
    const imageFilePath = `${imageFolder}${path.sep}${img.name}`
    // post_asset_folder false : return /images/xxx.xxx
    // post_asset_folder true : return xxx.xx
    const returnPath = doc.post_asset_folder ? img.name : `${path.sep}images${path.sep}${img.name}`

    if (!fs.existsSync(imageFolder)) {
      fs.mkdirSync(imageFolder)
    }

    fs.copyFileSync(img.path, `${imageFilePath}`)
    return this.getImgPath(returnPath)
  }

  remove () {
    // 刪除static&md
    if (fs.existsSync(this.staticDir)) {
      rimraf(this.staticDir, () => {})
    }

    fs.unlinkSync(this.path)
  }

  explain (content) {
    let meta = content.match(/---([\s\S]*?)---/g)
    meta = meta ? meta[0] : ''
    let injectMetaResult = {content: content.replace(meta + '\n', '')}
    if (meta) {
      let metas = meta.split('\n')
      metas.splice(0, 1)
      metas.splice(metas.length - 1, 1)
      metas.forEach(e => {
        let key = e.match(/[\w]*:[\s]*/g)[0]
        injectMetaResult[key.replace(': ', '')] = e.replace(key, '')
      })
    }

    // Img url tranform to local url
    injectMetaResult.content = this.imgPaser(injectMetaResult.content)

    return injectMetaResult
  }

  // direction: true : hexo style to local style
  //          : false: local style to hexo style
  imgPaser (content, direction = true) {
    if (content) {
      let afterImgResult = content.match(/!\[(.)+\]\((.)+\)/g)
      if (afterImgResult) {
        afterImgResult.forEach(img => {
          let url = img.match(/\((.)+\)/g)[0]
          url = this.getImgPath(url.substring(1, url.length - 1), direction)
          content = content.replace(img, img.substring(0, img.indexOf('](') + 2) + url + ')')
        })
      }
    }

    return content
  }

  getImgPath (url, direction = true) {
    const doc = this.db.get(CONSTANT.CONFIG)
    const hexoProjPath = this.db.get(CONSTANT.HEXO_PROJ_PATH)
    // ignore the remote image
    if (url.indexOf('http://') > -1 || url.indexOf('https://') > -1 || url.indexOf('data:image') > -1) return url
    if (doc.post_asset_folder) {
      url = (direction ? this.staticDir : '') + url.substring(url.lastIndexOf(path.sep))
    } else {
      url = (direction ? (hexoProjPath + path.sep +
            doc.source_dir) : '') + path.sep +
            'images' + path.sep +
            url.substring(url.lastIndexOf(path.sep))
    }

    return url
  }
}
