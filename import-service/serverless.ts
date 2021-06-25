import type {AWS} from '@serverless/typescript';

import {importProductsFile, importFileParser} from '@functions/index';

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      BUCKET_NAME: "aws-rs-school-import-service",
      SQS_QUEUE_NAME: "sqs_csv_products_queues",
      SQS_URL: {
        Ref: "catalogItemsQueue"
      },
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:CopyObject"
        ],
        Resource: "arn:aws:s3:::${self:provider.environment.BUCKET_NAME}"
      },
      {
        Effect: "Allow",
        Action: [
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:GetObject",
          "s3:CopyObject"
        ],
        Resource: "arn:aws:s3:::${self:provider.environment.BUCKET_NAME}/*"
      },
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: [
          {
            "Fn::GetAtt": ["catalogItemsQueue", "Arn"]
          }
        ]
      },
    ],
    lambdaHashingVersion: '20201221',
  },
  resources: {
    Resources: {
      catalogItemsQueue: {
        Type: "AWS::SQS::Queue",
        Properties: {
          QueueName: "${self:provider.environment.SQS_QUEUE_NAME}"
        }
      },
      GatewayResponseDefault4XX: {
        Type: 'AWS::ApiGateway::GatewayResponse',
        Properties: {
          ResponseParameters: {
            'gatewayresponse.header.Access-Control-Allow-Origin': "'*'",
            'gatewayresponse.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            'gatewayresponse.header.Access-Control-Allow-Methods': "'OPTIONS'"
          },
          ResponseType: 'DEFAULT_4XX',
          RestApiId: {
            Ref: 'ApiGatewayRestApi'
          }
        }
      }
    },
    Outputs: {
      SqsUrl: {
        Value: {
          Ref: "catalogItemsQueue"
        }
      },
      SqsArn: {
        Value: {
          "Fn::GetAtt": [
            "catalogItemsQueue",
            "Arn"
          ]
        }
      }
    }
  },
  // import the function via paths
  functions: {importProductsFile, importFileParser},
};

module.exports = serverlessConfiguration;
