module.exports=function(app,db){
    app.get("/:url",function(req,res){
    var url =  process.env.URL + req.params.url;
    shorten(url,db,res);
  });
  
  
   app.get('/:url*',function(req,res){
   var url = req.url.slice(1);
    var random = Math.floor(Math.random()*900)+1000;
    // Regex from https://gist.github.com/dperini/729294
    var regex = /^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
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