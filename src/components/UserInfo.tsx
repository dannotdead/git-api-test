import { observer } from 'mobx-react-lite'
import userStore from '../store/user'

const UserInfo = observer(() => {
	return (
		<div>
			<img src={userStore?.userInfo?.avatar_url} alt='' width={150} />
			<p>Login: {userStore?.userInfo?.login}</p>
			<p>Repos: {userStore?.userInfo?.public_repos}</p>
		</div>
	)
})

export default UserInfo