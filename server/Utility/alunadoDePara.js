const alunadoCrmField = (product, nivel, ano_serie, return_template) => {
  let replace_key = "";
  nivel = nivel || "";
  ano_serie = ano_serie || "";

  // Create switch based on product -> nivel -> ano/serie
  switch (product.toLowerCase()) {
    case "spe":
    case "spe novos":
    case "spe renovação":
    case "spe ampliação":
      switch (ano_serie.toLowerCase().replace(/ /g,"")) {
        case "grupo1":
          replace_key = "N_mero_1";
          break;
        case "grupo2":
          replace_key = "N_mero_2";
          break;
        case "grupo3":
          replace_key = "N_mero_3";
          break;
        case "grupo4":
          replace_key = "N_mero_4";
          break;
        case "grupo5":
          replace_key = "N_mero_5";
          break;
        case "1ºano":
          replace_key = "N_mero_6";
          break;
        case "2ºano":
          replace_key = "N_mero_7";
          break;
        case "3ºano":
          replace_key = "N_mero_8";
          break;
        case "4ºano":
          replace_key = "N_mero_9";
          break;
        case "5ºano":
          replace_key = "N_mero_10";
          break;
        case "6ºano":
          replace_key = "N_mero_11";
          break;
        case "7ºano":
          replace_key = "N_mero_12";
          break;
        case "8ºano":
          replace_key = "N_mero_13";
          break;
        case "9ºano":
          replace_key = "N_mero_14";
          break;
        case "1ªsérie":
          replace_key = "N_mero_15";
          break;
        case "2ªsérie":
          replace_key = "N_mero_16";
          break;
        case "3ªsérie":
          replace_key = "N_mero_17";
          break;
        case "extensivo":
          replace_key = "N_mero_19";
          break;
        case "semi-extensivo":
          replace_key = "N_mero_18";
          break;
        case "preparapositivo(extensivo)":
          replace_key = "Prepara_Positivo_Extensivo";
          break;
        case "preparapos.intensivo(semi)":
          replace_key = "Prepara_Pos_Intensivo_Semi";
          break;
        default:
          if (return_template === true) {
            replace_key = {
              N_mero_1: "Grupo 1",
              N_mero_2: "Grupo 2",
              N_mero_3: "Grupo 3",
              N_mero_4: "Grupo 4",
              N_mero_5: "Grupo 5",
              N_mero_6: "1º Ano",
              N_mero_7: "2º Ano",
              N_mero_8: "3º Ano",
              N_mero_9: "4º Ano",
              N_mero_10: "5º Ano",
              N_mero_11: "6º Ano",
              N_mero_12: "7º Ano",
              N_mero_13: "8º Ano",
              N_mero_14: "9º Ano",
              N_mero_15: "1ª Série",
              N_mero_16: "2ª Série",
              N_mero_17: "3ª Série",
              N_mero_19: "Extensivo",
              N_mero_18: "Semi-Extensivo",
              Prepara_Positivo_Extensivo: "Prepara Positivo (Extensivo)",
              Prepara_Pos_Intensivo_Semi: "Prepara Pos. Intensivo (Semi)"
            };
          }
          break;
      }
      break;
    case "conquista novos":
    case "conquista renovação":
    case "conquista ampliação":
      switch (ano_serie.toLowerCase().replace(/ /g,"")) {
        case "grupo1":
          replace_key = "N_mero_1";
          break;
        case "grupo2":
          replace_key = "N_mero_2";
          break;
        case "grupo3":
          replace_key = "N_mero_3";
          break;
        case "grupo4":
          replace_key = "N_mero_4";
          break;
        case "grupo5":
          replace_key = "N_mero_5";
          break;
        case "1ºano":
          replace_key = "N_mero_6";
          break;
        case "2ºano":
          replace_key = "N_mero_7";
          break;
        case "3ºano":
          replace_key = "N_mero_8";
          break;
        case "4ºano":
          replace_key = "N_mero_9";
          break;
        case "5ºano":
          replace_key = "N_mero_10";
          break;
        case "6ºano":
          replace_key = "N_mero_11";
          break;
        case "7ºano":
          replace_key = "N_mero_12";
          break;
        case "8ºano":
          replace_key = "N_mero_13";
          break;
        case "9ºano":
          replace_key = "N_mero_14";
          break;
        case "1ªsérie":
          replace_key = "N_mero_15";
          break;
        case "2ªsérie":
          replace_key = "N_mero_16";
          break;
        case "3ªsérie":
          replace_key = "N_mero_17";
          break;
        case "extensivo":
          replace_key = "N_mero_19";
          break;
        case "semi-extensivo":
          replace_key = "N_mero_18";
          break;
        case "preparapositivo(extensivo)":
          replace_key = "Prepara_Positivo_Extensivo";
          break;
        case "preparapos.intensivo(semi)":
          replace_key = "Prepara_Pos_Intensivo_Semi";
          break;
        default:
          if (return_template === true) {
            replace_key = {
              N_mero_1: "Grupo 1",
              N_mero_2: "Grupo 2",
              N_mero_3: "Grupo 3",
              N_mero_4: "Grupo 4",
              N_mero_5: "Grupo 5",
              N_mero_6: "1º Ano",
              N_mero_7: "2º Ano",
              N_mero_8: "3º Ano",
              N_mero_9: "4º Ano",
              N_mero_10: "5º Ano",
              N_mero_11: "6º Ano",
              N_mero_12: "7º Ano",
              N_mero_13: "8º Ano",
              N_mero_14: "9º Ano",
              N_mero_15: "1ª Série",
              N_mero_16: "2ª Série",
              N_mero_17: "3ª Série",
              N_mero_19: "Extensivo",
              N_mero_18: "Semi-Extensivo",
              Prepara_Positivo_Extensivo: "Prepara Positivo (Extensivo)",
              Prepara_Pos_Intensivo_Semi: "Prepara Pos. Intensivo (Semi)"
            };
          }
          break;
      }
      break;
    case "pes novos":
      switch (ano_serie.toLowerCase().replace(/ /g,"")) {
        case "grupo2":
          replace_key = "N_mero_2";
          break;
        case "pre / grupo 3":
          replace_key = "Kids_Preschool";
          break;
        case "pre / grupo 3 - ampliação":
          replace_key = "Kids_Preschool_Amplia_o";
          break;
        case "grupo4":
          replace_key = "Kids_Time_A";
          break;
        case "grupo 4 - ampliação":
          replace_key = "Kids_Time_A_Amplia_o";
          break;
        case "grupo5":
          replace_key = "Kids_Time_B";
          break;
        case "grupo 5 - ampliação":
          replace_key = "Kids_Time_B_Amplia_o";
          break;
        case "1ºano":
          replace_key = "Junior_Time_1";
          break;
        case "1ºano - ampliação":
          replace_key = "Junior_Time_1_Amplia_o";
          break;
        case "2ºano":
          replace_key = "Junior_Time_2";
          break;
        case "2ºano - ampliação":
          replace_key = "Junior_Time_2_Amplia_o";
          break;
        case "3ºano":
          replace_key = "Junior_Time_3";
          break;
        case "3ºano - ampliação":
          replace_key = "Junior_Time_3_Amplia_o";
          break;
        case "4ºano":
          replace_key = "Junior_Time_4";
          break;
        case "4ºano - ampliação":
          replace_key = "Junior_Time_4_Amplia_o";
          break;
        case "5ºano":
          replace_key = "Junior_Time_5";
          break;
        case "5ºano - ampliação":
          replace_key = "Junior_Time_5_Amplia_o";
          break;
        case "6ºano":
          replace_key = "Junior_Time_6";
          break;
        case "6ºano - ampliação":
          replace_key = "Junior_Time_6_Amplia_o";
          break;
        case "7ºano":
          replace_key = "Great_Time_1";
          break;
        case "7ºano - ampliação":
          replace_key = "Great_Time_1_Amplia_o";
          break;
        case "8ºano":
          replace_key = "Great_Time_2";
          break;
        case "8ºano - ampliação":
          replace_key = "Great_Time_2_Amplia_o";
          break;
        case "9ºano":
          replace_key = "Great_Time_3";
          break;
        case "9ºano - ampliação":
          replace_key = "Great_Time_3_Amplia_o";
          break;
        case "1ªsérie":
          replace_key = "Great_Time_4";
          break;
        case "1ª série - ampliação":
          replace_key = "Great_Time_4_Amplia_o";
          break;
        case "2ªsérie":
          replace_key = "Great_Time_5";
          break;
        case "2ª série - ampliação":
          replace_key = "Great_Time_5_Amplia_o";
          break;
        case "3ªsérie":
          replace_key = "Great_Time_6";
          break;
        case "3ª série - ampliação":
          replace_key = "Great_Time_6_Amplia_o";
          break;
        case "preparapositivo(extensivo)":
          replace_key = "Prepara_Positivo_Extensivo";
          break;
        case "preparapos.intensivo(semi)":
          replace_key = "Prepara_Pos_Intensivo_Semi";
          break;
        default:
          if (return_template === true) {
            replace_key = {
              N_mero_2: "Grupo 2",
              Kids_Preschool: "PRE / Grupo 3",
              Kids_Preschool_Amplia_o: "PRE / Grupo 3 - Ampliação",
              Kids_Time_A: "grupo 4",
              Kids_Time_A_Amplia_o: "grupo 4 - Ampliação",
              Kids_Time_B: "grupo 5",
              Kids_Time_B_Amplia_o: "grupo 5 - Ampliação",
              Junior_Time_1: "1º Ano",
              Junior_Time_1_Amplia_o: "1º Ano - Ampliação",
              Junior_Time_2: "2º Ano",
              Junior_Time_2_Amplia_o: "2º Ano - Ampliação",
              Junior_Time_3: "3º Ano",
              Junior_Time_3_Amplia_o: "3º Ano - Ampliação",
              Junior_Time_4: "4º Ano",
              Junior_Time_4_Amplia_o: "4º Ano - Ampliação",
              Junior_Time_5: "5º Ano",
              Junior_Time_5_Amplia_o: "5º Ano - Ampliação",
              Junior_Time_6: "6º Ano",
              Junior_Time_6_Amplia_o: "6º Ano - Ampliação",
              Great_Time_1: "7º Ano",
              Great_Time_1_Amplia_o: "7º Ano - Ampliação",
              Great_Time_2: "8º Ano",
              Great_Time_2_Amplia_o: "8º Ano - Ampliação",
              Great_Time_3: "9º Ano",
              Great_Time_3_Amplia_o: "9º Ano - Ampliação",
              Great_Time_4: "1ª Série",
              Great_Time_4_Amplia_o: "1ª Série - Ampliação",
              Great_Time_5: "2ª Série",
              Great_Time_5_Amplia_o: "2ª Série - Ampliação",
              Great_Time_6: "3ª Série",
              Great_Time_6_Amplia_o: "3ª Série - Ampliação",
              Prepara_Positivo_Extensivo: "Prepara Positivo (Extensivo)",
              Prepara_Pos_Intensivo_Semi: "Prepara Pos. Intensivo (Semi)"
            };
          }
          break;
      }
      break;
    case "pes ampliação":
    case "pes english":
      switch (ano_serie.toLowerCase().replace(/ /g,"")) {
        case "grupo2":
          replace_key = "N_mero_2";
          break;
        case "grupo3":
          replace_key = "N_mero_3";
          break;
        case "grupo4":
          replace_key = "N_mero_4";
          break;
        case "grupo5":
          replace_key = "N_mero_5";
          break;
        case "1ºano":
          replace_key = "N_mero_6";
          break;
        case "2ºano":
          replace_key = "N_mero_7";
          break;
        case "3ºano":
          replace_key = "N_mero_8";
          break;
        case "4ºano":
          replace_key = "N_mero_9";
          break;
        case "5ºano":
          replace_key = "N_mero_10";
          break;
        case "6ºano":
          replace_key = "N_mero_11";
          break;
        case "7ºano":
          replace_key = "N_mero_12";
          break;
        case "8ºano":
          replace_key = "N_mero_13";
          break;
        case "9ºano":
          replace_key = "N_mero_14";
          break;
        case "1ªsérie":
          replace_key = "N_mero_15";
          break;
        case "2ªsérie":
          replace_key = "N_mero_16";
          break;
        case "preparapositivo(extensivo)":
          replace_key = "Prepara_Positivo_Extensivo";
          break;
        case "preparapos.intensivo(semi)":
          replace_key = "Prepara_Pos_Intensivo_Semi";
          break;
        default:
          if (return_template === true) {
            replace_key = {
              N_mero_2: "Grupo 2",
              N_mero_3: "Grupo 3",
              N_mero_4: "Grupo 4",
              N_mero_5: "Grupo 5",
              N_mero_6: "1º Ano",
              N_mero_7: "2º Ano",
              N_mero_8: "3º Ano",
              N_mero_9: "4º Ano",
              N_mero_10: "5º Ano",
              N_mero_11: "6º Ano",
              N_mero_12: "7º Ano",
              N_mero_13: "8º Ano",
              N_mero_14: "9º Ano",
              N_mero_15: "1ª Série",
              N_mero_16: "2ª Série",
              Prepara_Positivo_Extensivo: "Prepara Positivo (Extensivo)",
              Prepara_Pos_Intensivo_Semi: "Prepara Pos. Intensivo (Semi)"
            };
          }
          break;
      }
      break;
    case "pes renovação":
      switch (ano_serie.toLowerCase().replace(/ /g,"")) {
        case "grupo2":
          replace_key = "N_mero_2";
          break;
        case "grupo3":
          replace_key = "N_mero_3";
          break;
        case "grupo4":
          replace_key = "N_mero_4";
          break;
        case "grupo5":
          replace_key = "N_mero_5";
          break;
        case "1ºano":
          replace_key = "N_mero_6";
          break;
        case "2ºano":
          replace_key = "N_mero_7";
          break;
        case "3ºano":
          replace_key = "N_mero_8";
          break;
        case "4ºano":
          replace_key = "N_mero_9";
          break;
        case "5ºano":
          replace_key = "N_mero_10";
          break;
        case "6ºano":
          replace_key = "N_mero_11";
          break;
        case "7ºano":
          replace_key = "N_mero_12";
          break;
        case "8ºano":
          replace_key = "N_mero_13";
          break;
        case "9ºano":
          replace_key = "N_mero_14";
          break;
        case "1ªsérie":
          replace_key = "N_mero_15";
          break;
        case "2ªsérie":
          replace_key = "N_mero_16";
          break;
        default:
          if (return_template === true) {
            replace_key = {
              N_mero_2: "Grupo 2",
              N_mero_3: "Grupo 3",
              N_mero_4: "Grupo 4",
              N_mero_5: "Grupo 5",
              N_mero_6: "1º Ano",
              N_mero_7: "2º Ano",
              N_mero_8: "3º Ano",
              N_mero_9: "4º Ano",
              N_mero_10: "5º Ano",
              N_mero_11: "6º Ano",
              N_mero_12: "7º Ano",
              N_mero_13: "8º Ano",
              N_mero_14: "9º Ano",
              N_mero_15: "1ª Série",
              N_mero_16: "2ª Série",
            };
          }
          break;
      }
      break;
    default:
      break;
  }

  return replace_key;
};

module.exports = alunadoCrmField;
