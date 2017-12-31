const martin = function (variant, picture) {

  var self = this, scanTime, visCode;

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

  var samples = this.sampleRate * (scanTime * .001);
  var scale = 320 / samples;

  function sync() {
    self._tone(1200, 4.862);
    self._tone(1500, 0.572);
  }

  function scan(line, colour) {
    for (var s = 0; s < samples; s++) {
      self._addSample(line[Math.floor(s * scale)][colour], s);
    }
    self._tone(1500, 0.572); // Separator
  }

  function cycle(line) {
    sync();
    scan(line, 'g');
    scan(line, 'b');
    scan(line, 'r');
  }

  function encode() {
    self._start(visCode);
    picture.RGB_AF.forEach(cycle);
    var data = self._finish();
  }

  picture.scale(256, encode);

}

module.exports = martin;
