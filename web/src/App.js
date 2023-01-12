import React from "react";
import { HashRouter as Router, Route } from "react-router-dom";
import "./index.css";

import UploadLayout from "./Components/Upload/Layout";
import FormUploadIndex from "./Components/Upload/Index";

import OverviewLayout from "./Components/Overview/Layout";
import OverviewIndex from "./Components/Overview/Index";

function App() {
  return (
    <div className="App">
      <Router>
        <Route
          exact
          path="/upload/:dealsId"
          render={(props) => {
            return (
              <>
                <UploadLayout>
                  <FormUploadIndex dealsId={props.match.params.dealsId} />
                </UploadLayout>
              </>
            );
          }}
        />
        <Route
          exact
          path="/overview/:dealsId"
          render={(props) => {
            return (
              <>
                <OverviewLayout>
                  <OverviewIndex dealsId={props.match.params.dealsId} />
                </OverviewLayout>
              </>
            );
          }}
        />
      </Router>
    </div>
  );
}

export default App;
