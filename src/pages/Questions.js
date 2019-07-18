import React, { useState } from "react";
export function Questions({ questions, actions, fields }) {
	return (<div className="tab-questions" key="tab-questions">
		{questions.length > 0 ? (questions.map((question, i) => (<QuestionCard key={"q-" + question.id} id={question.id} question={question} fields={fields} cardNum={i + 1} actions={actions} />))) : (<p className="no-questions">You currently have no questions.</p>)}
		<button className="create-question" onClick={actions.createQuestion}>
			<i className="fa fa-plus" />
		</button>
	</div>);
}
function QuestionCard({ question, fields, cardNum, actions, id }) {
	let [modalActivated, setModal] = useState(false);
	let [query, setQuery] = useState("");
	return (<div className="question-card-container">
		<div className="question-card">
			<input type="text" placeholder="Question Name" onChange={evt => actions.editQuestionName(id, evt.target.value)} value={question.name} name="" id="" />
			<div className="query">
				<button className="edit-query" onClick={() => {
					setQuery(question.expression);
					setModal(!modalActivated);
				}}>
					Edit Question
					</button>
			</div>
		</div>
		<button className="question-card-delete" onClick={() => actions.deleteQuestion(id)}>
			<i className="fa fa-trash" />
		</button>
		<div className={"query-modal" + (modalActivated ? " activated" : "")}>
			<p>Edit Question '{question.name}'</p>
			<textarea className="query-textarea" value={query} onChange={evt => setQuery(evt.target.value)} resizeable="false" />
			<p>Fields</p>
			<div className="query-fields">
				{fields.map((f, i) => (<a key={"field-" + i} href="#" onClick={() => setQuery(query + f)}>
					{f}
				</a>))}
			</div>
			<div className="question-actions">
				<button className="save-question" onClick={() => {
					actions.editQuestion(id, query);
					setModal(false);
				}}>
					Save
					</button>
				<button className="cancel-question" onClick={() => {
					setModal(false);
				}}>
					Cancel
					</button>
			</div>
		</div>
	</div>);
}
