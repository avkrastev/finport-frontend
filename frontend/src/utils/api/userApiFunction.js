import axios from 'axios';

export async function userLogin(email, password) {
	try {
		const response = await axios.post(
			process.env.REACT_APP_BACKEND_URL + '/users/login',
			{
				email, 
				password
			}
		)

		return response;
	} catch (error) {
		console.log(error);
	}
}

export async function userSignUp(name, email, password) {
	try {
		const response = await axios.post(
			process.env.REACT_APP_BACKEND_URL + '/users/signup',
			{
				name,
				email, 
				password
			}
		)

		return response;
	} catch (error) {
		console.log(error);
	}
}

export async function getLoggedInUserData() {
	const token = JSON.parse(localStorage.getItem('userData')).token;

	try {
		const response = await axios.get(
			process.env.REACT_APP_BACKEND_URL + '/users/', {
				headers: {
					'Authorization': `Basic ${token}` 
				}
			}
		)

		return response;
	} catch (error) {
		console.log(error);
	}
}

export async function updateUser(data, key) {
	const token = JSON.parse(localStorage.getItem('userData')).token;
	try {
		const response = await axios.patch(
			process.env.REACT_APP_BACKEND_URL + '/users/', 
			{
				key, 
				data,
			},
			{
				headers: {
					'Authorization': `Basic ${token}` 
				}
			}
		)

		return response;
	} catch (error) {
		console.log(error);
	}
}