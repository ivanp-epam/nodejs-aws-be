import {handlerPath} from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        path: "import",
        method: "get",
        cors: true,
        request: {
          parameters: {
            querystrings: {
              name: true
            }
          }
        },
        authorizer: {
          name: 'basicAuthorizer',
          arn: 'arn:aws:lambda:eu-west-1:343004150536:function:authorization-service-dev-basicAuthorizer',
          resultTtlInSeconds: 0,
          identitySource: 'method.request.header.Authorization',
          type: 'token',
        },
      }
    }
  ]
}
