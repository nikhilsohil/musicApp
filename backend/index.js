import express from 'express';
import cors from 'cors';
import path from 'path';
import dbConnect from './dbConnction.js';
import authRouter from './routes/authRoutes.js';
import playlistRouter from './routes/playlistRoutes.js';
import likesRouter from './routes/likesRoutes.js';
import usersRouter from './routes/usersRoutes.js';


import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: true}));
app.get('/',(req,res)=>{
    res.status(200).json({message:"server started sucessfully"})
})

// Define routes
app.use(express.static(path.join(__dirname, 'public')));

 // Homepage route
app.get('/',(req,res)=>{
    res.status(200).json({message:"server started sucessfully"})
})

app.use("/auth/", authRouter);

app.use("/playlist", playlistRouter);

app.use("/likes", likesRouter);

app.use("/users", usersRouter);



const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
      // Await the database connection
      await dbConnect(); 
      
      // Start the server
      app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
      });
    } catch (error) {
      // Log the error and exit the process
      console.error(`Error starting the server: ${error.message}`);
      process.exit(1);
    }
  };


  startServer();
