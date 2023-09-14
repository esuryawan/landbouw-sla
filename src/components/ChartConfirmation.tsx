import { Box, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { authService } from "../services/auth";
import { Doughnut } from "react-chartjs-2";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { ColourCodes } from "../constants";
import styles from "./ChartConfirmation.module.scss";
import { UserSLA } from "ababil-landbouw";

type dataType = {
	year: number;
	unknown: number;
	yes: number;
	no: number;
}

export default function ChartConfirmation() {
	const navigate = useNavigate();
	const [data, setData] = useState<dataType[]>([]);
	const [totalYes, setTotalYes] = useState(0);
	const [totalNo, setTotalNo] = useState(0);
	const [labels, setLabels] = useState<string[]>([]);
	const [hadirs, setHadirs] = useState<number[]>([]);
	const [colors, setColors] = useState<string[]>([]);
	const rowref = useRef<null | HTMLDivElement>(null);
	const user: UserSLA = authService.getLogin() as UserSLA;

	useEffect(() => {
		authService.queryConfirmationSummary().then(
			(recs) => {
				// console.log(recs);
				let year = 0;
				let totalYes = 0;
				let totalNo = 0;
				let result: dataType[] = [];
				let data: dataType = { year: 0, unknown: 0, yes: 0, no: 0 };
				let labels: string[] = [];
				let hadirs: number[] = [];
				let colors: string[] = [];

				for (let i = 0; i < recs.length; i++) {
					const rec = recs[i];
					if (rec.GraduationYear !== year) {
						year = rec.GraduationYear;
						data = { year: year, unknown: 0, yes: 0, no: 0 }
						result.push(data);
					}
					switch (rec.Status) {
						case 0: data.unknown = rec.CNT; break;
						case 1:
							data.yes = rec.CNT;
							totalYes += rec.CNT;
							labels.push(year.toString());
							hadirs.push(rec.CNT);
							colors.push(ColourCodes[year - 1958]);
							break;
						case 2: data.no = rec.CNT; totalNo += rec.CNT; break;
					}
				}
				setData(result);
				setLabels(labels);
				setHadirs(hadirs);
				setColors(colors);
				setTotalYes(totalYes);
				setTotalNo(totalNo);
				// console.log(result);
			}, (error) => {
				console.log(error);
			}
		)

	}, []);

	useEffect(() => {
		rowref.current?.scrollIntoView({ behavior: 'smooth' })
	});

	function onRowClick(year: number) {
		// console.log(year);
		navigate(`/chart/confirm/${year}`);
	}

	function newRow(i: number, onRowClick: (year: number) => void, rec: dataType) {
		if (user && user.Alumni && user.Alumni.GraduationYear === (rec.year + 2)) {
			// console.log(rec.year)
			return <TableRow key={i} onClick={() => onRowClick(rec.year)}>
				<TableCell align="left">{rec.year} <Link to={`/chart/confirm/${rec.year}`}><i className="fa fa-circle-info"></i></Link></TableCell>
				<TableCell align="right">{rec.yes}</TableCell>
				<TableCell align="right" ref={rowref}>{rec.no}</TableCell>
			</TableRow>;
		} else {
			return <TableRow key={i} onClick={() => onRowClick(rec.year)}>
				<TableCell align="left">{rec.year} <Link to={`/chart/confirm/${rec.year}`}><i className="fa fa-circle-info"></i></Link></TableCell>
				<TableCell align="right">{rec.yes}</TableCell>
				<TableCell align="right">{rec.no}</TableCell>
			</TableRow>;
		}
	}

	let tableMaxHeight = window.innerHeight - 150;

	return (
		<Box className={styles.containerWhite} sx={{ marginTop: 2 }} maxWidth={300}>
			<TableContainer sx={{ maxHeight: tableMaxHeight, marginTop: 2, maxWidth: 300, padding: "auto" }} >
				<Doughnut
					data={{
						labels: labels,
						datasets: [{
							data: hadirs,
							backgroundColor: colors,
							hoverBackgroundColor: colors,
							hoverOffset: 10,
							borderWidth: 0
						}],

					}}

					options={{
						responsive: true,
						plugins: {
							legend: {
								display: false,
							},
							title: {
								display: true,
								position: "top",
								align: "center",
								font: { size: 16 },
								padding: { top: 20, bottom: 10 }
							},
						},
					}}

					plugins={[{
						id: 'textCenter',
						afterDatasetDraw(chart, args, options) {
							const { ctx, data } = chart;
							const chartData = chart.getDatasetMeta(0).data;
							chartData.forEach((datapoint: any, i) => {
								let value: number = data.datasets[0].data[i] as number;
								if (value) {
									const { x, y } = datapoint.getCenterPoint();
									const label: string = '' + data.labels![i];
									ctx.font = 'bold 10px sans-serif';
									ctx.fillStyle = 'white';
									ctx.textAlign = 'center';
									ctx.textBaseline = 'middle';
									ctx.fillText(label, x, y);
								}
							});
						},
					}]}
				/>

				<Table stickyHeader sx={{ maxWidth: 200, fontSize: 8, margin: "auto", marginTop: 2 }} size="small" className="performance-table">
					<thead className={styles.stickyHeader}>
						<TableRow>
							<TableCell align="left">Angkatan</TableCell>
							<TableCell align="right">Hadir</TableCell>
							<TableCell align="right">Tidak</TableCell>
						</TableRow>
					</thead>
					<TableBody>
						{data.map((rec, i) => (newRow(i, onRowClick, rec)))}
					</TableBody>
					<tfoot className={styles.stickyFooter}>
						<TableRow>
							<TableCell align="left"></TableCell>
							<TableCell align="right"><b>{totalYes}</b></TableCell>
							<TableCell align="right"><b>{totalNo}</b></TableCell>
						</TableRow>
					</tfoot>
				</Table>
			</TableContainer>
			<div className={styles.footnote}>klik dibaris angkatan untuak maliek namo konco nan katibo</div>
			<div className={classNames(styles.btnContainer, "mt-3")}>
				<button type="button" className={classNames(styles.btn)}>
					<Link to="/">Tutup</Link>
				</button>
			</div>
		</Box>
	)
}

