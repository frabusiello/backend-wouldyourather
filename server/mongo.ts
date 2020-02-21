import { MongoClient, Db } from "mongodb";
import config from "./config";

// const client = new MongoClient(config.mongo.host);

// export default async function() {
//     await client.connect();
//     return client.db();
// }

export default async function() {
    const connection = await MongoClient.connect(config.mongo.host, {
        poolSize: 100
    });
    return connection.db("wouldyourather");
}
