const jwt = require('jsonwebtoken');
const auth_users = require('./auth_users');

const buildIAMPolicy = (userId, effect, resource, context) => {
    const policy = {
      principalId: userId,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource,
          },
        ],
      },
      context,
    };
  
    return policy;
};
  
/**
  * Authorizer functions are executed before your actual functions.
  * @method authorize
  * @param {String} event.authorizationToken - JWT
  * @throws Returns 401 if the token is invalid or has expired.
  * @throws Returns 403 if the token does not have sufficient permissions.
  */
module.exports.handler = (event, context, callback) => {
  const token = event.authorizationToken;
  const auth_mode = process.env.auth_mode || "role";
  
  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sub = JSON.parse(decoded.sub);
    const user = sub.uid;
    const authorizerContext = { user: JSON.stringify(user) };

    let policyDocument = null;
    
    const valid_affiliations = process.env.affiliations ? process.env.affiliations.split(",") : ["staff"];

    if((auth_mode==="role" && valid_affiliations.indexOf(sub.eduPersonPrimaryAffiliation)===-1) || (auth_mode==="user" && auth_users.indexOf(user)===-1)){
      policyDocument = buildIAMPolicy(user, "Deny", event.methodArn, authorizerContext);
      callback(null, policyDocument);
    }

    // Return an IAM policy document for the current endpoint
    policyDocument = buildIAMPolicy(user, "Allow", event.methodArn, authorizerContext);
    callback(null, policyDocument);
    console.log("User " + user + "allowed.")

    
  } catch (e) {
    callback(e); // Return a 401 Unauthorized response
  }
}; 