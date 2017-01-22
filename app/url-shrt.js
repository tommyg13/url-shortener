module.exports=function(app,db){
    app.get("/:url",function(req,res){
    var url =  process.env.URL + req.params.url;
    shorten(url,db,res);
  });
  
  
   app.get('/:url*',function(req,res){
   var url = req.url.slice(1);
    var random = Math.floor(Math.random()*900)+1000;
    var regex=/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    if(url.match(regex)){
    var obj = {};
   
      obj = {
        "original_url": url,
        "shorten-url":process.env.URL+random
      };
      res.send(obj);
      store(obj,db);
    }
    else {
      res.send("error: not valid url format");
    }
  });
  
  function store(myObj,db){
   db.collection("sites").save(myObj,function(err,result){
     if (err){
       throw err;
     }
     else {
       console.log(result);
     }
   });
  }
  function shorten(link,db,res){
    db.collection("sites").findOne({
      "shorten-url": link
    },function(err,result){
    if(err){
      throw err;
    } 
    if(result){
     res.redirect(result.original_url);
      
    }
    else {
     res.send("error: url not in database,please check again the url");
    }
  });
  }
  
  
};