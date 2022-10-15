import { makeAutoObservable } from 'mobx'
import { IUser, IUserRepo } from '../interfaces/User'

class User {
	usernameSearch: string = ''
	userInfo: IUser | null = null
	userRepos: IUserRepo[] | null = null

	constructor() {
		makeAutoObservable(this)
	}

	set setUsernameSearch(value: string) {
		this.usernameSearch = value
	}

	set setUserInfo(value: IUser) {
		this.userInfo = value
	}

	set setUserRepos(value: IUserRepo[]) {
		this.userRepos = value
	}
}

export default new User()