const AWS = require("aws-sdk");
const workspaces = new AWS.WorkSpaces({apiVersion: '2015-04-08'});

module.exports.handler = (event, context, callback) => {

  const done = (err, res) => callback(null, {
      statusCode: err ? '400' : '200',
      body: err ? err.message : JSON.stringify(res),
      headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Credentials' : true
      }    
  }); 

  let user = null;
  if(event.requestContext && event.requestContext.authorizer && event.requestContext.authorizer.user){
      user = JSON.parse(event.requestContext.authorizer.user);
  }   

  if(!user){
      done("{message:'unauthorized'}");
      return;
  }

  let setup = {
    DirectoryId: process.env.directory_id,
    UserName: user
  };

  workspaces.describeWorkspaces(setup, function(err, data) {
    
    if (err){
      console.log('error: ' + err.message);
      done(err, err.message);
      
    }else{done(null, data);}
  });

};