import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'

export default class ClickupController {
	baseUrl: string = 'https://api.clickup.com/api/v2'

	async _fetchData(path, name, token) {
		const { data } = await axios.get(path, {
			headers: { Authorization: token },
		})

		return data[name].map(({ id, name }) => ({ id, name }))
	}

	async getTeams(token: string) {
		return await this._fetchData(`${this.baseUrl}/team`, 'teams', token)
	}

	async getSpaces(teamId: string, token: string) {
		return await this._fetchData(`${this.baseUrl}/team/${teamId}/space?archived=false`, 'spaces', token)
	}

	async getFolders(spaceId: string, token: string) {
		return await this._fetchData(`${this.baseUrl}/space/${spaceId}/folder?archived=false`, 'folders', token)
	}

	async getLists(folderId: string, token: string) {
		return await this._fetchData(`${this.baseUrl}/folder/${folderId}/list?archived=false`, 'lists', token)
	}

	async getTaskTmpls(teamId: string, token: string) {
		return await this._fetchData(`${this.baseUrl}/team/${teamId}/taskTemplate?page=0`, 'templates', token)
	}

	public async init({ view, request }: HttpContextContract) {
		const { token } = request.body()

		const teams = await this.getTeams(token)
		const [spaces, tmpls] = await Promise.all([
			this.getSpaces(teams[0].id, token),
			this.getTaskTmpls(teams[0].id, token),
		])
		const folders = await this.getFolders(spaces[0].id, token)
		const lists = await this.getLists(folders[0].id, token)

		return view.render('swap/clickup', {
			token,
			teams,
			spaces,
			folders,
			lists,
			tmpls,
		})
	}

	public async space({ view, request }: HttpContextContract) {
		const { token, team } = request.qs()

		const [spaces, tmpls] = await Promise.all([this.getSpaces(team, token), this.getTaskTmpls(team, token)])

		return view.render('swap/multi', {
			token,
			spaces,
			tmpls,
		})
	}

	public async folder({ view, request }: HttpContextContract) {
		const { token, space } = request.qs()
		const opts = await this.getFolders(space, token)

		return view.render('components/select', {
			name: 'folder',
			'hx-get': `/clickup/list?token=${token}`,
			'hx-trigger': 'htmx:afterSwap, change',
			'hx-target': '[name=list]',
			opts,
		})
	}

	public async list({ view, request }: HttpContextContract) {
		const { token, folder } = request.qs()
		const opts = await this.getLists(folder, token)

		return view.render('components/select', { name: 'list', opts })
	}
}
