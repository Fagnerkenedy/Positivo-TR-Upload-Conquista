module.exports = (crmType) => {
    let dealCompany = "";
    switch (crmType.toLowerCase()) {
      case "conquista":
      case "conquista novos":
      case "conquista renovação":
      case "conquista ampliação":
        dealCompany = "conquista";
        break;
      case "spe":
      case "spe renovação":
      case "spe ampliação":
        dealCompany = "spe";
        break;
      case "pes":
      case "pes renovação":
      case "pes language":
        dealCompany = "pes";
        break;
      default:
        break;
    }
  
    return dealCompany;
  };
  