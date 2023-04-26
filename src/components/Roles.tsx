import React from "react";
import { Link } from "react-router-dom";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { withRouter, WithRouterProps } from "ababil-router";
import { authService } from "../services/auth";
import { Severity, ViewPaging, ViewPagingProps, ViewPagingState } from "ababil-ui-views";

import "./Roles.css";

class Roles extends ViewPaging<WithRouterProps<ViewPagingProps>, ViewPagingState> {
	// constructor(props: ViewPagingProps) {
	// 	super(props);
	// }

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
		let tags = [];
		for (let i = 0; i < roles.length; i++) {
			const role = roles[i];
			switch (role) {
				case "panitia.pindai":
					tags.push(
						<i key={i} className="fa fa-qrcode fa-2">
							&nbsp;
						</i>
					);
					break;

				case "panitia.absensi":
					tags.push(
						<i key={i} className="fa fa-check-square fa-2">
							&nbsp;
						</i>
					);
					break;

				case "admin.angkatan":
					tags.push(
						<i key={i} className="fa fa-graduation-cap fa-2">
							&nbsp;
						</i>
					);
					break;

				case "admin.all":
					tags.push(
						<i key={i} className="fa fa-university fa-2">
							&nbsp;
						</i>
					);
					break;

				case "view.chart":
					tags.push(
						<i key={i} className="fa fa-chart-bar fa-2">
							&nbsp;
						</i>
					);
					break;

				case "super.super":
					tags.push(
						<i key={i} className="fa fa-cog fa-2">
							&nbsp;
						</i>
					);
					break;

				default:
					break;
			}
		}
		return <>{tags}</>;
	}

	onRowClick(e: any, item: any) {
		// console.log(e);
		console.log(item);
		this.props.history.push(`/roles/edit/${item.UserId}/${item.Email}`);
	}

	render() {
		return (
			<div className="container">
				{this.doStatusRender()}
				<Paper sx={{ width: "100%", overflow: "hidden" }} className="transparent">
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
				<button type="button" className="btn mt-2">
					<Link to="/roles/add">Tambah</Link>
				</button>
				<button type="button" className="btn">
					<Link to="/">Tutup</Link>
				</button>
			</div>
		);
	}
}

export default withRouter(Roles);
