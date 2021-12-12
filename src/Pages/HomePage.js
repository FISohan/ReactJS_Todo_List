import React, { Component } from "react";
import AuthPage from "./AuthPage";
//import TodoPage from "./TodoPage";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  addDoc,
  query,
  where,
  collection,
  getDocs,
} from "firebase/firestore";
import firebaseConfig from "../FireBaseConfig";
import TodoPage from "./TodoPage";
import "../App.css";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
    initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.db = getFirestore();
    this.projectId = "";

    this.state = {
      warningMassage: "",
      isWarning: false,
      isLogin: true,
      todoPageActive: false,
      homePageActive: true,
      userId: "",
      projectName: "",
      projects: [],
    };
  }

  componentDidMount() {
    this.hasLogin();
  }

  async getData() {
    const querySnapshot = await getDocs(
      query(
        collection(this.db, "project"),
        where("userId", "==", `${this.state.userId}`)
      )
    );
    let data = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      data.push(doc.data());
    });
    this.setState({
      projects: data,
    });
    console.log(this.state.projects);
  }

  showWarning(massage, duration) {
    this.setState({
      isWarning: true,
      warningMassage: massage,
    });

    setTimeout(() => {
      this.setState({
        isWarning: false,
      });
    }, duration);
  }

  showLoadingWarning(s) {
    this.setState({
      isWarning: s,
      warningMassage: "Loading...",
    });
  }

  async hasLogin() {
    this.showLoadingWarning(true);

    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        console.log(user.uid);
        this.setState({
          isLogin: true,
          userId: user.uid,
        });
        this.getData();
        this.showLoadingWarning(false);
      } else {
        this.setState({
          isLogin: false,
        });
      }
    });
  }

  async addProject(name) {
    this.showLoadingWarning(true);
    const ref = collection(this.db, "project");
    const projectId =
      this.state.userId + "?:" + name + Math.floor(Math.random() * 1000);
    await addDoc(ref, {
      userId: this.state.userId,
      projectName: name,
      projectID: projectId,
    });

    await addDoc(collection(this.db, "todo"), {
      todoId: projectId,
      currentTodo: [],
      pendingTodo: [],
      completedTodo: [],
    });
    this.getData();
    this.showLoadingWarning(false);
    this.showWarning("successfully add", 2000);
  }

  render() {
    if (this.state.homePageActive === true && this.state.isLogin === true) {
      return (
        <>
          {this.warning()}
          <div
            style={{
              position: "absolute",
              backgroundColor: "#8ca2f0",
              width: "100%",
              height: "30px",
              top: "0px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div style={{ marginLeft: "5px", fontSize: "larger" }}>Todo</div>
            <div
              onClick={() => {
                signOut(this.auth);
              }}
              style={{
                marginRight: "5px",
                fontSize: "medium",
                color: "azure",
                cursor: "pointer",
              }}
            >
              Log-out
            </div>
          </div>
          <div className="cardParent" style={{ position: "relative" }}>
            <div className="card">
              <h3>Add project</h3>
              <input
                type="text"
                placeholder="Project Name"
                style={{ height: "30px" }}
                onChange={(e) => {
                  this.setState({
                    projectName: e.target.value,
                  });
                }}
              />
              <input
                type="button"
                value="Add project"
                onClick={() => {
                  this.addProject(this.state.projectName);
                }}
                style={{
                  width: "50%",
                  marginTop: "5px",
                  color: "black",
                }}
              />
            </div>
            {this.state.projects.map((value) => (
              <div
                className="card"
                key={value.projectID}
                onClick={() => {
                  this.projectId = value.projectID;
                  this.setState({
                    todoPageActive: true,
                    homePageActive: false,
                  });
                  console.log(this.projectId, this.state.todoPageActive);
                }}
              >
                <h3>{value.projectName}</h3>
              </div>
            ))}

            <div
              style={{
                position: "absolute",
                textAlign: "center",
                width: "100%",
                top: "98%",
              }}
            >
              <p
                style={{
                  color: "gray",
                  textAlign: "center",
                  fontSize: "small",
                }}
              >
                © {new Date().getUTCFullYear()}, by Fahim Ihtesham Sohan.
                <br />
                <a
                  href="mailto: fisohan7@gmail.com"
                  style={{
                    color: "gray",
                    textAlign: "center",
                    fontSize: "small",
                  }}
                >
                  fisohan7@gmail.com{" "}
                </a>
                <br />
                <a
                  href="https://www.facebook.com/fisohan.79"
                  style={{
                    color: "gray",
                    textAlign: "center",
                    fontSize: "small",
                  }}
                >
                  My fake facebook ID{" "}
                </a>
              </p>
            </div>
          </div>
        </>
      );
    } else if (this.state.todoPageActive) {
      return (
        <TodoPage
          projectId={this.projectId}
          onClose={() => {
            this.setState({
              todoPageActive: false,
              homePageActive: true,
            });
          }}
        />
      );
    } else {
      return <AuthPage />;
    }
  }

  warning() {
    return (
      <div
        className={
          this.state.isWarning === false ? "hideWarning" : "showWarning"
        }
        style={{
          position: "absolute",
          transitionProperty: "all",
          transitionDuration: "0.5s",
          top: "35px",
          backgroundColor: "#f5ae15c5   ",
          left: window.innerWidth / 2 - 250 / 2,
          width: "250px",
          padding: "5px",
          borderRadius: "5px",
          zIndex:100
        }}
      >
        {this.state.warningMassage}
      </div>
    );
  }
}
