import express, { json } from 'express';
import fsp from 'fs/promises'

///////////////////////////////////////// Exercise 3  ///////////////////////////////////////////////////////////////////////////////

const app = express()
app.use(express.json())

app.post('/sign-up',async(request,response)=>{
const account = request.body
const username = account.username
const password = account.password
let passwordConditionsSymbols=''
let passwordConditionsNumbers=''
let usernameLength=''
let passwordLength=''
if (username && password){
passwordConditionsSymbols = password.split('').some((letter)=> letter==="?" || letter==="." || letter==="!" || letter===":")
passwordConditionsNumbers = password.split('').some((letter)=>!isNaN(Number(letter)))
usernameLength=username.length
passwordLength=password.length
}
const contentFile = await fsp.readFile('./src/database.json','utf-8')
const contentParsed = JSON.parse(contentFile)
const id = contentParsed.length+1
account.id=id
const profileAlreadyExist=contentParsed.some( account=> account.username === username )
if(profileAlreadyExist){
  response.status(200)
  response.json('This username already exist. Please find another username') 
}else if(!username || !password){
  response.status(200)
  response.json('Please you have to use a username and password to Log In')
}
else if ( 5 < usernameLength && usernameLength < 12 && 5 < passwordLength && passwordLength < 12 && passwordConditionsSymbols && passwordConditionsNumbers ){
contentParsed.push(account)
await fsp.writeFile('./src/database.json',JSON.stringify(contentParsed,null,4))
response.status(200)
response.json(account)
}else{
  response.status(200)
  response.json('Username and password should contain more than 5 characters and less than 12. Also password should contain at least one number and one of the symboles which are ( : . ? ! )') 
}
})

app.post('/sign-in',async(request,response)=>{
const username = request.body.username
const password = request.body.password
const contentFile = await fsp.readFile('./src/database.json','utf-8')
const contentParsed = JSON.parse(contentFile)
const accountRequested = contentParsed.find(account=>account.username === username && account.password === password && username != undefined && password != undefined)
console.log(accountRequested)
if(accountRequested){
response.status(200)
response.json(accountRequested)
}
else if(!username||!password){
response.status(200)
response.json('Please put your username and pasword to get access in the account')
}else{
response.status(200)
response.json('Invalid username or password')
}
})

app.all('\*',async(request,response)=>{
response.status(400)
response.json('your request is invalid')
})

const port=3000
app.listen(port,()=>{
console.log(`Server active in port ${port}`)
})


