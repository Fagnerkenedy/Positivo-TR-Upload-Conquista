module.exports = (d) => {
  function pad(n) {
    return n < 10 ? '0' + n : n;
  }
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + 'T' + pad(d.getHours()) + '_' + pad(d.getMinutes()) + '_' + pad(d.getSeconds());
}
