const robotColour = function (variant, picture, encoder) {
  let yScanTime;
  let uvScanTime;
  let visCode;
  let vPorchTone;

  switch (variant) {
    case 0: // 36
      yScanTime = 88;
      uvScanTime = 44;
      visCode = 8;
      vPorchTone = 1900;
      break;
    case 1: // 72
      yScanTime = 138;
      uvScanTime = 69;
      visCode = 12;
      vPorchTone = 1500;
      break;
    default:
      break;
  }

  const ySamples = encoder.sampleRate * (yScanTime * .001);
  const uvSamples = encoder.sampleRate * (uvScanTime * .001);

  const yScale = 320 / ySamples;
  const uvScale = 320 / uvSamples;

  function addSamples(line, samples, scale, yuv) {
    let sample;
    for (let s = 0; s < samples; s++) {
      try {
        sample = line[Math.floor(s * scale)][yuv];
      } catch (er) {
        /* no op */
      }
      encoder._addSample(sample, s);
    }
  }

  function yScan(line) {
    encoder._tone(1200, 9);
    encoder._tone(1500, 3);
    addSamples(line, ySamples, yScale, 'y');
  }

  /*	I'm being lazy and not averaging the U & V values for every two lines.
    I doubt if it will make much of a difference once implemented, but it's
    on my mental to-do list anyhow. */
  function uScan(line) {
    encoder._tone(1500, 4.5);
    encoder._tone(1900, 1.5);
    addSamples(line, uvSamples, uvScale, 'u');
  }

  function vScan(line) {
    encoder._tone(2300, 4.5);
    encoder._tone(vPorchTone, 1.5);
    addSamples(line, uvSamples, uvScale, 'v');
  }

  function scan36(line, index) {
    yScan(line);
    (index % 2 === 0 ? uScan : vScan)(line);
  }

  function scan72(line) {
    yScan(line);
    uScan(line);
    vScan(line);
  }

  encoder._start(visCode);
  picture.YUV_AF.forEach(variant === 0 ? scan36 : scan72);
  return encoder._finish();

};

module.exports = robotColour;
