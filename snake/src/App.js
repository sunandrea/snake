/* eslint-disable default-case */
import React, { Component } from "react";
import Snake from "./components/Snake";
import Food from "./components/Food";
import "./App.css";
import Menu from "./components/Menu";
import API from "./api/api";
import Leaderboard from "./components/Leaderboard";

const getRandomFood = () => {
  let min = 1;
  let max = 98;
  let x = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  let y = Math.floor((Math.random() * (max - min + 1) + min) / 2) * 2;
  const type = Math.floor(Math.random() * 3) + 1;
  const points = type === 1 ? 1 : type === 2 ? 5 : 10;
  console.log({ type, points, position: [x, y] });
  return { type, points, position: [x, y] };
};

const initialState = {
  food: getRandomFood(),
  direction: "RIGHT",
  playerName: "",
  gameStarted: false,
  gameOver: false,
  speed: 150,
  score: 0,
  gamePaused: false,
  snakeDots: [
    [0, 0],
    [0, 2],
  ],
  records: [],
  intervalId: null,
};

class App extends Component {
  constructor() {
    super();
    this.state = initialState;
  }

  onKeyDown = (e) => {
    switch (e.keyCode) {
      case 38:
        if (this.state.direction !== "DOWN") {
          this.setState({ direction: "UP" });
        }
        break;
      case 40:
        if (this.state.direction !== "UP") {
          this.setState({ direction: "DOWN" });
        }
        break;
      case 37:
        if (this.state.direction !== "RIGHT") {
          this.setState({ direction: "LEFT" });
        }
        break;
      case 39:
        if (this.state.direction !== "LEFT") {
          this.setState({ direction: "RIGHT" });
        }
        break;
      case 80:
        this.handlePause();
        break;
      default:
        break;
    }
  };

  handlePause = () => {
    this.setState((prevState) => ({ gamePaused: !prevState.gamePaused }));
  };

  moveSnake = () => {
    if (this.state.gamePaused) {
      return;
    }

    let dots = [...this.state.snakeDots];
    let head = dots[dots.length - 1];

    switch (this.state.direction) {
      case "RIGHT":
        head = [head[0] + 2, head[1]];
        break;
      case "LEFT":
        head = [head[0] - 2, head[1]];
        break;
      case "DOWN":
        head = [head[0], head[1] + 2];
        break;
      case "UP":
        head = [head[0], head[1] - 2];
        break;
    }

    if (
      this.checkSnakeCollision(head, dots) ||
      this.checkBorderCollision(head)
    ) {
      this.handleGameOver();
      return;
    }

    if (
      this.state.food.position[0] === head[0] &&
      this.state.food.position[1] === head[1]
    ) {
      const newScore = this.state.score + this.state.food.points;

      this.setState({
        score: this.state.score + this.state.food.points,
        food: getRandomFood(),
      });

      dots.push(head);

      if (Math.floor(newScore / 50) > Math.floor(this.state.score / 50)) {
        this.setState({
          speed: Math.max(this.state.speed - 10, 10),
        });
      }
    } else {
      dots.push(head);
      dots.shift();
    }

    this.setState({
      snakeDots: dots,
    });
  };

  checkSnakeCollision = (head, snakeDots) => {
    for (let i = 0; i < snakeDots.length - 1; i++) {
      if (head[0] === snakeDots[i][0] && head[1] === snakeDots[i][1]) {
        this.setState({ gameOver: true });
        return true;
      }
    }
    return false;
  };

  checkBorderCollision = (head) => {
    if (head[0] >= 100 || head[1] >= 100 || head[0] < 0 || head[1] < 0) {
      this.setState({ gameOver: true });
      return true;
    }
    return false;
  };

  handleGameOver = async () => {
    if (this.state.gameOver) {
      return;
    }
    alert(
      `Game Over. Snake length is ${this.state.snakeDots.length}, your score is ${this.state.score}`
    );

    let records = [];
    try {
      await API.postResult(this.state.playerName, this.state.score);
      records = await API.getResults();
      console.log(`records`, records);
    } catch (error) {
      alert("Failed to save game result");
    }

    clearInterval(this.state.intervalId);

    this.setState({
      ...initialState,
      records: records,
      gameOver: true,
      gameStarted: false,
    });
  };

  handleRestart = () => {
    this.setState({
      ...this.initialState,
      gameOver: false,
      gameStarted: true,
      snakeDots: initialState.snakeDots,
    });
  };

  onRouteChange = (name) => {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
    }

    const intervalId = setInterval(this.moveSnake, this.state.speed);

    document.onkeydown = this.onKeyDown;

    this.setState({
      playerName: name,
      gameStarted: true,
      intervalId,
      gameOver: false,
    });
  };

  render() {
    if (!this.state.gameStarted) {
      return (
        <>
          {this.state.gameOver && <Leaderboard results={this.state.records} />}
          <Menu onRouteChange={this.onRouteChange} />
        </>
      );
    }

    return (
      <>
        <div className="name-panel">User: {this.state.playerName}</div>
        <div className="score-panel">Score: {this.state.score}</div>
        <div className="speed-panel">Speed: {this.state.speed}</div>
        <div
          className={`game-area ${this.state.gamePaused ? "game-paused" : ""}`}
        >
          <Snake snakeDots={this.state.snakeDots} />
          <Food dot={this.state.food} />
        </div>
        <button className="restart-button" onClick={this.handleRestart}>
          Restart
        </button>{" "}
      </>
    );
  }
}

export default App;
