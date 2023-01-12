import React, { useState, useEffect } from "react";
import axios from "axios";

import { Button } from "antd";

import Alert from "../Layout/Alert";
import Loading from "../Layout/Loading";

export default function PageAtualizar({
  crm,
  planilha,
  atualizarMapaEscolar,
  atualizarAlunado,
  _resetSteps,
  ...props
}) {
  const [loading, setLoading] = useState(true);

  const [alert, setAlert] = useState({ type: "", title: "", description: "" });
  /**
   *  Planilha:
   *    - if(atualizarAlunado)
   *        - [Produtos] => `Itens_Produtos`
   *        - [Alunado] => `Deals`
   *    - [Beneficios] => `Beneficios`
   *    - if(atualizarMapaEscolar)
   *        - [Mapa_Escolar] => `Mapa_Escolar`
   *    - [Oportunidade] => `Deals`
   *
   *  CRM:
   *    - dealsId => deals.id
   *    - mapaEscolarId => mapa_escolar.id
   *    -
   */
  //

  useEffect(() => {
    let postId = {
      dealsId: crm.deals.id,
      mapaEscolarId: crm.mapa_escolar.id,
    };

    let postData = {
      Beneficios: planilha.Beneficios,
      Oportunidade: planilha.Oportunidade,
    };

    if (atualizarAlunado) {
      postData["Produtos"] = planilha.Produtos;
      postData["Alunado"] = planilha.Alunado;
    }

    if (atualizarMapaEscolar) {
      postData["Mapa_Escolar"] = planilha["Mapa escolar"];
    }

    // console.log({ planilha });

    axios
      .put(`${process.env.REACT_APP_FILE_UPLOAD}`, {
        id: postId,
        filename: planilha.filename,
        data: postData,
      })
      .then((response) => {
        // console.log({ updateRepsonse: response.data });
        setLoading(false);
        if (response.data.success) {
          setAlert({
            type: "success",
            title: " ",
            description: "Registro atualizado com sucesso!",
          });
        } else {
          setAlert({ type: "error", title: "Erro", description: response.data.error });
        }
      });
  }, [crm, planilha, atualizarAlunado, atualizarMapaEscolar]);

  if (loading === true) {
    return (
      <>
        <Loading message={"Atualizando dados..."} />
      </>
    );
  }

  return (
    <>
      <Alert
        type={alert.type}
        title={alert.title}
        description={alert.description}
        closable={false}
      />
      {alert.type === "error" && (
        <Button style={{ margin: "0 8px" }} onClick={_resetSteps}>
          Reiniciar
        </Button>
      )}
    </>
  );
}
