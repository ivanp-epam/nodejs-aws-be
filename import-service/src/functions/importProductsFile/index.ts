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
        }
      }
    }
  ]
}
