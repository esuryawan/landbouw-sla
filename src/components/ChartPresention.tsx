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
	hadir: number;
	konfirmasi: number;
}

export default function ChartPresention() {
	const navigate = useNavigate();
	const [data, setData] = useState<dataType[]>([]);
	const [totalHadir, setTotalHadir] = useState(0);
	const [labels, setLabels] = useState<string[]>([]);
	const [hadirs, setHadirs] = useState<number[]>([]);
	const [colors, setColors] = useState<string[]>([]);
	const rowref = useRef<null | HTMLDivElement>(null);
	const user: UserSLA = authService.getLogin() as UserSLA;

	useEffect(() => {
		authService.queryPresentionSummary().then(
			(recs) => {
				// console.log(recs);
				let result: dataType[] = [];
				let totalHadir = 0;
				let labels: string[] = [];
				let hadirs: number[] = [];
				let colors: string[] = [];

				for (let i = 0; i < recs.length; i++) {
					const rec = recs[i];
					totalHadir += rec.Hadir;
					result.push({ year: rec.GraduationYear, konfirmasi: rec.Konfirmasi, hadir: rec.Hadir});
					labels.push(rec.GraduationYear.toString());
					hadirs.push(rec.Hadir);
					colors.push(ColourCodes[rec.GraduationYear - 1958]);
				}
				setData(result);
				setLabels(labels);
				setHadirs(hadirs);
				setColors(colors);
				setTotalHadir(totalHadir);
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
		navigate(`/chart/present/${year}`);
	}

	function newRow(i: number, onRowClick: (year: number) => void, rec: dataType) {
		if (user && user.Alumni && user.Alumni.GraduationYear === (rec.year + 2)) {
			// console.log(rec.year)
			return (<TableRow key={i} onClick={() => onRowClick(rec.year)}>
				<TableCell align="left">{rec.year} <Link to={`/chart/confirm/${rec.year}`}><i className="fa fa-circle-info"></i></Link></TableCell>
				<TableCell align="right">{rec.konfirmasi}</TableCell>
				<TableCell align="right" ref={rowref}>{rec.hadir}</TableCell>
			</TableRow>);
		} else {
			return <TableRow key={i} onClick={() => onRowClick(rec.year)}>
				<TableCell align="left">{rec.year} <Link to={`/chart/confirm/${rec.year}`}><i className="fa fa-circle-info"></i></Link></TableCell>
				<TableCell align="right">{rec.konfirmasi}</TableCell>
				<TableCell align="right">{rec.hadir}</TableCell>
			</TableRow>;
		}
	}

	let tableMaxHeight = window.innerHeight - 150;

	return (
		<Box className={styles.containerWhite} sx={{ marginTop: 2 }} maxWidth={300}>
			<TableContainer sx={{ maxHeight: tableMaxHeight, marginTop: 1, maxWidth: 300 }} >
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

				<Table stickyHeader sx={{ maxWidth: 200, mb: 2, fontSize: 8, margin: "auto" }} size="small" className="performance-table">
					<thead className={styles.stickyHeader}>
						<TableRow>
							<TableCell align="left">Angkatan</TableCell>
							<TableCell align="right">Konfirmasi</TableCell>
							<TableCell align="right">Tibo</TableCell>
						</TableRow>
					</thead>
					<TableBody>
						{data.map((rec, i) => (newRow(i, onRowClick, rec)))}
					</TableBody>
					<tfoot className={styles.stickyFooter}>
						<TableRow>
							<TableCell align="left" colSpan={2} className={styles.logtime}>({new Date().toLocaleString()})</TableCell>					
							<TableCell align="right"><b>{totalHadir}</b></TableCell>
						</TableRow>
					</tfoot>
				</Table>
			</TableContainer>
			<div className={styles.footnote}>klik dibaris angkatan untuak maliek namo nan alah tibo</div>
			<div className={classNames(styles.btnContainer, "mt-3")}>
				<button type="button" className={classNames(styles.btn)}>
					<Link to="/">Tutup</Link>
				</button>
			</div>
		</Box>
	)
}

