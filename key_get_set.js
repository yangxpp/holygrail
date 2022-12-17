var redis = require("redis");
const client = redis.createClient();

client.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
    await client.connect();

    await client.mSet(['key1', 'value1', 'key2', "value2"]);
    const [v1, v2] = await client.mGet(['key1', 'key2']);
    console.log(v1, v2);
    await client.disconnect();
})();