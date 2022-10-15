import errorStore from './store/error'
import userStore from './store/user'

export const showError = (res: Response) => {
	if (!res.ok) {
		const message = `An error has occured: ${res.status}`
		errorStore.setUserNotFoundError = 'User not found'
		userStore.setUserInfo = null
		throw new Error(message)
	} else {
		errorStore.setUserNotFoundError = null
	}
}