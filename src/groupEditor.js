import * as React from "react";
import { Redirect } from "react-router-dom";
import SyncingEditor from "./syncingEditor";

const GroupEditor = (data) => {
  const [value, setValue] = React.useState("");
  const [flag, setflag] = React.useState(false);
  const [id, setId] = React.useState();
  React.useEffect(() => {
    fetch("http://localhost:4000/create")
      .then((x) => x.json())
      .then((data) => {
        // socket.emit("initialize", data.groupId);
        // group.current = data.groupId;
        console.log("Value", data);
        setId(data.groupId);
      })
      .catch((err) => console.log("error", err));
    return () => {};
  }, []);
  return (
    <div>
      {flag ? (
        value.length > 0 ? (
          //console.log("Value", value);
          <Redirect to={`/${value}`} />
        ) : (
          //<SyncingEditor groupId={value}/>
          <Redirect to={`/${id}`} />
        )
      ) : (
        <div>
          <div
            style={{
              height: "100px",
              backgroundColor: "#50CB93",
              paddingLeft: "20px",
              paddingTop: "15px",
              color: "white",
            }}
          >
            <h1>PDocs</h1>
          </div>
          <div
            style={{
              display: "grid",
              height: "500px",
              marginTop: "100px",
              paddingLeft: "20%",
              paddingRight: "20%",
              gridTemplateColumns: "300px",
              gridTemplateRows: "100px 50px 50px 50px 50px",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              onClick={() => {
                setflag(true);
              }}
              style={{
                borderStyle: "solid",
                borderWidth: "1px",
                width: "130px",
                height: "30px",
                textAlign: "center",
                borderRadius: "20px",
                paddingTop: "10px",
                backgroundColor: "#50CB93",
                color: "white",
                cursor: "pointer",
              }}
            >
              Create New file
            </div>
            <div
              style={{
                fontSize: "30px",
                marginBottom: "20px",
                color: "#71EFA3",
                fontWeight: "bold",
              }}
            >
              OR
            </div>
            <div
              style={{ fontSize: "20px", color: "#71EFA3", fontWeight: "bold" }}
            >
              {" "}
              Open An Existing One
            </div>
            {/* <button onClick={() => setflag(true)}>Create New file</button> */}
            <input
              type="text"
              onChange={(e) => setValue(e.target.value)}
              style={{ height: "30px", marginBottom: 0 }}
            />
            <div
              onClick={() => {
                setflag(true);
              }}
              style={{
                borderStyle: "solid",
                borderWidth: "1px",
                width: "80px",
                height: "30px",
                textAlign: "center",
                borderRadius: "20px",
                paddingTop: "10px",
                backgroundColor: "#50CB93",
                color: "white",
                marginTop: "10px",
                cursor: "pointer",
              }}
            >
              Open
            </div>
            {/* <button onClick={() => setflag(true)}>Open</button> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupEditor;
