import { observer } from 'mobx-react-lite'
import userStore from '../store/user'

const UserRepos = observer(({ handleShowRepoDetail }: {handleShowRepoDetail: (commitsUrl: string) => void}) => {
	return (
		<table className='w-full text-center text-gray-700'>
			<thead className='p-8'>
				<tr>
					<th className='border-r border-slate-300'>Наименование</th>
					<th className='border-r border-slate-300'>Язык программирования</th>
					<th className='border-r border-slate-300'>Описание</th>
					<th>Количество звезд</th>
				</tr>
			</thead>

			<tbody>
				{userStore?.userRepos?.map(repo => (
					<tr key={repo.id}>
						<td
							className='cursor-pointer hover:underline'
							onClick={() => handleShowRepoDetail(repo.commits_url)}
						>{repo.name}</td>
						<td>{repo.language}</td>
						<td>{repo.description ? repo.description : '-'}</td>
						<td>{repo.stargazers_count}</td>
					</tr>
				))}
			</tbody>
		</table>
	)
})

export default UserRepos