<template>
  <div>
    <div>
      <br>
      <iButton  class="fr" type="primary" @click="newUser">新增院区</iButton>
      <br>
    </div>
    <br>
    <tableCustom :columns="columns" :data="hospital" @deleteUser="confirm"></tableCustom>
    <iModal
      v-model="modelShow"
      title="新增"
      @on-ok="ok" :loading="modalLoading"
      @on-cancel="cancel">
      <iForm ref="formCustom" :model="formCustom" :rules="ruleCustom" :label-width="100" class="inputBox">
        <iForm-item label="编码:" prop="hospitalCode">
          <iInput v-model="formCustom.hospitalCode" :maxlength="16" placeholder="只能输入数字或字母"></iInput>
        </iForm-item>
        <iForm-item label="院区:" prop="hospitalName">
          <iInput v-model="formCustom.hospitalName"></iInput>
        </iForm-item>
      </iForm>
    </iModal>
  </div>
</template>
<script>
  import iButton from 'iview/src/components/button'
  import iInput from 'iview/src/components/input'
  import iForm from 'iview/src/components/form/'
  import iFormItem from 'iview/src/components/form/form-item.vue'
  import iModal from 'iview/src/components/modal'
  import tableCustom from 'iview/src/components/tableCustom/table.vue'
  import message from 'iview/src/components/message'
  import urlConfig from '../router/url'
  import {mapState} from 'vuex'
  export default {
      components:{tableCustom,iButton,iInput,iForm,iModal,iFormItem},
    data () {
      return {
        modalLoading:true,
        formCustom: {
          hospitalName: '',
          hospitalCode: ''
        },
        ruleCustom: {
          hospitalCode: [
            { pattern:/^[A-Za-z0-9]+$/, required: true, message: '请输入编码', trigger: 'blur'}
          ],
          hospitalName: [
            { type: 'string', required: true, message: '请输入院区', trigger: 'blur'}
          ]
        },
        modelShow:false,
        columns: [
          {
            title: '编码',
            align:'center',
            key: 'hospitalCode',
            type:'info'
          },
          {
            title: '院区',
            key: 'hospitalName',
            type:'info'
          },

          {
            title: '操作',
            key: 'action',
            width:200,
            type:'delete',
            align: 'center'
          }
        ]
      }
    },
    computed:{
      ...mapState(['hospital'])
    },
    methods:{
      newUser(){
        this.modelShow=true;
      },
      ok(){
        this.modalLoading=true;
        this.$refs['formCustom'].validate((valid)=>{
              if(valid){
                $.post(urlConfig.get('hospitalSave'),this.formCustom,(re)=>{
                  this.modelShow=false;
                  if(re.status==0){
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
      confirm (Id) {
        iModal.confirm({
          title: '删除',
          content: '<p>确认删除吗？</p>',
          onOk: () => {
              $.post(urlConfig.get('hospitalDelete'),{hospitalId: Id},(re)=>{
                var index= this.hospital.findIndex((v)=>{
                  return v.hospitalId==Id;
                })
                if(index){
                  this.hospital.splice(index,1);
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
