import axios from 'axios';

export async function autocomplete(query) {
	try {
		const response = await axios.get(
			'https://yfapi.net/v6/finance/autocomplete?lang=en&query='+query, {
				headers: {
					'X-API-KEY': '5TsWlejPj779wWpWGcRJ63bTXIzKbO2A15BnsPPA'
				}
			}
		)

		return response;
	} catch (error) {
		console.log(error);
	}
}
