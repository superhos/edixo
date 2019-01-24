<template>
  <el-container>
    <el-aside class="content-bar">
      <search-bar />
      <note-list />
      <div class="status">
        {{ runningCommand }}
      </div>
    </el-aside>
    <el-main>
      <note-content-page />
    </el-main>
</el-container>
</template>

<script>
  import moment from 'moment'
  import SearchBar from '../SearchBar'
  import NoteList from '../NoteList'
  import NoteContentPage from '../NoteContentPage'
  
  export default {
    name: 'note-page',
    components: {
      SearchBar,
      NoteList,
      NoteContentPage
    },
    mounted () {
      this.initPost()
      this.$store.dispatch('updateCommand', moment().format('DD/MM/YYYY'))
    },
    computed: {
      runningCommand () {
        return this.$store.state.Post.command
      }
    },
    methods: {
      initPost () {
        // get the config
        // const hexoProjPath = this.$db.get(CONSTANT.HEXO_PROJ_PATH)
        // var doc = yaml.safeLoad(fs.readFileSync(`${hexoProjPath}${path.sep}_config.yml`, 'utf8'))
        // this.$db.set(CONSTANT.CONFIG, doc)
        // const paths = `${hexoProjPath}${path.sep}${doc.source_dir}${path.sep}_posts`
        // const fileNames = fs.readdirSync(`${paths}`)
        // const files = []
        // fileNames.forEach(e => {
        //   if (!fs.statSync(`${paths}${path.sep}${e}`).isDirectory() && e.substring(e.length - 3) === '.md') {
        //     files.push(new Post(fs.readFileSync(`${paths}${path.sep}${e}`).toString(), `${paths}${path.sep}${e}`))
        //   }
        // })
        this.$store.dispatch('initPosts')
        // this.$store.dispatch('addPosts', files)
        // this.$store.dispatch('showPost', files[0]._id)
      }
    }
  }
</script>

<style scoped>

  .content-bar {
    background:#FFF;
    border: 1px solid #f2f2f2;
    border-left: 0;
    width:280px!important;
    border-top:0;
    border-bottom:0;
    padding:0;
    margin:0;
    height:inherit;
    overflow: hidden;
  }

  .el-main {
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    line-height: 160px;
    padding:0!important;
    margin:0;
    height:inherit;
  }

  .status {
    text-align: left;
    font-size: 13px;
    color: rgb(197, 197, 197);
    line-height: 23px;
    height: 23px;
    position: absolute;
    bottom: 0;
    padding:0 5px;
    box-sizing: border-box;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
</style>
