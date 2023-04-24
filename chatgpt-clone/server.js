// install (npm i cors express nodemon) in  the chatgpt-clone folder

import express from "express";
import cors from "cors";
import  { config } from "dotenv";



config();


console.log(process.env.API_KEY);
const PORT = 8000;

const app = express();
app.use(cors());
app.use(express.json());

app.post('/completions', async (req, res) =>{
        
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [{
                role: "user",
                content: req.body.message,  //getting the message from the input
            }],
            max_tokens: 100,
        })
    }
    try {
       
         
        const response =    await fetch('https://api.openai.com/v1/chat/completions', options)
            
            const data = await response.json()
             

             //sending data to the localhost:8001/completions
             res.send(data)
    } catch(error) {
        console.log(error);


    }
})


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

console.log("Hello World");
