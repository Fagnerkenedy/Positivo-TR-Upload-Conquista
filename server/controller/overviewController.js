"use strict";
const importzoho = require("importzoho");
const winstonLogger = require("importzoho/utility/WinstonLogger");

module.exports = {
  show: async (req, res) => {
    // Oportunidade
    winstonLogger.log(`info`, `Overview #${req.params.dealsId} - Loading Deals.`);
    let deals_info = await importzoho.getId("Deals", [req.params.dealsId], () => {}, { params: { approved: "both" } });
    if (deals_info[0].error) {
      return res.send({ success: false, error: "Registro Oportunidade não encontrado.", data: null });
    }
    deals_info = deals_info[0].response;
    winstonLogger.log(`info`, `Overview #${req.params.dealsId} - Loaded Deals.`);

    // Itens Produtos
    let itens_produtos = [];
    winstonLogger.log(`info`, `Overview #${req.params.dealsId} - Loading Itens Produtos.`);
    await importzoho
      .searchRecords("Itens_Produtos", `(Oportunidade.id:equals:${req.params.dealsId})`, async (error, response) => {})
      .then((data) => {
        data.map((result) => {
          result.response.map((row) => itens_produtos.push(row));
        });
      });
    winstonLogger.log(`info`, `Overview #${req.params.dealsId} - Loaded Itens Produtos.`);

    // Beneficios
    let beneficios = [];
    winstonLogger.log(`info`, `Overview #${req.params.dealsId} - Loading Beneficios.`);
    await importzoho
      .searchRecords("Beneficios", `(Oportunidade.id:equals:${req.params.dealsId})`, async (error, response) => {})
      .then((data) => {
        data.map((result) => {
          result.response.map((row) => beneficios.push(row));
        });
      });
    winstonLogger.log(`info`, `Overview #${req.params.dealsId} - Loaded Beneficios.`);

    // Escola
    let escola_info = null;
    winstonLogger.log(`info`, `Overview #${req.params.dealsId} - Loading Escola.`);
    if (deals_info.Account_Name === null) {
      return res.send({ success: false, error: "Registro Escola não encontrado.", data: null });
    }
    escola_info = await importzoho.getId("Accounts", [deals_info.Account_Name.id], () => {}, { params: { approved: "both" } });
    if (escola_info[0].error) {
      return res.send({ success: false, error: "Registro Escola não encontrado.", data: null });
    }
    escola_info = escola_info[0].response;
    winstonLogger.log(`info`, `Overview #${req.params.dealsId} - Loaded Escola.`);

    // Mapa Escolar
    let mapa_escolar = null;
    winstonLogger.log(`info`, `Overview #${req.params.dealsId} - Loading Mapa Escolar.`);
    if (escola_info.hasOwnProperty("Mapa_Escolar1") && escola_info.Mapa_Escolar1 !== null) {
      mapa_escolar = await importzoho.getId("Mapa_Escolar", [escola_info.Mapa_Escolar1.id], () => {}, { params: { approved: "both" } });
      if (mapa_escolar[0].error) {
        return res.send({ success: false, error: "Registro Mapa Escolar não encontrado.", data: null });
      }
      mapa_escolar = mapa_escolar[0].response;
    } else {
      // Create Mapa Escolar record
      await importzoho.insertRecords("Mapa_Escolar", [{ Owner: escola_info.Owner.id, Escola: escola_info.id, Name: escola_info.Account_Name }], async (error, response) => {
        if (error) {
          return res.send({ success: false, error: "Registro Mapa Escolar não encontrado.", data: null });
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
        });
      });
    }
    winstonLogger.log(`info`, `Overview #${req.params.dealsId} - Loaded Mapa Escolar.`);

    return res.send({ success: true, error: null, data: { deals: deals_info, itens_produtos, beneficios, mapa_escolar } });
  },
};
