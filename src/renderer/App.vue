<template>
  <!-- Layout -->
  <div id="app">
    <el-container>
      <el-aside class="tool-bar" v-show="this.$route.path !== '/enter'">
        <ul>
          <li @click="addPost" class="add"><i class="el-icon-plus" /></li>
          <router-link to="/" tag="li" exact><i class="el-icon-document" /></router-link>
          <router-link to="/deploy" tag="li" exact><i class="el-icon-upload" /></router-link>
          <router-link to="/file" tag="li" exact><i class="el-icon-menu" /></router-link>
        </ul>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
  </div>
</template>

<script>
  export default {
    name: 'Edixo',
    methods: {
      addPost () {
        this.$store.dispatch('addPost')
      }
    }
  }
</script>

<style lang="scss">
  html,body,#app{
    height:100%;
    padding:0;
    margin:0;
    overflow: hidden;
  }
  
  * {
    -webkit-user-select: none;  /* Chrome all / Safari all */
    -moz-user-select: none;     /* Firefox all */
    -ms-user-select: none;      /* IE 10+ */
    user-select: none;  
  }

  .el-aside {
    background-color: #D3DCE6;
    color: #333;
    text-align: center;
  }

  .tool-bar {
    background: #F9F9FA;
    width:68px!important;
    height:100%;
    -webkit-app-region:drag;
    line-height:200px;
    border-right: 1px solid #f2f2f2;

    ul {
      list-style: none;
      padding:0;
      padding-top:50px;
      margin:0;
      width:100%;
      text-align: center;
      box-sizing: border-box;

      li {
        text-decoration: none;
        background: transparent;
        display:block;
        width:35px;
        height:35px;
        line-height:35px;
        // border-radius:50px;
        margin: 0 auto;
        text-align: center;
        cursor: pointer;
        margin-bottom: 18px;

        i {
          color:#c5c5c5;
          font-size:20px;
          width:38px;
          height:35px;
          line-height: 35px;
          text-align: center;
        }
      }

      li.add{
        background: #FFF;
        border: 1px solid #CCC;

        i {
          color: #00f7da;
          font-weight: 500;
          width:34px;
          height:34px;
        }
      }

      li:hover {
        i {
          color: #aaa;
        }
      }

      li.add:hover {
        border:1px solid #00f7da;
        background: #00f7da;

        i {
          color: #fff;
        }
      }

      li.router-link-active {
        background: #00f7da;
        // border-radius:50px;
        box-shadow: 1px 1px 7px #00dac0;

        i {
          color:#FFF;
        }
      }
    }
  }
  
  .el-container {
    margin-bottom: 40px;
    height:100%;
    overflow: hidden;
  }

  .el-main {
    overflow: hidden;
    padding:0;
  }
</style>
