import Vue from 'vue'
import Router from 'vue-router'
/*import table from '@/components/list'
import account from '@/components/account'
import editUser from '@/components/editUser'
import hospital from '@/components/hospital'*/
Vue.use(Router);
var ro= [
    {
      path: '/',
      name: '问题反馈',
      component:resolve=>require(['@/components/list'],resolve)//table//
    },
    {
      path: '/editUser',
      name: '修改密码',
      component:resolve=>require(['@/components/editUser'],resolve)//editUser//
    }
  ]
;
/**/if('admin'==($('#loginId').val())){
  ro.push({
      path: '/hospital',
      name: '院区设置',
      component:resolve=>require(['@/components/hospital'],resolve)//hospital//
    },{
    path: '/account',
      name: '开户',
      component:resolve=>require(['@/components/account'],resolve)//account//
  });
}
var route=new Router({
  routes:ro
});

export default route;
