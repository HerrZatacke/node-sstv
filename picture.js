const getPixels = require('get-pixels');
const rgb2yuv = require('./helpers/rgb2yuv');
const af = require('./helpers/af');

class Picture {

  constructor() {
    this.imageData = null;
    this.imageDimensions = null;
  }

  pixel2af(x, y, mode) {
    const rgb = {
      r: this.imageData.get(x, y, 0),
      g: this.imageData.get(x, y, 1),
      b: this.imageData.get(x, y, 2),
    };

    switch (mode) {
      case 'rgb':
      return {
        r: af(rgb.r),
        g: af(rgb.g),
        b: af(rgb.b),
      };
      case 'yuv':
        const yuv = rgb2yuv(rgb);
        return {
          y: af(yuv.y),
          u: af(yuv.u),
          v: af(yuv.v),
        };
      default:
        return null;
    }
  }

  line2af(y, mode) {
    const line = [];
    for (let x = 0; x < this.imageDimensions.width; x++) {
      line[x] = this.pixel2af(x, y, mode);
    }
    return line;
  }

  image2af(lineCount, mode) {
    const lines = [];
    for (let y = 0; y < lineCount; y++) {
      const relativeLine = Math.floor(y * this.imageDimensions.height / lineCount);
      lines[y] = this.line2af(relativeLine, mode);
    }
    return lines;
  }

  yuv_af(lines) {
    return this.image2af(lines, 'yuv');
  }

  rgb_af(lines) {
    return this.image2af(lines, 'rgb');
  };

  get width() {
    return this.imageDimensions.width;
  };

  load(filename) {
    return new Promise((resolve, reject) => {
      getPixels(filename, (err, imageData) => {
        if (err) {
          reject(err);
          return;
        }
        this.imageData = imageData;
        this.imageDimensions = {
          width: imageData.shape[0],
          height: imageData.shape[1],
        };
        resolve(this);
      })
    });
  };
}

module.exports = Picture;
