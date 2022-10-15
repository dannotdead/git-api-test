import React, { useEffect, useState } from 'react';
import { showError } from './errorBoundary';

interface User {
	login: string,
	id: number,
	avatar_url: string,
	repos_url: string,
	public_repos: number,
}

interface UserRepo {
	id: number,
	name: string,
	language: string,
	description: null | string,
	stargazers_count: number,
	commits_url: string
}

interface Commit {
	sha: string
	commit: {
		author: {
			date: string
			name: string
		}
	}
}

const App = () => {
	const [usernameSearch, setUsernameSearch] = useState<string>('')
	const [userInfo, setUserInfo] = useState<User | null>(null)
	const [userRepos, setUserRepos] = useState<UserRepo[] | null>(null)
	const [isShowRepoDetails, setIsShowRepoDetails] = useState<boolean>(false)
	const [currentRepoCommit, setCurrentRepoCommit] = useState<string>('')

	const handleSubmit = (event: React.FormEvent<HTMLButtonElement>): void => {
		event.preventDefault()
		searchUser()
	}

	const searchUser = async () => {
		const [userInfoResponse, userReposResponse] = await Promise.all([
			fetch(`https://api.github.com/users/${usernameSearch}`),
			fetch(`https://api.github.com/users/${usernameSearch}/repos`),
		])

		showError(userInfoResponse)
		showError(userReposResponse)

		const userInfo: User = await userInfoResponse.json()
		const userRepos: UserRepo[] = await userReposResponse.json()

		setUserInfo(userInfo)
		setUserRepos(userRepos)
	}

	const handleShowRepoDetail = (commitsUrl: string = ''): void => {
		setIsShowRepoDetails(prevState => !prevState)
		setCurrentRepoCommit(commitsUrl)
	}

	return (
		<div>
			<form>
				<input 
					value={usernameSearch}
					onChange={(event) => setUsernameSearch(event.target.value)}
					placeholder='GitHub Username'
				/>
				<button onClick={handleSubmit}>Search</button>
			</form>

			{isShowRepoDetails ?
				<CommitDetails 
					handleShowRepoDetail={handleShowRepoDetail}
					currentRepoCommit={currentRepoCommit}
				/> :
				userInfo &&
					<>
						<div>
							<img src={userInfo.avatar_url} alt='' width={150} />
							<p>Login: {userInfo.login}</p>
							<p>Repos: {userInfo.public_repos}</p>
						</div>
	
						{userRepos &&
							<table>
								<thead>
									<tr>
										<th>Наименование</th>
										<th>Язык программирования</th>
										<th>Описание</th>
										<th>Количество звезд</th>
									</tr>
								</thead>
	
								<tbody>
								{userRepos.map(repo => (
									<tr key={repo.id}>
										<td onClick={() => handleShowRepoDetail(repo.commits_url)} style={{cursor: 'pointer'}}>{repo.name}</td>
										<td>{repo.language}</td>
										<td>{repo.description}</td>
										<td>{repo.stargazers_count}</td>
									</tr>
								))}
								</tbody>
							</table>
						}
					</>
			}
		</div>
	);
}

const CommitDetails = ({ handleShowRepoDetail, currentRepoCommit }: {handleShowRepoDetail: () => void, currentRepoCommit: string}) => {
	// добавить стейт mobX
	// провести декомпозицию компонентов
	const [commit, setCommit] = useState<Commit | null>(null)

	useEffect(() => {
		getCommit()
	}, [])

	const getCommit = async () => {
		const url = currentRepoCommit?.split('{')[0]
		const commitResponse = await fetch(url)

		showError(commitResponse)

		const commitData = await commitResponse.json()

		const date = dateToISO8601(commitData[0].commit.author.date)
		const commit: Commit = {
			sha: commitData[0].sha,
			commit: {
				author: {
					date,
					name: commitData[0].commit.author.name
				}
			}
		}

		setCommit(commit)
	}

	const dateToISO8601 = (rawDate: string): string => {
		const date = new Date(rawDate)

		const year = date.getFullYear()
		const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
		const day = date.getDay() < 10 ? '0' + date.getDay() : date.getDay()

		return `${year}-${month}-${day}`
	}


	return (
		<>
			<table>
				<thead>
					<tr>
						<th>Автор</th>
						<th>Хэш коммита</th>
						<th>Дата</th>
					</tr>
				</thead>

				<tbody>
					<tr>
						<td>{commit?.commit.author.name}</td>
						<td>{commit?.sha}</td>
						<td>{commit?.commit.author.date}</td>
					</tr>
				</tbody>
			</table>

			<button onClick={handleShowRepoDetail}>Назад</button>
		</>
	)
}

export default App;
