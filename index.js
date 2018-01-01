const path = require('path');
const wav = require('wav');
const buffer2stream = require('./helpers/buffer2stream');
const Encoder = require('./encoder');
const Modes = require('./modes');

const enc = new Encoder();

// const mode = 'ROBOT_COLOR_36';
const mode = 'SCOTTIE_1';
const inFilename = './beatle300x256.png';
const outFilename = `./${path.basename(inFilename, path.extname(inFilename))}_${mode}.wav`;

const writer = new wav.FileWriter(outFilename, {
  format: 1,
  channels: 1,
  sampleRate: 44100,
  bitDepth: 16,
});

enc.encode(Modes[mode], inFilename)
.then((data) => {
  buffer2stream(data).pipe(writer);
})
.catch(err => {
  console.log(err);
});
