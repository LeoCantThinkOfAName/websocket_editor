import React from "react";
import SyncingEditor from "./SyncingEditor";
import { BrowserRouter, Route, Redirect } from "react-router-dom";
import GroupEditor from "./GroupEditor";

const App = () => {
  return (
    <BrowserRouter>
      <Route
        path="/"
        exact
        render={() => {
          return <Redirect to={`/group/${Date.now()}`} />;
        }}
      />
      <Route path="/group/:id" exact component={GroupEditor} />
    </BrowserRouter>
  );
};

export default App;
