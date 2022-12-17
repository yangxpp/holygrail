const express = require('express');
const app = express();
const redis = require('redis');
const client = redis.createClient();

client.on('error', err => console.log('Redis Client Error ', err));

(async () => {
    await client.connect();

    await client.mSet(['header','0','nav','0','left','0','article','0','right','0','footer','0']);
    
    let initialValues = await client.mGet(['header','nav','left','article','right','footer']);
    console.log(initialValues.join(' '));

    // await client.disconnect();
})();

async function data() {
    return new Promise(async (resolve,reject) => {
        try {
            let values = await client.mGet(['header','nav','left','article','right','footer']);
            let data = {
                'header': Number(values[0]),
                'nav': Number(values[1]),
                'left': Number(values[2]),
                'article': Number(values[3]),
                'right': Number(values[4]),
                'footer': Number(values[5])
            };
            resolve(data);
        } catch (e) {
            reject(e);
        }
    });
}

// serve static files from public directory
app.use(express.static('public'));

app.get('/', (req,res) => {
    res.send('Hello World!');
});

app.get('/data', async (req,res) => {
    try {
        let message = await data();
        console.log(message);
        res.send(message);
    } catch (e) {
        throw new Error(e);
    }
});

app.get('/update/:key/:value', async (req,res) => {
    const key = req.params.key;
    let value = Number(req.params.value);

    let oldValue = Number(await client.get(key));
    // new value
    await client.set(key, oldValue+value);

    try {
        let message = await data();
        console.log(message);
        res.send(message);
    }
    catch (e) {
        throw new Error(e);
    }
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
});
