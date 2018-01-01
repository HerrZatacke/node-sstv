const Duplex = require('stream').Duplex;

function buffer2stream(buffer) {
  let stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

module.exports = buffer2stream;
