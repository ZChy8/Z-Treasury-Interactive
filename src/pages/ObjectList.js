import React from "react";
export function ObjectList({ objects, fields, actions }) {
	return (
		<div className="tab-objects" key="tab-objects">
			{objects.length > 0 ? (
				objects.map((obj, i) => (
					<ObjectCard
						key={"obj-" + obj.id}
						obj={obj}
						fields={fields}
						cardNum={i + 1}
						actions={actions}
					/>
				))
			) : (
				<p className="no-objects">You currently have no objects.</p>
			)}
			<button className="create-object" onClick={actions.createObject}>
				<i className="fa fa-plus" />
			</button>
		</div>
	);
}
function ObjectCard({
	obj: { id, fields: objFields, name, image },
	fields,
	cardNum,
	actions: {
		deleteObject,
		createField,
		setField,
		editField,
		editObjectName,
		editImg
	}
}) {
	return (
		<div className="object-card-container">
			<div className="object-card">
				<div className="img">
					<div
						className="img-bg"
						style={{ backgroundImage: `url(${image})` }}
					/>
					<div className="actions">
						<label className="action">
							<i className="fa fa-upload" />
							<input
								type="file"
								name=""
								id=""
								className="img-upload"
								onChange={evt => {
									let reader = new FileReader();
									reader.onloadend = e => editImg(id, e.target.result);
									reader.readAsDataURL(evt.target.files[0]);
								}}
							/>
						</label>
						<button className="action">
							<i className="fa fa-link" />
						</button>
					</div>
				</div>
				<div className="desc">
					<input
						type="text"
						className="object-name"
						value={name}
						onChange={evt => editObjectName(id, evt.target.value)}
						placeholder={name || "Object " + cardNum}
					/>
					{fields.map((f, i) => (
						<div
							className="field"
							key={"obj-" + id + "-field-" + i}>
							<input
								type="text"
								className={
									"field-label" +
									(fields.indexOf(f) !== i ||
									f === undefined ||
									f === ""
										? " invalid"
										: "")
								}
								value={f}
								placeholder={"Field " + (i + 1)}
								onChange={evt => setField(i, evt.target.value)}
							/>
							<input
								type="text"
								className={
									"field-label" +
									(objFields[i] === undefined ||
									objFields[i] === ""
										? " invalid"
										: "")
								}
								value={objFields[i] || ""}
								placeholder="value"
								onChange={evt =>
									editField(id, i, evt.target.value)
								}
							/>
						</div>
					))}
					<button className="add-field" onClick={createField}>
						Add Field
					</button>
				</div>
			</div>
			<button
				className="object-card-delete"
				onClick={() => deleteObject(id)}>
				<i className="fa fa-trash" />
			</button>
		</div>
	);
}
