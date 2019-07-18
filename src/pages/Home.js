import React, { Component, Fragment, useRef, useEffect } from "react";
import {
	BrowserRouter as Router,
	Route,
	Link,
	Redirect,
	NavLink
} from "react-router-dom";
import {createAnimation, useScroll} from "../util.js";
import NavBar from "./Navbar";

export default function Home() {
	const [scrollToAbout, aboutScrollRef] = useScroll(
		t =>
			t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
		750
	);
	const [scrollToTop, topScrollRef] = useScroll(
		t =>
			t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
		750
	);

	return (
		<Fragment>
			<NavBar></NavBar>
			<div className="home">
				<span {...topScrollRef} />
				<div className="section-hero">
					<h1 className="welcome-header">Welcome</h1>
					<p className="welcome-desc">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit.
						Earum voluptates repudiandae eum numquam nam aliquid maiores
						iste itaque reiciendis ipsum quaerat vitae ab, sunt tempora.
					</p>
					<div className="welcome-actions">
						<Link to="/new">
							<button className="action-create">
								Create <i className="fa fa-plus" />
							</button>
						</Link>
						<button className="action-learn" onClick={scrollToAbout}>
							Learn More <i className="fa fa-arrow-right" />
						</button>
					</div>
				</div>
				<div className="section-about" {...aboutScrollRef}>
					<h1 className="about-header">Features</h1>
					<div className="feature">
						<img
							src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
							alt=""
							className="feature-image"
						/>
						<div className="feature-desc">
							<h2 className="feature-title">Title</h2>
							<p className="feature-blurb">
								Lorem ipsum dolor sit amet consectetur, adipisicing
								elit. Deserunt temporibus, veniam cupiditate
								voluptatum expedita quis veritatis officiis aperiam
								amet officia, architecto soluta quasi, odit
								molestias error cum corrupti eius natus.
							</p>
						</div>
					</div>
					<div className="feature">
						<img
							src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
							alt=""
							className="feature-image"
						/>
						<div className="feature-desc">
							<h2 className="feature-title">Title</h2>
							<p className="feature-blurb">
								Lorem ipsum dolor sit amet consectetur, adipisicing
								elit. Deserunt temporibus, veniam cupiditate
								voluptatum expedita quis veritatis officiis aperiam
								amet officia, architecto soluta quasi, odit
								molestias error cum corrupti eius natus.
							</p>
						</div>
					</div>
					<div className="feature">
						<img
							src="https://images.pexels.com/photos/67636/rose-blue-flower-rose-blooms-67636.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
							alt=""
							className="feature-image"
						/>
						<div className="feature-desc">
							<h2 className="feature-title">Title</h2>
							<p className="feature-blurb">
								Lorem ipsum dolor sit amet consectetur, adipisicing
								elit. Deserunt temporibus, veniam cupiditate
								voluptatum expedita quis veritatis officiis aperiam
								amet officia, architecto soluta quasi, odit
								molestias error cum corrupti eius natus.
							</p>
						</div>
					</div>
				</div>
				<button className="scroll-up" onClick={scrollToTop}>
					<i className="fa fa-arrow-up" />
				</button>
			</div>
		</Fragment>
	);
}