import { observer } from 'mobx-react-lite'
import { IUser, IUserRepo } from '../interfaces/User'
import { showError } from '../errorBoundary'
import userStore from '../store/user'

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
		<form>
			<input 
				value={userStore.usernameSearch}
				onChange={(event) => userStore.setUsernameSearch = event.target.value}
				placeholder='GitHub Username'
			/>

			<button onClick={handleSubmit}>Search</button>
		</form>
	)
})

export default SearchForm