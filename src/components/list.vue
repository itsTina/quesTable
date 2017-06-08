<template>
  <div class="searchBox">
    <div>
      <iInput placeholder="请输入相关模块	..." style="width: 300px" v-model="filters.module"></iInput>
      <iButton type="primary" icon="ios-search" @click="searchTable">搜索</iButton>
      <iButton @click="showOtherFun"><i class="ivu-icon ivu-icon-chevron-down"></i></iButton>
    <span class="fr">
      <iButton type="primary" @click="newRow">新增</iButton>
      <iButton type="primary" @click="save">保存修改</iButton>
      <a class="export ivu-btn ivu-btn-primary" :href="exportUrl"><iIcon type="ios-download-outline"></iIcon> 导出</a>
    </span>
    </div>
    <div class="otherSearchBox" v-show="showOther">
      <br>
      <div class="itemInput">提出人：<iInput placeholder="请输入..." v-model="filters.people"></iInput></div>
      <div class="itemInput">受理人：<iInput placeholder="请输入..." v-model="filters.accepter"></iInput></div>
      <div class="itemInput">日期：<iDate-picker @on-change="filterChange('reportDate',$event)" placeholder="选择日期" format="yyyy-MM-dd" type="daterange" placement="bottom-end"></iDate-picker></div>
    </div>
    <br>
  <tableCustom :columns="columns" :data="table.data" ref="table" spellcheck="false"></tableCustom>
  <div style="margin: 10px;overflow: hidden">
    <div style="float: right;">
      <iPage :total="page.total" :current="page.current" @on-change="changePage"></iPage>
    </div>
  </div>
  <br>
    <iModal
      v-model="modelShow"
      title="新增"
      @on-ok="ok"
      @on-cancel="cancel"  :width="850">
      <iForm ref="formCustom" :model="formCustom" :label-width="100" class="inputBox" >
        <iRow>
          <iCol span="12">
            <iForm-item v-for="item in underHalf" :label="item.title+':'" :prop="item.key" key="item.key" class="marginBtom2">
              <iDate-picker v-if="['reportDate','foundDate','expectedDate','realDate'].indexOf(item.key)>=0" :value="now" format="yyyy-MM-dd" @on-change="formCustom[item.key]=$event" type="date"></iDate-picker>
              <textarea v-else-if="['describe','answer','remark','expectedResult'].indexOf(item.key)>=0" v-model="formCustom[item.key]"></textarea>
              <select v-else-if="item.type=='select'" v-model="formCustom[item.key]" class="w150">
                <option :value="sItem.value" v-for="(sItem,index) in item.filters" :selected="(index==0)">{{sItem.label}}</option>
              </select>
              <iInput v-else v-model="formCustom[item.key]"></iInput>
            </iForm-item>
          </iCol>
          <iCol span="12">
            <iForm-item v-for="item in overHalf" :label="item.title+':'" :prop="item.key" key="item.key" class="marginBtom2">
              <iDate-picker v-if="['reportDate','foundDate','expectedDate','realDate'].indexOf(item.key)>=0" :value="now" format="yyyy-MM-dd" @on-change="formCustom[item.key]=$event" type="date"></iDate-picker>
              <textarea v-else-if="['describe','answer','remark','expectedResult'].indexOf(item.key)>=0" v-model="formCustom[item.key]"></textarea>
              <select v-else-if="item.type=='select'" v-model="formCustom[item.key]" class="w150">
                <option :value="sItem.value" v-for="(sItem,index) in item.filters" :selected="(index==0)">{{sItem.label}}</option>
              </select>
              <iSelect v-else-if="item.type=='inputSelect'" v-model="formCustom[item.key]" class="w150" filterable>
                <iOption :value="sItem.label" v-for="(sItem,index) in columns[13].filtersInput" :selected="(index==0)" :key="sItem.label">{{sItem.label}}</iOption>
              </iSelect>
              <iInput v-else v-model="formCustom[item.key]"></iInput>
            </iForm-item>
          </iCol>
        </iRow>
      </iForm>
    </iModal>
  </div>
</template>
<script>
  import {mapState} from 'vuex'
  import iButton from 'iview/src/components/button/'
  import iIcon from 'iview/src/components/icon/'
  import iPage from 'iview/src/components/page/'
  import iInput from 'iview/src/components/input/'
  import iForm from 'iview/src/components/form/'
  import iFormItem from 'iview/src/components/form/form-item.vue'
  import iModal from 'iview/src/components/modal/'
  import iDatePicker from 'iview/src/components/date-picker/'
  import tableCustom from 'iview/src/components/tableCustom/table.vue'
  import iRow from 'iview/src/components/grid/row'
  import iCol from 'iview/src/components/grid/col'
  import urlConfig from '../router/url'
  import message from 'iview/src/components/message'
  import iSelect from 'iview/src/components/select/select.vue'
  import iOption from 'iview/src/components/select/option.vue'

  export default {
    components:{tableCustom,iButton,iIcon,iPage,iDatePicker,iInput,iForm,iModal,iFormItem,iRow,iCol,iSelect,iOption },
    data () {
      var date=new Date();
      var m=date.getMonth()+1,d=date.getDate();
      var nowDate= date.getFullYear()+'-'+(m<10 ?('0'+m):m)+'-'+(d<10 ?('0'+d):d);

      return {
          now:nowDate,
          filters:{
            pageIndex:1,
            reportDate: '',
            product: '',
            module: '',
            hospitalName: '',
            people: '',
            accepter:'',
            needQuestion: '',
            level: '',
            resolve:''
          },
          modelShow:false,
          showOther:false,
          search:{},
          formCustom:{
            "reportDate": nowDate,
            "product": 0,
            "module": '',
            "hospitalName": 0,
            "people": '',
            "accepter":"",
            "needQuestion": '',
            "describe": '',
            "expectedResult": '',
            "level": 0,
            "foundDate": nowDate,
            "expectedDate": nowDate,
            "realDate": nowDate,
            "resolve":0,
            "remark":"",
            "answer":""
          }
        };
    },
    computed:{
      ...mapState(['table','page']),
      columns(){
        var that=this;
        return [
          {
            "title": "序号",
            "key": "index",
            "fixed": "left",
            align:'center',
            type:'info',
            "width": 40
          },
          {
            "title": "日期",
            "key": "reportDate",
            align:'center',
            "width": 100
          },
          {
            "title": "产品",
            "key": "product",
            "width": 110,
            filterMultiple: true,
            filters: [
              {
                label: 'HIS',
                value: 'HIS'
              },
              {
                label: 'CRM',
                value: 'CRM'
              },
              {
                label: 'SCM',
                value: 'SCM'
              },
              {
                label: 'MIN',
                value:  'MIN'
              },
              {
                label: 'PMS',
                value:'PMS'
              },
              {
                label: 'ARIS',
                value: 'ARIS'
              },
              {
                label: 'HBD',
                value:  'HBD'
              },
              {
                label: 'DHC',
                value: 'DHC'
              },
              {
                label: 'P',
                value: 'P'
              },
              {
                label: 'SMP',
                value: 'SMP'
              },
              {
                label: 'SDC',
                value: 'SDC'
              },
              {
                label: 'DIS',
                value: 'DIS'
              },
              {
                label: '客户端',
                value: '客户端'
              }
            ],
            filterMethod :that.filterM,
            "type":"select"
          },
          {
            "title": "相关模块",
            "key": "module",
            "width": 100
          },
          {
            "title": "院区",
            "key": "hospitalName",
            "width": 120,
            type:'select',
            filters: that.table.hospitalFilter,
            filterMultiple: true,
            filterMethod :that.filterM
          },
          {
            "title": "需求/问题",
            "key": "needQuestion",
            "width": 110,
            //"sortable": true,
            filters: [
              {
                label: '需求',
                value: '需求'
              },
              {
                label: '数据类',
                value: '数据类'
              },
              {
                label: '操作类',
                value: '操作类'
              },{
                label: 'BUG',
                value:  'BUG'
              },
              {
                label: '问题解答',
                value: '问题解答'
              },
              {
                label: '配置类',
                value:  '配置类'
              },
              {
                label: '异常现象',
                value: '异常现象'
              },
              {
                label: '网络异常',
                value:  '网络异常'
              },
              {
                label: '其他',
                value: '其他'
              }
            ],
            filterMultiple: true,
            filterMethod :that.filterM,
            "type":"select"
          },
          {
            "title": "问题描述",
            "key": "describe",
            //ellipsis:true,
            "width": 200
          },
          {
            "title": "期望结果",
            "key": "expectedResult",
            "width": 110
          },
          {
            "title": "优先级",
            "key": "level",
            "width": 100,
            type:'select',
            filters: [
              {
                label: '低',
                value:  '低'
              },
              {
                label: '高',
                value: '高'
              },
              {
                label: '中',
                value:  '中'
              }
            ],
            filterMultiple: true,
            filterMethod :that.filterM
          },
          {
            "title": "发现时间",
            "key": "foundDate",
            align:'center',
            "width": 90
          },
          {
            "title": "期望解决时间",
            "key": "expectedDate",
            align:'center',
            "width": 100
          },
          {
            "title": "实际解决时间",
            "key": "realDate",
            align:'center',
            "width": 100
          },
          {
            "title": "提出人",
            "key": "people",
            "width": 80
          },
          {
            "title": "受理人",
            "key": "accepter",
            "width": 80,
            filtersInput: that.table.accountFilter,
            type:'inputSelect'
          },
          {
            "title": "是否已解决",
            "key": "resolve",
            "width": 130,
            type:'select',
            filters: [
              {
                label: '是',
                value: '是'
              },
              {
                label: '否',
                value: '否'
              },
              {
                label: '不解决',
                value: '不解决'
              }
            ],
            filterMultiple: false,
            filterMethod:that.filterM
          },
          {
            "title": "备注",
            "key": "remark",
            "width": 150
          },
          {
            "title": "产品答复",
            "key": "answer",
            "width": 150
          }
        ]
      },
      underHalf(){
          var half=10;
          return this.columns.filter((v,i)=>{
              return i>0&&i<half
          })
      },
      overHalf(){
        var half=10;
        return this.columns.filter( (v,i)=>{return i>0&&i>=half})
      },
      exportUrl(){
          return urlConfig.get('export')+'?'+$.param(this.$store.state.filters);
      }
    },
    filters:{

    },
    methods: {
      filterM(f){
        try{
          this.filters[f.key]=f._filterChecked.length>0 ? ("'"+f._filterChecked.join("','")+"'") : '';
          //this.$store.commit('changeFilters',{name:f.key,value:"'"+f._filterChecked.join("','")+"'"});
        }catch (err){

        }
        return true;
      },
      showOtherFun(e){
          this.showOther=!this.showOther;
          var $icon=$(e.currentTarget).find('.ivu-icon');
          if($icon.hasClass('ivu-icon-chevron-down')){
            $icon.attr('class','ivu-icon ivu-icon-chevron-up')
          }else{
            $icon.attr('class','ivu-icon ivu-icon-chevron-down')
          }
        },
      changePage:function(p){
        this.$store.commit('changePage',p);
        this.$store.dispatch('reportList')
      },
      newRow(){
        this.modelShow=true;
      },
      cancel(){},
      ok(){
          debugger
          $.post(urlConfig.get('reportSave'),this.formCustom,(re)=>{
            if(re.status==0){
              message.success('保存成功');
              location.reload()
            }else{
              message.error(re.msg||'保存失败');
            }
          },'json').catch(()=>{
            message.error('保存失败');
          })
      },
      searchTable(){
        this.filters.pageIndex=1;
        this.$store.commit('changePage',1);
        this.$store.commit('changeFilters', this.filters);
        //this.$store.commit('changeFilters',{name:'pageIndex',value:1});
        this.$store.dispatch('reportList');
      },
      save(){
        var data= {reportInfos:this.table.data};
        $.ajax({
          type:'post',
          url:urlConfig.get('reportEdit'),
          contentType:'application/json',
          data:JSON.stringify(data),
          dataType:'json',
          success:(re)=>{
            if(re.status==0){
              message.success('保存成功');
            }else{
              message.error(re.msg||'保存失败');
            }
          }});
      },
      filterChange(name,e){
        this.filters[name]=(typeof e=='string')?e:(e.join(",")==','?'':e.join(","));
        //this.$store.commit('changeFilters',{name:name,value:(typeof e=='string')?e:(e.join(",")==','?'':e.join(","))});
      }
    },
    created(){
      this.$store.dispatch('reportList');
    }
  }
</script>
<style>
  .w150{
    width:150px;
  }
  div.searchBox{
    padding:5px 10px;
  }

  .fr{
    float:right;
    margin-right:10px;
  }
  .fr button{
    margin-left:10px;
  }
  div.itemInput{
    width:250px;
    display:inline-block;
  }
  div.itemInput >div{
    width:200px;
    display:inline-block;
  }
  div.marginBtom2 {
    margin-bottom: 2px;
  }
  div.ivu-modal-header{
    padding:5px 16px;
  }
  select{
    border-color: #d7dde4;
    border-radius: 3px;
    padding: 1px;
    height: 28px;
  }
  .ivu-form-item-content select{
    width:100%;
  }
  .ivu-form-item-content textarea{
    border-color: #d7dde4;
    border-radius: 3px;
    width: 100%;
    height: 50px;
    line-height: 15px;
    resize:none;
  }
  body{
    min-width:800px;
  }
</style>
