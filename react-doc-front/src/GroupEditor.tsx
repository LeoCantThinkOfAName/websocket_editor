import React from "react";
import { RouteComponentProps } from "react-router-dom";

import SyncingEditor from "./SyncingEditor";

const GroupEditor: React.FC<RouteComponentProps<{ id: string }>> = ({
  match: {
    params: { id }
  }
}) => {
  return (
    <div>
      <div>Room Id: {id}</div>
      <SyncingEditor groupId={id}/>
    </div>
  );
};

export default GroupEditor;
