import Vue from 'vue'
import Hexo from '../../../utils/hexo'
import Post from '../../model/post.js'
import CONSTANT from '../../../common/constant.js'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

const state = {
  posts: [],
  cur: {},
  command: '',
  search: ''
}

const mutations = {
  INIT_POSTS (state, posts) {
    console.log(posts)
    state.posts = posts
  },
  UPDATE_COMMAND (state, command) {
    state.command = command
  },
  ADD_POSTS (state, posts) {
    state.posts.forEach((e, i) => {
      let ind = posts.findIndex(ele => ele._id === e._id)
      if (ind > -1) {
        state.posts[i] = posts[ind]
        posts.splice(ind, 1)
      }
    })
    state.posts = [
      ...state.posts,
      ...posts
    ]
  },
  ADD_POST (state, post) {
    if (!post) {
      state.cur = new Post()
    } else {
      post.save()
      state.posts.push(post)
    }
  },
  SHOW_POST (state, id) {
    state.cur = state.posts.find(e => e._id === id)
  },
  SEARCH_POST (state, name) {
    state.search = name
  },
  UPDATE_POST (state, post) {
    state.posts = state.posts.map(e => {
      if (e._id === post._id) {
        return post
      }
      return e
    })

    state.posts.find(e => e._id === post._id).save()
  },
  DELETE_POST (state, post) {
    state.posts.find(e => e._id === post._id).remove()
    state.posts = state.posts.filter(e => e._id !== post._id)
    state.cur = state.posts[0]
  }
}

const actions = {
  initPosts ({commit}) {
    const hexoProjPath = Vue.$db.get(CONSTANT.HEXO_PROJ_PATH)
    var doc = yaml.safeLoad(fs.readFileSync(`${path.resolve(hexoProjPath, '_config.yml')}`, 'utf8'))
    Vue.$db.set(CONSTANT.CONFIG, doc)
    const sourcePath = path.resolve(hexoProjPath, doc.source_dir)
    const dbConfigPath = path.resolve(hexoProjPath, 'db.json')
    if (!fs.existsSync(dbConfigPath)) {
      return
    }
    const dbConfig = JSON.parse(fs.readFileSync(`${dbConfigPath}`).toString())
    const posts = []
    dbConfig.models.Post.forEach(post => {
      posts.push(new Post(post, sourcePath))
    })
    commit('INIT_POSTS', posts)
  },
  addPosts ({commit}, posts) {
    commit('ADD_POSTS', posts)
  },
  showPost ({commit}, id) {
    commit('SHOW_POST', id)
  },
  updateCommand ({commit}, command) {
    commit('UPDATE_COMMAND', command)
  },
  search ({commit}, name) {
    commit('SEARCH_POST', name)
  },
  updatePost ({commit}, post) {
    commit('UPDATE_POST', post)
  },
  addPost ({commit}) {
    commit('ADD_POST')
  },
  async addNewPost ({commit}, post) {
    const hexoProjPath = Vue.$db.get(CONSTANT.HEXO_PROJ_PATH)
    const res = await Hexo.addPost(hexoProjPath, post.title)

    if (!res.result) {
      console.log('新建失败')
    } else {
      commit('ADD_POST', post)
    }
  },
  delPost ({commit}, post) {
    commit('DELETE_POST', post)
  }
}

export default {
  state,
  mutations,
  actions
}
