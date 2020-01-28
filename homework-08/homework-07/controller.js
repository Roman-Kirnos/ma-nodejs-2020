const ram = require('./ram');

async function ok(res, body) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 200;
  res.write(JSON.stringify(body));
  res.end();
}

async function badRequest(res) {
  res.setHeader('Content-Type', 'application/json');
  res.statusCode = 400;
  res.write(JSON.stringify({ message: 'Filter value is not valid' }));
  res.end();
}

async function get200Code(res) {
  ok(res, { message: 'OK' });
}

async function getInfoAboutRam(res) {
  const body = ram.cliTool();
  ok(res, body);
}

async function getInfoAboutRamByFilter(req, res) {
  try {
    const body = {};
    const { message, ...params } = ram.cliTool();

    body.message = message;

    switch (req.filter) {
      case 'total':
        body.total = params.total;
        break;
      case 'free':
        body.free = params.free;
        break;
      case 'allocated':
        body.allocated = params.allocated;
        break;
      default:
        badRequest(res);
        return 0;
    }

    ok(res, body);
  } catch (err) {
    console.error(err);
  }
  return 0;
}

async function setLimit(limit = 1000, res) {
  const body = {};
  const answer = ram.setLimit(limit);

  body.message = answer;

  ok(res, body);
}

module.exports = {
  get200Code,
  getInfoAboutRam,
  getInfoAboutRamByFilter,
  setLimit,
};