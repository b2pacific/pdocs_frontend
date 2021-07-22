import React from "react";

const About = () => {
  return (
    <>
      <div
        style={{
          height: "100px",
          backgroundColor: "#50CB93",
          paddingLeft: "20px",
          paddingTop: "15px",
          color: "white",
        }}
      >
        <div style={{ width: "40px" }}>
          <a
            href="/"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            <h1>PDocs</h1>
          </a>
        </div>
      </div>
      <div style={{ marginLeft: "30px", marginTop: "50px" }}>
        <h3>What is PDocs?</h3>
        <p>
          PDocs is WebApp made with React js and Javscript and Slate js. This
          WebApp is a Clone of Google Docs and implements some of the core
          features of Google Docs.
        </p>
        <h3>Features Offered by PDocs</h3>
        <p>
          <ul>
            <li>
              Real Time Document Editing between more than One Participant.
            </li>
            <li>
              Font Formatting Options like Bold, Italic, Color Change, Font Size
              Change, etc.
            </li>
            <li>Option to add Links to the Document.</li>
            <li>
              Shows the number of Participants currently working on the
              Document.
            </li>
          </ul>
        </p>
        <h3>How to Use PDocs</h3>
        <p>
          <ul>
            <li>
              If you want to Create a new Document then click on the Create New
              File Option and a New session will be created for you.
            </li>
            <li>
              You can now share the Session Id with your friends and start
              working on it Together.
            </li>
            <br />
            <li>
              If you want to open an Existing Session then enter the Session Id
              in the Input Box and Click on Open.
            </li>
            <br />
            <li>
              Paste the Document link in the Browser and you will be redirected
              to the document with the latest changes.
            </li>
          </ul>
        </p>
      </div>
    </>
  );
};

export default About;
