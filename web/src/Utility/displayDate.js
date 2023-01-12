function displayDate(value) {
  if (value === undefined || value === null) return "";
  // Remove the hours if any
  value = value.split(" ")[0];
  const convertDate = new Date(`${value} 00:00:00`);
  return (
    convertDate.getDate() + "/" + (convertDate.getMonth() + 1) + "/" + convertDate.getFullYear()
  );
}

module.exports = displayDate;
