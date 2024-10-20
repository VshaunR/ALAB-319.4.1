import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import gradeRoutes from './routes/gradeRoute.mjs';
import labRoutes from './routes/labRoutes.mjs';
//set up
const app = express();
dotenv.config();
let PORT = process.env.PORT || 3001;

//middleware
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json({extended:true}));

//routes
app.use('/grades',gradeRoutes);
app.use('/gradesstats',labRoutes)

//listener
app.listen(PORT,(req,res)=>{

  console.log(`Listening to port ${PORT}`)

});