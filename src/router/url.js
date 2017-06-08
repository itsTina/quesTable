/**
 * Created by mating on 2017/5/22.
 */
export default {
  base:'/',//http://10.1.18.143:8183/requirement/',http://10.1.18.145:8183
  request:{
    userSave:'userSave.do',
    account:'userList.do',
    export:'exportReport.do',
    userDelete:'userDelete.do',
    editUser:'userChangePwd.do',
    logout:'logout.do',
    reportList:'reportList.do',
    reportEdit:'reportEdit.do',
    reportSave:'reportSave.do',
    hospitalList:'hospitalList.do',
    hospitalSave:'hospitalSave.do',
    hospitalDelete:'hospitalDelete.do'
  },
  get(name){
    return this.base + this.request[name]||'';
  }
}
