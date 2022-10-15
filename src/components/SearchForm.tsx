import { observer } from 'mobx-react-lite'
import { IUser, IUserRepo } from '../interfaces/User'
import { showError } from '../errorBoundary'
import userStore from '../store/user'
import SearchIcon from '../assets/images/right-arrow.png'

const SearchForm = observer(() => {
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

		console.log(userInfo)

		userStore.setUserInfo = userInfo
		userStore.setUserRepos = userRepos
	}

	return (
		<form className='w-full max-w-sm my-10'>
			<div className='flex items-center shadow border border-slate-300 p-2 m-auto rounded'>
				<input
					className='w-full focus:outline-none'
					value={userStore.usernameSearch}
					onChange={(event) => userStore.setUsernameSearch = event.target.value}
					placeholder='GitHub Username'
				/>

				<button
					onClick={handleSubmit}
					className='border-l border-slate-300 pl-2'
				>
					<img src={SearchIcon} alt='' width={25} />
				</button>
			</div>
		</form>
	)
})

export default SearchForm