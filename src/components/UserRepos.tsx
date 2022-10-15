import { observer } from 'mobx-react-lite'
import userStore from '../store/user'

const UserRepos = observer(({ handleShowRepoDetail }: {handleShowRepoDetail: (commitsUrl: string) => void}) => {
	return (
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
			{userStore?.userRepos?.map(repo => (
				<tr key={repo.id}>
					<td onClick={() => handleShowRepoDetail(repo.commits_url)} style={{cursor: 'pointer'}}>{repo.name}</td>
					<td>{repo.language}</td>
					<td>{repo.description}</td>
					<td>{repo.stargazers_count}</td>
				</tr>
			))}
			</tbody>
		</table>
	)
})

export default UserRepos