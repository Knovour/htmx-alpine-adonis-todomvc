/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer''
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async ({ view }) => view.render('index'))

Route.post('/todo/create', 'TodoController.create')

Route.patch('/todo/:id/update', 'TodoController.update')

Route.patch('/todo/:id/toggle', 'TodoController.toggle')
Route.put('/todo/toggle', 'TodoController.toggleAll')

Route.delete('/todo/:id/del', 'TodoController.del')
Route.delete('/todo/del', 'TodoController.delAll')
