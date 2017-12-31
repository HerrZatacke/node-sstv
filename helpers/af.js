const af = (n) => {
  return 1500 + Math.min(255, Math.max(0, n)) * 3.1372549;
};

module.exports = af;
