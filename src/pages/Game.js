import React, { Fragment, useEffect, useState, Component } from "react";
import { Link, Redirect, Route } from "react-router-dom";
import Editor from "./Editor";
import { randomize, memoize1, group } from "../util";

class Play extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ui: "preload",
			sidebar: false,

			gameData: {},
			questionList: [],
			currentQuestion: 0,
			score: 0,
			picked: {},
			choices: [],
			results: []
		};
		this.getGame = props.getGame;
		this.gameId = props.game;
		this.maxNumber = 30;
	}

	componentDidMount() {
		const gameData = this.getGame(this.gameId);

		if (gameData === undefined) return this.transition("no-game");
		if (gameData.questions.length === 0)
			return this.transition("no-questions");

		const questionList = randomize(gameData.questions);
		const choices = this.calculateChoices(
			gameData,
			questionList,
			this.state.currentQuestion
		);

		this.setState({
			gameData,
			questionList,
			choices
		});
		this.transition("question");
	}

	calculateChoices({ objects, fields }, questionList, currentQuestion) {
		const currentPredicate = obj =>
			memoize1(questionList[currentQuestion].query.execute(obj, fields));

		return randomize(
			group(objects, currentPredicate).slice(0, this.maxNumber)
		);
	}

	transition(ui) {
		this.setState({
			ui
		});
	}

	toggleSidebar = () => {
		this.setState(({ sidebar }) => ({
			sidebar: !sidebar
		}));
	};

	createPicker = id => {
		return v => {
			this.setState(({ picked }) => ({
				picked: {
					...picked,
					[id]: v
				}
			}));
		};
	};
	resetPicked = () => {
		this.setState({
			picked: {}
		});
	};

	showAnswers = () => {
		let {
			questionList,
			currentQuestion,
			choices,
			score,
			gameData,
			picked
		} = this.state;

		const currentPredicate = questionList[currentQuestion].query.execute;
		const results = choices.map(object => ({
			id: object.id,
			res: currentPredicate(object, gameData.fields),
			picked: !!picked[object.id],
			object
		}));
		const newScore = results.reduce((a, { res }) => a + res, 0);

		this.setState({
			results,
			score: score + newScore
		});
		this.transition("answered");
	};
	nextQuestion = () => {
		let { currentQuestion, questionList, gameData } = this.state;
		const newQuestion = currentQuestion + 1;
		if (newQuestion >= questionList.length) return this.transition("final");

		this.setState({
			picked: {},
			currentQuestion: newQuestion,
			ui: "question",
			choices: this.calculateChoices(
				gameData,
				questionList,
				currentQuestion
			)
		});
	};

	render() {
		let {
			sidebar,
			questionList,
			currentQuestion,
			score,
			picked,
			gameData,
			choices,
			results
		} = this.state;
		return (
			<div className="play">
				<Sidebar active={sidebar} toggle={this.toggleSidebar}>
					<Link to="/home">Home</Link>
					<Link to="/games">Games</Link>
					<Link to="/new">New</Link>
				</Sidebar>
				<div className="menu" onClick={this.toggleSidebar}>
					<i className="fa fa-bars" />
				</div>
				<div className="score">{score}</div>
				{{
					preload: () => <p>Loading</p>,
					"no-questions": () => <p>No Questions</p>,
					"no-game": () => <Redirect to="/games" />,
					question: () => {
						let current = questionList[currentQuestion];

						return (
							<Fragment>
								<div className="question">{current.name}</div>
								<div className="choices" key={"choices"}>
									{choices.map(c => (
										<Choice
											key={"choice-" + c.id}
											object={c}
											setPicked={this.createPicker(c.id)}
											picked={picked[c.id]}
										/>
									))}
								</div>
								<div className="actions">
									<button
										className="reset"
										onClick={this.resetPicked}>
										<i className="fa fa-sync" /> Reset
									</button>
									<button
										className="submit"
										onClick={this.showAnswers}>
										<i className="fa fa-check" /> Submit
									</button>
								</div>
							</Fragment>
						);
					},
					answered: () => {
						let current = questionList[currentQuestion];
						return (
							<Fragment>
								<div className="question">{current.name}</div>
								<div className="choices" key={"choices"}>
									{results.map(
										({ id, res, object, picked }) => (
											<Result
												key={"choice-" + id}
												result={res}
												object={object}
												picked={picked}
											/>
										)
									)}
								</div>
								<div className="actions">
									<button disabled className="reset">
										<i className="fa fa-sync" /> Reset
									</button>
									<button
										className="next"
										onClick={this.nextQuestion}>
										<i className="fa fa-check" /> Next
									</button>
								</div>
							</Fragment>
						);
					},
					final: () => {
						return (
							<Fragment>
								<div className="question">
									No More Questions
								</div>
								<div className="choices" key={"choices"}>
									<div className="final">
										Your final score was {score}
									</div>
								</div>
								<div className="actions">
									<Link to="/games">
										<button className="back">
											<i className="fa fa-arrow-left" />
											Back to List
										</button>
									</Link>
									<Link to={`/game/${gameData.gameId}/edit`}>
										<button className="next">
											<i className="fa fa-edit" />
											Next
										</button>
									</Link>
								</div>
							</Fragment>
						);
					}
				}[this.state.ui]()}
			</div>
		);
	}
}

function Choice({ object, setPicked, picked }) {
	return (
		<div className="object" key={"choice-el-" + object.id}>
			<div
				key={"choice-img-" + object.id}
				className="image-container"
				style={{ backgroundImage: `url(${object.image})` }}
				onClick={() => setPicked(!picked)}>
				<div className={"check" + (picked ? " picked" : "")}>
					<i className="fa fa-check" />
				</div>
			</div>
			<div className="name">{object.name || <br />}</div>
		</div>
	);
}
function Result({ result, object, picked }) {
	return (
		<div className="object object-result" key={"choice-el-" + object.id}>
			<div
				key={"choice-img-" + object.id}
				className={
					"image-container" + (result && picked ? "" : " flipped")
				}
				style={{ backgroundImage: `url(${object.image})` }}>
				{result && picked ? (
					<div className={"check picked"}>
						<i className="fa fa-check" />
					</div>
				) : result === picked ? (
					<div className="check-indicator">
						<i className="fa fa-check" />
					</div>
				) : (
					<div className="times-indicator">
						<i className="fa fa-times" />
					</div>
				)}
			</div>
			<div className="name">{object.name || <br />}</div>
		</div>
	);
}
function Sidebar({ children, toggle, active }) {
	return (
		<div className={"sidebar" + (active ? " active" : "")}>
			<div className="close" onClick={toggle}>
				<i className="fa fa-times" />
			</div>
			<div className="links">{children}</div>
		</div>
	);
}

function Share() {
	return <p>Share</p>;
}
function Learn() {
	return <p>Learn</p>;
}

export default function GamePage({ match, getGame, saveGame }) {
	let game = match.params.game;
	return (
		<Fragment>
			<Route
				path={`${match.path}/edit`}
				render={props => (
					<Editor
						{...props}
						game={game}
						getGame={getGame}
						saveGame={saveGame}
					/>
				)}
			/>
			<Route
				path={`${match.path}/play`}
				render={props => (
					<Play {...props} game={game} getGame={getGame} />
				)}
			/>
		</Fragment>
	);
}
