import {AWSError, SQS} from "aws-sdk";
import {SendMessageResult} from "aws-sdk/clients/sqs";

export const sendProductToQueue = (sqs: SQS, product) => {

  console.debug(`Adding product to the queue: ${JSON.stringify(product)}`)

  sqs.sendMessage(
    {
      QueueUrl: process.env.SQS_URL,
      MessageBody: JSON.stringify(product),
    },
    (error: AWSError, data: SendMessageResult) => {
      if (error) {
        console.error(error);
        return;
      }
      console.log(`Product ${JSON.stringify(product)} is successfully sent to the queue: ${JSON.stringify(data)}`);
    }
  );
}
