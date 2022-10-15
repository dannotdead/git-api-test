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
		const getCommit = async () => {
			commitStore.setResetCommits = []
			const url = currentRepoCommitsURL?.split('{')[0]
			const commitResponse = await fetch(url)

			showError(commitResponse)

			const commitData: ICommit[] = await commitResponse.json()

			commitData.forEach(commit => {
				const date = dateToISO8601(commit.commit.author.date)
				const newCommit: ICommit = {
					sha: commit.sha,
					commit: {
						author: {
							date,
							name: commit.commit.author.name
						}
					}
				}

				commitStore.setCommit = newCommit
			})
		}

		getCommit()
	}, [currentRepoCommitsURL])

	const dateToISO8601 = (rawDate: string): string => {
		const date = new Date(rawDate)

		const year = date.getFullYear()
		const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth()
		const day = date.getDay() < 10 ? '0' + date.getDay() : date.getDay()

		return `${year}-${month}-${day}`
	}

	return (
		<>
			<table className='w-full max-w-4xl text-center text-gray-700 mb-10'>
				<thead>
					<tr>
						<th className='border-r border-slate-300'>Автор</th>
						<th className='border-r border-slate-300'>Хэш коммита</th>
						<th>Дата</th>
					</tr>
				</thead>

				<tbody>
					{commitStore?.commits?.map(commit => (
						<tr>
							<td>{commit.commit.author.name}</td>
							<td>{commit.sha}</td>
							<td>{commit.commit.author.date}</td>
						</tr>
					))}
				</tbody>
			</table>

			<div className='rounded-full bg-gradient-to-r p-[4px] from-[#81d7ff] via-[#a8b7fe] to-[#e783fc] text-gray-700'>
				<div className='flex flex-col justify-between h-full bg-white rounded-full px-4 py-1 hover:bg-transparent hover:text-white'>
					<button
						className=''
						onClick={handleShowRepoDetail}
					>
						Назад
					</button>
					</div>
			</div>
		</>
	)
})


export default CommitDetails