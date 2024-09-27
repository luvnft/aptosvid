import React from "react";

interface ScrollProps {
  children: React.ReactNode;
}

const Scroll: React.FC<ScrollProps> = (props) => {
  return (
    <div
      style={{
        flex: 1,
        overflowY: "scroll",
        height: "600px",
      }}
    >
      {props.children}
    </div>
  );
};

export default Scroll;
