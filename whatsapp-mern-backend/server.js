import express from 'express';
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Pusher from 'pusher';
import cors from 'cors';
import * as dotenv from 'dotenv'

// app config
dotenv.config()
const app = express()
const port = process.env.PORT || 9000

// pusher config
const pusher = new Pusher({
    appId: process.env.pusherAppId,
    key: process.env.pusherKey,
    secret: process.env.pusherSecret,
    cluster: process.env.pusherCluster,
    useTLS: true
  });

// middleware
app.use(express.json())
app.use(cors())

const connection_url = `mongodb://${process.env.connectionUsername}:${process.env.connectionPassword}@main-shard-00-00-03xkr.mongodb.net:27017,main-shard-00-01-03xkr.mongodb.net:27017,main-shard-00-02-03xkr.mongodb.net:27017/main?ssl=true&replicaSet=Main-shard-0&authSource=admin&retryWrites=true`

mongoose.connect(connection_url, {
    // useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.once('open', ()=> {
    console.log('DB connected');
    const msgCollection = db.collection('messagecontents')
    const changeStream = msgCollection.watch()
    console.log(changeStream)

    changeStream.on('change', (change) => {
        console.log('A change occured', change);

        if(change.operationType === 'insert') {
            const messageDetails = change.fullDocument;
            pusher.trigger('messages', 'inserted', {
                name: messageDetails.user,
                message: messageDetails.message,
                timestamp: messageDetails.timestamp,
                received: messageDetails.received
            })
        } else {
            console.log('Error triggering Pusher')
        }
    })
})

// app routes
app.get('/', (req, res) => res.status(200).send('Hello World'));

app.get('/messages/sync', (req, res) => {
    Messages.find((err, data) => {
        if(err) {
            res.status(500).send(err)
        } else {
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new', (req, res)=>{
  const dbMessage = req.body
  Messages.create(dbMessage, (err, data)=> {
    if(err){
        res.status(500).send(err)
    } else {
        res.status(200).send(data)
    }
  })
})

app.listen(port, ()=> console.log(`listening on port ${port}`))
