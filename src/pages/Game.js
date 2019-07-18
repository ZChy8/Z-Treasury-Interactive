import React, { Fragment, useEffect, useState } from "react";
import { Link, Redirect, Route } from "react-router-dom";
import New from "./New";

let randomize = a => a.sort((a, b) => ~~(Math.random() > 0.5) - 1);

function Play({ game, getGame }) {
	// States: no-game, preload, question, no-questions, answered, final
	let [state, setUiState] = useState("preload");
	let [sidebar, setSidebar] = useState(false);
	let [gameData, setGameData] = useState({});

	let [questionList, setQuestionList] = useState([]);
	let [question, setQuestion] = useState(0);
	let [score, setScore] = useState(0);
	let [picked, setPicked] = useState({});
	let [choices, setChoices] = useState([]);
	let [objects, setObjects] = useState([]);

	let [results, setResults] = useState([]);

	const maxNumber = 30;

	useEffect(() => {
		let val = getGame(game);

		if (val === undefined) return setUiState("no-game");
		if (val.questions.length === 0) return setUiState("no-questions");

		let { name, objects, questions, fields} = val;

		let qList = randomize(questions);

		let current = qList[question];
		let correct = objects.filter(obj => current.query.execute(obj, fields));
		let extra = randomize(
			objects.filter(obj => !correct.includes(obj))
		).slice(0, maxNumber - correct.length);

		setQuestionList(qList);
		setGameData(val);
		setUiState("question");
		setObjects(objects);
		setChoices(randomize(correct.concat(extra)));
	}, []);

	return (
		<div className="play">
			<div className={"sidebar" + (sidebar ? " active" : "")}>
				<div className="close" onClick={() => setSidebar(false)}>
					<i className="fa fa-times" />
				</div>
				<div className="links">
					<Link to="/home">Home</Link>
					<Link to="/games">Games</Link>
					<Link to="/new">New</Link>
				</div>
			</div>
			<div className="menu" onClick={() => setSidebar(!sidebar)}>
				<i className="fa fa-bars" />
			</div>
			{{
				preload: () => <p>Loading</p>,
				"no-questions": () => <p>No Questions</p>,
				"no-game": () => <Redirect to="/games" />,
				question: () => {
					let current = questionList[question];
					console.log(current);

					return (
						<Fragment>
							<div className="question">
								{questionList[question].name}
							</div>
							<div className="score">{score}</div>
							<div className="choices" key={"choices"}>
								{choices.map(c => (
									<Choice
										key={"choice-" + c.id}
										object={c}
										setPicked={v =>
											setPicked({
												...picked,
												[c.id]: v
											})
										}
										picked={picked[c.id]}
									/>
								))}
							</div>
							<div className="actions">
								<button
									className="reset"
									onClick={() => setPicked({})}>
									<i className="fa fa-sync" /> Reset
								</button>
								<button
									className="submit"
									onClick={() => {
										let results = choices.map(object => ({
											id: object.id,
											res: current.query.execute(object, gameData.fields),
											picked: !!picked[object.id],
											object
										}));
										console.log(results);
										setResults(results);
										setScore(
											score +
												results.reduce(
													(a, { res }) =>
														a + (res ? 1 : 0),
													0
												)
										);
										setUiState("answered");
									}}>
									<i className="fa fa-check" /> Submit
								</button>
							</div>
						</Fragment>
					);
				},
				answered: () => {
					return (
						<Fragment>
							<div className="question">
								{questionList[question].name}
							</div>
							<div className="score">{score}</div>
							<div className="choices" key={"choices"}>
								{results.map(c => (
									<Result
										key={"choice-" + c.id}
										result={c.res}
										object={c.object}
										picked={c.picked}
									/>
								))}
							</div>
							<div className="actions">
								<button disabled className="reset">
									<i className="fa fa-sync" /> Reset
								</button>
								<button
									className="next"
									onClick={() => {
										let newQ = question + 1;
										if (newQ >= questionList.length)
											return setUiState("final");

										let current = questionList[newQ];
										let correct = objects.filter(obj =>
											current.query.execute(obj)
										);
										let extra = randomize(
											objects.filter(
												obj => !correct.includes(obj)
											)
										).slice(0, maxNumber - correct.length);
										setPicked({});
										setQuestion(newQ);
										setUiState("question");
										setChoices(
											randomize(correct.concat(extra))
										);
									}}>
									<i className="fa fa-check" /> Next
								</button>
							</div>
						</Fragment>
					);
				},
				final: () => {
						return <Fragment>
							<div className="question">
								No More Questions
							</div>
							<div className="score">
								{score}
							</div>
							<div
								className="choices"
								key={"choices"}
							>
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
								<Link
									to={
										"/game/" +
										gameData.gameId +
										"/edit"
									}>
									<button className="next">
										<i className="fa fa-edit" />
										Next
									</button>
								</Link>
							</div>
						</Fragment>;
				}
			}[state]()}
		</div>
	);
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
function Result({ result, object, picked}) {
	return (
		<div
			className="object object-result"
			key={"choice-el-" + object.id}>
			<div
				key={"choice-img-" + object.id}
				className={
					"image-container" +
					(result && picked ? "" : " flipped")
				}
				style={{ backgroundImage: `url(${object.image})` }}>
				{result && picked ? (
					<div className={"check picked"}>
						<i className="fa fa-check" />
					</div>
				) : ((result===picked) ? (
					<div className="check-indicator">
						<i className="fa fa-check" />
					</div>
				) : (
					<div className="times-indicator">
						<i className="fa fa-times" />
					</div>
				))}
			</div>
			<div className="name">{object.name || <br />}</div>
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
	console.log(match, game);
	return (
		<Fragment>
			<Route
				path={`${match.path}/edit`}
				render={props => (
					<New
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
