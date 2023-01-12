import React from "react";
import { Table } from "antd";
import displayPrice from "../../Utility/displayPrice";

const { Column } = Table;

const displayDate = (val) => {
  if (val === null || val === "") return "";
  try {
    const dateSplit = val.split("-");
    return dateSplit[2] + "/" + dateSplit[1] + "/" + dateSplit[0];
  } catch (e) {
    return val;
  }
};

function ItensProdutos({ data, ...props }) {
  data = [{ key: data.id, ...data }];

  return (
    <div>
      <Table
        dataSource={data}
        sticky
        pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
        bordered
        size="small"
      >
        <Column
          title="%Desconto / Benefícios"
          dataIndex="Percentual_Benef_cio"
          key="Percentual_Benef_cio"
          width="100px"
          render={(Percentual_Benef_cio) => <>{`${Percentual_Benef_cio}%`}</>}
        />
        <Column
          title="Contrato até"
          dataIndex="Data_Limite_Renova_o"
          key="Data_Limite_Renova_o"
          width="125px"
          render={(Data_Limite_Renova_o) => <>{displayDate(Data_Limite_Renova_o)}</>}
        />
        <Column
          title="Oportunidade Para"
          dataIndex="Oportunidade_para"
          key="Oportunidade_para"
          width="125px"
        />
        {/* <Column
          title="% Comissão"
          dataIndex="Comissao"
          key="Comissao"
          width="100px"
          render={(Comissao) => <>{`${Comissao}%`}</>}
        /> */}
        <Column
          title="Montante"
          dataIndex="Amount"
          key="Amount"
          width="100px"
          render={(Amount) => <>{displayPrice(Amount)}</>}
        />
      </Table>
    </div>
  );
}

export default ItensProdutos;
