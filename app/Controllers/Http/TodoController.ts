import crypto from 'crypto'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TodoController {
	public async add({ view, request }: HttpContextContract) {
		const task = {
			id: crypto.getRandomValues(new Uint32Array(1)),
			name: request.body().add,
		}

		console.log(`Add: ${task.id} - ${task.name}`)
		return view.render('swap/task', task)
	}

	public async update({ params, request }: HttpContextContract) {
		console.log(`Update: ${params.id} - ${request.body().newName}`)
		return request.body().newName
	}

	public async toggle({ params, request }: HttpContextContract) {
		console.log(`${request.body().completed ? 'Completed' : 'Reset'}: ${params.id}`)
		return
	}

	public async toggleAll({ request }: HttpContextContract) {
		request.body().completedId ? console.log(`Completed: ${request.body().completedId}`) : console.log(`Reset all`)
	}

	public async del({ params }: HttpContextContract) {
		console.log(`Delete: ${params.id}`)
	}

	public async delAll({ request }: HttpContextContract) {
		console.log(`Delete Completed: ${request.body().completedId}`)
	}
}
