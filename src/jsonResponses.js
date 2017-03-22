//Code borrowed from Cody's example API assignments
const crypto = require('crypto');

const gear = {};

let etag = crypto.createHash('sha1').update(JSON.stringify(gear));
let digest = etag.digest('hex');


const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
    etag: digest,
  };
  
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const getGear = (request, response, params) => {
  const responseJSON = {
    gear,
  };
    
  var publicJSON = JSON.parse(JSON.stringify(responseJSON));
  delete publicJSON.gear.secret;
  console.log(responseJSON);
  console.log(publicJSON);

  if (params.secret == 'true'){
  return respondJSON(request, response, 200, responseJSON);
  }
    
  return respondJSON(request, response, 200, publicJSON);
};

const getGearMeta = (request, response) => {
  if (request.headers['if-none-match'] === digest) {
    return respondJSONMeta(request, response, 304);
  }

  return respondJSONMeta(request, response, 304);
};


const updateGear = (request, response) => {
  const newGear = {
    createdAt: Date.now(),
  };

  gear[newGear.createdAt] = newGear;
  
  etag = crypto.createHash('sha1').update(JSON.stringify(gear));
  digest = etag.digest('hex');

  return respondJSON(request, response, 201, newGear);
};

const addGear = (request, response, body) => {
  const responseJSON = {
    message: 'Title field is required',
  };

  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (gear[body.name]) {
    responseCode = 204;
  } else {
    gear[body.name] = {};
  }

  gear[body.name].name = body.name;
  gear[body.name].head = body.head;
  gear[body.name].chest = body.chest;
  gear[body.name].arms = body.arms;
  gear[body.name].legs = body.legs;
  gear[body.name].feet = body.feet;
  gear[body.name].picture = body.picture;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }

  return respondJSONMeta(request, response, responseCode);
};


const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {

  respondJSONMeta(request, response, 404);
};


module.exports = {
  getGear,
  getGearMeta,
  addGear,
  updateGear,
  notFound,
  notFoundMeta,
};
