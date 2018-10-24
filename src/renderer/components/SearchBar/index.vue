<template>
  <div class="search-bar">
    <el-input
      :placeholder="$t('message.search_placeholder')"
      v-model="searchContent"
      @change="search"
      clearable>
    </el-input>
    <i @click="search" class="el-icon-search" />
  </div>
</template>

<script>
  export default {
    name: 'search-bar',
    data () {
      return {
        searchContent: ''
      }
    },
    methods: {
      search () {
        this.$store.dispatch('search', this.searchContent)
      }
    }
  }
</script>

<style lang="scss">
.search-bar {
    height: 42px;
    line-height: 40px;
    box-sizing: border-box;
    border-bottom:2px solid #F3F3F3;
    -webkit-app-region: none;

    div,button {
        width:20%;
        float:left;
        box-sizing: border-box;
        border: 0;
        border-radius: 0;
    }

    div:first-child {
        width:80%;
    }

    input {
        border: 0;
    }
}
</style>
