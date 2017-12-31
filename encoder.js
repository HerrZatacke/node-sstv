const Modes = require('./modes.js');
const Picture = require('./picture.js');
const scottie = require('./encoders/scottie');
const robotBW = require('./encoders/robotBW');
const robotColour = require('./encoders/robotColour');
const martin = require('./encoders/martin');
const fax480 = require('./encoders/fax480');

class Encoder {

  constructor(options = {}) {
    this.tones = [];
    this.phase = 0;
    this.volume = options.volume || 8192;
    this.sampleRate = options.sampleRate || 44100;
  }

  _addSample(frequency) {
    const m = this.volume * Math.sin(this.phase);
    this.phase += ((2 * Math.PI * frequency) / this.sampleRate);
    if (this.phase > (2 * Math.PI)) {
      this.phase -= (2 * Math.PI);
    }
    this.tones.push(m & 255);
    this.tones.push((m >> 8) & 255);
  }

  _tone(frequency, duration) {
    const samples = this.sampleRate * (duration * .001);
    for (let s = 0; s < samples; s++) {
      this._addSample(frequency, s);
    }
  }

  reset() {
    this.tones = [];
    this.phase = 0;
  }

  deedleEedleMeepMeep() {
    this._tone(1900, 100);
    this._tone(1500, 100);
    this._tone(1900, 100);
    this._tone(1500, 100);
    this._tone(2300, 100);
    this._tone(1500, 100);
    this._tone(2300, 100);
    this._tone(1500, 100);
  }

  calibrationHeader(visCode) {

    this._tone(1900, 300);	// Leader
    this._tone(1200, 10);	// Break
    this._tone(1900, 300);	// Leader

    // VIS code 'b', LSB first, even parity
    this._tone(1200, 30);	// VIS start bit

    let parity = 0; // Parity accumulator
    for (let n = 0; n < 7; n++) {
      // noinspection JSBitwiseOperatorUsage
      this._tone(visCode & (1 << n) ? 1100 : 1300, 30); // A 1 or a 0
      // noinspection JSBitwiseOperatorUsage
      if (visCode & (1 << n)) {
        parity++; // Parity accumulator
      }
    }
    this._tone(parity % 2 === 0 ? 1300 : 1100, 30); // Parity bit
    this._tone(1200, 30); // VIS stop bit
  }

  _start(visCode) {
    this.reset();
    this.deedleEedleMeepMeep();
    this.calibrationHeader(visCode);
  }

  _finish() {
    const ret = new Buffer(this.tones);
    this.reset();
    return ret;
  }

  generate(mode, picture) {
    switch (mode) {
      case Modes.ROBOT_BW_8:
        return robotBW(0, picture, this);
      case Modes.ROBOT_BW_12:
        return robotBW(1, picture, this);
      case Modes.ROBOT_COLOR_36:
      case Modes.ROBOT_COLOUR_36:
        return robotColour(0, picture, this);
      case Modes.ROBOT_COLOR_72:
      case Modes.ROBOT_COLOUR_72:
        return robotColour(1, picture, this);
      case Modes.MARTIN_1:
        return martin(0, picture, this);
      case Modes.MARTIN_2:
        return martin(1, picture, this);
      case Modes.SCOTTIE_1:
        return scottie(0, picture, this);
      case Modes.SCOTTIE_2:
        return scottie(1, picture, this);
      case Modes.SCOTTIE_DX:
        return scottie(2, picture, this);
      case Modes.FAX480:
        return fax480(picture, this);
      default:
        return null;
    }
  }

  encode(mode, imagePath) {
    const picture = new Picture();
    return picture.load(imagePath)
    .then(() => this.generate(mode, picture))
  }
}



module.exports = Encoder;
