import { useState } from 'react'
import { observer } from 'mobx-react-lite'
import userStore from './store/user'
import SearchForm from './components/SearchForm'
import UserInfo from './components/UserInfo'
import UserRepos from './components/UserRepos'
import CommitDetails from './components/CommitDetails'
import ErrorBoundary from './components/ErrorBoundary'

const App = observer(() => {
	const [isShowRepoDetails, setIsShowRepoDetails] = useState<boolean>(false)
	const [currentRepoCommitsURL, setCurrentRepoCommit] = useState<string>('')

	const handleShowRepoDetail = (commitsUrl: string = ''): void => {
		setIsShowRepoDetails(prevState => !prevState)
		setCurrentRepoCommit(commitsUrl)
	}

	return (
		<div>
			<SearchForm />

			{isShowRepoDetails ?
				<CommitDetails 
					handleShowRepoDetail={handleShowRepoDetail}
					currentRepoCommitsURL={currentRepoCommitsURL}
				/> :
				(userStore.userInfo ?
					<>
						<UserInfo />

						{userStore.userRepos &&
							<UserRepos handleShowRepoDetail={handleShowRepoDetail} />
						}
					</> : <ErrorBoundary />)
			}
		</div>
	)
})

export default App
