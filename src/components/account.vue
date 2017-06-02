<template>
  <div>
    <div>
      <br>
      <iButton  class="fr" type="primary" @click="newUser">新增开户</iButton>
      <br>
    </div>
    <br>
    <tableCustom :columns="columns" :data="account" @deleteUser="confirm"></tableCustom>
    <iModal
      v-model="modelShow"
      title="新增"
      @on-ok="ok" :loading="modalLoading"
      @on-cancel="cancel">
      <iForm ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100" class="inputBox">
        <iForm-item label="ID:" prop="loginId">
          <iInput v-model="formCustom.loginId"></iInput>
        </iForm-item>
        <iForm-item label="姓名:" prop="userName">
          <iInput v-model="formCustom.userName"></iInput>
        </iForm-item>
      </iForm>
    </iModal>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import iButton from 'iview/src/components/button'
  import iInput from 'iview/src/components/input'
  import iForm from 'iview/src/components/form/'
  import iFormItem from 'iview/src/components/form/form-item.vue'
  import iModal from 'iview/src/components/modal'
  import tableCustom from 'iview/src/components/tableCustom/table.vue'
  import message from 'iview/src/components/message'
  import urlConfig from '../router/url'
  export default {
    components:{tableCustom,iButton,iInput,iForm,iModal,iFormItem},
    computed:{
          ...mapState(['account'])
    },
    data () {
      return {
        modalLoading:true,
        formCustom: {
          loginId: '',
          userName: ''
        },
        ruleCustom: {
          loginId: [
            { type: 'string', required: true, message: '请输入ID', trigger: 'blur'}//,
            //{ type: 'string', min: 6, message: '长度不能小于6位', trigger: 'blur' }
          ],
          userName: [
            { type: 'string', required: true, message: '请输入姓名', trigger: 'blur'}//,
            //{ type: 'string', min: 6, message: '长度不能小于6位', trigger: 'blur' }
          ]
        },
        modelShow:false,
        columns: [
          {
            title: 'ID',
            align:'center',
           // fixed:'left',
            key: 'loginId',
            type:'info'
          },
          {
            title: '姓名',
            key: 'userName',
            type:'info'
          },

          {
            title: '操作',
            key: 'action',
            width:200,
            type:'delete',
            align: 'center'
          }
        ],
        data: []
      }
    },
    methods:{
      newUser(){
        this.modelShow=true;
      },
      ok(){
          var that=this;
        this.modalLoading=true;
        this.$refs['formCustom'].validate((valid)=>{
              if(valid){
                $.post(urlConfig.get('userSave'),this.formCustom,(re)=>{
                  that.modelShow=false;
                  if(re.status==0){
                    //that.data.push(that.formCustom);
                    iModal.remove();
                    message.success('新增成功');
                    location.reload()
                  }else{
                    message.error(re.msg||'新增失败');
                    this.modalLoading=false;
                  }
                },'json').catch( (err)=> {
                  message.error('新增失败');
                  this.modalLoading=false;
                });
              }else{
                this.modalLoading=false;
              }
          })

      },
      cancel(){
        this.modalLoading=false;
        this.modelShow=false;
      },
      confirm (userId) {
        var that=this;
        iModal.confirm({
          title: '删除',
          content: '<p>确认删除吗？</p>',
          onOk: () => {
              $.post(urlConfig.get('userDelete'),{userId: userId},(re)=>{
                var index= that.account.findIndex((v)=>{
                    return v.userId==userId;})
                if(index){
                    that.account.splice(index,1);
                }
                message.info('删除成功');
              }).catch((re)=>{
                message.info('删除失败');
              })

          },
          onCancel: () => {

          }
        });
      },
    },
    created(){

    }
  }
</script>
