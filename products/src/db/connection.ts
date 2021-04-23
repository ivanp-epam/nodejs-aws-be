import {Client} from 'pg';

const {DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD} = process.env;

export class Connection {

  public async connect():Promise<Client> {
    const client = new Client({
      host: DB_HOST,
      port: +DB_PORT,
      database: DB_DATABASE,
      user: DB_USERNAME,
      password: DB_PASSWORD,
      ssl: {
        rejectUnauthorized: false // to avoid warring in this example
      },
      connectionTimeoutMillis: 5000 // time in millisecond for termination of the database query
    })
    await client.connect();
    return Promise.resolve(client)
  }
}

