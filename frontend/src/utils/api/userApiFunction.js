import axios from 'axios';

export async function userLogin(email, password) {
	try {
		const response = await axios.post(
			'http://localhost:3005/api/users/login',
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
			'http://localhost:3005/api/users/signup',
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
			'http://localhost:3005/api/users/', {
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
			'http://localhost:3005/api/users/', 
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