import axios from 'axios';

export async function userLogin(email, password) {
	try {
		const response = await axios.post(
			'http://localhost:3005/api/user/login',
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
			'http://localhost:3005/api/user/signup',
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