export interface IUser {
	login: string,
	id: number,
	avatar_url: string,
	repos_url: string,
	public_repos: number,
}

export interface IUserRepo {
	id: number,
	name: string,
	language: string,
	description: null | string,
	stargazers_count: number,
	commits_url: string
}