import React from "react";
import { Table, Typography } from "antd";
import displayPrice from "../../Utility/displayPrice";
import findDealCompany from "../../Utility/findDealCompany";

const { Column } = Table;

const crmFields = (nivel) => {
  let replace_keys = {
    concorrente: `Sistema_de_Ensino_${nivel}`,
    preco_mensalidade: `Pre_o_de_mensalidade_${nivel}`,
    venda_para_pai: `Pre_o_de_venda_do_material_${nivel}`,
    vencimento_contrato: `Vencimento_do_contrato_${nivel}`,
  };

  switch (nivel) {
    case "Kids":
    case "Junior":
    case "Teens":
      replace_keys.venda_para_pai = `Pre_o_de_Venda_de_Material_${nivel}`;
      replace_keys.preco_mensalidade = `Pre_o_de_Mensalidade_${nivel}`;
      replace_keys.vencimento_contrato = `Vencimento_do_Contrato_${nivel}`;
      break;
    default:
      break;
  }
  return replace_keys;
};

function MapaEscolar({ data, dealsType, ...props }) {
  // console.log({ MapaEscolar: data });
  // Check if Accounts has a Mapa Escolar associated to it.
  if (data === null) return <></>;

  const company = findDealCompany(dealsType);

  let niveis = [];

  if(company === "spe")
  {
      niveis = ["EI", "EF1", "EF2", "EM"];
  }
  else
  {
      niveis = ["EI", "EF1", "EF2", "EM", "Kids", "Junior", "Teens"];
  }

  let rows = niveis.map((nivel) => {
    const keys = crmFields(nivel);

    let return_obj = {
      nivel: nivel,
      key: nivel,
    };

    Object.keys(keys).map((key) => {
      //   console.log({ return_obj_key: key, data_key: keys[key], data_value: data[keys[key]] });

      if (keys.hasOwnProperty(key) && data.hasOwnProperty(keys[key])) {
        return_obj[key] = data[keys[key]];
      }

      return key;
    });

    return return_obj;
  });

  return (
    <div>
      <Typography.Title level={3}>Mapa Escolar</Typography.Title>
      <Table
        dataSource={rows}
        sticky
        bordered
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        size="small"
      >
        <Column title="Nível" dataIndex="nivel" key="nivel" width="100px" />
        <Column
          title="Preço Mensalidade"
          dataIndex="preco_mensalidade"
          key="preco_mensalidade"
          width="125px"
          render={(preco_mensalidade) => <>{displayPrice(preco_mensalidade)}</>}
        />
        <Column
          title="Venda"
          dataIndex="venda_para_pai"
          key="venda_para_pai"
          width="125px"
          render={(venda_para_pai) => <>{displayPrice(venda_para_pai)}</>}
        />
        <Column title="Concorrente" dataIndex="concorrente" key="concorrente" width="125px" />
        <Column
          title="Vencimento"
          dataIndex="vencimento_contrato"
          key="vencimento_contrato"
          render={(tmp_data) => (
            <>{tmp_data ? tmp_data.replace(/-/g, "/").split("/").reverse().join("/") : ""}</>
          )}
          width="125px"
        />
      </Table>
    </div>
  );
}

export default MapaEscolar;
