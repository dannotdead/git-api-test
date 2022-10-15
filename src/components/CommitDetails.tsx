import { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { ICommit } from '../interfaces/Commit'
import commitStore from '../store/commit'
import { showError } from '../errorBoundary'

const CommitDetails = observer(({ 
		handleShowRepoDetail,
		currentRepoCommitsURL
	}: {
		handleShowRepoDetail: () => void,
		currentRepoCommitsURL: string
	}) => {

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


export default CommitDetails