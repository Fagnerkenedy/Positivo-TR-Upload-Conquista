module.exports = (crmType) => {
  let dealType = "";
  switch (crmType.toLowerCase()) {
    case "conquista novos":
    case "spe":
      dealType = "Novos";
      break;
    case "conquista renovação":
    case "spe renovação":
      dealType = "Renovação";
      break;
    case "conquista ampliação":
    case "spe ampliação":
      dealType = "Ampliação";
      break;
    case "pes novos":
      dealType = "PES Novos";
      break;
    case "pes renovação":
      dealType = "PES Renovação";
      break;
    case "pes ampliação":
      dealType = "PES Ampliação";
      break;
    case "pes english":
      dealType = "PES English";
      break;
    case "maralto":
      dealType = "Maralto";
      break;
    default:
      break;
  }

  return dealType;
};
