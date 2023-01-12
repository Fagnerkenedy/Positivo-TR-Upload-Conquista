import React from "react";

import { Layout as AntdLayout } from "antd";

export default function Layout({ ...props }) {
  const { children } = props;
  return (
    <AntdLayout className="navbar">
      <AntdLayout.Header>Positivo - Overview</AntdLayout.Header>
      <AntdLayout.Content>{children}</AntdLayout.Content>
      {/* <AntdLayout.Footer>aaaa</AntdLayout.Footer> */}
    </AntdLayout>
  );
}
