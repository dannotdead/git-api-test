export interface ICommit {
	sha: string
	commit: {
		author: {
			date: string
			name: string
		}
	}
}