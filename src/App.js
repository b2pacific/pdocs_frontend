import React from "react";
import { BrowserRouter, Redirect, Route } from "react-router-dom";

import About from "./about";
import GroupEditor from "./groupEditor";
import SyncingEditor from "./syncingEditor";

const App = () => {

  React.useEffect(() => {
    document.title = "PDocs";

  }, [])

  return (
    <BrowserRouter>
      <Route path="/" exact component={GroupEditor} />
      <Route path="/about" exact component={About} />
      <Route
        path="/session/:id"
        render={(props) => {
          const id = props.match.params.id;
          return <SyncingEditor groupId={id} />;
        }}
      />
    </BrowserRouter>
  );
};

export default App;
