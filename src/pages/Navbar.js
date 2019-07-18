import React from "react";
import { Route, Redirect, NavLink, Link } from "react-router-dom";


export default () => (
	<nav className="nav-bar">
		<Link to="/">Home</Link>
		<Link to="/games">List</Link>
		<Link to="/new">New</Link>
	</nav>
);