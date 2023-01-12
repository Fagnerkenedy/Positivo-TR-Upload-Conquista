"use strict";
const importzoho = require("importzoho");

module.exports = {
  show: async (req, res) => {
    // Oportunidade
    let deals_info = await importzoho.getId("Deals", [req.params.dealsId], () => {}, { params: { approved: "both" } });
    if (deals_info[0].error) {
      return res.send({ success: false, error: "Registro Oportunidade não encontrado.", data: null });
    }
    deals_info = deals_info[0].response;

    // 2022-05-25 // Validate type and stage --- If type of deal is "Conquista" or "SPE" + "Ampliação" || "Renovação" send error
    const blacklistedTypesWon = ["Conquista Ampliação", "Conquista Renovação", "SPE Ampliação", "SPE Renovação"]
    if(blacklistedTypesWon.indexOf(deals_info.Type) >= 0 && deals_info.Stage === "Ganho (Renovado/Ampliado)") {
      return res.send({ success: false, error: "Não é permitida atualização da oportunidade pois esta no estágio 'Ganho'!", data: null })
    }

    // Escola
    let escola_info = null;
    if (deals_info.Account_Name !== null) {
      escola_info = await importzoho.getId("Accounts", [deals_info.Account_Name.id], () => {}, { params: { approved: "both" } });
      if (escola_info[0].error) {
        return res.send({ success: false, error: "Registro Escola não encontrado.", data: null });
      }
      escola_info = escola_info[0].response;
    } else {
      return res.send({ success: false, error: "Registro Escola não encontrado.", data: null });
    }

    // Mapa Escolar
    let mapa_escolar = null;
    if (escola_info.hasOwnProperty("Mapa_Escolar1") && escola_info.Mapa_Escolar1 !== null) {
      mapa_escolar = await importzoho.getId("Mapa_Escolar", [escola_info.Mapa_Escolar1.id], () => {}, { params: { approved: "both" } });
      if (mapa_escolar[0].error) {
        return res.send({ success: false, error: "Registro Mapa Escolar não encontrado.", data: null });
      }
      mapa_escolar = mapa_escolar[0].response;
      return res.send({ success: true, error: false, data: { deals: deals_info, accounts: escola_info, mapa_escolar: mapa_escolar } });
    } else {
      // Create Mapa Escolar record
      await importzoho.insertRecords("Mapa_Escolar", [{ Owner: escola_info.Owner.id, Escola: escola_info.id, Name: escola_info.Account_Name }], async (error, response) => {
        if (error) {
          return res.send({ success: false, error: "Registro Mapa Escolar não encontrado.", data: null });
        }

        if(response.error.length > 0) {
          const errorObj = response.error[0];
          if(errorObj.error.details.api_name === 'Owner')
            return res.send({ success: false, error: "Falha em carregar escola, proprietario da escola esta inativo.", data: null });
          else
          return res.send({ success: false, error: `Falha em carregar escola, campo ${errorObj.error.details.api_name} invalido.`, data: null });
        }

        // Update Accounts with id
        await importzoho.updateRecords("Accounts", [{ id: escola_info.id, Mapa_Escolar1: response.success[0].id }], async (error) => {
          if (error) {
            return res.send({ success: false, error: "Registro Mapa Escolar não encontrado.", data: null });
          }

          // Now fetch Mapa Escolar record
          mapa_escolar = await importzoho.getId("Mapa_Escolar", [response.success[0].id], () => {}, { params: { approved: "both" } });
          if (mapa_escolar[0].error) {
            return res.send({ success: false, error: "Registro Mapa Escolar não encontrado.", data: null });
          }
          mapa_escolar = mapa_escolar[0].response;
          return res.send({ success: true, error: false, data: { deals: deals_info, accounts: escola_info, mapa_escolar: mapa_escolar } });
        });
      });
    }
  },
};
