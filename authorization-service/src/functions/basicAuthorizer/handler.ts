import 'source-map-support/register';

import {APIGatewayTokenAuthorizerHandler} from 'aws-lambda';

const handler: APIGatewayTokenAuthorizerHandler = (event, _, cb) => {

  console.log('Event: ', JSON.stringify(event));

  if (event.type !== 'TOKEN') {
    return cb('Unauthorized');
  }

  try {
    const authorizationToken = event.authorizationToken;

    const encodedCreds = authorizationToken.split(' ')[1];
    const buff = Buffer.from(encodedCreds, 'base64');
    const plainCreds = buff.toString('utf-8').split(':');
    const [username, password] = plainCreds;

    console.log(`username: ${username} and password: ${password}`);

    const storedUser = process.env['USERNAME'];
    const storedUserPassword = process.env['PASSWORD'];

    const effect = storedUser === username && storedUserPassword === password ? 'Allow' : 'Deny';

    const policy = generatePolicy(encodedCreds, event.methodArn, effect);

    cb(null, policy);
  } catch (err) {
    cb(`Unauthorized: ${err.message}`);
  }
}

const generatePolicy = (principalId: string, resource: string, effect: string = 'Allow') => ({
  principalId,
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
});

export const main = handler;
