import React, { Component, Fragment } from "react";
import { Route, Redirect, NavLink, Link } from "react-router-dom";
import { ObjectList } from "./ObjectList";
import { Questions } from "./Questions";
import { Settings } from "./Settings";
import NavBar from "./Navbar";
import { parseExpr } from "../util.js";

let ObjectFactory = id => ({
	id,
	name: "",
	fields: {},
	image:
		"http://www.stleos.uq.edu.au/wp-content/uploads/2016/08/image-placeholder-350x350.png"
});
let QuestionFactory = id => ({
	id,
	name: "",
	expression: "",
	query: { execute: () => false }
});
let initial = v => ({
	fields: [],
	objects: [],
	objectId: 0,
	questions: [],
	questionId: 0,
	name: "",
	gameId: undefined,
	...v
});
export default class Editor extends Component {
	constructor(props) {
		super(props);
		this.saveGame = props.saveGame;
		this.state = initial(
			props.game
				? { ...props.getGame(props.game), gameId: props.game }
				: {}
		);
		this.match = props.match;
		window.logNewState = () => console.log(this.state, props);
	}
	save = () => {
		let data = {
			fields: this.state.fields,
			objects: this.state.objects,
			questions: this.state.questions,
			name: this.state.name,
			gameId: this.state.gameId
		};
		if (this.state.gameId) {
			this.saveGame(this.state.gameId, data);
		} else {
			this.setState({
				gameId: this.saveGame(false, data)
			});
		}
		this.setState(initial());
	};
	createObject = () => {
		this.setState(({ objectId, objects }) => ({
			objects: [...objects, ObjectFactory(objectId)],
			objectId: objectId + 1
		}));
	};
	editObject = (id, data) => {
		this.setState(({ objects }) => ({
			objects: objects.map((v, i) =>
				i === id ? Object.assign({}, v, data) : v
			)
		}));
	};
	editImg = (id, image) => {
		this.setState(({ objects }) => ({
			objects: objects.map((v, i) => (i === id ? { ...v, image } : v))
		}));
	};
	editObjectName = (id, name) => {
		this.setState(({ objects }) => ({
			objects: objects.map((v, i) => (i === id ? { ...v, name } : v))
		}));
	};
	deleteObject = id => {
		this.setState(({ objects }) => ({
			objects: objects.filter(obj => obj.id !== id)
		}));
	};
	editField = (id, field, value) => {
		this.setState(({ objects }) => ({
			objects: objects.map(obj =>
				id === obj.id
					? {
							...obj,
							fields: { ...obj.fields, [field]: value }
					  }
					: obj
			)
		}));
	};
	createField = () => {
		this.setState(({ fields }) => ({
			fields: [...fields, ""]
		}));
	};
	setField = (id, val) => {
		this.setState(({ fields }) => ({
			fields: fields.map((v, i) => (i === id ? val : v))
		}));
	};
	deleteField = id => {
		this.setState(({ fields, objects }) => ({
			fields: fields.filter((v, i) => i !== id),
			objects: objects.map(obj => {
				let {
					fields: { [id]: _, ...fields },
					...props
				} = obj;
				return { ...props, fields };
			})
		}));
	};
	handleNameChange = evt => {
		this.setState({
			name: evt.target.value
		});
	};

	createQuestion = () => {
		this.setState(({ questionId, questions }) => ({
			questions: [...questions, QuestionFactory(questionId)],
			questionId: questionId + 1
		}));
	};
	editQuestion = (id, expression) => {
		console.trace(expression);
		let f = parseExpr(expression);
		this.setState(({ questions }) => ({
			questions: questions.map(question =>
				id === question.id
					? {
							...question,
							expression,
							query: {
								execute: (obj, fields) =>
									f(
										obj.fields,
										fields,
										console.log.bind(console)
									)
							}
					  }
					: question
			)
		}));
	};
	editQuestionName = (id, name) => {
		this.setState(({ questions }) => ({
			questions: questions.map(question =>
				id === question.id
					? {
							...question,
							name
					  }
					: question
			)
		}));
	};
	deleteQuestion = id => {
		this.setState(({ questions }) => ({
			questions: questions.filter(q => q.id !== id)
		}));
	};

	render() {
		let { name, fields, objects, questions, gameId } = this.state;
		let {
			createObject,
			createField,
			deleteObject,
			setField,
			editField,
			handleNameChange,
			editObjectName,
			createQuestion,
			deleteQuestion,
			editQuestion,
			editQuestionName,
			editImg
		} = this;
		let objActions = {
			createObject,
			createField,
			deleteObject,
			setField,
			editField,
			editObjectName,
			editImg
		};
		let questionActions = {
			createQuestion,
			deleteQuestion,
			editQuestion,
			editQuestionName
		};
		const tabs = {
			objects: props => (
				<ObjectList
					key="objects"
					objects={objects}
					fields={fields}
					actions={objActions}
					{...props}
				/>
			),
			questions: props => (
				<Questions
					questions={questions}
					actions={questionActions}
					fields={fields}
					{...props}
				/>
			),
			settings: props => <Settings settings={{}} {...props} />
		};
		return (
			<Fragment>
				<NavBar />
				<div className="new">
					<Route
						exact
						path="/new"
						component={() => <Redirect to="/new/objects" />}
					/>
					<Route
						exact
						path="/game/:id/edit"
						component={() => (
							<Redirect
								to={"/game/" + gameId + "/edit/objects"}
							/>
						)}
					/>

					<input
						type="text"
						className="name-input"
						placeholder="Name"
						value={name}
						onChange={handleNameChange}
					/>

					<div className="new-tabs">
						{Object.keys(tabs).map(t => (
							<NavLink
								to={
									gameId === undefined
										? `/new/${t}`
										: `/game/${gameId}/edit/${t}`
								}
								className="new-tab"
								activeClassName="active-link"
								key={"t-" + t}>
								{t}
							</NavLink>
						))}
					</div>
					<div className="new-content" key="new-content">
						{Object.entries(tabs).map(([name, component]) => (
							<Route
								path={
									gameId === undefined
										? `/new/${name}`
										: `/game/${gameId}/edit/${name}`
								}
								render={component}
								key={"c-" + name}
							/>
						))}
					</div>
					<div className="new-upload" />
					<Link to="/games">
						<button className="save-new button" onClick={this.save}>
							Save Game
						</button>
					</Link>
				</div>
			</Fragment>
		);
	}
}
