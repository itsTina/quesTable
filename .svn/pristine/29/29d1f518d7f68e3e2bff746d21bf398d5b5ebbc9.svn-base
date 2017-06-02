//设置Cookie的方法集合
var Cookie = {
  add:function(name,value,expiresDays=7){
    var cookieString=name+"="+escape(value);
      var date=new Date();
      date.setTime(date.getTime()+expiresDays *24*3600*1000);
      cookieString=cookieString+";expires=" + date.toUTCString();

    document.cookie=cookieString;
  },
  edit:function(name,value,expiresDays=7){
    var cookieString=name+"="+escape(value);

    var date=new Date();
    date.setTime(date.getTime()+expiresDays*24*3600*1000); //单位是毫秒
    cookieString=cookieString+";expires=" + date.toGMTString();
    document.cookie=cookieString;
  },
  get: function(name) {
    var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
    if (arr) {
      return window.unescape(arr[2]);
    }
    return '';
  }
};

export default function getCookie() {
  return Cookie;
}
