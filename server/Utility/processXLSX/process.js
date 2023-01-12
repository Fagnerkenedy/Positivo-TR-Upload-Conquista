const XLSX = require('xlsx');
const importzoho = require('importzoho');

const alunadoCrmDePara = require('../../Utility/alunadoDePara.js');
const winstonLogger = require('importzoho/utility/WinstonLogger');
const convertPrice = require('../../Utility/convertPrice');
const convertPercentage = require('../../Utility/convertPercentage');

const columns = require('./columns');

const ArrToJsonKeys = (arr) => {
  let response = {};
  arr.map((key) => (response[key] = null));
  return response;
};

const renameObjectKeys = (data, replace) => {
  data = data.map((row) => {
    // For each key in replace, check if data has it and replace it
    Object.keys(replace).map((replaceLookup) => {
      const column_info = replace[replaceLookup];
      if (row.hasOwnProperty(column_info.sheets_column) && column_info.sheets_column != column_info.internal_name) {
        row[column_info.internal_name] = `${row[column_info.sheets_column]}`.trim();
        delete row[column_info.sheets_column];
      }
      /*
      if (row.hasOwnProperty(replace_lookup) && replace_lookup != replace[replace_lookup]) {
        row[replace[replace_lookup]] = `${row[replace_lookup]}`.trim();
        delete row[replace_lookup];
      }
      */
    });
    return row;
  });
  return data;
};

module.exports.parseSheet = (filename) => {
  winstonLogger.log(`info`, `[${filename}] - Parsing file.`);

  var workbook = XLSX.readFile(filename);
  var sheet_name_list = workbook.SheetNames;

  const data = sheet_name_list.map((name) => {
    let data = [];

    var worksheet = workbook.Sheets[name];
    var headers = {};


    Object.keys(worksheet).map((column) => {
      if (column[0] === '!') return;
      let tt = 0;
      for (var i = 0; i < column.length; i++) {
        if (!isNaN(column[i])) {
          tt = i;
          break;
        }
      }

      var col = column.substring(0, tt);
      var row = parseInt(column.substring(tt));
      //var value = worksheet[column].v;
      var value = worksheet[column].w;

      //store header names
      if (row == 1 && value) {
        headers[col] = value;
        return;
      }

      if (!data[row]) data[row] = ArrToJsonKeys(Object.keys(headers).map((col) => headers[col]));
      data[row][headers[col]] = value;
    });

    if (data.length) {
      data.shift();
      data.shift();
    }

    data = data.filter(function (el) {
      return el != null;
    });

    return { name, data };
  });

  const associate = {};
  data.map((sheet) => {
    associate[sheet.name] = sheet.data;
  });

  return associate;
};

module.exports.initialCheck = (filePath, fileName, dealId, dealProduct, dealType, dealSge, dealInep) => {
  dealProduct = dealProduct.toLowerCase().trim().replace(' ', '');
  dealType = dealType.toLowerCase().trim().replace(' ', '');

  return new Promise(async (resolve, reject) => {
    // Check if all params are present
    if (!fileName || !dealId || !dealProduct) {
      winstonLogger.log(`error`, `[${fileName}] - Parâmetros necessários ausentes.`);
      return reject(`Parâmetros necessários ausentes.`);
    }

    // Parse sheets
    const parsedData = module.exports.parseSheet(`${filePath}/${fileName}`);

    // Check if all the necessary worksheets are there
    const required_sheets = ['Produtos', 'Beneficios', 'Mapa escolar', 'Oportunidade'];
    required_sheets.map((sheetName) => {
      if (!parsedData.hasOwnProperty(sheetName)) {
        winstonLogger.log(`error`, `[${fileName}][Oportunidade] - Sem nome da folha ${sheetName} encontrados.`);
        return reject(`Sem nome da folha ${sheetName} encontrados.`);
      }
    });

    // COLUMN CHECKS -----
    // Check if necessary columns are there for each sheet
    const requiredColumns = columns(dealProduct);
    // Loop through sheets
    Object.keys(requiredColumns).map((sheetName) => {
      // Loop through columns in sheet
      requiredColumns[sheetName].map((column, index) => {
        if (!parsedData[sheetName][0].hasOwnProperty(column.sheets_column)) {
          winstonLogger.log(`error`, `[${fileName}] - Coluna ${column.sheets_column} não encontrado em ${sheetName}.  - Required?: ${column.required}`);
          if (column.required === true) return reject(`Coluna ${column.sheets_column} não encontrado em ${sheetName}.`);
        }
      });
    });

    // OPORTUNIDADE CHECKS -----
    // Check if the deal_type is present in one of the rows in Oportunidade
    let oportunidadeFiltered = parsedData.Oportunidade;
    /*
    if (deal_type !== "") {
      oportunidadeFiltered = parsed_data.Oportunidade.filter((row) => row.Tipo.toLowerCase() === deal_type.toLowerCase());
      if (oportunidadeFiltered.length <= 0) {
        winstonLogger.log(`error`, `[${filename}][Oportunidade] - Sem linha ${deal_type} encontrada.`);
        return reject(`Linha do tipo ${deal_type} não encontrada em Oportunidade.`);
      } else if (oportunidadeFiltered.length > 1) {
        winstonLogger.log(`error`, `[${filename}][Oportunidade] - Varias linhas encontrada para ${deal_type}.`);
        return reject(`Linha do tipo ${deal_type} encontrada varias vezes em Oportunidade.`);
      }
    }
    */

    let temp_deals_product = dealProduct;
    if (dealProduct === 'spe') {
      temp_deals_product = 'spenovos';
    }

    if (temp_deals_product !== '') {
      oportunidadeFiltered = parsedData.Oportunidade.filter((row) => `${row.Produto}`.toLowerCase().trim().replace(' ', '') === temp_deals_product.toLowerCase().trim().replace(' ', ''));
      if (oportunidadeFiltered.length <= 0) {
        winstonLogger.log(`error`, `[${fileName}][Oportunidade] - Sem linha ${dealProduct} encontrada.`);
        return reject(`Linha do tipo ${dealProduct} não encontrada em Oportunidade.`);
      } else if (oportunidadeFiltered.length > 1) {
        winstonLogger.log(`error`, `[${fileName}][Oportunidade] - Varias linhas encontrada para ${dealProduct}.`);
        return reject(`Linha do tipo ${dealProduct} encontrada varias vezes em Oportunidade.`);
      }
    }

    oportunidadeFiltered = oportunidadeFiltered[0];

    // Check if the deal_product is the same
    if (!oportunidadeFiltered.hasOwnProperty('Produto') || oportunidadeFiltered.Produto === null || oportunidadeFiltered.Produto === undefined || temp_deals_product !== oportunidadeFiltered.Produto.toLowerCase().trim().replace(' ', '')) {
      winstonLogger.log(`error`, `[${fileName}][Oportunidade] - Produto não corresponde ao tipo ${oportunidadeFiltered.Produto}.`);
      return reject(`O tipo de oportunidade não corresponde ao tipo ${oportunidadeFiltered.Produto}.`);
    }

    return resolve(parsedData);
  });
};

module.exports.convertToApi = (filename, rawSheetData, deal_id, deal_product, deal_type) => {
  winstonLogger.log(`info`, `[${filename}] - Converting to API.`);

  return new Promise((resolve, reject) => {
    const required_columns = columns(deal_product, deal_type);
    let return_object = {};

    Object.keys(rawSheetData).map((sheet_name) => {
      if (required_columns.hasOwnProperty(sheet_name)) {
        return_object[sheet_name] = renameObjectKeys(rawSheetData[sheet_name], required_columns[sheet_name]);
      }
    });

    return resolve(return_object);
  });
};

module.exports.filterRows = (data, key, deal_type) => {
  return data.filter((row) => `${row[key]}`.toLowerCase() === `${deal_type}`.toLowerCase());
};

module.exports.filterRowsOpp = (data, key, dealProduct) => {
  let tempDealsProduct = dealProduct;
  if (dealProduct === 'SPE') {
    tempDealsProduct = 'spe novos';
  }
  return data.filter((row) => `${row[key]}`.toLowerCase() === `${tempDealsProduct}`.toLowerCase());
};

// Treatments
module.exports.treatmentMapaEscolar = (filename, rawData) => {
  winstonLogger.log(`info`, `[${filename}] - Mapa Escolar treatment started.`);

  return new Promise(async (resolve, reject) => {
    const processedData = rawData
      .filter((row) => row.Nivel !== 'null')
      .map((row) => {
        // Filter columns that are N/A
        Object.keys(row).map((col) => {
          if (row[col] === 'N/A') delete row[col];
        });

        const data = row;
        // De -> Para nivel
        switch (row.Nivel) {
          case 'EFI':
            row.Nivel = 'EF1';
            break;
          case 'EFII':
            row.Nivel = 'EF2';
            break;
          default:
            row.Nivel = row.Nivel;
            break;
        }

        let replace_keys = {
          Nivel: 'Nivel',
          Concorrente: `Sistema_de_Ensino_${row.Nivel}`,
          PrecoMensalidade: `Pre_o_de_mensalidade_${row.Nivel}`,
          VendaParaPai: `Pre_o_de_venda_do_material_${row.Nivel}`,
          VencimentoContrato: `Vencimento_do_contrato_${row.Nivel}`
        };

        switch (row.Nivel) {
          case 'Kids':
          case 'Junior':
          case 'Teens':
            replace_keys.VendaParaPai = `Pre_o_de_Venda_de_Material_${row.Nivel}`;
            replace_keys.PrecoMensalidade = `Pre_o_de_Mensalidade_${row.Nivel}`;
            replace_keys.VencimentoContrato = `Vencimento_do_Contrato_${row.Nivel}`;
            break;
          default:
            break;
        }

        // Verify that data has key value
        Object.keys(replace_keys).map((key) => {
          if (!data.hasOwnProperty(key)) delete replace_keys[key];
        });

        return {
          data,
          replace_keys
        };
      })
      .map((row) => {
        if (row.data.hasOwnProperty('PrecoMensalidade')) {
          row.data.PrecoMensalidade = convertPrice(row.data.PrecoMensalidade, 2);
          if (isNaN(row.data.PrecoMensalidade)) {
            return reject(`Preço de Mensalidade inválido para Nível: ${row.data.Nivel}`);
          }
        }
        // if (row.data.hasOwnProperty("VendaParaPai")) row.data.VendaParaPai = Number(row.data.VendaParaPai).toFixed(2);
        if (row.data.hasOwnProperty('VendaParaPai')) {
          row.data.VendaParaPai = convertPrice(row.data.VendaParaPai, 2);
          if (isNaN(row.data.VendaParaPai)) {
            return reject(`Preço de Venda para o Pai inválido para Nível: ${row.data.Nivel}`);
          }
        }

        if (row.data.hasOwnProperty('VencimentoContrato')) {
          const splitDate = row.data.VencimentoContrato.replace(/-/g, '/').split('/');
          try {
            var calcDate = new Date(splitDate.reverse().join('/')).toISOString().split('T')[0];
            row.data.VencimentoContrato = calcDate;
          } catch (e) {
            try {
              var calcDate = new Date([splitDate[2], splitDate[1], splitDate[0]].join('/')).toISOString().split('T')[0];
              row.data.VencimentoContrato = calcDate;
            } catch (e) {
              return reject(`Vencimento do Contrato inválido para Nível: ${row.data.Nivel}`);
            }
          }
        }

        return row;
      })
      .filter((row) => {
        return Object.keys(row.data) === 1 ? false : true;
      });

    winstonLogger.log(`info`, `[${filename}] - Mapa Escolar treatment completed.`);
    return resolve(processedData);
  });
};

module.exports.templateAlunado = (filename, product) => {
  winstonLogger.log(`info`, `[${filename}] - Alunado template started.`);

  // product from spreadsheet, split the names and only use the first one
  // ie: "PES Renovacao"  ->  "PES"
  // product = product.split(' ')[0];

  return new Promise(async (resolve, reject) => {
    const replace_key = alunadoCrmDePara(product, '', '', true);

    winstonLogger.log(`info`, `[${filename}] - Alunado template completed.`);
    return resolve(replace_key);
  });
};

module.exports.treatmentAlunados = (filename, product, rawData, validYear) => {
  winstonLogger.log(`info`, `[${filename}] - Alunado treatment started.`);

  // product from spreadsheet, split the names and only use the first one
  // ie: "PES Renovacao"  ->  "PES"
  // product = product.split(' ')[0];
  const productMaterial = product.split(' ')[0].toLowerCase().trim();

  return new Promise(async (resolve, reject) => {
    const niveis = {};

    // Set individual API names for rows
    rawData
      .filter((row) => {
        return row.Ano.toString().toLowerCase() == validYear.toString().toLowerCase() && row.AnoSerie !== '-' && row.Material.toString().toLowerCase().trim() === productMaterial
      })
      .map((row) => {
        // Convert null values to 0
        if (row.NumeroAlunos === 'null') row.NumeroAlunos = '0';

        if (!niveis.hasOwnProperty(row.AnoSerie)) {
          const replace_key = alunadoCrmDePara(product, row.Nivel, row.AnoSerie);
          if (replace_key != '') {
            niveis[row.AnoSerie.toLowerCase()] = {
              data: row.NumeroAlunos,
              replace_key: replace_key
            };
          }
        }

        return row;
      });

    winstonLogger.log(`info`, `[${filename}] - Alunado treatment completed.`);
    return resolve(niveis);
  });
};

module.exports.treatmentOportunidade = (filename, rawData) => {
  winstonLogger.log(`info`, `[${filename}] - Oportunidade treatment started.`);

  return new Promise(async (resolve, reject) => {
    const data = rawData.map((row) => {
      if (row.hasOwnProperty('Montante')) row.Montante = convertPrice(row.Montante, 2);
      if (isNaN(row.Montante)) {
        return reject(`Preço Montante ano 1 inválido em aba Oportunidade.`);
      }

      if (row.hasOwnProperty('MontanteTotal')) row.MontanteTotal = convertPrice(row.MontanteTotal, 2);
      if (isNaN(row.MontanteTotal)) {
        return reject(`Preço Montante Total inválido em aba Oportunidade.`);
      }

      // Faturmaneto bruto 1
      if (row.hasOwnProperty('FaturamentoBruto_1')) row.FaturamentoBruto_1 = convertPrice(row.FaturamentoBruto_1, 2);
      if (isNaN(row.FaturamentoBruto_1)) {
        return reject(`Faturamento Bruto 1 inválido em aba Oportunidade.`);
      }

      // Faturmaento bruto total
      if (row.hasOwnProperty('FaturamentoBruto_Total')) row.FaturamentoBruto_Total = convertPrice(row.FaturamentoBruto_Total, 2);
      if (isNaN(row.FaturamentoBruto_Total)) {
        return reject(`Faturamento Bruto Total inválido em aba Oportunidade.`);
      }

      // Faturmaento Liquido
      if (row.hasOwnProperty('Faturamento_Liquido')) row.Faturamento_Liquido = convertPrice(row.Faturamento_Liquido, 2);
      if (isNaN(row.Faturamento_Liquido)) {
        return reject(`Faturamento Líquido inválido em aba Oportunidade.`);
      }

      // Faturamento Líq. Médio Programa (META)
      if (row.hasOwnProperty('Faturamento_Liq_Medio_Programa_Meta')) row.Faturamento_Liq_Medio_Programa_Meta = convertPrice(row.Faturamento_Liq_Medio_Programa_Meta, 2);
      if (isNaN(row.Faturamento_Liq_Medio_Programa_Meta)) {
        return reject(`Faturamento Líq. Médio Programa (META) inválido em aba Oportunidade.`);
      }

      // Projeção de faturamento Bruto - Repasse LNE
      if (row.hasOwnProperty('Projecao_Faturamento_Bruto_Repasse_LNE')) row.Projecao_Faturamento_Bruto_Repasse_LNE = convertPrice(row.Projecao_Faturamento_Bruto_Repasse_LNE, 2);
      if (isNaN(row.Projecao_Faturamento_Bruto_Repasse_LNE)) {
        return reject(`Projeção de faturamento Bruto - Repasse LNE inválido em aba Oportunidade.`);
      }

      // Projeção de faturamento Bruto - Custo LNE
      if (row.hasOwnProperty('Projecao_Faturamento_Bruto_Custo_LNE')) row.Projecao_Faturamento_Bruto_Custo_LNE = convertPrice(row.Projecao_Faturamento_Bruto_Custo_LNE, 2);
      if (isNaN(row.Projecao_Faturamento_Bruto_Custo_LNE)) {
        return reject(`Projeção de faturamento Bruto - Custo LNE inválido em aba Oportunidade.`);
      }

      // Alunado referência ano 1 (META)
      if(row.hasOwnProperty('Alunado_Ref_Ano_1_Meta')) row.Alunado_Ref_Ano_1_Meta = convertPrice(row.Alunado_Ref_Ano_1_Meta, 0);

      if (row.hasOwnProperty('DescontoBeneficios')) row.DescontoBeneficios = row.DescontoBeneficios.replace('%', '') + '%';
      if (row.hasOwnProperty('Comissao')) row.Comissao = row.Comissao.replace('%', '') + '%';
      if (row.hasOwnProperty('Percent_Desconto_Liq_Programa_Contrato_Total')) row.Percent_Desconto_Liq_Programa_Contrato_Total = row.Percent_Desconto_Liq_Programa_Contrato_Total.replace('%', '') + '%';

      if (row.hasOwnProperty('CodigoSGE')) row.CodigoSGE = row.CodigoSGE.replace('N/A', '');
      if (row.hasOwnProperty('CodigoINEP')) row.CodigoINEP = row.CodigoINEP.replace('N/A', '');

      //
      return row;
    });

    winstonLogger.log(`info`, `[${filename}] - Oportunidade treatment completed.`);
    return resolve(data);
  });
};

module.exports.treatmentBeneficios = (filename, rawData) => {
  winstonLogger.log(`info`, `[${filename}] - Beneficios treatment started.`);

  return new Promise(async (resolve, reject) => {
    const data = rawData.map((row, line) => {
      if (row.hasOwnProperty('ValorUnitario')) row.ValorUnitario = convertPrice(row.ValorUnitario, 2);
      if (isNaN(row.ValorUnitario)) {
        return reject(`Valor Unitário inválido em aba Beneficios, linha #${line + 1}.`);
      }

      if (row.hasOwnProperty('ValorTotal')) row.ValorTotal = convertPrice(row.ValorTotal, 2);
      if (isNaN(row.ValorTotal)) {
        return reject(`Valor Total inválido em aba Beneficios #${line + 1}.`);
      }

      if (row.hasOwnProperty('Quantidade')) row.Quantidade = convertPrice(row.Quantidade, 0);

      if (row.hasOwnProperty('CodBeneficio')) {
        row.CodBeneficio = convertPrice(row.CodBeneficio, 0);
        row.CodBeneficio = Number(row.CodBeneficio.replace(/\D/gi, '')).toString().padStart(2, '0');
      } else {
        row.CodBeneficio = '00';
      }

      if (row.hasOwnProperty('Concessao')) row.Concessao = row.Concessao.replace('%', '');

      //
      return row;
    });

    winstonLogger.log(`info`, `[${filename}] - Beneficios treatment completed.`);
    return resolve(data);
  });
};

module.exports.treatmentProdutos = (filename, rawData) => {
  winstonLogger.log(`info`, `[${filename}] - Produtos treatment started.`);

  return new Promise(async (resolve, reject) => {
    const data = rawData.map((row, line) => {
      if (row.hasOwnProperty('Montante')) row.Montante = convertPrice(row.Montante, 2);
      if (isNaN(row.Montante)) {
        return reject(`Montante inválido em aba Beneficios, linha #${line + 1}.`);
      }

      if (row.hasOwnProperty('Quantidade')) row.Quantidade = convertPrice(row.Quantidade, 0);
      if (row.hasOwnProperty('Desconto')) row.Desconto = convertPercentage(row.Desconto, 2);

      if (row.hasOwnProperty('Produto (chave)')) delete row['Produto (chave)'];
      //
      return row;
    });

    winstonLogger.log(`info`, `[${filename}] - Produtos treatment completed.`);
    return resolve(data);
  });
};

// Upload to CRM
module.exports.processBeneficios = (dealsId, data) => {
  return new Promise(async (resolve, reject) => {
    console.log("Executando processBeneficios...")
    // Delete current records in Beneficios
    const searchRecords = importzoho.searchRecords('Beneficios', `(Oportunidade.id:equals:${dealsId})`, async (error, response) => {
      if (error) {
        return reject(error.message);
      }

      // Loop through records found and delete them
      if (response.length) {
        const records = response.map((record) => record.id);
        importzoho.deleteRecords('Beneficios', records, (error, response_delete) => {
        });
      }
    });

    // Set individual API names for rows
    const promiseArray = [];
    data = data
      .filter((row) => {
        return Number(row.Quantidade) > 0 ? true : false;
      })
      .map((row, lineCount) => {
        row.Oportunidade = dealsId;
        row.Name = `${row.Bonificacoes}`;
        row.SpreadsheetLine = lineCount + 1;
        row.Nome_do_Benef_cio = null;
        row.Valor_Total = row.ValorTotal;
        if (row.CodBeneficio !== '00') {
          promiseArray.push(importzoho.searchRecords('Lista_de_Benef_cios', `(C_digo_do_Benef_cio:equals:${row.CodBeneficio})`));
        }
        row.Concess_o = row.Concessao;
        row.M_s_de_pagamento = row.MesPagamento;
        return row;
      });

    if (promiseArray.length === 0) return resolve(true);

    // Got all Lista_de_Benef_cios ids from map search, now associate results to data, then insert records
    Promise.all(promiseArray).then((response) => {
      response = response.filter((x) => !x[0].error).filter((x) => x[0].response.length > 0).map((x) => x[0].response[0]);
      data.map((row) => {
        if (row.CodBeneficio !== '00') {
          const codigoBeneficio = response.filter((x) => x.C_digo_do_Benef_cio === row.CodBeneficio);
          if (codigoBeneficio.length > 0) row.Nome_do_Benef_cio = codigoBeneficio[0].id;
        }
        return row;
      });

      // Insert records
      const insertRecords = importzoho
        .insertRecords('Beneficios', data, (error, response_insert) => {
          if (response_insert.error.length > 0) {
            response_insert.error.map((error) => {
              return reject(`Beneficios: Informação inválida para campo ${error.error.details.api_name}, tentou enviar valor '${error.data[error.error.details.api_name]}'.`);
            });
          }
        })
        .then(() => {
          console.log("processBeneficios Finalizado.")
          return resolve(true);
        });
    });
  });
};

module.exports.processProdutos = (dealsId, data) => {
  return new Promise(async (resolve, reject) => {
    console.log("Executando processProdutos...")
    // Delete current records in products
    const searchRecords = importzoho.searchRecords('Itens_Produtos', `(Oportunidade.id:equals:${dealsId})`, async (error, response) => {
      if (error) {
        return reject(error.message);
      }

      // Loop through records found and delete them
      if (response.length) {
        const records = response.map((record) => record.id);
        importzoho.deleteRecords('Itens_Produtos', records, (error, response_delete) => {
        });
      }
    });

    // Set individual API names for rows
    data = data
      .filter((row) => {
        return Number(row.NumeroAlunos) > 0 ? true : false;
      })
      .map((row, lineCount) => {
        row.Oportunidade = dealsId;
        row.Name = `${row.Material}`;
        row.SpreadsheetLine = lineCount + 1;
        return row;
      });

    // Filter rows with N/A quantity
    data = data.filter((row) => row.NumeroAlunos !== 'N/A');
    if (data.length === 0) return resolve(true);

    // Insert records
    const insertRecords = importzoho.insertRecords('Itens_Produtos', data, (error, response_insert) => {
      if (response_insert.error.length > 0) {
        response_insert.error.map((error) => {
          return reject(`Produtos: Informação inválida para campo ${error.error.details.api_name}, tentou enviar valor '${error.data[error.error.details.api_name]}'.`);
        });
      }
    });

    Promise.all([searchRecords, insertRecords]).then((data) => {
      console.log("processProdutos Finalizado.")
      return resolve(true);
    });
  });
};

const renameSingularObject = (data, replace) => {
  data = data.map((row) => {
    // For each key in replace, check if data has it and replace it
    Object.keys(replace).map((replace_lookup) => {
      const column_info = replace[replace_lookup];
      if (row.hasOwnProperty(replace_lookup) && replace_lookup != replace[replace_lookup]) {
        row[replace[replace_lookup]] = `${row[replace_lookup]}`.trim();
        delete row[replace_lookup];
      }
    });
    return row;
  });
  return data;
};
module.exports.processMapaEscolar = (mapaEscolarId, data) => {
  return new Promise(async (resolve, reject) => {
    console.log("Executando processMapaEscolar...")
    if (mapaEscolarId === null) {
      return reject(`O mapa escolar está vazio.`);
    }

    const individual_update_objects = data.map((row) => {
      return renameSingularObject([row.data], row.replace_keys)[0];
    });

    const grouped_update_objects = {};
    Object.keys(individual_update_objects).map((row) => {
      if (individual_update_objects[row]) {
        Object.keys(individual_update_objects[row]).map((col) => {
          grouped_update_objects[col] = individual_update_objects[row][col];
        });
      }
    });

    const mapa_escolar_update = await importzoho.updateRecords('Mapa_Escolar', [{ id: mapaEscolarId, ...grouped_update_objects }], (error, response) => {
      if (error) {
        return reject(error.message);
      }

      if (response.error.length > 0) {
        response.error.map((error) => {
          return reject(`Mapa Escolar: Informação inválida para campo ${error.error.details.api_name}, tentou enviar valor '${error.data[error.error.details.api_name]}'.`);
        });
      }
      console.log("processMapaEscolar Finalizado.")
      return resolve(true);
    });
  });
};

module.exports.processAlunados = (dealsId, data) => {
  return new Promise(async (resolve, reject) => {
    console.log("Executando processAlunados...")
    const update_object = {};

    Object.keys(data).map((key) => {
      update_object[data[key].replace_key] = data[key].data;
    });

    const oportunidade_update = await importzoho.updateRecords(
      'Deals', 
      [{ id: dealsId, ...update_object }], 
      (error, response) => {
        if (error) {
          return reject(error.message);
        }

        if (response.error.length > 0) {
            response.error.map((error) => {
              if(error.error.hasOwnProperty("code")){
                if(error.error.code === 'NOT_APPROVED'){
                  return reject(`Alunados: Registro não está aprovado`);
                }
              }
              return reject(`Alunados: Informação inválida para campo ${error.error.details.api_name}, tentou enviar valor '${error.data[error.error.details.api_name]}'.`);
          });
        }


        if (response.error.length > 0) {
          response.error.map((error) => {
            return reject(`Alunados: Informação inválida para campo ${error.error.details.api_name}, tentou enviar valor '${error.data[error.error.details.api_name]}'.`);
          });
        }
        console.log("Executando processAlunados...")
        return resolve(response.success[0]);
      });
  });
};

module.exports.processOportunidade = (dealsId, Oportunidade) => {
  return new Promise(async (resolve, reject) => {
    console.log("Executando processOportunidade...")
    // Set individual API names for rows
    Oportunidade = Oportunidade.map((row) => {
      const data = row;

      let replace_keys = {
        DescontoBeneficios: `Percentual_Benef_cio`,
        AnoContrato: `Quantidade_de_Anos_do_Contrato`,
        Montante: `Amount`,
        MontanteTotal: `Montante_Total`,
        Comissao: `Comiss_o`,
        Benef_cio_de_MKT_Concedido: 'Benef_cio_de_MKT_Concedido',
        Patroc_nio_e_ou_M_dia_Cooperada: 'Patroc_nio_e_ou_M_dia_Cooperada',
        FaturamentoBruto_1: 'Faturamento_Bruto_1_Ano',
        FaturamentoBruto_Total: 'Faturamento_Bruto_Total',
        Meio_de_Compra: 'Meio_de_Compra',
        ContratoAte: 'Data_Limite_Renova_o',
        Fidelizacao_Inicio: 'In_cio_da_Fideliza_o',
        Fidelizacao_Termino: 'T_rmino_da_Fideliza_o',
        Anos_Contrato_Extenso: 'Anos_de_contrato_por_extenso',
        Faturamento_Liquido: 'Faturamento_L_quido',
        Modelo_Minuta: 'Modelo_de_minuta',
        Periodo_Concessao_Desconto: 'Per_odo_de_concess_o_do_desconto',
        Tipo_Capa: 'Tipo_de_Capa',
        Alcada_Aprovacao: 'Al_ada_para_aprova_o',
        Frete_Pedido_Principal: 'Frete_pedido_principal',
        Frete_Pedido_Complementar: 'Frete_pedido_complementar',
        Forma_Pagamento: 'Forma_de_Pagamento',
        Observacoes_Para_Aprovador: 'Observa_es_para_aprovador',
        Faturamento_Liq_Medio_Programa_Meta: 'Faturamento_L_q_M_dio_Programa_META',
        Alunado_Ref_Ano_1_Meta: 'Alunado_refer_ncia_ano_1_META',
        Percent_Desconto_Liq_Programa_Contrato_Total: 'Desconto_L_quido_Programa_CONTRATO_TOTAL',
        Projecao_Faturamento_Bruto_Repasse_LNE: 'Proje_o_de_faturamento_Bruto_Repasse_LNE',
        Projecao_Faturamento_Bruto_Custo_LNE: 'Proje_o_de_faturamento_Bruto_Custo_LNE',
        Possui_Confissao_Divida: 'Possui_confiss_o_de_d_vida',
        Numero_Professores: 'N_mero_de_professores',
        Benef_cio_pag_dinheiro: 'Benef_cio_pag_dinheiro',
      };

      return {
        data,
        replace_keys
      };
    });
    //
    // Update Oportunidade
    const oportunidade_update_objects = Oportunidade.map((row) => {
      // Treat fields
      delete row.data.Produto;
      delete row.data.Tipo;
      delete row.data.CodigoSGE;
      delete row.data.CodigoINEP;

      // Delete null values
      Object.keys(row.data).map((col) => {
        if (!row.data[col]) {
          delete row.data[col];
        }
      });

      // if (row.data.hasOwnProperty('AnoContrato')) row.data.AnoContrato = `${row.data.AnoContrato}-12-31`;
      if (row.data.hasOwnProperty("AnoContrato")) row.data.AnoContrato = Number(row.data.AnoContrato);
      // if (row.data.hasOwnProperty("Montante")) row.data.Montante = Number(row.data.Montante).toFixed(2);
      // if (row.data.hasOwnProperty("DescontoBeneficios")) row.data.DescontoBeneficios = Number(row.data.DescontoBeneficios).toFixed(2);
      // if (row.data.hasOwnProperty("Comissao")) row.data.Comissao = Number(row.data.Comissao).toFixed(2);
      // if (row.data.hasOwnProperty("Montante")) row.data.Montante = convertPrice(row.data.Montante, 2);
      // if (row.data.hasOwnProperty("Montante_Total")) row.data.Montante_Total = convertPrice(row.data.Montante_Total, 2);
      if (row.data.hasOwnProperty('DescontoBeneficios')) row.data.DescontoBeneficios = convertPercentage(row.data.DescontoBeneficios, 2);
      console.log("DescontoBeneficios: ", row.data.DescontoBeneficios)
      if (row.data.hasOwnProperty('Percent_Desconto_Liq_Programa_Contrato_Total')) row.data.Percent_Desconto_Liq_Programa_Contrato_Total = convertPercentage(row.data.Percent_Desconto_Liq_Programa_Contrato_Total, 2);

      //  Comissao
      if (row.data.hasOwnProperty('Comissao')) {
        row.data.Comissao = convertPercentage(row.data.Comissao, 2);
        if(row.data.Comissao > 999) row.data.Comissao = parseFloat(row.data.Comissao).toFixed(0);
      }


      row.data.Conferido_Analista = null;

      if (row.data.hasOwnProperty('Fidelizacao_Inicio')) row.data.Fidelizacao_Inicio = `${row.data.Fidelizacao_Inicio}-01-01`;
      if (row.data.hasOwnProperty('Fidelizacao_Termino')) row.data.Fidelizacao_Termino = `${row.data.Fidelizacao_Termino}-12-31`;
      if (row.data.hasOwnProperty('Fidelizacao_Termino')) row.data.ContratoAte = `${row.data.Fidelizacao_Termino}`;

      // Create update obj
      return renameSingularObject([row.data], row.replace_keys)[0];
    });

    const oportunidade_update_obj = {};
    Object.keys(oportunidade_update_objects).map((row) => {
      Object.keys(oportunidade_update_objects[row]).map((col) => {
        oportunidade_update_obj[col] = oportunidade_update_objects[row][col];
      });
    });

    const oportunidade_update = await importzoho.updateRecords(
      'Deals',
      [{ id: dealsId, ...oportunidade_update_obj }],
      (error, response) => {
        if (error) {
          return reject(error.message);
        }

        if (response.error.length > 0) {
          response.error.map((error) => {
            if(error.error.hasOwnProperty("code")){
              if(error.error.code === 'NOT_APPROVED'){
                return reject(`Oportunidade: Registro não está aprovado`);
              }
            }
            return reject(`Oportunidade: Informação inválida para campo ${error.error.details.api_name}, tentou enviar valor '${error.data[error.error.details.api_name]}'.`);
          });
        }

        return resolve(response.success[0]);
      },
      { trigger: ['approval'] }
    );
    console.log("processOportunidade Finalizado.")
    return resolve(true);
  });
};
