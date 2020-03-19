const AWS = require("aws-sdk");
const workspaces = new AWS.WorkSpaces({apiVersion: '2015-04-08'});

let params = {
  Workspaces: [ 
    {
      BundleId: process.env.bundle_id, 
      DirectoryId: process.env.directory_id,
      UserName: "",
      Tags: [
        {
          Key: 'ci',
          Value: process.env.ci
        },
        {
          Key: 'UOCEnv',
          Value: process.env.UOCEnv
        },
        {
          Key: 'Name',
          Value: process.env.Name
        },
        {
          Key: 'Departament',
          Value: process.env.Departament
        },
      ],
      WorkspaceProperties: {
        ComputeTypeName: process.env.ComputeTypeName || 'VALUE',
        RootVolumeSizeGib: 80,
        RunningMode: process.env.RunningMode || 'AUTO_STOP',
        RunningModeAutoStopTimeoutInMinutes: 60,
        UserVolumeSizeGib: 10
      }
    }
  ]
};

params.Workspaces.forEach(function(v){ 
  if(v.WorkspaceProperties.RunningMode==="ALWAYS_ON"){
    delete v.WorkspaceProperties.RunningModeAutoStopTimeoutInMinutes; 
  }
});

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

  let setup = JSON.parse(JSON.stringify(params));
  setup.Workspaces[0].UserName = user;
  setup.Workspaces[0].Tags.push({"Key":"uid","Value":user});
  
  workspaces.createWorkspaces(setup, function(err, data) {
    if(err!==null){done(err, err.message);} 
    else{done(null, data);}
  });

};