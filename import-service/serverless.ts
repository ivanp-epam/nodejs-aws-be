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
      BUCKET_NAME: "aws-rs-school-import-service"
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
      }
    ],
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {importProductsFile, importFileParser},
};

module.exports = serverlessConfiguration;
