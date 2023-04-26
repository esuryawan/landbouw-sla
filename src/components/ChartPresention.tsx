import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";

import { authService } from "../services/auth";
import { getLocalTime } from "ababil-utils";
import { Severity, ViewStatus, ViewStatusProps, ViewStatusState } from "ababil-ui-views";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartPresentionProps extends ViewStatusProps {}

interface ChartPresentionState extends ViewStatusState {
	alabels: string[];
	avalues: number[];
	acolors: string[];
	glabels: string[];
	gvalues: number[];
	gcolors: string[];
	total: number;
	loaded: boolean;
}

export default class ChartPresention extends ViewStatus<ChartPresentionProps, ChartPresentionState> {
	constructor(props: ChartPresentionProps) {
		super(props);
		this.state = {
			...this.state,
			alabels: [],
			avalues: [],
			acolors: [],
			glabels: [],
			gvalues: [],
			gcolors: [],
			total: 0,
			loaded: false,
		};
	}

	override componentDidMount() {
		authService.chartPresention().then(
			(result) => {
				console.log(result);
				this.setState({
					avalues: result.avalues,
					alabels: result.alabels,
					acolors: result.acolors,
					gvalues: result.gvalues,
					glabels: result.glabels,
					gcolors: result.gcolors,
					total: result.total,
					loaded: true,
				});
			},
			(error) => {
				this.onStatusError(error, Severity.Error);
			}
		);
	}

	override render() {
		const adata = {
			labels: this.state.alabels,
			datasets: [
				{
					label: "# of Votes",
					data: this.state.avalues,
					backgroundColor: this.state.acolors,
					borderColor: ["rgba(108,153,186,0.1)"],
					borderWidth: 1,
				},
			],
		};
		const gdata = {
			labels: this.state.glabels,
			datasets: [
				{
					label: "# of Votes",
					data: this.state.gvalues,
					backgroundColor: this.state.gcolors,
					borderColor: ["rgba(108,153,186,0.1)"],
					borderWidth: 1,
				},
			],
		};
		return this.state.loaded ? (
			<div className="container">
				{this.doStatusRender()}
				<div>
					<h4 className="title">Absensi Angkatan</h4>
					<Doughnut data={adata} />
					<h4 className="title mt-3">Absensi Grup</h4>
					<Doughnut data={gdata} />
					<h5 className="title mt-3">Total {this.state.total} Alumni</h5>
					<h6 className="title mt-3"> {getLocalTime()}</h6>
				</div>
				<button type="button" className="btn">
					<Link to="/">Tutup</Link>
				</button>
			</div>
		) : (
			<></>
		);
	}
}
