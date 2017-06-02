/**
 * Created by mating on 2017/4/24.
 */
var config = {
  api_url:'/',
  /*api 字典*/
  url_map:{
    login:'/login'
  },
  getUrl:function(urlName){
    return this.api_url+ this[urlName]||'';
  }
};
export default config;
