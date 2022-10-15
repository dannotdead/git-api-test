import { observer } from 'mobx-react-lite'
import errorStore from '../store/error'

const ErrorBoundary = observer(() => {
	return (
		<>
			{errorStore.userNotFound &&
				<div>
					<p>Такого пользователя не существует, попробуйте другой никнейм</p>
				</div>
			}
		</>
	)
})

export default ErrorBoundary