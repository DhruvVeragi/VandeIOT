const express = require('express')
const app = express()
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {MongoClient} = require('mongodb');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
require('./passport');

app.use(express.json());
app.use(cookieParser());
// app.use(cors());
app.use(cors(
  {
    origin: "http://localhost:3000",
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
  }
  ));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
    session({
      secret: 'our.jsonwt.skey',
      resave: true,
      saveUninitialized: true,
    })
);
const crypto = require('crypto');
app.use(passport.initialize());
app.use(passport.session());
    
const uri = "mongodb+srv://dhruv:dhruv@cluster0.vwq29qh.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, { useUnifiedTopology: true });


//uri1 for channels details and users Data
const uri1 = "mongodb+srv://dhruv:dhruv@cluster0.vwq29qh.mongodb.net/VandeIot?retryWrites=true&w=majority";

// uri2 for channels data 
const uri2 = "mongodb+srv://dhruv:dhruv@cluster0.vwq29qh.mongodb.net/VandeIotData?retryWrites=true&w=majority";


const connection1 = mongoose.createConnection(uri1, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const connection2 = mongoose.createConnection(uri2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const ChannelSchema = new mongoose.Schema({
    c_id:Number,
    email:String,
    name: String,
    description: String,
    field1Enabled: Boolean,
    field1Value:String,
    field2Enabled: Boolean,
    field2Value:String,
    field3Enabled: Boolean,
    field3Value:String,
    writeapiKey:String,
    readapiKey:String,  
    },{ versionKey: false  }
);

const dataSchema = new mongoose.Schema({
    field: String,
    value: String,
    createdAt:{ type: Date, default: Date.now }
},{ versionKey: false});

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    channels:Number,
},{ versionKey: false});
  

  
// Create a new model using the form schema
const Channel = connection1.model('Channels', ChannelSchema);
const User = connection1.model('User', userSchema); 
const Data = connection2.model('Data', dataSchema);


const generateApiKey = () => {
  const apikey = crypto.randomBytes(10).toString('hex');
  return apikey;
}


app.post('/createChannel', async (req, res) => {
    try {
        const { email, name, description, field1Enabled, field1Value, field2Enabled, field2Value, field3Enabled, field3Value } = req.body;
        const writeapiKey = crypto.randomBytes(10).toString('hex');
        const readapiKey = crypto.randomBytes(10).toString('hex');
        const lastChannel = await Channel.findOne().sort({ _id: -1 }).exec();
        const c_id = lastChannel ? lastChannel.c_id + 1 : 31000; 
       
        const channel = new Channel({ c_id, email, name, description, field1Enabled, field1Value, field2Enabled, field2Value, field3Enabled, field3Value, writeapiKey, readapiKey });
        await channel.save();
        let id = c_id.toString();
        const DynamicData = connection2.model(`${id}`, dataSchema);
                // Create a new data instance
                const newData = new DynamicData({
                  field: "0",
                  value: "",
                });
                newData.save()
                .then(() => {
                //   console.log('Data saved successfully');
                // res.send('Data saved successfully')
                    User.updateOne({ email : email }, {$inc: { channels: 1 }
                    })
                    .then(() => {
                      res.sendStatus(201);
                    })
                    .catch(error => {
                      console.error(error);
                  });
                })
                .catch((error) => {
                  console.error('Error saving data:', error);
                  res.sendStatus(500);
                }); 
        // res.sendStatus(201);
        // console.log("data send");
        } catch (error) {
        console.error(error);
        res.sendStatus(500);
        }
});

app.get('/get', async(req,res)=>{
    await Channel.find({})
     .then((channel) => {
        console.log('All Channels Retrieve ');
        res.send(channel);
        })
     .catch((error) => console.log('Error fetching people', error));     
});

app.get('/user/:email', async(req,res) =>{
  const email = req.params.email;
  await Channel.find({email : email})
   .then((channel) => {
      // console.log('Channel',email,'Data Retrieve ');
      res.send(channel);
      })
   .catch((error) => console.log('Error fetching people', error));
});

app.get('/count/:email', async(req,res) =>{
  const email = req.params.email;
  await User.findOne({email : email})
   .then((user) => {
      // console.log('Channel',email,'Data Retrieve ');
      // console.log(user.channels);
      res.send(user);
      })
   .catch((error) => console.log('Error fetching people', error));
});

app.get('/search/:id', async(req,res) =>{
    const id = req.params.id;
    const c_id = parseInt(id);
    await Channel.findOne({c_id : c_id})
     .then((channel) => {
        // console.log('Channel',c_id,'Data Retrieve ');
        res.send(channel);
        })
     .catch((error) => console.log('Error fetching people', error));
});

app.put('/updateChannel', async(req,res)=>{
    const { _id,name, description, field1Value, field1Enabled, field2Enabled, field2Value, field3Enabled, field3Value } = req.body;
    
  // Do something with the updated form data (e.g. update the database)
  // console.log(_id,name,description,field1Value,field1Enabled);
    
    await Channel.updateOne({ _id: _id }, { 
        name: name,
        description: description,
        field1Value: field1Value,
        field1Enabled: field1Enabled,
        field2Value:field2Value,
        field2Enabled:field2Enabled,
        field3Value:field3Value,
        field3Enabled:field3Enabled
      })
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error(error);
    });
})

app.post('/updateWriteapi/:id', async(req,res)=>{
    const id = req.params.id;
    await Channel.updateOne({ _id:id }, { 
        writeapiKey : crypto.randomBytes(10).toString('hex')
      })
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error(error);
    });
})

app.post('/updateReadapi/:id', async(req,res)=>{
    const id = req.params.id;
    await Channel.updateOne({ _id:id }, { 
        readapiKey : crypto.randomBytes(10).toString('hex')
      })
      .then(result => {
        console.log(result);
      })
      .catch(error => {
        console.error(error);
    });
})

app.get('/update', async(req, res) => {
    const { id, api_key, ...fields } = req.query;
    const c_id = parseInt(id);
    await Channel.findOne({c_id : c_id})
     .then((channel) => {    
        if ( api_key === channel.writeapiKey) {
            // console.log("api matched");
            for (const fieldName in fields) {
                const fieldValue = fields[fieldName];
                // console.log(`Field: ${fieldName}, Value: ${fieldValue}`);
                if (fieldValue !== "") {
                    // Code to execute if value is not null
                    // console.log("Value is not null");
                 
                // Define a new model with a dynamic collection name based on the id
                const DynamicData = connection2.model(`${id}`, dataSchema);
            
                // Create a new data instance
                const newData = new DynamicData({
                  field: fieldName,
                  value: fieldValue,
                });
                newData.save()
                .then(() => {
                //   console.log('Data saved successfully');
                  res.send('Data saved successfully')
                })
                .catch((error) => {
                  console.error('Error saving data:', error);
                  res.send('0')
                });
                 } else {
                // Code to execute if value is null
                console.log("Value is null");
                res.send("Value is null")
                }
            }
            
        }   else{
            res.send("Authentication Failed")
        }
        })
    .catch((error) => console.log('Error fetching people', error));
});
  
app.get('/chart', async(req,res) =>{
    // const id = req.params.id;
    const { id, field } = req.query;

    // const { id } = req.query;
    const DynamicData = connection2.model(`${id}`, dataSchema);         
    // Find documents matching the specified id
    await DynamicData.find({ field : field })
    .then((documents) => {
    //   console.log('Retrieved data:', documents);
      // Send the retrieved data as the response
      res.json(documents);
    })
    .catch((error) => {
      console.error('Error retrieving data:', error);
      // Send an error response
      res.status(500).json({ error: 'An error occurred while retrieving data' });
    });
});

app.get('/channels/:id/feeds', async(req,res) =>{
    // const id = req.params.id;
    const id = req.params.id;
    const api_key = req.query;
    // const { id } = req.query;
    const DynamicData = connection2.model(`${id}`, dataSchema);         
    // Find documents matching the specified id
    await DynamicData.find({})
    .then((data) => {
       //   console.log('Retrieved data:', documents);
      // Send the retrieved data as the response
      res.json(data);
    })
    .catch((error) => {
      console.error('Error retrieving data:', error);
      // Send an error response
      res.status(500).json({ error: 'An error occurred while retrieving data' });
    });
});

app.get('/deleteChannel/:id',async(req,res) => {
    const c_id = req.params.id;
    var email = ""
    // console.log(_id);
    // const id = req.params.id;
    const id = parseInt(c_id);
    await Channel.findOne({c_id : id})
     .then((channel) => {
        // console.log('Channel',id,'Data Retrieve ');
        // console.log(channel.email);
        email = channel.email;
        })
     .catch((error) => console.log('Error fetching people', error));
    try {
    await Channel.deleteOne({ c_id: c_id });
    connection2.db.dropCollection(c_id, (err) => {
        if (err) {
          console.error('Error dropping the collection:', err);
          res.status(500).send('Error dropping the collection');
        } else {
          console.log(`Collection '${clusterName}' dropped successfully`);
        //   res.send(`Collection '${clusterName}' dropped successfully`);
        // res.sendStatus(200);
        }
      });
    User.updateOne({ email : email }, {$inc: { channels:-1 }
      })
      .then(() => {
        res.sendStatus(200);
      })
      .catch(error => {
        console.error(error);
      });
    // res.sendStatus(200);
    // console.log('Record deleted successfully');
    
    } catch (error) {
      // Handle error
      console.log('An error occurred while deleting the record', error)
    }
    
})

app.get('/clearChannel/:id',async(req,res) => {
    const id = req.params.id;
    console.log(typeof(id));
    await connection2.db.dropCollection(id, (err) => {
        if (err) {
          console.error('Error dropping the collection:', err);
          res.status(500).send('Error dropping the collection');
        } else {
          console.log(`Collection '${clusterName}' dropped successfully`);
        //   res.send(`Collection '${clusterName}' dropped successfully`);
          res.sendStatus(200);
        }
      });
    res.sendStatus(200);
    
})



// login signup 

//signup
app.post('/bsignup', async (req, res) => {
    // const { name, email, password } = req.body;
    const sign = req.body
    username = sign.values.Name
    email = sign.values.email
    password = sign.values.password
    // console.log(username, email, password);
    try {
  
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }
  
      // Hash the password with bcrypt
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
  
      // Create a new user
      const channels = 0;
      const newUser = new User({ name : username, email, password: hashedPassword , channels });
      await newUser.save();
  
      return res.status(200).json({ message: 'User created' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server Error' });
    }
});
  

// Login route
// app.post('/login', async  (req, res) => {
//     try {
//       const { email, password } = req.body;
      
//       // Check if the user exists
//       const user = await User.findOne({ email });
//       if (!user) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Check if the password is correct
//       const isPasswordValid = await bcrypt.compare(password, user.password);
//       if (!isPasswordValid) {
//         return res.status(401).json({ message: 'Invalid credentials' });
//       }
  
//       // Generate a JWT token
//       const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });
  
//       return res.status(200).json({ token });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ message: 'Server Error' });
//     }
// });

app.post('/blogin', async function (req, res) {
  email = req.body.username
  loginp = req.body.password
  console.log(email, loginp);
  User.findOne({ email })
      .then(async user => {
          if (user) {
            const hashedPassword = await bcrypt.hash(loginp, 10);
            const isMatch = await bcrypt.compare(loginp, user.password);
              if (isMatch) {
                  const name = user.name
                  const token = jwt.sign({ name, email }, "our.jsonwt.skey", { expiresIn: '1d' })
                  res.cookie('token', token, { maxAge: 7 * 24 * 60 * 60 * 1000 })
                  return res.json({ Status: "success" })
              } else {
                  res.send({ message: "Credentials mismatch" })
              }
          } else {
              res.send({ message: "Credentials mismatch" })
          }
      })
      .catch(err => {
          console.error(err);
      });
})

const verifyUser = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
      return res.send({status:"loggedout"});
  } else {
      try {
          const data = jwt.verify(token, "our.jsonwt.skey");
          // console.log(data)
          req.name = data.name
          req.email = data.email
          return next();
      } catch {
          return res.sendStatus(403);
      }
  }
}

app.get('/verify', verifyUser, async (req, res) => {
  res.send({ message: "success", name: req.name, email: req.email })
})

app.get('/auth', passport.authenticate('google', {scope:['email', 'profile']}));

app.get('/auth/callback',passport.authenticate('google', {successRedirect: '/auth/callback/success',
    failureRedirect: '/auth/callback/failure'
    }));

app.get('/auth/callback/success', async (req, res) => {
    const name = req.user.name.givenName
    const email = req.user.email
    if (!req.user){
        res.redirect('/auth/callback/failure');
    }
    else{
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            const token = jwt.sign({ name , email}, "our.jsonwt.skey", { expiresIn: '23h' })
            res.cookie('token', token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.redirect('http://localhost:3000');
        }
        else{
            const channels = 0;
            const newUser = new User({ email , channels });
            await newUser.save();
            const token = jwt.sign({ name , email }, "our.jsonwt.skey", { expiresIn: '23h' })
            res.cookie('token', token, { maxAge: 7 * 24 * 60 * 60 * 1000 });
            res.redirect('http://localhost:3000');
        }
       
    }    
});

app.get('/auth/callback/failure', (req, res) => {
    console.log("fail")
    res.redirect('http://localhost:3000/login');
})

app.get('/logout', verifyUser, async (req, res) => {
  res.clearCookie("token")
      .json({ Status: "loggedout", name: req.name })
})



//mongo client 


app.post('/create', async(req,res) => {
    const name = req.body.Name
    const description = req.body.Description
    const field1 = req.body.Field1
    const field2 = req.body.Field2
    const field3 = req.body.Field3
    const ch1 = req.body.enableInput1
    const ch2 = req.body.enableInput2
    const ch3 = req.body.enableInput3
    const writeapiKey = generateApiKey();
    const readapiKey = generateApiKey();
        
    
    // c_id = (c_id + 1);
    console.log(ch1);
    async function main(){
        // const uri = "mongodb+srv://dhruv:dhruv@cluster0.vwq29qh.mongodb.net/?retryWrites=true&w=majority";
        // const client = new MongoClient(uri);
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            console.log("connected");
            const db = client.db("Try")
            const collection = db.collection('Channels');
            const lastRecord = await collection.findOne({}, {sort: {c_id: -1}});
            const newCid = lastRecord ? lastRecord.c_id + 1 : c_id;
            
            context={
                "c_id":newCid,
                "name":name,
                "description":description,
                "field1":field1,
                "field2":field2,
                "field3":field3,
                "e1":ch1,
                "e2":ch2,
                "e3":ch3,
                "writeApiKey":writeapiKey,
                "readApiKey":readapiKey
                
            }
            // Make the appropriate DB calls
            await collection.insertOne(context);
            console.log('Data Send');      
        } catch (e) {
            console.error(e);
        } finally {
            await client.close();
        }
    }
    main().catch(console.error);
    
});


app.get('/fetchChannels', async(req,res) =>{
     
    async function main(){
        // const uri = "mongodb+srv://dhruv:dhruv@cluster0.vwq29qh.mongodb.net/?retryWrites=true&w=majority";
        // const client = new MongoClient(uri);
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            const db = client.db("Try")
            const collection = db.collection('Channels');
            // Make the appropriate DB calls
            const data = await collection.find().toArray();
            res.send(data);
            console.log("data retrieved");
            // console.log(data);
            
            
        } catch (e) {
            console.error(e);
            
        } finally {
            await client.close();
        }
    }
    main().catch(console.error);
    
})

app.get('/S/:i', async(req,res) =>{
    const i = req.params.i;
    // console.log(typeof(i));
    const c_id = parseInt(i);
    async function main(){
        // const uri = "mongodb+srv://dhruv:dhruv@cluster0.vwq29qh.mongodb.net/?retryWrites=true&w=majority";
        // const client = new MongoClient(uri);
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            const db = client.db("Try")
            const collection = db.collection('Channels');
            // Make the appropriate DB calls
            // console.log(typeof(c_id));
            // console.log(c_id);
            const data = await collection.findOne({"c_id":c_id});
            // console.log(data);
            res.send(data);
            
            // console.log(data);
            console.log("data retrieved");
            // console.log(data);
            
            
        } catch (e) {
            console.error(e);
            
        } finally {
            await client.close();
        }
    }
    main().catch(console.error);
    
})


app.get('/fetchData/:id', async(req,res) =>{
    const id = req.params.id;
    async function main(){
        
        try {
            // Connect to the MongoDB cluster
            await client.connect();
            const db = client.db("Data")
            const collection = db.collection(id);
            // Make the appropriate DB calls
            const data = await collection.find().toArray();
            res.send(data);
            console.log("Channel data retrieved");
            // console.log(data);
            
            
        } catch (e) {
            console.error(e);
            
        } finally {
            await client.close();
        }
    }
    main().catch(console.error);
    
})

app.listen(5000, () => {
    console.log('Server started on port : 5000');
});