const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;

const app = express();
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json())

//mongoDb altes
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@rasel-01.uhpxwkk.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

//JWT verifyToken 
async function verifyJWT(req, res, next) {
    const authHeder = req.headers.authorization;
    if (!authHeder) {
        return res.status(401).send('This parson unAthorizetion access')
    }

    const token = authHeder.split(' ')[1];
    jwt.verify(token, process.env.ACCSS_TOKEN, function (err, decoded) {
        if (err) {
            return res.status(402).send({ message: "forbiden access" })
        }

        req.decoded = decoded;
        next()
    })

}

async function run() {

    try {
        const CetegoriesCars = client.db('Car-Shop_Datas').collection('Categories_Cars');
        const allCarCollection = client.db('Car-Shop_Datas').collection('All-Products');
        const BookingCar = client.db('Car-Shop_Datas').collection('BookingCar');
        const AllUser = client.db('Car-Shop_Datas').collection('All-Users');
        const adverticCollection = client.db('Car-Shop_Datas').collection('All-Advertic');

        // get all cetegories collctions
        app.get('/cetegories', async (req, res) => {
            const query = {};
            const result = await CetegoriesCars.find(query).toArray();
            res.send(result);
        })

        // Product car post
        // all review parson add
        app.post('/productAdd', async (req, res) => {
            const review = req.body;
            const result = await allCarCollection.insertOne(review);
            res.send(result)
        })


        // cetegories/:Id filter
        app.get('/cetegories/:id', async (req, res) => {
            const product = req.params.id;
            const query = { id: product };
            const result = await allCarCollection.find(query).toArray();
            res.send(result);

        })

        // all cullection
        app.get('/allProduct', async (req, res) => {
            const query = {};
            const result = await allCarCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/allProduct/:email', async (req, res) => {
            const user = req.params.email
            const query = { email: user };
            const result = await allCarCollection.find(query).toArray();
            res.send(result)
        })

        //Booking Car Modal infromation
        app.post('/booking', async (req, res) => {
            const boking = req.body;
            const result = await BookingCar.insertOne(boking);
            res.send(result);
        })
        //Advatice Car Modal infromations
        app.post('/advertic', async (req, res) => {
            const boking = req.body;
            const result = await adverticCollection.insertOne(boking);
            res.send(result);
        })
        //Booking resive on email user 
        app.get('/advertic/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await adverticCollection.find(query).toArray();
            res.send(result);
        })
        //Booking resive on email user 
        app.get('/bookings/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await BookingCar.find(query).toArray();
            res.send(result);
        })
        //get bookin
        app.get('/bookings', async (req, res) => {
            const query = {};
            const result = await BookingCar.find(query).toArray();
            res.send(result);
        })

        //Admin panel usersss
        app.post('/users', async (req, res) => {
            const users = req.body;
            const result = await AllUser.insertOne(users);
            res.send(result);
        })

        // all user  information mongodb add
        app.get('/users', async (req, res) => {
            const query = {};
            const result = await AllUser.find(query).toArray();
            res.send(result)
        })
        // seller emaill
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            // console.log(email);
            const query = { email: email };
            const result = await AllUser.find(query).toArray();
            res.send(result)
        })

        //Jwt token access
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await AllUser.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCSS_TOKEN, { expiresIn: '1h' });
                return res.send({ accessToken: token })
            }
            console.log(user);
            res.status(403).send({ accessToken: '' })
        })


    }
    catch (error) {
        console.log(error.name, error.message, error.stack);
    }

}

run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send('Cars Resell.shop is Runings')
})
app.listen(port, () => console.log(`Cars Resell.shop is Runing is ${port}`))