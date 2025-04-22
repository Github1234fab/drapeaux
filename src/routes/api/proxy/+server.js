export async function GET({ url }) {
    const endpoint = url.searchParams.get('endpoint');
    if (!endpoint) {
      return new Response(JSON.stringify({ error: 'Missing endpoint' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  
    try {
      const decoded = decodeURIComponent(endpoint);
      const response = await fetch(decoded);
      const data = await response.json();
  
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Server error', details: err.message }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
  }
  