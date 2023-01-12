import React from "react";
import { Table, Checkbox, Typography } from "antd";

const { Column } = Table;

export default function PageConfirmAlunados({
  crm,
  planilha,
  _checkboxChangeAlunado,
  checkboxAlunado,
  ...props
}) {
  // Join CRM and Planlilha
  // console.log("####Planilha");
  // console.log(planilha);
  // console.log("####CRM");
  // console.log(crm);
  let planilha_data = [];

  // Loop through planilha rows and add it to data + CRM info
  Object.keys(planilha).map((anoSerieKey) => {
    const crm_field = planilha[anoSerieKey].replace_key;
    const label = anoSerieKey;

    if (crm.hasOwnProperty(crm_field)) {
      planilha_data.push({
        key: `${anoSerieKey}`,
        field: label,
        planilha: planilha[anoSerieKey].data,
        crm: crm[crm_field],
      });
    }

    return anoSerieKey;
  });

  return (
    <div style={{ padding: "10px" }}>
      <Typography.Title level={4}>Comparação de campos de Alunado</Typography.Title>
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
        onChange={_checkboxChangeAlunado}
        checked={checkboxAlunado}
      >
        Substituir os valores no CRM pelos valores da planilha?
      </Checkbox>
    </div>
  );
}
