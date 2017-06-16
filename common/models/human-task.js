'use strict';
var request = require('request');

module.exports = function(Humantask) {
  Humantask.complete = function(id,completedBy,cb){
    this.findById(id,{include:"taskType"},function(err,obj){
      obj.completedBy = completedBy;
      var o = obj.toJSON()
      var keyName = "proc:" + o.taskType.completeOperationName;
      var keyNamespace = o.taskType.completeOperationNamespace;
      var targetUrl = o.taskType.completeUrl;
      obj.save(null,function(err,savedObj){
        var post_data = {
          "proc":{
            "@xmlns":{
              "proc":keyNamespace,
              "dat":"http:\/\/workforce.everteam.com\/Datatypes"
            },
            "dat:parentId":{"$":savedObj.parentId},
            "dat:taskId":{"$":savedObj.id},
            "dat:humanTaskId":{"$":savedObj.workflowId},
            "dat:completedBy":{"$":savedObj.completedBy}
          }
        }
        Object.defineProperty(post_data,keyName,Object.getOwnPropertyDescriptor(post_data,"proc"));
        delete post_data["proc"];
        var post_options = {
          headers: {
            'Content-Type':'application/json/badgerfish'
          },
          method: 'post',
          body: JSON.stringify(post_data),
          url: targetUrl
        }
        request(post_options,function(err,res,body){
          if(err){
            console.error(err);
            throw err;
          }
          console.log(body);
          cb(null,savedObj);
        })
      })
    });
  }

  Humantask.remoteMethod('complete',{
    http:{
      path:'/:id/complete',
      verb:'post'
    },
    accepts: [
      {arg: 'id',type:'string','http':{source:'path'}},
      {arg: 'completedBy',type:'string'},

    ],
    returns: {arg: 'data',type:'HumanTask', root:true}
  });
};
