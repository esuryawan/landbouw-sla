import * as React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import { Create } from "./Create";
import { EditCustomer } from "./Edit";
import "./App.css";

export class App extends React.Component {
	public render() {
		return (
			<div>
				<nav>
					<ul>
						<li>
							<Link to={"/"}> Home </Link>
						</li>
						<li>
							<Link to={"/create"}> Create Customer </Link>
						</li>
					</ul>
				</nav>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/create" element={<Create />} />
					<Route path="/edit/:id" element={<EditCustomer />} />
				</Routes>
			</div>
		);
	}
}
