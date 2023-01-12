module.exports = (data, decimals = 2) => {
  if (data === "N/A" || data === "n/a" || data === "" || data === "NaN" || data === "N/A%" || data === null || data === undefined) {
    data = "0%";
  }
  return Number(data.replace(/\s/g, "").replace(/%/, "").replace(/\$/, "").replace(/,/gi, "")).toFixed(decimals);
};
