import MongoClient from "mongodb";
import config from "./config";

class Db {
    constructor() {
        MongoClient.connect(
            config.mongo.host,
            {
                poolSize: 100
            },
            (err, client) => {
                if (err) {
                    throw new Error(`Cannot connect to mongodb ${err}`);
                } else {
                    this.db = client.db("wouldyourather");
                }
            }
        );
    }
}

const db = new Db();

export default db;
