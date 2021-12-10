import React, { Component } from "react";
import "../App.css";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import { initializeApp } from "firebase/app";
import firebaseConfig from "../FireBaseConfig";

export default class AuthPage extends Component {
  constructor(props) {
    super(props);
    initializeApp(firebaseConfig);
    this.auth = getAuth();
    this.state = {
      isLogin: true,
      warningMassage: "",
      isWarning: false,
      singUp: {
        email: "",
        password: "",
      },
      login: {
        email: "",
        password: "",
      },
    };
  }

  createAccount() {
    this.showLoadingWarning(true);
    createUserWithEmailAndPassword(
      this.auth,
      this.state.singUp.email,
      this.state.singUp.password
    )
      .then((e) => {
        this.showLoadingWarning(false);
        this.showWarning("Successfully Created", 2000);
      })
      .catch((err) => {
        this.showLoadingWarning(false);
        this.showWarning(err.code, 3000);
        console.log(err);
      });
  }

  login() {
    this.showLoadingWarning(true);
    signInWithEmailAndPassword(
      this.auth,
      this.state.login.email,
      this.state.login.password
    )
      .then(() => {
        this.showLoadingWarning(false);
        this.showWarning("Successfully Login:)", 3000);
      })
      .catch((err) => {
        this.showLoadingWarning(false);
        this.showWarning(err.code, 4000);
      });
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

  render() {
    return (
      <>
        {this.warning()}
        <div
          className="outerDiv"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#f0f2f5",
            height: window.innerHeight,
          }}
        >
          <div
            className="mainDiv"
            style={{
              minWidth:
                window.innerWidth < 500 ? window.innerWidth - 30 : "450px",
              marginTop: "15px",
              minHeight: window.innerHeight / 1.3 - 40,
              backgroundColor: "snow",
              borderRadius: "10px",
              paddingBottom: "15px",
            }}
          >
            {/* ----------------login------------------ */}
            <div
              className="loginContainer"
              style={{
                display: this.state.isLogin === true ? "flex" : "none",
                flexDirection: "column",
                textAlign: "center",
                alignContent: "space-around",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <h2>Login</h2>

              <input
                type="email"
                placeholder="example@gmail.com"
                value={this.state.login.email}
                onChange={(e) => {
                  this.setState({
                    login: {
                      email: e.target.value,
                      password: this.state.login.password,
                    },
                  });
                }}
              />
              <input
                type="password"
                placeholder="Password***"
                value={this.state.login.password}
                onChange={(e) => {
                  this.setState({
                    login: {
                      email: this.state.login.email,
                      password: e.target.value,
                    },
                  });
                }}
              />
              <input
                type="submit"
                style={{ backgroundColor: "#1877f2" }}
                value="Login"
                onClick={(e)=>{
                    this.login();
                    e.preventDefault();
                }}
              />

              <span style={{color:'gray'}}>or</span>
              <input
                type="button"
                style={{
                  width: 85 / 2 + "%",
                  backgroundColor: "#42b72a",
                }}
                value="Create a account"
                onClick={() => {
                  this.setState({ isLogin: false });
                  this.showLoadingWarning(false);
                }}
              />
            </div>
            {/* --------------------------sing-up--------------------------------- */}
            <div
              className="singUpContainer"
              style={{
                display: this.state.isLogin === false ? "flex" : "none",
                flexDirection: "column",
                textAlign: "center",
                alignContent: "space-around",
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                gap: "20px",
              }}
            >
              <h2 style={{color:'black !important'}}>Sing-up</h2>

              <input
                type="email"
                placeholder="example@gmail.com"
                value={this.state.singUp.email}
                onChange={(e) => {
                  this.setState({
                    singUp: {
                      email: e.target.value,
                      password: this.state.singUp.password,
                    },
                  });
                }}
              />
              <input
                type="password"
                placeholder="Password***"
                value={this.state.singUp.password}
                onChange={(e) => {
                  this.setState({
                    singUp: {
                      email: this.state.singUp.email,
                      password: e.target.value,
                    },
                  });
                }}
              />
              <input
                type="submit"
                style={{ backgroundColor: "#1877f2" }}
                value="Sing-up"
                onClick={(e) => {
                  this.createAccount();
                  e.preventDefault();
                }}
              />
              <span style={{color:'gray'}}>or</span>
              <input
                type="button"
                style={{
                  width: 85 / 2 + "%",
                  backgroundColor: "#42b72a",
                }}
                value="Already have a account"
                onClick={() => {
                  this.setState({
                    isLogin: true,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }

    warning() {
        return <div
            className={this.state.isWarning === false ? "hideWarning" : "showWarning"}
            style={{
                position: "absolute",
                transitionProperty: "all",
                transitionDuration: "0.5s",
                top: '5px',
                backgroundColor: "orange",
                left: window.innerWidth / 2 - 250 / 2,
                width: "250px",
                padding: "5px",
                borderRadius: "5px",
            }}
        >
            {this.state.warningMassage}
        </div>;
    }
}
