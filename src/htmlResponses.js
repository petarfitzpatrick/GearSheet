const fs = require('fs');

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const css = fs.readFileSync(`${__dirname}/../client/style.css`);

const getIndex = (request, response) => {
  respond(request, response, index, 200, 'text/html');
};

const getStyle = (request, response) => {
  respond(request, response, css, 200, 'text/css');
};

const respond = (request, response, content, status, type) => {
  response.writeHead(status, { 'Content-Type': type });
  response.write(content);
  response.end();
};


module.exports.getIndex = getIndex;
module.exports.getStyle = getStyle;