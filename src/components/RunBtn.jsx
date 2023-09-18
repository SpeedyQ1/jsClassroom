import React from "react";
import "./RunBtn.css";
function RunBtn({ handleRun }) {
  return (
    <button className="run-btn" onClick={() => handleRun()}>
      Run
    </button>
  );
}

export default RunBtn;
