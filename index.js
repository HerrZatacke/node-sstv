const fs = require('fs');
const Encoder = require('./encoder');
const { SCOTTIE_1, ROBOT_COLOR_36 } = require('./modes');

const enc = new Encoder();

// enc.encode(ROBOT_COLOR_36, './beatle300x256.png')
enc.encode(SCOTTIE_1, './beatle300x256.png')
.then((data) => {
  fs.writeFile('./signed16_mono.wav', data, (err) => {
    console.log(err);
    console.log('we are here');
  });
})
.catch(err => {
  console.log(err);
});
