const StreamrClient = require("streamr-client")
require('dotenv').config()

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const STREAMR_GERMANY = '0x31546eEA76F2B2b3C5cC06B1c93601dc35c9D916';

const client = new StreamrClient({
    auth: {
        privateKey: PRIVATE_KEY
    }
})

async function main(){
    let count;
    const streamProps = {
        "id": "/test",
        "name": "test",
        "description": "test description",
        "config": {
        "fields": [{
        "hello": "string",
        }]
        },
        "partitions": 1,
        "requireSignedData": false,
        "requireEncryptedData": false,
        "autoConfigure": true,
        "storageDays": 0,
        "inactivityThresholdHours": 48
    }
    //Create and/or get stream
    const stream = await client.getOrCreateStream(streamProps);
    await stream.addToStorageNode(STREAMR_GERMANY);
    //Subscribe to stream
    client.subscribe({
        stream: stream.id,
        resend: {
            //Return the last 20 items sent (if storage is on)
            last: 20,
        },
    }),
    (data) => {
        console.log(count+": "+data);
        count++;
    }
    const publishData = () => {
        //Create a random number
        const data = Math.random();
        //Publish to stream
        client.publish(stream.id, {data})
    }
    //Publish random number to stream every 10 seconds
    setInterval(publishData, 10000);
}

main();