const scottie = function (variant, picture, encoder) {

  let scanTime;
  let visCode;

  switch (variant) {
    case 0: // 1
      scanTime = 138.24;
      visCode = 60;
      break;
    case 1: // 2
      scanTime = 88.064;
      visCode = 56;
      break;
    case 2: // DX
      scanTime = 345.6;
      visCode = 76;
      break;
    default:
      break;
  }

  const samples = encoder.sampleRate * (scanTime * .001);
  const scale = 320 / samples;

  function sync() {
    encoder._tone(1200, 9);
    encoder._tone(1500, 1.5);
  }

  function separate() {
    encoder._tone(1500, 1.5);
  }

  const sampleRange = {
    min: 9000,
    max: 0,
  };

  function scan(line, colour) {
    let sample;
    for (let s = 0; s < samples; s++) {
      try {
        sample = line[Math.floor(s * scale)][colour];
        // sampleRange.min = Math.min(sampleRange.min, sample);
        // sampleRange.max = Math.max(sampleRange.max, sample);
      } catch (er) {
        /* no op */
      }
      encoder._addSample(sample, s);
    }
  }

  function cycle(line) {
    separate();
    scan(line, 'g');
    separate();
    scan(line, 'b');
    sync();
    scan(line, 'r');
  }

  encoder._start(visCode);
  picture.RGB_AF.forEach(cycle);
  console.log(sampleRange);
  return encoder._finish();

};

module.exports = scottie;
