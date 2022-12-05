import express, { json } from 'express'
import { appendFile } from 'fs'
import fsp from 'fs/promises'
  
///////////////////////////////////////// Exercise 1 ///////////////////////////////////////////////////////////////////////////////

const app = express()
app.use(express.json())

app.get('/server',async(request,response)=>{
  const {number1} = request.query
  const {number2} = request.query
  const orderedNumbers = [number1,number2].sort((a,b)=>Number(a)>Number(b) ? 1:-1)
  const lowerNumber = Number(orderedNumbers[0])
  const greaterNumber = Number(orderedNumbers[1])
  const readDatabase = await fsp.readFile('./src/log1.json','utf-8')
  const parsedDatabase = JSON.parse(readDatabase)
  const arrayOutput = []
  for( let i = lowerNumber+1;i<greaterNumber;i++ ){
    arrayOutput.push(i)
 }
  parsedDatabase.push(`{Request number ${parsedDatabase.length+1} is ${number1} and ${number2} `)
  await fsp.writeFile('./src/log1.json', JSON.stringify(parsedDatabase,null,4))
  if(arrayOutput.length>0){
  response.status(200)
  response.json(arrayOutput)
  }else if(!request.query.number1||!request.query.number2|| isNaN(Number(request.query.number1))||isNaN(Number(request.query.number2))){
  response.status(200)
  response.json('Please provide us with number1 and number 2 so we can provide you with integer number between them.Please make sure to select numbers')
  } else{
  response.status(200)
  response.json('The numbers provided do not have any integer numbers between')
 }})

app.all('/*',async(request,response)=>{
    response.status(400)
    response.json('Please select two numbers so we can provide you with integer numbers between them')
})

const port=3000

app.listen(port,()=>{
    console.log(`local server ${port}`)
})