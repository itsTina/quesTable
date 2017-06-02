<template>
  <div class="login">
    <Row align="middle">
      <Col span="12" class="left">
        <img  src="static/img/login.png"/>
      </Col>
      <Col span="12" class="right">
        <Form ref="formInline" :model="user" :rules="ruleValidate" :label-width="50" class="inputBox">
          <Form-item label="姓名" prop="name">
            <Input v-model="user.name" placeholder="请输入姓名"></Input>
          </Form-item>
          <Form-item label="密码" prop="password">
            <Input v-model="user.password" placeholder="请输入密码" type="password"></Input>
          </Form-item>
          <div><Checkbox v-model="autoLogin">下次自动登录</Checkbox></div>
          <Form-item>
            <Button type="primary" @click="handleSubmit('formInline')">登录</Button>
          </Form-item>
        </Form>
      </Col>
    </Row>
  </div>
</template>

<script>
  import getCookie from '../utils/cookie'
  import urlConfig from '../utils/urlConfig'
var cookieObj=new getCookie();
export default {
  name:'login',
  data () {
    return {
      autoLogin:false,
      user: {
        name: '',
        password: ''
      },
      ruleValidate: {
        name: [
          { required: true, message: '请填写用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请填写密码', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    handleSubmit(name) {
      var self=this;
      this.$refs[name].validate((valid) => {
        if (valid) {
          $.get('/loginIn',this.user).then((res) => {
            if(this.autoLogin){
              cookieObj.add('okruserid',res.data);
            }
            //location.href='/#/'

          }).catch(() => {
            this.$Message.error('登陆失败!');
          });
        } else {
          //this.$Message.error('验证失败!');
    }
    })
    }
  }
}
</script>

<style scoped>
  div.login{
     height: 300px;
    transform: translate(0,50%);
  }
  .left img{
    float:right
  }
  .right .inputBox{
    float: left;
    height: 220px;
    width: 300px;
    padding: 44px 0px 0px 10px;
  }
  .right .inputBox > *{
    margin-bottom:20px;
  }
  .right .inputBox button{
    width:100%;
  }
</style>
