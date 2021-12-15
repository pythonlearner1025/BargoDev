import {MongoClient} from "mongodb";


const client = new MongoClient(process.env.DATABSE_URL, {
    useNewUrlParser: true,
    useUnifiedToplogy: true,
})


async function connect(){
    if (!client.isConnected()) await client.connect();
    const db = client.db('cluster0');
    return {db, client};
}

export {connect};