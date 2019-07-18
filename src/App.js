import React, { Fragment, useRef, useEffect, Component } from "react";
import "./App.scss";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Home, GamePage, New, GameList} from "./pages/index.js";
// import { New } from "./pages/New";
// import { GameList } from "./pages/Gamelist";

class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			games: {},
			gameid: 0
		};
		window.logState = () => console.log(this.state);
	}
	saveGame = (id, data) => {
		if (id) {
			this.setState(state => ({ games: { ...state.games, [id]: data } }));
		} else {
			let gameid = this.state.gameid + 1;
			this.setState(state => ({
				...state,
				gameid,
				games: {
					...state.games,
					[gameid]: data
				}
			}));
			return gameid;
		}
	};
	getGame = (id) => this.state.games[id];
	render() {
		return (
			<div className="App">
				<Router>
					<Route path="/" exact component={Home} />
					<Route
						path="/new"
						render={() => (
							<New
								saveGame={this.saveGame}
								getGame={this.getGame}
							/>
						)}
					/>
					<Route
						path="/games"
						render={() => (
							<GameList games={this.state.games} />
						)}
					/>
					<Route
						path="/game/:game"
						render={props => (
							<GamePage
								saveGame={this.saveGame}
								getGame={this.getGame}
								{...props}
							/>
						)}
					/>
				</Router>
			</div>
		);
	}
}

export default App;
