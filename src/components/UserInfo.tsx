import { observer } from 'mobx-react-lite'
import userStore from '../store/user'

const UserInfo = observer(() => {
	return (
		<div className='flex items-center flex-col mb-10 text-gray-700'>
			<img
				className='rounded-full'
				src={userStore?.userInfo?.avatar_url}
				alt=''
				width={150}
			/>
			<p>
				<b>Никнейм:</b> {userStore?.userInfo?.login}
			</p>
			<p>
				<b>Количество публичных репозиториев:</b> {userStore?.userInfo?.public_repos}
			</p>
		</div>
	)
})

export default UserInfo