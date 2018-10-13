const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');

const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('Hello World!')
})



//METHOD POST
//Post a new task

app.post('/todo/api/v1.0/tasks', (req, res)=> {

  const params = {
    TableName: USERS_TABLE,
    Item: {
      id : "secretuserkey" + Math.random(),
      done : false,
      title : req.body.title,
      description : req.body.description
    },
  };

  dynamoDb.put(params, (error, data) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create task' });
    }else{
      console.log(data)
      res.status(200).json({result : params.Item});
    }
  });
});




//GET METHOD
//Get all tasks
app.get('/todo/api/v1.0/tasks', (req, res)=> {
  const params = {
    TableName: USERS_TABLE,
  }

  dynamoDb.scan(params , (error , result) =>{
    if(error){
      res.status(400).json({ error: 'Could not get tasks' });
    }else{
      res.status(200).json({data : result})
    }
  })


})



//GET METHOD
//Get single task

app.get('/todo/api/v1.0/tasks/:taskId', (req, res)=> {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      id: req.params.taskId,
    },
  }
  dynamoDb.get(params , (error , result)=>{
    if(error){
      res.status(400).json({ error: 'Could not get task' });
    }else{
      res.status(200).json({data : result})
    }
  })
})


module.exports.handler = serverless(app);