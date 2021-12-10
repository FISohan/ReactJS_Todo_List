import React, { Component } from "react";
import "../App.css";
import ProgressIndicator from "../Components/ProgressIndicator";
import { Todo } from "../Components/Todo";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  query,
  collection,
  getDocs,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import firebaseConfig from "../FireBaseConfig";

export default class TodoPage extends Component {
  currentTodoContainerPositionX;
  pendingTodoContainerPositionX;
  completedTodoContainerPositionX;

  deleteAreaPosition;

  currentTodoContainerWidth;
  pendingTodoContainerWidth;
  completedTodoContainerWidth;

  currentArray;
  todoText;

  docId;

  constructor(props) {
    super(props);
    initializeApp(firebaseConfig);
    this.db = getFirestore();
    this.padding = 10;
    this.state = {
      currentTodo: [],
      pendingTodo: [],
      completedTodo: [],
    };
  }

  async componentDidMount() {
    await this.getData();
  }

  async getData() {
    const q = query(
      collection(this.db, "todo"),
      where("todoId", "==", this.props.projectId)
    );

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      this.setState({
        currentTodo: doc.data().currentTodo,
        pendingTodo: doc.data().pendingTodo,
        completedTodo: doc.data().completedTodo,
      });
      this.docId = doc.id;
    });
  }

  async updateDocs(c, p, e) {
    console.log("updating");
    const todoRef = doc(this.db, "todo", this.docId);
    await updateDoc(todoRef, {
      currentTodo: c,
      pendingTodo: p,
      completedTodo: e,
    });
  }

  async dataTransfer(i, x, y) {
    let a = [...this.state.currentTodo];
    let b = [...this.state.pendingTodo];
    let c = [...this.state.completedTodo];
    if (
      x <
      this.currentTodoContainerPositionX + this.currentTodoContainerWidth
    ) {
      if (this.currentArray === "P") {
        a.push(this.state.pendingTodo[i]);
        b.splice(i, 1);
      } else if (this.currentArray === "E") {
        a.push(this.state.completedTodo[i]);
        c.splice(i, 1);
      }
    } else if (
      x > this.currentTodoContainerPositionX + this.currentTodoContainerWidth &&
      x < this.pendingTodoContainerPositionX + this.pendingTodoContainerWidth
    ) {
      if (this.currentArray === "C") {
        b.push(this.state.currentTodo[i]);
        a.splice(i, 1);
      } else if (this.currentArray === "E") {
        b.push(this.state.completedTodo[i]);
        c.splice(i, 1);
      }
    } else {
      if (this.currentArray === "C") {
        c.push(this.state.currentTodo[i]);
        a.splice(i, 1);
      } else if (this.currentArray === "P") {
        c.push(this.state.pendingTodo[i]);
        b.splice(i, 1);
      }
    }
    if (
      this.deleteAreaPosition.y + this.deleteAreaPosition.height > y &&
      this.currentArray === "C"
    ) {
      a.splice(i, 1);
    }
    this.setState({
      currentTodo: a,
      pendingTodo: b,
      completedTodo: c,
    });

    await this.updateDocs(a, b, c);
  }

  render() {
    return (
      <>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div
            ref={(e) => {
              if (e === null) return;
              this.deleteAreaPosition = e.getBoundingClientRect();
            }}
            style={{
              border: "dotted",
              borderColor:'red',
              marginLeft: "5px",
              width: window.innerWidth / 3 - this.padding,
              textAlign: "center",
              paddingTop: "10px",
              color:'red'
            }}
          >
            DELETE
          </div>

          <div
            style={{
              width: window.innerWidth / 3 - this.padding,
              display: "inherit",
              marginTop: "5px",
            }}
          >
            <textarea
              cols="10"
              rows="5"
              placeholder="Your Todo***"
              style={{
                height: "40px",
                borderRadius: "5px",
                outline: "none",
                border: "1px solid #dddfe2",
                width: "100%",
                color:'gray'
              }}
              onChange={(e) => {
                this.todoText = e.target.value;
              }}
            />
            <button
              style={{
                width: "75px",
                borderRadius: " 5px",
                outline: " none",
                border: "1px solid #dddfe2",
                backgroundColor: "#7f7ff1",
                height: "46px",
              }}
              onClick={async () => {
                if (this.todoText !== undefined && this.todoText != null) {
                  let d = [...this.state.currentTodo];
                  d.push(this.todoText);
                  this.setState({
                    currentTodo: d,
                  });
                  await this.updateDocs(
                    d,
                    this.state.pendingTodo,
                    this.state.completedTodo
                  );
                }
              }}
            >
              Add
            </button>
          </div>

          <button
            style={{
              width: "75px",
              borderRadius: "5px",
              outline: "none",
              border: "1px solid rgb(221, 223, 226)",
              backgroundColor: "rgb(255 61 61)",
              height: "46px",
              marginRight: "5px",
              marginTop: "5px",
            }}
            onClick={this.props.onClose}
          >
            Close
          </button>
        </div>
        <div className="todoContainer">
          <div
            id="currentTodoContainer"
            ref={(e) => {
              if (!e) return;
              this.currentTodoContainerPositionX = e.getBoundingClientRect().x;
              this.currentTodoContainerWidth = e.getBoundingClientRect().width;
            }}
            style={{
              width: window.innerWidth / 3 - this.padding,
              minHeight: window.innerHeight / 1.2,
              textAlign: "center",
              fontSize: "small",
            }}
          >
            <ProgressIndicator
              progress={
                (this.state.currentTodo.length /
                  (this.state.currentTodo.length +
                    this.state.pendingTodo.length +
                    this.state.completedTodo.length)) *
                100
              }
              color="linear-gradient(90deg, hsla(217, 100%, 50%, 1) 0%, hsla(186, 100%, 69%, 1) 100%)"
            />
            <span>
              {" "}
              Current Todo(
              {isNaN(
                Math.floor(
                  (this.state.currentTodo.length /
                    (this.state.currentTodo.length +
                      this.state.pendingTodo.length +
                      this.state.completedTodo.length)) *
                    100
                )
              )
                ? "0%"
                : Math.floor(
                    (this.state.currentTodo.length /
                      (this.state.currentTodo.length +
                        this.state.pendingTodo.length +
                        this.state.completedTodo.length)) *
                      100
                  ) + "%"}
              ){" "}
            </span>
            {this.state.currentTodo.map((v, i) => (
              <Todo
                todoContent={v}
                ondragstart={(e) => {
                  this.currentArray = "C";
                  console.log("start");
                }}
                ondragend={(e) => {
                  this.dataTransfer(i, e.clientX, e.clientY);

                  // console.log(this.currentArray);
                }}
              />
            ))}
          </div>
          <div
            id="pendingTodoContainer"
            ref={(e) => {
              if (!e) return;
              this.pendingTodoContainerPositionX = e.getBoundingClientRect().x;
              this.pendingTodoContainerWidth = e.getBoundingClientRect().width;
            }}
            style={{
              width: window.innerWidth / 3 - this.padding,
              textAlign: "center",
              fontSize: "small",
            }}
          >
            <ProgressIndicator
              progress={
                (this.state.pendingTodo.length /
                  (this.state.currentTodo.length +
                    this.state.pendingTodo.length +
                    this.state.completedTodo.length)) *
                100
              }
              color="linear-gradient(90deg, hsla(33, 100%, 53%, 1) 0%, hsla(58, 100%, 68%, 1) 100%)"
            />
            <span>
              {" "}
              Pending Todo({" "}
              {isNaN(
                Math.floor(
                  (this.state.pendingTodo.length /
                    (this.state.currentTodo.length +
                      this.state.pendingTodo.length +
                      this.state.completedTodo.length)) *
                    100
                )
              )
                ? "0%"
                : Math.floor(
                    (this.state.pendingTodo.length /
                      (this.state.currentTodo.length +
                        this.state.pendingTodo.length +
                        this.state.completedTodo.length)) *
                      100
                  ) + "%"}
              ){" "}
            </span>

            {this.state.pendingTodo.map((v, i) => (
              <Todo
                todoContent={v}
                ondragstart={(e) => {
                  this.currentArray = "P";
                }}
                ondrag={(e) => {
                  console.log(this.currentTodoContainerPositionX);
                }}
                ondragend={(e) => {
                  this.dataTransfer(i, e.clientX);
                }}
              />
            ))}
          </div>
          <div
            id="completedTodoContainer"
            ref={(e) => {
              if (!e) return;
              this.completedTodoContainerPositionX =
                e.getBoundingClientRect().x;
              this.completedTodoContainerWidth =
                e.getBoundingClientRect().width;
            }}
            style={{
              width: window.innerWidth / 3 - this.padding,
              textAlign: "center",
              fontSize: "small",
            }}
          >
            <ProgressIndicator
              progress={
                (this.state.completedTodo.length /
                  (this.state.currentTodo.length +
                    this.state.pendingTodo.length +
                    this.state.completedTodo.length)) *
                100
              }
              color="linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)"
            />
            <span>
              {" "}
              completed Todo({" "}
              {isNaN(
                Math.floor(
                  (this.state.completedTodo.length /
                    (this.state.currentTodo.length +
                      this.state.pendingTodo.length +
                      this.state.completedTodo.length)) *
                    100
                )
              )
                ? "0%"
                : Math.floor(
                    (this.state.completedTodo.length /
                      (this.state.currentTodo.length +
                        this.state.pendingTodo.length +
                        this.state.completedTodo.length)) *
                      100
                  ) + "%"}
              ){" "}
            </span>

            {this.state.completedTodo.map((v, i) => (
              <Todo
                todoContent={v}
                ondragstart={(e) => {
                  this.currentArray = "E";
                }}
                ondrag={(e) => {
                  console.log(this.currentTodoContainerPositionX);
                }}
                ondragend={(e) => {
                  this.dataTransfer(i, e.clientX);
                }}
              />
            ))}
          </div>
        </div>
      </>
    );
  }
}
