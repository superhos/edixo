<template>
  <div>
    <div class="title-zone">
        <el-row>
            <el-col :span="18">
                <h3><el-input style="border:0" :readonly="!editMode" v-model="curPost.title" :placeholder="$t('message.input')+'...'"></el-input></h3>
            </el-col>
            <el-col :span="6" style="text-align:right">
                <i @click="toggleEdit(false)" class="el-icon-edit" v-show="!editMode"></i>
                <i @click="toggleEdit(true)" class="el-icon-view" v-show="editMode"></i>
                <i class="el-icon-share"></i>
                <i @click="deletePost" class="el-icon-delete"></i>
            </el-col>
            <el-col class="tags" v-show="curPost.tags && curPost.tags.length > 0">
                <el-tag
                    v-for="tag in curPost.tags"
                    v-show="tag && tag.length > 0"
                    :key="tag"
                    :closable="editMode"
                    size="medium" 
                    @close="handleClose(tag)"
                    type="info">
                    {{tag}}
                    </el-tag>
                <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small" 
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                    >
                </el-input>
                <el-button v-else size="small" v-show="!inputVisible && editMode" class="button-new-tag" @click="showInput">+</el-button>
            </el-col>
        </el-row>
    </div>
    <article class="content-zone" :style="contentStyle">
        <div class="content">
            <mavon-editor ref="md" :placeholder="$t('message.content_placeholder')" @save="save" @imgAdd="imgAdd" @change="changeHandle" :language="lang" :style="contentStyle" :subfield="editMode" v-model="curPost.raw" :toolbarsFlag="editMode" defaultOpen="preview" />
        </div>
    </article>
  </div>
</template>

<script>
import SearchBar from '../SearchBar'
import _ from 'lodash'
const electron = require('electron').remote
const win = electron.getCurrentWindow()

export default {
  name: 'note-content-page',
  components: {
    SearchBar
  },
  data () {
    return {
      contentStyle: {
        height: '1000px'
      },
      isChange: false,
      editMode: false,
      lang: 'zh-cn',
      curId: '',
      inputVisible: false,
      inputValue: '',
      lastModifyTime: 0,
      autoSaveGap: 30000 // 30秒一次
    }
  },
  computed: {
    curPost () {
      if (this.$store.state.Post.cur._id !== this.curId) {
        this.curId = this.$store.state.Post.cur._id
        this.editMode = !this.curId
      }
      console.log(this.$store.state.Post.cur)
      return _.cloneDeep(this.$store.state.Post.cur)
    }
  },
  mounted () {
    this.contentStyle.height = `${win.getSize()[1] - 80}px`
    window.addEventListener('resize', () => {
      this.contentStyle.height = `${win.getSize()[1] - 80}px`
    })
  },
  methods: {
    toggleEdit (save) {
      this.editMode = !this.editMode
      if (save && this.isChange) {
        this.save()
      }
    },
    imgAdd (fileName, img) {
      const newPath = this.curPost.addImg(img)
      this.$refs.md.$img2Url(fileName, newPath)
    },
    save (auto) {
      if (this.curId) {
        this.$store.dispatch('updatePost', this.curPost)
        this.$store.dispatch('showPost', this.curPost._id)
      } else {
        this.$store.dispatch('addNewPost', this.curPost)
      }
    //   this.$notify.success({
    //     title: this.$i18n.t('message.notific'),
    //     position: 'bottom-right',
    //     message: auto ? this.$i18n.t('message.auto_save_success') : this.$i18n.t('message.save_success'),
    //     duration: 1000
    //   })
    },
    handleClose (tag) {
      console.log(this.curPost.tags)
      this.curPost.tags.splice(this.curPost.tags.indexOf(tag), 1)
      console.log(this.curPost.tags)
    },
    showInput () {
      this.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    handleInputConfirm () {
      let inputValue = this.inputValue
      if (inputValue) {
        this.curPost.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
    changeHandle () {
      this.isChange = true
      if (new Date().getTime() - this.lastModifyTime > this.autoSaveGap && this.editMode && this.isChange) {
        // this.save(true)
      }
      this.lastModifyTime = new Date().getTime()
    },
    deletePost () {
      this.$confirm(this.$i18n.t('message.delete_confirm'), this.$i18n.t('message.notific'), {
        confirmButtonText: this.$i18n.t('message.confirm'),
        cancelButtonText: this.$i18n.t('message.cancel'),
        type: 'warning'
      }).then(() => {
        // this.$message({
        //   type: 'success',
        //   message: this.$i18n.t('message.delete_success')
        // })
        this.$store.dispatch('delPost', this.curPost)
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="scss" >
  /* width */
::-webkit-scrollbar {
    width: 8px;
}

/* Track */
::-webkit-scrollbar-track {
    background: #fff; 
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #62ffe7; 
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #00f7da; 
}

.content-bar {
    background:#FFF;
    border: 1px solid #f2f2f2;
    width:280px!important;
    border-top:0;
    border-bottom:0;
    padding:0;
    margin:0;
    height:inherit;
}

// .el-main {
//     background-color: #E9EEF3;
//     color: #333;
//     text-align: center;
//     line-height: 160px;
//     padding:0!important;
//     margin:0;
//     height:inherit;
// }

.title-zone {
    -webkit-app-region: drag;
    height: auto;
    line-height: 80px;
    border-bottom: 2px solid #F3F3F3;
    background: #FFF;

    div {
        height: auto;

        h3 {
            padding: 0;
            margin: 0;
            text-align: left;
            padding-left:15px;
            box-sizing: border-box;
            font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
            font-weight: 100;
            width: 100%;
            overflow:hidden;
            white-space:nowrap;
            text-overflow:ellipsis;
            font-size:18px;

            input {
                border: 0;
            }

            input:disabled {
                background-color: #FFF !important;
            }
        }

        i {
            font-size: 18px;
            cursor: pointer;
            margin-right: 15px;
            color: #b4b4b4;
        }

        i:hover {
            color: rgb(145, 145, 145);
        }
    }

    .tags {
        height: auto;
        line-height: 28px;
        text-align: left;
        padding: 0 28px 15px;

        .el-tag {
            height: 28px;
            line-height: 26px;
            background: #fff;
            border-radius: 0;
            cursor: pointer;
        }

        i {
            margin-right: 0;
        }
    }

    .el-tag + .el-tag {
        margin-left: 10px;
    }

    .button-new-tag {
        margin-left: 8px;
        line-height: 28px;
        height: 28px;
        padding: 0 10px;
        box-sizing: border-box;
        vertical-align: bottom;
        font-weight: 100;
        border-radius: 0;
    }

    .input-new-tag {
        min-width: 80px;
        width: 80px;
        margin-left: 10px;
        vertical-align: middle;
        height: 28px;
        padding: 0;
        box-sizing: border-box;
        border-radius: 0;

        input {
            outline: none;
            border: 0;
            border-bottom: 1px solid rgb(219, 219, 219);
            border-radius: 0;
            height:28px;
            line-height: 28px;
        }
    }
}

.content-zone{
    overflow: auto;
    -webkit-overflow-scrolling: touch;

    .content {
        height:auto;
        background: #FFF;
    }
}
</style>
