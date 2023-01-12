import React, { useState, useEffect } from "react";
import axios from "axios";

import { Typography } from "antd";

import Loading from "../Layout/Loading";

import ItensProdutos from "./ItensProdutos";
import Beneficios from "./Beneficios";
import MapaEscolar from "./MapaEscolar";
import Oportunidade from "./Oportunidade";

function Index({ ...props }) {
  const [isLoading, setIsLoading] = useState(true);

  // CRM Infos
  const [deals, setDeals] = useState(null);
  const [itensProdutos, setItensProdutos] = useState(null);
  const [beneficios, setBeneficios] = useState(null);
  const [mapaEscolar, setMapaEscolar] = useState(null);

  // Get Deals Info
  useEffect(() => {
    if (!isLoading) setIsLoading(true);

    axios.get(`${process.env.REACT_APP_API_ZOHO_OVERVIEW}/${props.dealsId}`).then((response) => {
      // console.log(response.data);
      if (response.data.success) {
        // console.log(response.data.data);
        //
        setDeals(response.data.data.deals);
        setItensProdutos(response.data.data.itens_produtos);
        setBeneficios(response.data.data.beneficios);
        setMapaEscolar(response.data.data.mapa_escolar);
        //
        setIsLoading(false);
      } else {
        alert(response.data.error);
      }
    });
    // eslint-disable-next-line
  }, [props.dealsId]);

  if (isLoading) {
    return (
      <>
        <Loading message={"Carregando dados..."} />
      </>
    );
  }

  return (
    <div>
      <Typography.Title level={2}>
        Oportunidade: {deals.Deal_Name}
        &nbsp;
        <a
          className="ant-btn"
          href={`https://crm.zoho.com/crm/org699416994/tab/Potentials/${deals.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Visualizar no CRM
        </a>
      </Typography.Title>
      <div style={{ paddingBottom: "15px" }}>
        <Oportunidade data={deals} />
      </div>
      <div style={{ paddingBottom: "15px" }}>
        <ItensProdutos data={itensProdutos} />
      </div>
      <div style={{ paddingBottom: "15px" }}>
        <Beneficios data={beneficios} />
      </div>
      <div style={{ paddingBottom: "15px" }}>
        <MapaEscolar dealsType={deals?.Type} data={mapaEscolar} />
      </div>
    </div>
  );
}

export default Index;
