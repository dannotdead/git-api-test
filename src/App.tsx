import React, { useEffect, useState } from 'react'
import { showError } from './errorBoundary'
import { IUser, IUserRepo } from './interfaces/User'
import { ICommit } from './interfaces/Commit'
import { observer } from 'mobx-react-lite'
import userStore from './store/user'
import commitStore from './store/commit'

const App = observer(() => {
	const [isShowRepoDetails, setIsShowRepoDetails] = useState<boolean>(false)
	const [currentRepoCommitsURL, setCurrentRepoCommit] = useState<string>('')

	const handleSubmit = (event: React.FormEvent<HTMLButtonElement>): void => {
		event.preventDefault()
		searchUser()
	}

	const searchUser = async () => {
		const [userInfoResponse, userReposResponse] = await Promise.all([
			fetch(`https://api.github.com/users/${userStore.usernameSearch}`),
			fetch(`https://api.github.com/users/${userStore.usernameSearch}/repos`),
		])

		showError(userInfoResponse)
		showError(userReposResponse)

		const userInfo: IUser = await userInfoResponse.json()
		const userRepos: IUserRepo[] = await userReposResponse.json()

		userStore.setUserInfo = userInfo
		userStore.setUserRepos = userRepos
	}

	const handleShowRepoDetail = (commitsUrl: string = ''): void => {
		setIsShowRepoDetails(prevState => !prevState)
		setCurrentRepoCommit(commitsUrl)
	}

	return (
		<div>
			<form>
				<input 
					value={userStore.usernameSearch}
					onChange={(event) => userStore.setUsernameSearch = event.target.value}
					placeholder='GitHub Username'
				/>
				<button onClick={handleSubmit}>Search</button>
			</form>

			{isShowRepoDetails ?
				<CommitDetails 
					handleShowRepoDetail={handleShowRepoDetail}
					currentRepoCommitsURL={currentRepoCommitsURL}
				/> :
				userStore.userInfo &&
					<>
						<div>
							<img src={userStore.userInfo.avatar_url} alt='' width={150} />
							<p>Login: {userStore.userInfo.login}</p>
							<p>Repos: {userStore.userInfo.public_repos}</p>
						</div>
	
						{userStore.userRepos &&
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
								{userStore.userRepos.map(repo => (
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
})

const CommitDetails = observer(({ handleShowRepoDetail, currentRepoCommitsURL }: {handleShowRepoDetail: () => void, currentRepoCommitsURL: string}) => {
	// добавить стейт mobX
	// провести декомпозицию компонентов
	// const [commit, setCommit] = useState<ICommit | null>(null)

	useEffect(() => {
		getCommit()
	}, [])

	const getCommit = async () => {
		const url = currentRepoCommitsURL?.split('{')[0]
		const commitResponse = await fetch(url)

		showError(commitResponse)

		const commitData = await commitResponse.json()

		const date = dateToISO8601(commitData[0].commit.author.date)
		const newCommit: ICommit = {
			sha: commitData[0].sha,
			commit: {
				author: {
					date,
					name: commitData[0].commit.author.name
				}
			}
		}

		commitStore.setCommit = newCommit
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

				{commitStore.commit && 
					<tbody>
						<tr>
							<td>{commitStore.commit.commit.author.name}</td>
							<td>{commitStore.commit.sha}</td>
							<td>{commitStore.commit.commit.author.date}</td>
						</tr>
					</tbody>
				}
			</table>

			<button onClick={handleShowRepoDetail}>Назад</button>
		</>
	)
})

export default App;
