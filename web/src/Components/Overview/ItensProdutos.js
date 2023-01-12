import React from "react";
import { Table, Typography } from "antd";
import displayPrice from "../../Utility/displayPrice";

const { Column } = Table;

function ItensProdutos({ data, ...props }) {
  data = data.map((row) => {
    row.key = row.id;
    return row;
  });

  data = data
    .filter((row) => row.NumeroAlunos > 0)
    .sort((a, b) => parseFloat(a.SpreadsheetLine) - parseFloat(b.SpreadsheetLine));

  return (
    <div>
      <Typography.Title level={3}>Itens Produtos</Typography.Title>
      <Table
        dataSource={data}
        sticky
        pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
        bordered
        size="small"
      >
        <Column title="Material" dataIndex="Material" key="Material" width="100px" />
        <Column title="Nível" dataIndex="Nivel" key="Nivel" width="200px" />
        <Column title="Ano/Série" dataIndex="AnoSerie" key="AnoSerie" width="125px" />
        <Column title="Ano" dataIndex="Ano" key="Ano" width="100px" />
        <Column
          title="Número de Alunos"
          dataIndex="NumeroAlunos"
          key="NumeroAlunos"
          width="200px"
        />
        <Column
          title="Desconto"
          dataIndex="Desconto"
          key="Desconto"
          width="100px"
          render={(Desconto) => <>{`${Desconto}%`}</>}
        />
        <Column
          title="Montante"
          dataIndex="Montante"
          key="Montante"
          width="100px"
          render={(Montante) => <>{displayPrice(Montante)}</>}
        />
      </Table>
    </div>
  );
}

export default ItensProdutos;
