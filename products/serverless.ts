import type {AWS} from '@serverless/typescript';

import {getProductList, getProductById, addProduct, catalogBatchProcess} from '@functions/index';

const serverlessConfiguration: AWS = {
  useDotenv: true,
  service: 'products',
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-webpack', 'serverless-offline', 'serverless-dotenv-plugin'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'eu-west-1',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      DB_HOST: "${env:DB_HOST}",
      DB_PORT: "5432",
      DB_DATABASE: "${env:DB_DATABASE}",
      DB_USERNAME: "${env:DB_USER}",
      DB_PASSWORD: "${env:DB_PASSWORD}",
      SNS_ARN: {
        Ref: "createProductTopic",
      },
      SNS_TOPIC_NAME: "new-product-notification",
      EMAIL_ONE: "${file(./secret.json):EMAIL_ONE}",
      EMAIL_TWO: "${file(./secret.json):EMAIL_TWO}",
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "sqs:*",
        Resource: "${cf:import-service-dev.SqsArn}",
      },
      {
        Effect: "Allow",
        Action: "sns:*",
        Resource: {
          Ref: "createProductTopic",
        },
      },
    ],
  },
  resources: {
    Resources: {
      createProductTopic: {
        Type: "AWS::SNS::Topic",
        Properties: {
          TopicName: "${self:provider.environment.SNS_TOPIC_NAME}",
        },
      },
      SNSSubscriptionRandomStatus1: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "${self:provider.environment.EMAIL_ONE}",
          Protocol: "email",
          TopicArn: {
            Ref: "createProductTopic",
          },
          FilterPolicy: {
            randomStatus: ["1"],
          },
        },
      },
      SNSSubscriptionRandomStatus2: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: "${self:provider.environment.EMAIL_TWO}",
          Protocol: "email",
          TopicArn: {
            Ref: "createProductTopic",
          },
          FilterPolicy: {
            randomStatus: ["2"],
          },
        },
      },
    },
  },
  // import the function via paths
  functions: {getProductList, getProductById, addProduct, catalogBatchProcess},
};

module.exports = serverlessConfiguration;
