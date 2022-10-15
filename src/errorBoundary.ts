import errorStore from './store/error'

export const showError = (res: Response) => {
	if (!res.ok) {
		const message = `An error has occured: ${res.status}`
		errorStore.setUserNotFoundError = 'User not found'
		throw new Error(message)
	} else {
		errorStore.setUserNotFoundError = null
	}
}