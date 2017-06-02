<template>
  <div class="editBox">
      <iForm ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100" class="inputBox">
        <iForm-item label="当前密码:" prop="psw">
          <iInput v-model="formCustom.psw" placeholder="当前密码" disabled></iInput>
        </iForm-item>
        <iForm-item label="新密码:" prop="newPwd">
        <iInput v-model="formCustom.newPwd" placeholder="新密码" type="password"></iInput>
      </iForm-item>
        <iForm-item label="确认密码:" prop="newRePwd">
          <iInput v-model="formCustom.newRePwd" placeholder="确认密码" type="password"></iInput>
        </iForm-item>
<br>
        <iForm-item>
          <iButton type="primary" @click="handleSubmit('formCustom')" style="width:400px;">提交</iButton>
        </iForm-item>
      </iForm>
  </div>
</template>

<script>
  import iButton from 'iview/src/components/button'
  import iInput from 'iview/src/components/input'
  import iForm from 'iview/src/components/form/'
  import iFormItem from 'iview/src/components/form/form-item.vue'
  import message from 'iview/src/components/message'
  import urlConfig from '../router/url'
  export default {
    components:{iForm,iButton,iInput,iFormItem},
    data () {
        var self=this;
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (self.formCustom.newRePwd !== '') {
            // 对第二个密码框单独验证
            self.$refs.formCustom.validateField('newRePwd');
          }
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== self.formCustom.newPwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      return {
        formCustom: {
          newPwd: '',
          newRePwd: '',
          psw: '******'
        },
        ruleCustom: {
          newPwd: [
            { validator: validatePass, trigger: 'blur' },
            { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
          ],
          newRePwd: [
            { validator: validatePassCheck, trigger: 'blur' },
            { type: 'string', min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleSubmit (name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            $.post(urlConfig.get('editUser'),this.formCustom,(res)=> {
              if(res.status==0){
                //this.$store.commit('SETUSER',res.data);
                message.success('提交成功!');
              }else{
                message.error(res.msg||'修改失败');
              }
            }).catch(()=>{
              message.error(res.msg||'修改失败');
            });
          } else {
            //message.error('表单验证失败!');
          }
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  div.editBox{
    height: 500px;
    width: 500px;
    margin: 20px;
   /* transform: translate(0,50%);*/
  }
  .left img{
    float:right
  }
  .right .inputBox{
    float: left;
    height: 220px;
    width: 450px;
    padding: 44px 0px 0px 10px;
  }
  .right .inputBox > *{
    margin-bottom:20px;
  }
  .right .inputBox button{
    width:100%;
  }
</style>
