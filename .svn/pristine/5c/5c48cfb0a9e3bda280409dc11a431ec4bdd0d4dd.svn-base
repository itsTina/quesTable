/**
 * Created by mating on 2017/4/27.
 */
$(function(){
  var formValid=$('form.inputBox').validate();
  $.validator.messages=$.extend($.validator.messages,{
    required: function(show,el){
      return $(el).attr('placeholder')||'请输入';
    }
  });
  $('form').on('submit',function (ev) {
    if(formValid && formValid.form()){
      return true;
      /*$.post('/loginIn',{
        name:$('input[name=user]').val(),
        password:$('input[name=password]').val(),
        auto:$('input[name=auto]').is(':checked')
      },function(res){
        if(res.status==0){
          location.href = location.origin+'/#/';
        }else{
          alert(res.msg);
        }
      }).catch(function (err) {
        alert('登陆失败');
      })*/
    }
    return false;
  })
})
