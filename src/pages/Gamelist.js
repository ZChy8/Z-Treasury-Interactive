import React, { Fragment } from "react";
import { Route, Redirect, NavLink, Link } from "react-router-dom";
import NavBar from "./Navbar";
export default function GameList({ games }) {
	return (
		<Fragment>
			<NavBar />
			<div className="game-list">
				<h1 className="gamelist-header">Your Interactives</h1>
				<div className="list">
					{Object.entries(games)
						.reverse()
						.map(([id, game]) => (
							<Game id={id} game={game} key={"game-" + id} />
						))
						.concat([
							<div key={"filler-" + 3} className="game-card-new">
								<Link to="/new">
									<button className="new-game">
										<i className="fa fa-plus" />
									</button>
								</Link>
								<p>Create game</p>
							</div>
						])
						.concat(
							Array(2)
								.fill()
								.map((_, i) => (
									<div
										key={"filler-" + i}
										className="game-card"
									/>
								))
						)}
				</div>
			</div>
		</Fragment>
	);
}
function Game({ id, game }) {
	return (
		<div className="game-card">
			{/* <div className="image" /> */}
			<div className="desc">
				<h3 className="title">{game.name || "Untitled"}</h3>
				<p className="blurb">
					{game.blurb ||
						"Lorem ipsum dolor sit amet consectetur, adipisicing elit. Minima, laudantium, culpa reiciendis dignissimos, iure hic nisi quibusdam adipisci consequuntur ad facere eum a nihil ex quis quidem asperiores suscipit. Hic."}
				</p>
				<div className="actions">
					<Link to={`/game/${id}/edit`}>
						<button className="edit">Edit</button>
					</Link>
					<Link to={`/game/${id}/play`}>
						<button className="play">Play</button>
					</Link>
				</div>
			</div>
		</div>
	);
}
