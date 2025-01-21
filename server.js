const express=require('express')
const app=express();
const path=require('path')
const cors= require('cors')
const PORT=process.env.PORT || 5000;

app.use(express.static('public'))
app.use(express.json());

const connectDB = require('./config/db');
connectDB();//importing the database

//cors
const corsOptions={
    origin: "https://shareitfileshare.netlify.app", // Specify a specific origin
    methods: 'GET, POST',           // Specify allowed HTTP methods
    allowedHeaders: 'Content-Type'
}
app.use(cors(corsOptions))

//Template Engine
app.set('views',path.join(__dirname,'/views'));//all html templates are in views
app.set('view engine','ejs')

//Routes
app.use('/api/files', require('./routes/files')) // take file from files.js - uoload and send it to end point of /api/files
app.use('/files', require('./routes/show'))
app.use('/files/download', require('./routes/download'))


app.listen(PORT, ()=>{
    console.log(`LIstening on port ${PORT}`);
})

// to run the server enter yarn dev on terminal