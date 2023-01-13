import  express  from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { Configuration , OpenAIApi } from 'openai';
import bodyParser from 'body-parser';

// const OpenAI = require('openai');
// const { Configuration, OpenAIApi } = OpenAI;

const App = express();
dotenv.config();
App.use(bodyParser.json());

const configuration = new Configuration({
    organization: "org-9pHkKveQUrTQgOA4zVuDnx02",
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

App.use(cors());
App.use(express.json());

App.get('/' , async (req , res )=>{
    res.status(200).send({
        message: "Hello from backend",
    });
 });

App.post('/' , async (req , res)=>{
    try{
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,
            max_tokens: 1000,
            temperature: 0,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        console.log(response.data);
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    }
    catch( error ){
        console.log(error);
        res.status(500).send({error})
    }
})

const port = 4050;

App.listen(port , ()=> console.log(`server is running on port: http://localhost:${port}`));

