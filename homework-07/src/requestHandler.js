const url = require('url');
const querystring = require('querystring');
const router = require('./router');
const authorization = require('./authorization');

function internalServerError(res, err) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 500;
  res.write(JSON.stringify({ message: 'Internal error occurred', Error: err }));
  res.end();
}

module.exports = async (request, response) => {
  try {
    const { url: uri } = request;

    const parsedUrl = url.parse(uri);
    const queryParams = querystring.decode(parsedUrl.query);

    let body = [];

    if (!authorization(request, response)) return 1;

    request
      .on('error', () => {
        throw new Error();
      })
      .on('data', (chunk) => {
        body.push(chunk);
      })
      .on('end', () => {
        body = Buffer.concat(body).toString();

        router(
          {
            ...request,
            body: body ? JSON.parse(body) : {},
            url: parsedUrl,
            queryParams,
          },
          response,
        );
      });
  } catch (err) {
    internalServerError(response, err);
  }
  return 0;
};
