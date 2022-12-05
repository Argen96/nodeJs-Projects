import express from 'express';

import database from './database.js';

const app = express()
app.use(express.json())

app.post('/pizza', async (request, response) => {
    const content = request.body;
    await database.raw(`insert into menu (pizza , restaurant )
    values ('${content.pizza}','${content.restaurant}')`);
    const result = await database.raw(`select * from menu order by id desc limit 1`);
    response.status(200);
    response.json(result);
  });
  
  app.get('/pizza/:id', async (request, response) => {
    const id = request.params.id;
    const result = await database.raw(`select * from menu where id = ${id}`);
    if(result.length !== 0) {
      response.status(200);
      response.json(result);  
    }
    else {
      response.status(404);
      response.json(`The menu with id = ${id} NOT FOUND!`);
    }  
  });
  
  app.get('/pizza', async (request, response) => {
    const result = await database.raw(`select * from menu`);
    response.status(200);
    response.json(result);
  });
  
  app.put('/pizza/:id', async (request, response) => {
    const id = request.params.id;
    const content = request.body;
    await database.raw(`update menu set pizza ='${content.pizza}', restaurant ='${content.restaurant}' where id=${id} `);
    const result = await database.raw(`select * from menu where id=${id}`);
    response.status(200);
    response.json(result); 
  });
  
  app.delete('/pizza/:id', async (request, response) => {
    const id = request.params.id;
    const result = await database.raw(`delete from menu where id=${id}`);
    if(result.length !== 0) {
      response.status(200);
      response.json(true);  
    }
    else {
      response.status(404);
      response.json(`The menu with id = ${id} does not exist!`);
    }
  });
   
  app.all('\*',async(request,response)=>{
    response.status(400)
    response.json('your request is invalid')
  })


  const port = 3000;
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })