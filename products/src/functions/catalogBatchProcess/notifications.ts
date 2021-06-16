import {SNS} from 'aws-sdk';

const randomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}


export const sendMessage = async (subject, message) => {
  const random = randomInt(1, 3); // range between 1 and 2

  message += `
    Random number is: ${random}
  `;

  console.log(`Trying to send message:
    subject: ${subject}
    body: ${message}`);

  const sns = new SNS({region: process.env.REGION});

  try {
    await sns.publish({
      Subject: subject,
      Message: message,
      TargetArn: process.env.SNS_ARN,
      MessageAttributes: {
        randomStatus: {
          DataType: 'String',
          StringValue: `${random}`
        }
      }
    }).promise();

    console.log(`Has sent message:
      subject: ${subject}
      body: ${message}`);
  } catch (err) {
    console.log(`Failed to send message:
      subject: ${subject}
      body: ${message}`);

    console.error(err);

    throw err;
  }
};
