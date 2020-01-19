export default class SendRequest{
    async fetch(url, method, token, body = null){

        let headers = {
            'Content-Type': 'application/json',
        };
        if (token){
            headers['X-AUTH-TOKEN'] = token;
        }

        let fetchBody = {
            method: method,
            headers: headers
        };
        console.log(body);
        if (body){
            fetchBody['body'] = JSON.stringify(body);
        }
        const response = await fetch(url, fetchBody);

        const responseBody =  await response.json();

        if ('Username could not be found.' === responseBody.message){
            return false;
        }

        if (403 === responseBody.status){
            return false;
        }

        return responseBody;
    }
}