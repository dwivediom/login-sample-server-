import express from "express"
import mongoose from "mongoose"
import bodyParser from "body-parser"
import User from "./modles/user.js"
import cors from "cors"

const app = express() 
//data connection 
const dbconnection= async()=>{ 
    try {
        const mongoDBstring = "mongodb://127.0.0.1:27017/login"
            
           await mongoose.connect(mongoDBstring , { 
            // useNewUrlParser: true, 
            // useUnifiedTopology:true
           })
           console.log("data base connection established ")
     }catch(error){ 
          console.log("error in database ", error.message)
     }
}
dbconnection() 
//api
app.use(cors())
app.use(bodyParser.json({extended:true}))


//@public get : http://localhost:5000/login?password=3434343&email=helowworld@gmail.com
app.get("/login", async(req, res)=>{ 
    try{ 
        const password = req.query.password; 
        const email = req.query.email
        const user = await User.findOne({email:email})
        if(!user){ 
            return res.status(200).json({msg:"user not found please register "})
        }
        if( user.password ===  password){ 
            return res.status(200).json({msg:"login successfull"})
        }else{ 
            return res.status(200).json({msg:"incorrect password"})
        }

    }catch(error){ 

    }
})

//for user registration 
app.post("/register", async(req, res)=>{ 
    try {
        const user = await User.findOne({ email: req.body.email });

        console.log(req.body.email);

        if (!user) {
            const userData = {
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
            };

            const newUser = new User(userData);
            await newUser.save();

            console.log("user registered ");

            return res.status(200).json({ msg: "user registered" });
        } else {
            // Instead of using res.sendStatus(200), use res.status(200).json()
            return res.status(200).json({ msg: "user already exists, please login" });
        }
    
    }catch(error){ 
         console.log(error)
        return 
    }
})



//server connection 
const port = 5000

app.listen( port, ()=>{
    console.log("server started in port  " , port)
})