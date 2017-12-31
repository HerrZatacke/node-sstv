const fax480 = function (picture) {

  var self = this;
  var samples = this.sampleRate * (262.144 * .001);
  var scale = 512 / samples;

  function header() {
    self._tone(2300, 2.05);
    self._tone(1500, 2.05);
  }

  function phasingInterval() {
    self._tone(1200, 5.12);
    self._tone(2300, 262.144);
  }

  function scan(line) {
    self._tone(1200, 5.12);
    for (var s = 0; s < samples; s++) {
      self._addSample(line[Math.floor(s * scale)].y, s);
    }
  }

  function encode() {
    for (var n = 0; n < 1220; n++) {
      header();
    }
    for (var n = 0; n < 20; n++) {
      phasingInterval();
    }
    picture.YUV_AF.forEach(scan);
    var data = self._finish();
  }

  picture.scale(480, encode);

};

module.exports = fax480;
