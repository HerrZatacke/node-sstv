const robotBW = function (variant, picture) {

  var self = this, syncTime, yScanTime, width, visCode;

  switch (variant) {
    case 0: // 8
      syncTime = 10;
      yScanTime = 56;
      width = 160;
      visCode = 2;
      break;
    case 1: // 12
      syncTime = 7;
      yScanTime = 93;
      width = 160;
      visCode = 6;
      break;
    default:
      break;
  }

  var samples = this.sampleRate * (yScanTime * .001);
  var scale = width / samples;

  function scan(line) {
    self._tone(1200, syncTime);
    for (var s = 0; s < samples; s++) {
      self._addSample(line[Math.floor(s * scale)].y, s);
    }
  }

  function encode() {
    self._start(visCode);
    picture.YUV_AF.forEach(scan);
    var data = self._finish();
  }

  picture.scale(120, encode);

}

module.exports = robotBW;
