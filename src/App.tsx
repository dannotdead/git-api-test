import React, { useState } from 'react';

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
	const [usernameSearch, setUsernameSearch] = useState('')
	const [userInfo, setUserInfo] = useState<User | null>(null)
	const [userRepos, setUserRepos] = useState<UserRepo[] | null>(null)
	const [isShowRepoDetails, setIsShowRepoDetails] = useState<boolean>(false)
	const [currentRepoCommit, setCurrentRepoCommits] = useState<Commit | null>(null)

	const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
		event.preventDefault()
		searchUser()
	}

	const searchUser = () => {
		Promise.all([
			fetch(`https://api.github.com/users/${usernameSearch}`),
			fetch(`https://api.github.com/users/${usernameSearch}/repos`),
		])
			.then(res => Promise.all(res.map(item => item.json())))
			.then(data => {
				console.log(data)
				setUserInfo(data[0])
				setUserRepos(data[1])
			})
	}

	const handleShowRepoDetail = (commitsUrl: string = '') => {
		setIsShowRepoDetails(prevState => !prevState)
		
		const url = commitsUrl?.split('{')[0]

		if (!isShowRepoDetails) {
			fetch(url)
				.then(res => res.json())
				.then(data => setCurrentRepoCommits(data[0]))
		}
		// setCurrentRepoCommits(commitsUrl)
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

const CommitDetails = ({ handleShowRepoDetail, currentRepoCommit }: {handleShowRepoDetail: () => void, currentRepoCommit: Commit | null}) => {
	const date = new Date(currentRepoCommit?.commit.author.date || '').toDateString()
	// пофиксить отображение даты
	// добавить стейт mobX
	// провести декомпозицию компонентов

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
						<td>{currentRepoCommit?.commit.author.name}</td>
						<td>{currentRepoCommit?.sha}</td>
						<td>{date}</td>
					</tr>
				</tbody>
			</table>
			<button onClick={handleShowRepoDetail}>Назад</button>
		</>
	)
}

export default App;
