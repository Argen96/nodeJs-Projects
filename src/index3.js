import express from 'express';
import fsp from 'fs/promises'

///////////////////////////////////////// Exercise 2 ///////////////////////////////////////////////////////////////////////////////

const app = express()
app.use(express.json())

app.get('/server',async(request,response)=>{
  const {string} = request.query
  let result = ''
  let output = ''
  if (string){
  result= [string[0]];
  for(let el=1; el<string.length; el++){
  if((string[el-1]%2 === 0)&&(string[el]%2 === 0)){
  result.push('-', string[el]);
  }else{
  result.push(string[el]);}}}
  if(typeof result ==='object'){
    output = result.join('');
  }
  const readDatabase= await fsp.readFile('./src/log2.json','utf-8')
  const parsedDatabase=JSON.parse(readDatabase)
  parsedDatabase.push(`{Request number ${parsedDatabase.length+1} is ${string} `)
  await fsp.writeFile('./src/log2.json', JSON.stringify(parsedDatabase,null,4))
  if(output.includes('-')){
  response.status(200)
  response.json(output)
  }else if(!string){
  response.status(200)
  response.json('Please provide us with a string so we can provide you with a result')
  }else{
  response.status(200)
  response.json('This string does not have two even numbers next to each other')
 }})

app.all('/*',async(request,response)=>{
  response.status(400)
  response.json('Please select two numbers so we can provide you with integer numbers between them')
})
const port=3000

app.listen(port,()=>{
  console.log(`local server ${port}`)
})

