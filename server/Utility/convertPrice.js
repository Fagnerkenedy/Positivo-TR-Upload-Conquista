module.exports = (value, decimals = 2) => {
  if (value === null || value === undefined) return Number(0).toFixed(decimals);
  let returnValue = Number(value.replace(/\s/g, "").replace(/\D/, "").replace(/\$/, "").replace(/,/gi, "")).toFixed(decimals);
  if (isNaN(returnValue)) return Number(0).toFixed(decimals);
  return returnValue;
};
