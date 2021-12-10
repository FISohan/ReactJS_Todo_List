import React from "react";
import "../App.css";

export const Todo = (p) => {
  return (
    <div
      draggable
      className="todo"
      style={{
        background:
          "linear-gradient(90deg, rgb(100 90 78) 0%, rgb(143 142 116) 100%)",
        padding: "1px 5px",
        marginBottom: "3px",
        color: "black",
        paddingLeft: "5px",
        paddingRight: "5px",
        paddingBottom: "1px",
        paddingTop: "1px",
      }}
      onDragStart={p.ondragstart}
      onDrag={p.ondrag}
      onDragEnd={p.ondragend}
    >
      <p>{p.todoContent}</p>
    </div>
  );
};
