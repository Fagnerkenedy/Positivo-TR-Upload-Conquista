function displayPrice(value) {
  return new Intl.NumberFormat("pt-br", { style: "currency", currency: "BRL" }).format(value);
}

module.exports = displayPrice;
