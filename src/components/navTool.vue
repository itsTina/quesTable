<template>
  <div>
    <div class="titleBox ivu-menu ivu-menu-dark ivu-menu-horizontal">
      <span class="titleSpan">问题反馈表</span>
      <span class="useSpan">
        <span>您好，{{loginId}}</span>
        <span @click="edit" class="link">修改密码</span>
        <span @click="logout" class="link">退出</span>
      </span>
    </div>
  <iMenu mode="horizontal" :theme="'dark'" :active-name="active" @on-select="main">
    <iMenu-item name="">
      <iIcon type="ios-paper"></iIcon>
      问题反馈
    </iMenu-item>
    <iMenu-item name="account" v-if="show">
      <iIcon type="ios-people"></iIcon>
      开户
    </iMenu-item>
    <iMenu-item name="hospital" v-if="show">
      <iIcon type="ios-people"></iIcon>
      院区设置
    </iMenu-item>
    <iMenu-item name="editUser">
      <iIcon type="settings"></iIcon>
      密码修改
    </iMenu-item>
  </iMenu>
   </div>
</template>
<script>
  import iMenuItem from 'iview/src/components/menu/menu-item.vue'
  import iMenu from 'iview/src/components/menu/'
  import iIcon from 'iview/src/components/icon'
  import urlConfig from '../router/url'
  export default {
      components:{iMenu,iIcon,iMenuItem},
    data () {
      return {
          show:'admin'==$('#loginId').val(),
          loginId:$('#loginId').val()||"",
          active:''
      }
    },
    methods:{
        edit:function(){
            this.$router.push('editUser');
        },
        logout:function(){
          location.href = urlConfig.get('logout');
        },
      main(name){
        //this.active-name=name;
        this.$router.push('/'+name);
      }
    },
    computed:{

    },
    created:function(){
      this.active=this.$route.path.replace('/','');
      this.$store.dispatch('accountList');
      this.$store.dispatch('hospitalList');
    }
  }
</script>

<style>
  span.titleSpan{
    float: left;
    font-size: 24px;
    color: white;
    margin-left: 16px;}
  span.useSpan{
    float: right;
    margin-right: 20px;
    color: white;
  }
  span.useSpan span{
    margin-left: 15px;
  }
  .link{
    cursor: pointer;
  }
  .link:hover{
    text-decoration: underline;
  }
</style>
