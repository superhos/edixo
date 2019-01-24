<template>
  <div 
    class="select-folder"
    v-loading="showLoading"
    :element-loading-text="loadingMsg"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    >
    <!-- <el-alert
      title="错误提示的文案"
      type="error"
      style="position:abolute;z-index:999"
      description="文字说明文字说明文字说明文字说明文字说明文字说明"
      show-icon>
    </el-alert> -->
    <div class="logo">
      <h1>Edixo</h1>
      <h1>Edixo</h1>
      <h1>Edixo</h1>
      <h1>Edixo</h1>
      <h1>Edixo</h1>
      <h3>{{ $t('message.edixo_introduce') }}</h3>
    </div>
    <div class="control">
      <div class="bg bg-2"></div>
      <div class="bg bg-1"></div>
      <el-popover
        placement="top"
        width="200"
        class="tooltip"
        v-model="showInputName">
        <p>{{ $t('message.input_blog_name') }} :</p>
        <div style="text-align: right; margin: 0">
          <el-input v-model="blogName" />
          <el-button size="mini" type="text" @click="showInputName = false">{{ $t('message.cancel') }}</el-button>
          <el-button :disabled="blogName.length === 0" type="primary" size="mini" @click="initBlog">{{ $t('message.select_save_folder') }}</el-button>
        </div>
        <el-button slot="reference">{{ $t('message.build_hexo_folder') }}</el-button>
      </el-popover>
      <button @click="selectDic">{{ $t('message.select_hexo_folder') }}</button>
    </div>
  </div>
</template>

<script>
import Hexo from '../../../utils/hexo'
import CONSTANT from '../../../common/constant'
const electron = require('electron').remote
const dialog = electron.dialog
const path = require('path')
// const { ipcRenderer } = electron
// const fs = require('fs')

export default {
  name: 'enter-page',
  data () {
    return {
      showLoading: false,
      showInputName: false,
      blogName: '',
      loadingMsg: ''
    }
  },
  mounted () {
    this.showLoading = !Hexo.checkHexoInstall()
    if (this.showLoading) {
      const loading = this.$loading({
        lock: true,
        text: this.$t('message.no_hexo'),
        spinner: 'el-icon-error',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        loading.close()
      }, 2000)
    }
  },
  methods: {
    initBlog () {
      const remind = this.$t('message.building')
      dialog.showOpenDialog({properties: ['openDirectory']}, async (pathName) => {
        if (!pathName) return
        this.showInputName = false
        this.loadingMsg = remind
        this.showLoading = true
        const result = await Hexo.initBlog(pathName[0], this.blogName)
        this.showLoading = false
        if (result.result) {
          this.$db.set(CONSTANT.HEXO_PROJ_PATH, `${pathName[0]}${path.sep}${this.blogName}`)
          this.$electron.ipcRenderer.sendSync('open-main')
        } else {
          this.$message({
            showClose: true,
            message: result.msg,
            type: 'error',
            duration: 3000
          })
        }
      })
    },
    selectDic () {
      dialog.showOpenDialog({properties: ['openDirectory']}, (pathName) => {
        if (!pathName) return
        // 检查是否是Hexo
        const result = Hexo.checkIsHexoPath(pathName[0])
        if (!result.result) {
          this.$message({
            showClose: true,
            message: result.msg,
            type: 'error',
            duration: 3000
          })
          return
        }
        // 打开项目
        this.$db.set(CONSTANT.HEXO_PROJ_PATH, pathName[0])
        this.$electron.ipcRenderer.sendSync('open-main')
      })
    }
  }
}
</script>

<style lang="scss">
  /* width */

.select-folder {
  height: 100%;
}

.el-message {
  left: 150px!important;
  min-width: 300px!important;
  top: 0!important;
}

.el-popover {
  input,input:focus {
    border: 0;
    border-bottom: 1px solid #00bda7;
    border-radius: 0;
  }

  button {
    margin-top:5px;
    color: #00bda7;
  }

  .el-button+.el-button {
    margin-top:5px;
    color: #FFF;
    background: #00bda7;
    border: 0;
    border-radius: 50px;
  }

  .el-button+.el-button.is-disabled{
    background : #CCC;
  }
}

.logo {
  background: #FFF;
  height:200px;
  -webkit-app-region: drag;
  position: relative;
  -webkit-user-select: none;  /* Chrome all / Safari all */
  -moz-user-select: none;     /* Firefox all */
  -ms-user-select: none;      /* IE 10+ */
  user-select: none;  

  h1 {
    width: 100%;
    text-align: center;
    height: 200px;
    line-height: 200px;
    font-size: 80px;
    color: #00f7da;
    opacity: .7;
    position: absolute;
    top:0;
    text-shadow: 1px 1px 10px #00665a;
  }

  h3 {
    width: 100%;
    text-align: center;
    height: 200px;
    line-height: 200px;
    font-size: 13px;
    color: #98dbd5;
    position: absolute;
    top:58px;
  }

  h1:nth-child(2) {
    opacity: .5;
    left: - 5px;
    top:5px;
    // -webkit-filter: blur(3px);
    // filter: blur(3px);  
  }

  h1:nth-child(3) {
    opacity: .2;
    left: 3px;
    top: 8px;
    color: #00e7cc;
  }

  h1:nth-child(4) {
    opacity: .5;
    left: 3px;
    top: 8px;
    color: #FFF;
  }


  h1:last-child {
    opacity: .8;
    left: 5px;
    top:5px;
  }
}

.control {
  height:150px;
  text-align: center;
  box-sizing: border-box;
  padding-top: 30px;
  position: relative;
  background: #FFF;
  -webkit-user-select: none;  /* Chrome all / Safari all */
  -moz-user-select: none;     /* Firefox all */
  -ms-user-select: none;      /* IE 10+ */
  user-select: none;  

  button, button:focus {
    color: #00d8bf;
    width: 60%;
    margin: 0 auto;
    height:40px;
    border: 1px solid #00f7da;
    background: #FFF;
    border-radius: 80px;
    font-size: 13px;
    outline: none;
    cursor: pointer;
    position: relative;
    z-index: 999;
    margin-bottom:15px;
  }

  button:hover{
    background-color: #00f7da;
    color:#FFF;
  }

  .bg-1 {
    background:#5cffec;
    width:200%;
    height:400px;
    position:absolute;
    top: -10px;
    left: -110%;
    z-index:10;
    transform: rotate(40deg);
  }

  .bg-2 {
    background:#00bda7;
    width:200%;
    height:400px;
    position:absolute;
    top: 25px;
    left: 0;
    z-index: 9;
    transform: rotate(-45deg);
  }
}
</style>
