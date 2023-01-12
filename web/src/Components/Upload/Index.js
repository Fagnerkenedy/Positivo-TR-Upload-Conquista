import React, { useState, useEffect } from "react";
import axios from "axios";

import "antd/dist/antd.css";
import { Steps, Button, Typography } from "antd";

import Alert from "../Layout/Alert";
import Loading from "../Layout/Loading";

import PageForm from "./PageForm";
import PageConfirmMapa from "./PageConfirmMapa";
import PageConfirmAlunados from "./PageConfirmAlunados";
import PageAtualizar from "./PageAtualizar";

const { Step } = Steps;

// Display Steps headers
function StepsHeader({ currentStep, steps, ...props }) {
  return (
    <Steps current={currentStep}>
      {steps.map((item) => (
        <Step key={item} title={item} />
      ))}
    </Steps>
  );
}

// Displays next/prev buttons
function StepsButton({ currentStep, totalSteps, handleNextStep, handlePrevStep, ...props }) {
  return (
    <>
      {currentStep < totalSteps - 2 && (
        <Button type="primary" onClick={handleNextStep}>
          Próximo
        </Button>
      )}
      {currentStep === totalSteps - 2 && (
        <Button type="primary" onClick={handleNextStep}>
          Atualizar
        </Button>
      )}
      {currentStep > 0 && currentStep < totalSteps - 1 && (
        <Button style={{ margin: "0 8px" }} onClick={handlePrevStep}>
          Anterior
        </Button>
      )}
    </>
  );
}

// Maestro
export default function UploadIndex({ ...props }) {
  //
  const [currentStep, setCurrentStep] = useState(0);
  const [planilha, setPlanilha] = useState(null);

  const [crm, setCRM] = useState(null);

  const [alert, setAlert] = useState({ type: "", title: "", description: "" });

  // Checkboxes
  const [checkboxMapa, setcheckboxMapa] = useState(true);
  const [checkboxAlunado, setcheckboxAlunado] = useState(true);

  useEffect(() => {

    // Reset state
    setCurrentStep(0);
    setPlanilha(null);
    setCRM(null);
    setAlert({ type: "", title: "", description: "" });
    setcheckboxMapa(true);
    setcheckboxAlunado(true);

    // Load in Deals info
    axios.get(`${process.env.REACT_APP_API_ZOHO_REGISTRY}/${props.dealsId}`).then((response) => {
      if (response.data.success) {
        // Verify if response.data.data.deals["$approval_state"] != "approval_process_pending"
        if (response.data.data.deals["$approval_state"] === "approval_process_pending") {
          setAlert({
            type: "warning",
            title: "Erro",
            description: "O registro está aguardando aprovação.",
          });
          setCRM(false);
        } else {
          setCRM(response.data.data);
        }
      } else {
        setAlert({ type: "error", title: "Erro", description: response.data.error });
        setCRM(false);
      }
    });

  }, [props.dealsId])

  const handleNextStep = () => {
    if (!planilha) {
      setAlert({ type: "warning", title: "Aviso", description: `Nenhum arquivo carregado.` });

      return null;
      // return message.error(`No file uploaded.`, 3);
    }
    setCurrentStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleResetStep = () => {
    setCurrentStep(0);
  };

  const getSteps = () => {
    return ["Anexar Arquivo", "Mapa Escolar", "Alunado", "Atualizar"];
  };

  // Step 1: File uploaded
  const handleFileSubmit = (file) => {
    setAlert({ type: "", title: "", description: "" });
    setPlanilha(file);
    setCurrentStep(1);
    // console.log({ handleFileSubmit: file });
  };

  // Step 2: Checkbox changed
  const _checkboxChangeMapa = (e) => {
    setcheckboxMapa(e.target.checked);
  };
  const _checkboxChangeAlunado = (e) => {
    //modificado
    //setcheckboxAlunado(e.target.checked);
    setcheckboxAlunado(true);
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return <PageForm crm={crm.deals} _handleFileSubmit={handleFileSubmit} />;
      case 1:
        // console.log("#### Mapa Escolar");
        // console.log(planilha["Mapa escolar"]);
        // console.log(planilha);
        return (
          <PageConfirmMapa
            crm={crm.mapa_escolar}
            planilha={planilha["Mapa escolar"]}
            _checkboxChangeMapa={_checkboxChangeMapa}
            checkboxMapa={checkboxMapa}
          />
        );
      case 2:
        // console.log("### crm.deals aa");
        // console.log(crm.deals);
        // console.log("### planilha.Alunado");
        // console.log(planilha.Alunado);
        // console.log("### Planilha");
        // console.log(planilha);
        return (
          <PageConfirmAlunados
            crm={crm.deals}
            planilha={planilha.Alunado}
            _checkboxChangeAlunado={_checkboxChangeAlunado}
            checkboxAlunado={checkboxAlunado}
          />
        );
      case 3:
        return (
          <PageAtualizar
            crm={crm}
            planilha={planilha}
            atualizarMapaEscolar={checkboxMapa}
            atualizarAlunado={checkboxAlunado}
            _resetSteps={handleResetStep}
          />
        );
      default:
        // Unknown show initial upload page
        return <></>;
    }
  };

  const steps = getSteps();

  if (crm === null) {
    return (
      <>
        <Loading message={"Carregando dados..."} />
      </>
    );
  }

  if (crm === false) {
    return (
      <Alert
        type={alert.type}
        title={alert.title}
        description={alert.description}
        closable={false}
      />
    );
  }

  return (
    <>
      <Typography.Title level={2}>Oportunidade: {crm.deals.Deal_Name}</Typography.Title>
      <StepsHeader currentStep={currentStep} steps={steps} />
      <Alert
        type={alert.type}
        title={alert.title}
        description={alert.description}
        closable={true}
        onClose={(e) => {
          setAlert({ type: "", title: "", description: "" });
        }}
      />
      <div className="steps-content">{getStepContent(currentStep)}</div>
      <div className="steps-action">
        <StepsButton
          currentStep={currentStep}
          totalSteps={steps.length}
          handleNextStep={handleNextStep}
          handlePrevStep={handlePrevStep}
        />
      </div>
    </>
  );
}
