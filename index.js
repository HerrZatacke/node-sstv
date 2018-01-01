const path = require('path');
const wav = require('wav');
const chalk = require('chalk');
const buffer2stream = require('./helpers/buffer2stream');
const Encoder = require('./encoder');
const Modes = require('./modes');

const encoder = new Encoder();

const inFilename = './beatle.png';
const writerOptions = {
  format: 1,
  channels: 1,
  sampleRate: 44100,
  bitDepth: 16,
};

Object.keys(Modes).forEach((mode) => {
  const outFilename = `./out/${path.basename(inFilename, path.extname(inFilename))}_${mode.toLowerCase()}.wav`;

  encoder.encode(Modes[mode], inFilename)
  .catch(err => {
    console.log(chalk.red(`Mode: ${mode} caused error: ${err.message}`));
    return null;
  })
  .then((data) => {
    if (!data || !data.length) {
      return null;
    }
    const writer = new wav.FileWriter(outFilename, writerOptions);
    buffer2stream(data).pipe(writer);
    console.log(chalk.green(`Mode: ${mode} file written: ${outFilename}`));
  })
  .catch(err => {
    console.log(chalk.red(`Mode: ${mode} file error: ${err.message}`));
  });
});
