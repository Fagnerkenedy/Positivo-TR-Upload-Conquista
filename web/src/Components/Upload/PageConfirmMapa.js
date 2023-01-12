import React from "react";
import { Table, Checkbox, Typography } from "antd";
import displayPrice from "../../Utility/displayPrice";
import displayDate from "../../Utility/displayDate";

const { Column } = Table;

export default function PageConfirmMapa({
  crm,
  planilha,
  _checkboxChangeMapa,
  checkboxMapa,
  ...props
}) {
  // Join CRM and Planlilha
  let planilha_data = [];

  // Loop through planilha rows and add it to data + CRM info
  planilha.map((row, row_key) => {
    Object.keys(row.replace_keys).map((field, col_key) => {
      //console.log(field, row.replace_keys[field], crm.hasOwnProperty(row.replace_keys[field]));

      const crm_field = row.replace_keys[field];
      const label = row.replace_keys[field].replace(/Pre_o/g, "Preço").replace(/_/g, " ");
      if (crm.hasOwnProperty(crm_field)) {
        // Default way to display values to screen
        let displayPlanilha = row.data[field],
          displayCRM = crm[crm_field];

        // Determine the display type by the value of field
        if (field === "PrecoMensalidade" || field === "VendaParaPai") {
          displayPlanilha = displayPrice(row.data[field]);
          displayCRM = displayPrice(crm[crm_field]);
        } else if (field === "VencimentoContrato") {
          displayPlanilha = displayDate(row.data[field]);
          displayCRM = displayDate(crm[crm_field]);
        }

        planilha_data.push({
          key: `${row_key}_${col_key}`,
          field: label,
          planilha: displayPlanilha,
          crm: displayCRM,
        });
      }

      return field;
    });

    return row;
  });

  // console.log({ planilha_data });

  return (
    <div style={{ padding: "10px" }}>
      <Typography.Title level={4}>Comparação dos campos do Mapa Escolar</Typography.Title>
      <Table
        dataSource={planilha_data}
        sticky
        bordered
        pagination={{ pageSize: 50, hideOnSinglePage: true }}
        size="small"
      >
        <Column title="Campo" dataIndex="field" key="field" width="125px" />
        <Column title="Planilha" dataIndex="planilha" key="planilha" width="125px" />
        <Column title="CRM" dataIndex="crm" key="crm" width="125px" />
      </Table>
      <Checkbox
        className="checkbox-substitute-message"
        onChange={_checkboxChangeMapa}
        checked={checkboxMapa}
      >
        Substituir os valores no CRM pelos valores da planilha?
      </Checkbox>
    </div>
  );
}
