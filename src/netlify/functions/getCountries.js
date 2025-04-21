export async function handler(event, context) {
	const { endpoint } = event.queryStringParameters;

	if (!endpoint) {
		return {
			statusCode: 400,
			body: JSON.stringify({ error: 'Missing endpoint parameter' })
		};
	}

	try {
		const decodedUrl = decodeURIComponent(endpoint);
		const response = await fetch(decodedUrl);

		if (!response.ok) {
			return {
				statusCode: response.status,
				body: JSON.stringify({ error: 'Failed to fetch from API' })
			};
		}

		const data = await response.json();

		return {
			statusCode: 200,
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Headers': 'Content-Type'
			},
			body: JSON.stringify(data)
		};
	} catch (error) {
		return {
			statusCode: 500,
			body: JSON.stringify({ error: 'Server error', details: error.message })
		};
	}
}
