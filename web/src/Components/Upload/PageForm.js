import React, { useState } from "react";
import axios from "axios";

import Alert from "../Layout/Alert";

import "antd/dist/antd.css";
import { Input, Col, Row, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import findDealType from "../../Utility/findDealType";

export default function PageForm({ _handleFileSubmit, crm, ...props }) {
  const [alert, setAlert] = useState({ type: "", title: "", description: "" });

  const [fileList, setFileList] = useState([]);
  const whiteListedFiles = ["xlsx", "xlsm"];

  const [uploading, setUploading] = useState(false);

  const handleFileSubmit = () => {
    setUploading(true);
    const data = new FormData();
    data.append("file", fileList[0].originFileObj);
    data.append("dealId", crm.id);

    data.append("dealProduct", crm.Type);
    data.append("dealSGE", crm.C_digo_SGE);
    data.append("dealInep", crm.C_digo_INEP);

    // Find out what dealType of grouping up to do.
    // console.log("####Web crm type");
    // console.log(crm.Type);
    // console.log(findDealType(crm.Type));
    data.append("dealType", findDealType(crm.Type));

    // setFileList([]);

    if (fileList.length) {
      // console.log(`Sending post.`);
      axios.post(`${process.env.REACT_APP_FILE_UPLOAD}`, data, {}).then((res) => {
        setUploading(false);
        // console.log({ upload: res.data });
        if (res.data.success) {
          //
          _handleFileSubmit(res.data.data);
          return;
        } else {
          //
          setFileList([]);
          // message.error(`${res.data.error}`, 3);
          setAlert({ type: "error", title: "Erro", description: res.data.error });
          return;
        }
      });
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    onChange: (info) => {
      // Allow only whitelisted files
      const lastFileName = info.fileList.slice(-1)[0].name;
      if (whiteListedFiles.indexOf(lastFileName.split(".").pop()) === -1) {
        // message.error(`${lastFileName} is not a valid file.`, 1);
        setAlert({
          type: "error",
          title: "Erro",
          description: `${lastFileName} não é um arquivo válido.`,
        });

        // Remove it from filelist
        let newFileList = [...info.fileList];
        newFileList.pop();
        setFileList(newFileList);

        return;
      }

      let newFileList = [...info.fileList];

      newFileList = newFileList.slice(-1);

      newFileList = newFileList.map((file) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });

      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <>
      <div>
        <Alert
          type={alert.type}
          title={alert.title}
          description={alert.description}
          closable={true}
          onClose={(e) => {
            setAlert({ type: "", title: "", description: "" });
          }}
        />
        <Input.Group size="large">
          <Row gutter={0} align="top" justify="center">
            <Col align="left">
              <Upload {...uploadProps}>
                <Button icon={<UploadOutlined />}>Selecione o Arquivo</Button>
              </Upload>
            </Col>
          </Row>
          <Row gutter={0} align="middle" justify="center">
            <Col style={{ color: '#1890ff', fontSize: '18px' }}>
              <br />Atenção,verifique se está utilizando a ultima versão do simulador.
            </Col>
          </Row>
          <Row gutter={0} align="middle" justify="center">
            <Col>
              <Button
                type="primary"
                onClick={() => {
                  handleFileSubmit();
                }}
                disabled={fileList.length === 0}
                loading={uploading}
                style={{ marginTop: 16 }}
              >
                {uploading ? "Enviando" : "Subir arquivo"}
              </Button>
            </Col>
          </Row>
        </Input.Group>
      </div>
    </>
  );
}
