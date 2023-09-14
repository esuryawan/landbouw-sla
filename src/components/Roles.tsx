import React from "react";
import { Link } from "react-router-dom";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import classNames from "classnames";
import { withRouter, WithRouterProps } from "ababil-router";
import { authService } from "../services/auth";
import { Severity, ViewPaging, ViewPagingProps, ViewPagingState } from "ababil-ui-views";

import styles from "./Roles.module.scss";

class Roles extends ViewPaging<WithRouterProps<ViewPagingProps>, ViewPagingState> {

	componentDidMount() {
		this.getRecords(this.state.page);
	}

	getRecords(page: number) {
		authService.roleList(page - 1, this.state.pageSize).then(
			(response: any) => {
				authService.updateToken(this.state.login!, response.headers["x-access-token"]);
				// console.log(response);
				const { count, rows } = response.data;
				const pages = Math.ceil(count / this.state.pageSize);
				this.initRecords(count, rows);
				this.setState({
					records: rows,
					page: page,
					pageCount: pages,
					rowCount: count,
				});
			},
			(error) => {
				this.onStatusError(error, Severity.Error);
			}
		);
	}

	formatRoles(roles: any) {
		const result: any = [];
		const pushFA = (i: number, icon: string) => {
			result.push(<i key={i} className={classNames("fa", icon, styles.fontSmall)}>&nbsp;</i>);
		}

		for (let i = 0; i < roles.length; i++) {
			const role = roles[i];
			switch (role) {
				case "panitia.pindai": pushFA(i, "fa-qrcode"); break;
				case "panitia.absensi": pushFA(i, "fa-check-square"); break;
				case "admin.angkatan": pushFA(i, "fa-graduation-cap"); break;
				case "admin.all": pushFA(i, "fa-university"); break;
				case "view.chart": pushFA(i, "fa-chart-bar"); break;
				case "super.super": pushFA(i, "fa-cog"); break;
				default: break;
			}
		}
		return <>{result}</>;
	}

	onRowClick(e: any, item: any) {
		console.log(item);
		this.props.history.push(`/roles/edit/${item.UserId}/${item.Email}`);
	}

	render() {
		return (
			<div className={styles.container} >
				{this.doStatusRender()}
				<Paper sx={{ width: "100%", overflow: "hidden" }} className={styles.transparent}>
					<TableContainer sx={{ maxHeight: 440 }}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Nama, Email</TableCell>
									<TableCell>Roles</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{this.state.rowCount > 0 &&
									this.state.records.map((item) => (
										<TableRow key={item.UserId} onClick={(e) => this.onRowClick(e, item)}>
											<TableCell>
												{item.UserName}
												<br />
												{item.Email}
											</TableCell>
											<TableCell>{this.formatRoles(item.Roles)}</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</TableContainer>
					{this.doPaginationRender()}
				</Paper>
				<button type="button" className={classNames(styles.btn, "mt-2")} >
					<Link to="/roles/add">Tambah</Link>
				</button>
				<button type="button" className={styles.btn}>
					<Link to="/">Tutup</Link>
				</button>
			</div>
		);
	}
}

export default withRouter(Roles);
