'use strict';

const path = require('path');
const fs = require('fs');

const zohoXLSX = require('../Utility/processXLSX/process');
const importzoho = require('importzoho');

// Path to where to save files to
const staticPath = `${path.resolve(process.env.SERVER_FILE_PATH)}`;
const logPath = `${path.resolve(process.env.WINSTON_LOG_PATH)}/uploads`;
console.log(`staticPath: ${staticPath}`);

const winstonLogger = require('importzoho/utility/WinstonLogger');

const ZCRMRestClient = require('@pedrolian/zcrmsdk');
const execPhp = require('exec-php');
const makeId = require( '../Utility/makeId' )
const isoDateString = require( '../Utility/isoDateString' )

function getFileExtension(data) {
  const extension = /(?:\.([^.]+))?$/.exec(data)[1];
  return extension === undefined ? null : extension;
}

module.exports = {
  uploadFile: (req, res) => {
    // Validate post
    // console.log("###upload body");
    // console.log(req.body);
    const { dealId, dealProduct, dealType, dealSGE, dealInep, post } = req.body;

    if (!dealId || !dealProduct) {
      return res.send({ success: false, error: 'ID, Tipo, ou Produto inválido.' });
    }

    // Validate file was uploaded
    if (!req.files) {
      return res.send({ success: false, error: 'Arquivo inválido.' });
    }

    // Validate file size
    const { file } = req.files;
    if (file.size >= 50 * 1000 * 1000) {
      return res.send({ success: false, error: 'O arquivo não pode ser maior que 50Mb.' });
    } else if (!file.name.match(/\.(xlsx)$/) && !file.name.match(/\.(xlsm)$/)) {
      return res.send({ success: false, error: 'Tipo de arquivo não suportado.' });
    }

    // Move uploaded file
    const filename = `${dealId}_${makeId(3)}_${makeId(5)}.${file.name.split('.').pop()}`;
    file.mv(`${staticPath}/${filename}`, async (err) => {
      if (err) {
        return res.send({ success: false, error: err });
      }

      // Start process
      try {
        winstonLogger.log(`info`, `[${filename}] - Starting XLSX process`);

        // Check if initial pages and columns are there
        const xlsx_process = await zohoXLSX.initialCheck(staticPath, filename, dealId, dealProduct, dealType, dealSGE, dealInep);

        // Convert column names for easier read
        let xlsx = await zohoXLSX.convertToApi(filename, xlsx_process, dealId, dealProduct, dealType, dealSGE, dealInep);

        // Find first valid year in Products page
        const firstYearContract = xlsx.Produtos.filter(row => row.Tipo === dealType).reduce((prevValue, currValue) => {
          if(prevValue === null || prevValue === undefined) return Number(currValue.Ano);
          if(Number(currValue.Ano) < Number(prevValue)) {
            return Number(currValue.Ano);
          }
          else {
            return prevValue;
          }
        }, null);

        // Filter sheets to only use rows of the same dealType
        //  xlsx.Oportunidade = zohoXLSX.filterRows(xlsx.Oportunidade, "Tipo", dealType);
        xlsx.Oportunidade = zohoXLSX.filterRowsOpp(xlsx.Oportunidade, 'Produto', dealProduct);
        // Filter alunados pelo Ano depois pelo Tipo
        xlsx.Alunados = zohoXLSX.filterRows(xlsx.Produtos, 'Ano', firstYearContract);
        xlsx.Alunados = zohoXLSX.filterRows(xlsx.Alunados, 'Tipo', dealType);
        xlsx.Produtos = zohoXLSX.filterRows(xlsx.Produtos, 'Tipo', dealType);

        // Do treatment to Mapa escolar, remover unecessary rows, create { to : from }, convert values to proper data types
        xlsx['Oportunidade'] = await zohoXLSX.treatmentOportunidade(filename, xlsx['Oportunidade']);
        xlsx['Mapa escolar'] = await zohoXLSX.treatmentMapaEscolar(filename, xlsx['Mapa escolar']);
        xlsx['Produtos'] = await zohoXLSX.treatmentProdutos(filename, xlsx['Produtos']);
        //xlsx["Alunado"] = await zohoXLSX.treatmentAlunados(filename, dealProduct, xlsx["Produtos"], xlsx.Oportunidade[0].AnoContrato);
        xlsx['Alunado'] = await zohoXLSX.treatmentAlunados(filename, dealProduct, xlsx.Alunados, firstYearContract);
        xlsx['Beneficios'] = await zohoXLSX.treatmentBeneficios(filename, xlsx['Beneficios']);

        // Append to Oportunidade Benefícios Oferecidos
        xlsx.Oportunidade = xlsx.Oportunidade.map((data) => {
          data.Benef_cio_de_MKT_Concedido = xlsx.Beneficios.filter((row) => `${row.Bonificacoes}`.trim().toLowerCase() === 'marketing' && row.Quantidade != '0').length > 0 ? 'Sim' : 'Não';
          data.Patroc_nio_e_ou_M_dia_Cooperada = xlsx.Beneficios.filter((row) => (`${row.Bonificacoes}`.trim().toLowerCase() === 'patrocínio' && row.Quantidade != '0') || (`${row.Bonificacoes}`.trim().toLowerCase() === 'patrocinio' && row.Quantidade != '0')).length > 0 ? 'Sim' : 'Não';
          if(xlsx.Beneficios.filter((row) => `${row.Bonificacoes}`.trim().toLowerCase() === 'pag dinheiro' && row.Quantidade != '0').length > 0) {
            data.Benef_cio_pag_dinheiro = 'Sim';
          }
          return data;
        });

        // Use Alunado template and set values if found in spreadsheet
        let templateAlunado = await zohoXLSX.templateAlunado(filename, dealProduct);
        let alunadoKeys = {};
        Object.keys(xlsx['Alunado']).map((level) => {
          alunadoKeys[xlsx['Alunado'][level].replace_key] = xlsx['Alunado'][level];
        });

        let mergedAlunado = {};
        Object.keys(templateAlunado).map((field) => {
          mergedAlunado[templateAlunado[field]] = field in alunadoKeys ? alunadoKeys[field] : { data: '0', replace_key: field };
        });

        xlsx['Alunado'] = mergedAlunado;
        //
        xlsx['filename'] = filename;

        res.send({ success: true, error: null, data: xlsx });

        // Delete file from server
        /*
        fs.unlink(`${staticPath}/${filename}`, (err) => {
          if (err) console.log(err);
        });
        */
      } catch (e) {
        res.send({ success: false, error: `${e} - Erro: ${filename.split('.')[0]}` });
        fs.rename(`${staticPath}/${filename}`, `${staticPath}/error/${filename}`, function (err) {
          if (err) console.log(err);
        });
      }

      winstonLogger.log(`info`, `[${filename}] - Process ended.`);
      return;
    });
  },

  put: async (req, res) => {
    const { id, data, filename } = req.body;

    // console.log(data);

    try {
      let promise_arr = [];
      let deals_info = await importzoho.getId('Deals', [id.dealsId], () => {}, { params: { approved: 'both' } });
      let oportunidade = null;
      
      let beneficios = null;
      if (data.hasOwnProperty('Beneficios')) {
        beneficios = zohoXLSX.processBeneficios(id.dealsId, data.Beneficios);
        promise_arr.push(beneficios);
      }

      let produtos = null;
      if (data.hasOwnProperty('Produtos')) {
        produtos = zohoXLSX.processProdutos(id.dealsId, data.Produtos);
        promise_arr.push(produtos);
      }

      let mapa_escolar = null;
      if (data.hasOwnProperty('Mapa_Escolar')) {
        mapa_escolar = zohoXLSX.processMapaEscolar(id.mapaEscolarId, data.Mapa_Escolar);
        promise_arr.push(mapa_escolar);
      }

      deals_info = deals_info[0].response;

      // Skip updating Alunados para SPE Renovação
      // if (deals_info.Type !== 'SPE Renovação') {
      //   let alunado = null;
      //   if (data.hasOwnProperty('Alunado')) {
      //     alunado = zohoXLSX.processAlunados(id.dealsId, data.Alunado);
      //     promise_arr.push(alunado);
      //   }
      // }
      let alunado = null;
      if (data.hasOwnProperty('Alunado')) {
        alunado = zohoXLSX.processAlunados(id.dealsId, data.Alunado);
        promise_arr.push(alunado);
      }

      // Removemos a Oportunidade do promise_arr para garantir que ela será executada por último
      // pois o update na oportunidade estava disparando o approval e bloqueando o updade das outras
      if (data.hasOwnProperty('Oportunidade')) {
        oportunidade = data.Oportunidade;
        //promise_arr.push(oportunidade);
      }

      Promise.all(promise_arr)
        .then( async (data) => {
          const resOportunidade = await zohoXLSX.processOportunidade(id.dealsId, oportunidade);
          if(resOportunidade.zoho_response.status === 'success'){
            res.send({ success: true, error: '', data: null });
          }else{
            res.send({ success: false, error: 'Erro ao atualizar a Oportunidade', data: resOportunidade});
          }
          // Upload file
          /* importzoho.attachFile("Deals", id.dealsId, fs.createReadStream(`${staticPath}/${filename}`) )
          .then(res => {
            fs.unlinkSync(`${staticPath}/${filename}`);
          })
          .catch(err => {
            importzoho.Log('error', `${id.dealsId}: Failed to upload file.`);
            fs.unlinkSync(`${staticPath}/${filename}`);
          }) */

          // Get latest token
          ZCRMRestClient.getOAuthTokens().then((token) => {
            // Execute php script
            execPhp('uploadFile.php', function (error, php, outprint) {
              if (error) {
                importzoho.Log('error', JSON.stringify(error));
              }
              // console.log(error);
              // php.uploadfile("Deals", id.dealsId, token, `${ISODateString(new Date())}.xlsx`, `${staticPath}/${filename}`, function (error, result, output, printed) {
              php.uploadfile('Deals', id.dealsId, token, `${isoDateString(new Date())}.${getFileExtension(filename)}`, `${staticPath}/${filename}`, function (error, result, output, printed) {
                //console.log({ error, result });
                // Delete file from server
                fs.unlink(`${staticPath}/${filename}`, (err) => {
                  if (err) console.log(err);
                });
              });
            });
          });
          //
          return;
        })
        .catch((e) => {
          importzoho.Log('error', JSON.stringify(e));
          return res.send({ success: false, error: e, data: null });
        });
    } catch (e) {
      importzoho.Log('error', JSON.stringify(e));
      return res.send({ success: false, error: e, data: null });
    }
  }
};
