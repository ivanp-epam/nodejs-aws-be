import * as aws from "aws-sdk";
import {CopyObjectRequest, DeleteObjectRequest} from "aws-sdk/clients/s3";
import csvParser from "csv-parser";
import {sendProductToQueue} from "@services/sqs";

const BUCKET_NAME = 'aws-rs-school-import-service';
const UPLOADED_FOLDER = 'uploaded';
const PARSED_FOLDER = 'parsed';

export type S3Params = {
  Bucket: string,
  Key: string
};

type S3ParamsForUrls = S3Params & {
  Expires: number,
  ContentType?: string
};

export type S3MoveParams = {
  Bucket: string,
  From: string,
  To: string
};

export const getURLForUpload = async (fileName: string) => {
  if (!fileName.length) {
    throw new Error("Empty string is provided");
  }

  const params: S3ParamsForUrls = {
    Bucket: BUCKET_NAME,
    Key: `uploaded/${fileName}`,
    Expires: 30
  };

  const s3 = new aws.S3({signatureVersion: "v4"});

  return s3.getSignedUrlPromise("putObject", params);
};


export const move = async (s3CopyParams: S3MoveParams): Promise<any> => {
  console.debug('move');
  console.debug(s3CopyParams);
  const s3 = new aws.S3();

  const copyObjectRequest: CopyObjectRequest = {
    Bucket: s3CopyParams.Bucket,
    CopySource: `/${s3CopyParams.Bucket}/${s3CopyParams.From}`,
    Key: s3CopyParams.To
  };

  console.debug('copyObjectRequest');
  console.debug(copyObjectRequest);

  await s3.copyObject(copyObjectRequest).promise();
  const deleteParams: DeleteObjectRequest = {
    Bucket: s3CopyParams.Bucket,
    Key: s3CopyParams.From
  };
  console.debug('deleteParams');
  console.debug(deleteParams);

  return s3.deleteObject(deleteParams).promise();
}

export const parseCsvFromBucket = async (s3Params: S3Params): Promise<any> => {
  console.debug('parseCsvFromBucket');
  console.debug(s3Params);
  const s3 = new aws.S3();
  const parsedRows = [];
  const sqs = new aws.SQS();

  const stream = s3.getObject(s3Params).createReadStream().pipe(csvParser()).on('data', (row) => {
    sendProductToQueue(sqs, row);
  });

  return new Promise((resolve, reject) => {
    stream.on('end', () => {
      console.debug(`${s3Params.Key} has parsed`);
      console.debug(parsedRows);
      resolve(parsedRows);
    });

    stream.on('error', (error) => {
      console.debug(error);
      reject(error);
    });
  });
};

export const parseCsvFromBucketAndMove = async (s3Params: S3Params): Promise<any> => {
  console.debug('parseCsvFromBucketAndMove');
  console.debug(s3Params);
  await parseCsvFromBucket(s3Params);
  const to = s3Params.Key.toString().replace(new RegExp('^' + UPLOADED_FOLDER + '\/'), PARSED_FOLDER + '/');
  return move({
    Bucket: s3Params.Bucket,
    From: s3Params.Key,
    To: to
  });
};
