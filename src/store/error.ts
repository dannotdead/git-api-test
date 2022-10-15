import { makeAutoObservable } from 'mobx'

class Error {
	userNotFound: string | null = null

	constructor() {
		makeAutoObservable(this)
	}

	set setUserNotFoundError(value: string | null) {
		this.userNotFound = value
	}
}

export default new Error()