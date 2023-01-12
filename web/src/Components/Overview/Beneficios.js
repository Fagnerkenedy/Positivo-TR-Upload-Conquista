import React from "react";
import { Table, Typography } from "antd";
import displayPrice from "../../Utility/displayPrice";

const { Column } = Table;

function Beneficios({ data, ...props }) {
  data = data
    .filter((row) => {
      return row.Quantidade > 0 ? true : false;
    })
    .map((row) => {
      row.key = row.id;
      return row;
    });

  data = data.sort((a, b) => parseFloat(a.SpreadsheetLine) - parseFloat(b.SpreadsheetLine));

  return (
    <div>
      <Typography.Title level={3}>Beneficios</Typography.Title>
      <Table
        dataSource={data}
        sticky
        pagination={{ pageSize: 10, hideOnSinglePage: true, showSizeChanger: false }}
        bordered
        size="small"
      >
        <Column title="Bonificações" dataIndex="Bonificacoes" key="Bonificacoes" width="125px" />
        <Column title="Observação" dataIndex="Observacao" key="Observacao" width="125px" />
        <Column
          title="Valor Unitário"
          dataIndex="ValorUnitario"
          key="ValorUnitario"
          width="125px"
          render={(ValorUnitario) => <>{displayPrice(ValorUnitario)}</>}
        />
        <Column title="Quantidade" dataIndex="Quantidade" key="Quantidade" width="125px" />
        <Column title="Ano" dataIndex="Ano" key="Ano" width="125px" />
      </Table>
    </div>
  );
}

export default Beneficios;
