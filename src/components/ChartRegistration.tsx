import React from "react";
import classNames from "classnames";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Link } from "react-router-dom";

import { getLocalTime } from "ababil-utils";
import { Severity, ViewStatus, ViewStatusProps, ViewStatusState } from "ababil-ui-views";
import { authService } from "../services/auth";

import styles from "../styles/general.module.scss";

ChartJS.register(ArcElement, Tooltip, Legend);

interface ChartRegistrationProps extends ViewStatusProps {}

interface ChartRegistrationState extends ViewStatusState {
	alabels: string[];
	avalues: number[];
	acolors: string[];
	glabels: string[];
	gvalues: number[];
	gcolors: string[];
	total: number;
	loaded: boolean;
}

export default class ChartRegistration extends ViewStatus<ChartRegistrationProps, ChartRegistrationState> {
	constructor(props: ChartRegistrationProps) {
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
		authService.chartRegistration().then(
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
			<div className={styles.container}>
				{this.doStatusRender()}
				<div>
					<h3 className={styles.title}>Registrasi Angkatan</h3>
					<Doughnut data={adata} />
					<h3 className={classNames(styles.title, "mt-3")}>Registrasi Grup</h3>
					<Doughnut data={gdata} />
					<h5 className={classNames(styles.title, "mt-3")}>Total {this.state.total} Alumni</h5>
					<h6 className={classNames(styles.title, "mt-3")}> {getLocalTime()}</h6>
				</div>
				<button type="button" className={styles.btn}>
					<Link to="/">Tutup</Link>
				</button>
			</div>
		) : (
			<></>
		);
	}
}
