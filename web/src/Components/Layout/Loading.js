import React from "react";
import { Space, Row, Col, Spin, Typography } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

export default function Loading({ message, ...props }) {
  return (
    <div style={{ padding: "10px" }}>
      <Row justify="center">
        <Col justify="center">
          <Typography.Title level={3}>
            <Space>
              <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
              {message}
            </Space>
          </Typography.Title>
        </Col>
      </Row>
    </div>
  );
}
