import React from "react";
import { Link } from "react-router-dom";
import { Table, TableCell, TableHead, TableRow, TableBody, Switch } from "@mui/material";
import parse from "html-react-parser";
import { Severity, ViewStatus, ViewStatusProps, ViewStatusState } from "ababil-ui-views";
import { withRouter, WithRouterProps } from "ababil-router";
import { authService } from "../services/auth";
import { UserSLA } from "ababil-landbouw";
import styles from "./RolesAdd.module.scss";
import classNames from "classnames";

interface RolesAddProps extends ViewStatusProps {
	id?: string;
	email?: string;
}

interface RolesAddState extends ViewStatusState {
	loaded: boolean;
	roles: string[];
}

class RolesAdd extends ViewStatus<WithRouterProps<RolesAddProps>, RolesAddState> {
	email: string | undefined = "";
	emailId = 0;
	emails: UserSLA[] | undefined;
	emailCount = 0;
	emailInfo = "";

	constructor(props: any) {
		super(props);
		this.state = {
			...this.state,
			loaded: false,
			roles: [],
		};

		this.onRoleSwitch = this.onRoleSwitch.bind(this);
	}

	override componentDidMount(): void {
		if (this.props.match.params.id) {
			this.emailId = parseInt(this.props.match.params.id);
			this.email = this.props.match.params.email;
			this.getRoleById();
		}
	}

	doValidateForm() {
		return this.email !== "";
	}

	insertFieldEmail(name: string, label: string, placeholder: string) {
		let list = [];
		this.emails?.forEach((item, key) => {
			list.push(
				<li value={item.Email} key={item.Id}>
					<a href="#-" className="dropdown-item" onClick={this.onEmailClick.bind(this, key)}>
						{item.Name} ({item.Email})
					</a>
				</li>
			);
		});

		if (this.emails && this.emails.length < this.emailCount) {
			list.push(
				<li value="x" key="x">
					<span> {this.emailCount - this.emails.length} email lain tidak ditampilkan</span>
				</li>
			);
		}

		return (
			<>
				<label htmlFor="Email">Email</label>
				<div className="dropdown">
					<div className="input-group">
						<span className="input-group-text">
							<i className="fa fa-envelope" />
						</span>
						<input
							type="text"
							value={this.email}
							data-bs-toggle="dropdown"
							className="form-control input-lg form-group text-start"
							placeholder="email pengguna"
							id="inputEmail"
							onChange={this.onEmailFilter.bind(this)}
							autoComplete="off"
						/>
						<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2" id="myDropdown">
							{list}
						</ul>
					</div>
					<p>{parse(this.emailInfo)}</p>
				</div>
			</>
		);
	}

	onEmailFilter(e: any) {
		this.email = e.target.value.toLowerCase();
		this.emailId = 0;
		if (this.email && this.email.length > 0) {
			authService
				.queryEmail(this.email)
				.then((response) => {
					const { count, rows } = response;
					this.emailCount = count;
					this.emails = rows;
					this.setState({});
				})
				.catch((error) => {
					this.onStatusError(error, Severity.Error);
				});
		} else {
			this.setState({});
		}
	}

	onEmailClick(key: number) {
		if (this.emails) {
			var item = this.emails[key];
			this.emailId = item.Id;
			this.email = item.Email!;
			this.setState(
				{
					loaded: false,
					roles: [],
				},
				() => {
					this.getRoleById();
				}
			);
		}
	}

	private getRoleById() {
		console.log(this.emailId, this.email);
		authService.roleId(this.emailId).then(
			(response: any) => {
				authService.updateToken(this.state.login!, response.headers["x-access-token"]);
				const rows = response.data.rows;
				console.log(rows);
				this.setState({
					roles: rows.length > 0 ? rows[0].Roles : [],
					loaded: true,
				});
			},
			(error) => {
				this.onStatusError(error, Severity.Error);
			}
		);
	}

	insertValidationMsg(valid: boolean, error: string) {
		let classNm = "validation-msg text-sm-left";
		if (valid) classNm = "validation-info text-sm-left ";
		return error && <p className={classNm}>{parse(error)}</p>;
	}

	onRoleSwitch(e: any, role: string) {
		let roles = this.state.roles;
		if (e.target.checked) {
			roles.push(role);
		} else {
			let idx = roles.indexOf(role);
			roles.splice(idx, 1);
		}
		this.setState({ roles: roles });
	}

	onRolesSave(e: any) {
		e.preventDefault();
		if (this.doValidateForm()) {
			let data = {
				Email: this.email,
				UserId: this.emailId,
				Roles: this.state.roles,
			};
			authService.roleSave(data).then(
				(result) => {
					this.setState({});
					setTimeout(() => {
						this.props.history.push("/roles");
					}, 1500);
				},
				(error) => {
					this.onStatusError(error, Severity.Error);
				}
			);
		}
	}

	render() {
		const insertRoleItem = (title: string, role: string, faIcon: string) => {
			let checked = this.state.roles.find((e) => e === role) ? true : false;
			return (
				<TableRow>
					<TableCell>
						<i className={classNames("fa", faIcon, styles.fontSmall)}>&nbsp;</i>
						{title}
					</TableCell>
					<TableCell>
						<Switch checked={checked} onClick={(e) => this.onRoleSwitch(e, role)}></Switch>
					</TableCell>
				</TableRow>
			);
		};
		return (
			<div className={styles.container}>
				{this.doStatusRender()}
				<>
					<h3 className={styles.title}>Akses User</h3>
					<form>
						{this.props.match.params.id && (
							<div className={styles.emailTitle}>
								<span>{this.props.match.params.email}</span>
							</div>
						)}
						{!this.props.match.params.id && this.insertFieldEmail("Email", "Email", "Pilih Email")}
						{this.state.loaded && (
							<>
								<Table>
									<TableHead>
										<TableRow>
											<TableCell></TableCell>
											<TableCell></TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{insertRoleItem("Pindai", "panitia.pindai", "fa-qrcode")}
										{insertRoleItem("Absensi Manual", "panitia.absensi", "fa-check-square")}
										{insertRoleItem("Admin Angkatan", "admin.angkatan", "fa-graduation-cap")}
										{insertRoleItem("Admin IASMA", "admin.all", "fa-university")}
										{insertRoleItem("Statistik", "view.chart", "fa-chart-bar")}
									</TableBody>
								</Table>
								<button type="button" className={classNames(styles.btn, "mt-2")} onClick={this.onRolesSave.bind(this)}>
									Simpan
								</button>
							</>
						)}
					</form>
				</>

				<button type="button" className={styles.btn}>
					<Link to="/roles">Tutup</Link>
				</button>
			</div>
		);
	}
	onSwitch(e: any, role: string): void {
		throw new Error("Method not implemented.");
	}
}

export default withRouter(RolesAdd);
