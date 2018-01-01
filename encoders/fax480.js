const fax480 = function (picture, encoder) {
  const samples = encoder.sampleRate * (262.144 * .001);
  const scale = picture.width / samples;

  function header() {
    encoder._tone(2300, 2.05);
    encoder._tone(1500, 2.05);
  }

  function phasingInterval() {
    encoder._tone(1200, 5.12);
    encoder._tone(2300, 262.144);
  }

  function scan(line) {
    encoder._tone(1200, 5.12);
    let sample;
    for (let s = 0; s < samples; s++) {
      try {
        sample = line[Math.floor(s * scale)].y
      } catch (err) {
        /* no op */
      }
      encoder._addSample(sample, s);
    }
  }

  for (let n = 0; n < 1220; n++) {
    header();
  }
  for (let n = 0; n < 20; n++) {
    phasingInterval();
  }
  picture.yuv_af(480).forEach(scan);
  return encoder._finish();
};

module.exports = fax480;
