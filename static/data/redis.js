/**
 * Created by mating on 2017/5/3.
 */

var redisExports={
  client:null,
  users:[]
};

redisExports.signin = function(req, res,next){
  var params=req.body;
  var username = params.name;
  var password = params.password;
  var callback=function(user){
    if(user){
      //成功获取用户对象
      req.session.regenerate(function(){
        req.user = user;
        req.session.user = user.name;
        if(req.body.auto == 'false' ){//非自动登陆,保存24h
          req.session.cookie.maxAge=1000*3600*24;
        }
        req.session.save();  //保存一下修改后的Session

        res.send({status:0, data:user});
      });
    }
    else{
      //用户信息不符合，登陆失败
      res.send({status:1,msg:'用户名或密码错误'});
    }
  }
  //查找用户信息，看是否满足登陆条件
  redisExports.getUserByAttr(username,'psw', password,callback);

}

redisExports.signout = function(req, res){
  req.session.user=null;
  req.session.destroy();

  res.redirect('/login');

}

redisExports.persist = function(req, res, next){
  /*console.log('enter url:'+req.url);
  if(!req.session || !req.session.user) {
    res.redirect('/login');
  }else{
   next();
  }*/
  next()
}
//获取用户信息
redisExports.getinfo = function (req, res , next) {
  if( req.session.user) {
    redisExports.getUserByName(req.session.user, function(user){
      res.send({status:user?0:1,data:user});
    })
  }else{
    res.send({status:1,data:null});
  }
}
//修改用户密码
redisExports.editinfo = function (req, res , next) {
  if( req.session.user) {//todo: 修改密码
    redisExports.setUser(req.session.user,req.body.passwd, function(user){
      res.send({status:0,data:user});
    })
  }else{
    res.send({status:1,data:null});
  }
}
redisExports.setUser=function(name,psw,callback){
  var self=this;
  self.getUserByName(name, function(user){
    user.psw=psw;
    self.client.hmset("user:"+name,user,function(err,obj){
      if(obj=='OK'){
        callback({name:user.name,id:user.id});
      }
    });
  })
};
redisExports.setAll=function(){
  var self=this;
  var user=this.users;
  var callback=function(err){
    console.log(new Date().getMilliseconds())
    console.log(err);
  }
  console.log('start:'+new Date().getMilliseconds())
  this.client.hmset("user:mating",{"name":"mating","psw":"123456","id":"11111"},callback);

  this.client.hmset("user:wangyang",{"name":"wangyang","psw":"123456","id":"55555555"},callback);

  this.client.hmset("user:wanghaojun",{"name":"wanghaojun","psw":"123456","id":"3333333"},callback);

  this.client.hmset("user:tangxu",{"name":"tangxu","psw":"123456","id":"444444444"},function(){
  });

}

redisExports.getUserByName=function(name,callback){
  //this.client.hmget(name+' name', callback);
  this.client.hgetall('user:'+name, function(err,obj){
    if(obj){
      callback({
        name:obj.name,
        id:obj.id
      });
    }
  });
}
redisExports.getUserByAttr=function(name,attrName,attrVal,callback){
  this.client.hgetall("user:"+name, function(err,obj){
    if(obj[attrName]==attrVal){
      callback({id:obj.id,name:obj.name});
    }else{
      callback(null);
    }
  });
}


redisExports.getAll=function(){
  var callback=function(err, keys){
    console.log(keys)
  }
  this.client.keys('user:*', callback)
}

module.exports = function(client){
  redisExports.client=client;
  //redisExports.setAll()
  return redisExports;
}
