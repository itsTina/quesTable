<template>
  <div class="mainBox">
    <navTool></navTool>
    <div>
      <br>
      <div class="ivu-menu-dark">
        <div class="titleBox">{{title}}</div>
      </div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import navTool from '@/components/navTool.vue'
  export default {
    name: 'app',
    components:{
      navTool
    },
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    computed:{
        title:function(){
            return this.$route.name;
        }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    min-width:1000px;
  }
  .titleBox{
    height:40px;
    line-height:40px;
    color:white;
    font-weight: bold;
    font-size: 16px;
    margin-left: 20px;
  }
 /* h1, h2 {
    font-weight: normal;
  }

  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }*/
</style>
