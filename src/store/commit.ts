import { makeAutoObservable } from 'mobx'
import { ICommit } from '../interfaces/Commit'

class Commit {
	commit: ICommit | null = null

	constructor() {
		makeAutoObservable(this)
	}

	set setCommit(value: ICommit) {
		this.commit = value
	}
}

export default new Commit()