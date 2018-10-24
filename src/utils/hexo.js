import router from '../renderer/router'

const is = require('electron-is')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')
const path = require('path')

export default class Hexo {
  static async checkHexoInstall () {
    const cmd = `hexdo -v`
    const { stdout, error } = await Hexo.run(`${cmd}`)
    if (stdout && stdout.toString().indexOf('hexo-cli')) {
      return true
    }
    if (error && error.toString().indexOf('Command failed')) {
      return false
    }
  }

  static async initBlog (path, name) {
    const cmd = `cd ${path} && hexo init ${name} && echo 1`
    const { error } = await Hexo.run(`${cmd}`)
    if (error) {
      let errs = error.toString().split('\n').filter(e => e.indexOf('Error') > -1)
      return {result: false, msg: (errs[1] || errs[0])}
    } else {
      return {result: true}
    }
  }

  static checkIsHexoPath (hexoPath) {
    // Check Package.json
    const packagePath = `${hexoPath}${path.sep}package.json`
    const configPath = `${hexoPath}${path.sep}_config.yml`
    if (!fs.existsSync(packagePath) || !fs.existsSync(configPath)) {
      return {result: false, msg: router.app.$t('message.not_hexo_path')}
    }
    const packages = JSON.parse(fs.readFileSync(packagePath).toString())
    const dependencies = packages.dependencies
    if (dependencies.hexo) {
      return {result: true}
    } else {
      return {result: false, msg: router.app.$t('message.not_hexo_path')}
    }
  }

  static async run (cmd) {
    return new Promise((resolve) => {
      exec(`${cmd}`, (error, stdout, stderr) => {
        resolve({error, stdout, stderr})
      })
    })
  }

  static checkOS () {
    if (is.windows()) { return 'windows' }
    if (is.macOS()) { return 'mac' }
    if (is.linux()) { return 'linux' }
  }
}
