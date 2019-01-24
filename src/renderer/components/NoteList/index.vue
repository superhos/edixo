<template>
  <div class="list" :style="contentStyle">
    <ul>
      <li @click="showPost(item._id)" v-for="item in posts" :key="item._id" :class="{ active: curPost._id === item._id }">
        <i class="el-icon-document"></i>
        <span class="title">{{ item.title }}</span>
        <span class="date">{{ time(item.date) }}</span>
        <!-- <div class="desc">{{ overFont(item.content) }}</div> -->
      </li>
    </ul>
  </div>
</template>

<script>
import moment from 'moment'
// import { mapState } from 'vuex'
import SearchBar from '../SearchBar'
const electron = require('electron').remote
const win = electron.getCurrentWindow()

export default {
  name: 'note-list',
  components: {
    SearchBar
  },
  data () {
    return {
      contentStyle: {
        height: '600px'
      }
    }
  },
  computed: {
    posts () {
      let postList = this.$store.state.Post.posts
      if (this.$store.state.Post.search.length > 0) {
        postList = postList.filter(e => e.title.indexOf(this.$store.state.Post.search) > -1 || e.content.indexOf(this.$store.state.Post.search) > -1)
      }
      return postList
    },
    curPost () {
      return this.$store.state.Post.cur
    }
  },
  mounted () {
    this.contentStyle.height = `${win.getSize()[1] - 66}px`

    window.addEventListener('resize', () => {
      this.contentStyle.height = `${win.getSize()[1] - 66}px`
    })
  },
  methods: {
    overFont (desc) {
      let len = 160
      let i = 0
      let result = ''
      while (len > 0 && desc[i]) {
        result += desc[i]
        if (desc.charCodeAt(i) > 127 || desc.charCodeAt(i) === 94) {
          // 中文
          len -= 2
        } else {
          len--
        }
        i++
      }
      return result + (desc[i] ? '...' : '')
    },
    time (params) {
      if (!params || params.length === 0) return ''
      return moment(params).format('DD/MM/YYYY')
    },
    showPost (id) {
      this.$store.dispatch('showPost', id)
    }
  }
}
</script>

<style lang="scss" scoped>
  /* width */
.list{
  overflow: auto;
  height: 100%;

  ul {
    padding:0;
    margin:0;

    li {
      background:#fdfdfd;
      cursor: pointer;
      max-height:150px;
      overflow: hidden;
      display: block;
      border-bottom:1px solid #F5F5F5;
      overflow: hidden;
      padding:15px 18px 0;
      box-sizing: border-box;
      text-align: left;
      z-index: 1;
      position: relative;

      span{
        float:left;
        height:20px;
        font-size:15px;
        font-family:'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
        margin-bottom:15px;
      }

      i {
        width:10%;
        float:left;
      }

      span.title {
        width:90%;
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
      }

      span.date {
        width:100%;
        font-size: 13px;
        color: #DBDBDB;
      }

      div.desc {
        width:100%;
        color: rgb(187, 187, 187);
        font-size:13px;
        overflow:hidden;
        text-overflow:ellipsis;
        height:80px;
      }
    }

    li.active {
      background: #F5F5F5;
    }

    li:hover {
      // box-shadow: 1px 1px 20px #CCC;
      background:#FFF;
      z-index:99;
    }
  }
}
</style>
