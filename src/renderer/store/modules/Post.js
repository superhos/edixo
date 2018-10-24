import Post from '../../model/post.js'

const state = {
  posts: [],
  cur: {},
  command: '',
  search: ''
}

const mutations = {
  UPDATE_COMMAND (state, command) {
    state.command = command
  },
  ADD_POSTS (state, posts) {
    state.posts.forEach((e, i) => {
      let ind = posts.findIndex(ele => ele.id === e.id)
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
    state.cur = state.posts.find(e => e.id === id)
  },
  SEARCH_POST (state, name) {
    state.search = name
  },
  UPDATE_POST (state, post) {
    state.posts = state.posts.map(e => {
      if (e.id === post.id) {
        return post
      }
      return e
    })

    state.posts.find(e => e.id === post.id).save()
  },
  DELETE_POST (state, post) {
    state.posts.find(e => e.id === post.id).remove()
    state.posts = state.posts.filter(e => e.id !== post.id)
    state.cur = state.posts[0]
  }
}

const actions = {
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
  addNewPost ({commit}, post) {
    commit('ADD_POST', post)
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
