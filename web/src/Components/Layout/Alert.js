import React from "react";
import { Alert } from "antd";

export default function DisplayAlert({ type, title, description, closable, ...props }) {
  if (!description) return <></>;

  return (
    <div style={{ padding: "10px" }}>
      <Alert
        className="custom-alert"
        message={title !== undefined ? title : type ? type.toUpperCase() : ""}
        description={description}
        type={type}
        showIcon
        closable={closable}
        {...props}
      />
    </div>
  );
}
