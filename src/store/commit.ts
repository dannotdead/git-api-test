import { makeAutoObservable } from 'mobx'
import { ICommit } from '../interfaces/Commit'

class Commit {
	commits: ICommit[] | null = []

	constructor() {
		makeAutoObservable(this)
	}

	set setCommit(value: ICommit) {
		this.commits?.push(value)
	}
	set setResetCommits(value: []) {
		this.commits = value
	}

}

export default new Commit()