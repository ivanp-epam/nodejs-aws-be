import type {AWS} from '@serverless/typescript';

import {getProductList, getProductById, addProduct} from '@functions/index';

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
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {getProductList, getProductById, addProduct},
};

module.exports = serverlessConfiguration;
