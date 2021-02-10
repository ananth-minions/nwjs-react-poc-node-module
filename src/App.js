import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import * as fs from "fs";
import net from "net";

const NetworkConnection = async (buffer, { port, host }) => {
  return new Promise((res, rej) => {
    let device = new net.Socket();

    device.on("close", () => {
      if (device) {
        device.destroy();
        device = null;
      }
      res();
      return;
    });

    device.on("error", rej);

    device.connect(port, host, () => {
      device.write(buffer);
      device.emit("close");
    });
  });
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { files: [] };
  }

  async onStart() {
    try {
      await NetworkConnection(Buffer.from([1, 2, 3, 4, 5, 6]), {
        host: "192.168.0.8",
        port: "8081",
      });
    } catch (err) {
      console.log("error", err);
    }
  }

  async componentDidMount() {
    console.log("check if fs and net modules are loaded ", fs, net);

    fs.readdir("/", (err, files) => {
      this.setState({ files: files });
    });

    await this.onStart();
  }

  renderFiles = () => {
    return this.state.files.map((file, index) => {
      return <p key={index}>{file}</p>;
    });
  };

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React/NW.js</h2>
        </div>
        <p className="App-intro">Hello NW.js!</p>
        {this.renderFiles()}
      </div>
    );
  }
}

export default App;
