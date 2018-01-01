const martin = function (variant, picture, encoder) {

  let scanTime;
  let visCode;

  switch (variant) {
    case 0: // M1
      scanTime = 146.432;
      visCode = 44;
      break;
    case 1: // M2
      scanTime = 73.216;
      visCode = 40;
      break;
    default:
      break;
  }

  const samples = encoder.sampleRate * (scanTime * .001);
  const scale = picture.width / samples;

  function sync() {
    encoder._tone(1200, 4.862);
    encoder._tone(1500, 0.572);
  }

  function scan(line, colour) {
    let sample;
    for (let s = 0; s < samples; s++) {
      try {
        sample = line[Math.floor(s * scale)][colour];
      } catch (er) {
        /* no opp */
      }
      encoder._addSample(sample, s);
    }
    encoder._tone(1500, 0.572); // Separator
  }

  function cycle(line) {
    sync();
    scan(line, 'g');
    scan(line, 'b');
    scan(line, 'r');
  }

  encoder._start(visCode);
  picture.rgb_af(256).forEach(cycle);
  return encoder._finish();
};

module.exports = martin;
