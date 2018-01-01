const robotBW = function (variant, picture, encoder) {
  let syncTime;
  let yScanTime;
  let visCode;

  switch (variant) {
    case 0: // 8
      syncTime = 10;
      yScanTime = 56;
      visCode = 2;
      break;
    case 1: // 12
      syncTime = 7;
      yScanTime = 93;
      visCode = 6;
      break;
    default:
      break;
  }

  const samples = encoder.sampleRate * (yScanTime * .001);
  const scale = picture.width / samples;

  function scan(line) {
    encoder._tone(1200, syncTime);
    let sample;
    for (let s = 0; s < samples; s++) {
      try {
        sample = line[Math.floor(s * scale)].y;
      } catch (er) {
        /* no op */
      }
      encoder._addSample(sample, s);
    }
  }


  encoder._start(visCode);
  picture.yuv_af(120).forEach(scan);
  return encoder._finish();
};

module.exports = robotBW;
