import React from "react";
import parse from "html-react-parser";
import { authService, API_DOMAIN } from "../services/auth";
import { Link } from "react-router-dom";
import { grupIndex, UserSLA } from "ababil-landbouw";
import { Severity, ViewStatus, ViewStatusProps, ViewStatusState } from "ababil-ui-views";
import { Popup } from "./Popup";

import "./Register.css";
import { GrupNames } from "../constants";
import { CredentialResponse, GoogleSignIn } from "ababil-auth";

interface RegisterProps extends ViewStatusProps {}

interface RegisterState extends ViewStatusState {
	newRegister: boolean;
}

export default class Register extends ViewStatus<RegisterProps, RegisterState> {
	angkatan = "";
	angkatanInfo = "";

	nama = "";
	namaId = 0;
	namas: UserSLA[] | undefined;
	namaCount = 0;
	namaInfo = "";

	user: UserSLA | undefined;
	userPicture: string = "";
	timeout: any = null;

	isPanitiaPindai: boolean | undefined;
	isPanitiaAbsensi: boolean | undefined;
	isSuperSuper: boolean | undefined;
	isViewChart: boolean | undefined;

	constructor(props: RegisterProps) {
		super(props);
		this.insertFieldAngkatan = this.insertFieldAngkatan.bind(this);
		this.insertFieldNama = this.insertFieldNama.bind(this);
		this.setUser = this.setUser.bind(this);
		this.setUser(authService.getLogin());
		this.state = {
			...this.state,
			newRegister: false,
		};
		/* -----------------------------------------------  demo only -----------------------------------------------
		this.user = { Id: 1, Name: "Erick Suryawan", Email: "erick.suryawan@gmail.com", Kind: 0, 
			suggests: [ { Id: 1, Name: "Erick Suryawan", GraduationYear: 1993, }, ],
			Alumni : { Id: 1, GraduationYear: 1993, Classes: "1::1, 2:A1:2, 3:A1:2", Status: 0, Alias: null, Title: null, BirthDate: null, DateOfDeath: null,}
			Picture: "https://lh3.googleusercontent.com/a-/AOh14GhsyKuGjQkV89GsGUqvIeQgv1su6JGAYf3HHUbaOA=s96-c",
			AccessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMDQ0OTA4MzI0NDkzMDk2NzYzOCIsInVzZXJuYW1lIjoiRXJpY2sgU3VyeWF3YW4iLCJzZXNzaW9uIjoiZjkyMDVlYjA2MjgyODE3MTU4NDgzZjkxNmNmNmUyYzdhYzBiYjJhYSIsImlhdCI6MTY1Mjc1ODI1MCwiZXhwIjoxNjUyNzYwMDUwfQ.5wYXgnCd99lP-H0EbxUD4P4Mez1wdBo_Tjq-vHvDtVI",
		}; */
	}

	componentDidMount() {}

	doValidateForm() {
		return this.angkatan !== "" && this.nama !== "";
	}

	setUser(user: UserSLA | undefined) {
		this.user = user;
		if (this.user?.Picture) {
			this.userPicture = API_DOMAIN + this.user.Picture;
		}
		this.isPanitiaAbsensi = this.user ? this.user?.Roles?.includes("panitia.absensi") : false;
		this.isPanitiaPindai = this.user ? this.user?.Roles?.includes("panitia.pindai") : false;
		this.isSuperSuper = this.user ? this.user?.Roles?.includes("super.super") : false;
		this.isViewChart = this.user ? this.user?.Roles?.includes("view.chart") : false;
	}

	onSignIn(credential: CredentialResponse) {
		authService.signin(credential).then(
			(result) => {
				this.setUser(result as UserSLA);
				this.setState({});
			},
			(error) => {
				this.onStatusError(error, Severity.Error);
			}
		);
	}

	onSignOut(e: any) {
		authService.logout();
		this.setUser(undefined);
		this.setState({});
	}

	onSignUp(e: any) {
		e.preventDefault();
		if (this.doValidateForm()) {
			let data = {
				Id: this.user?.Id,
				GraduationYear: this.angkatan,
				Name: this.nama,
				AlumnusId: this.namaId,
			};
			// console.log(data);
			authService.registrasi(data).then(
				(result) => {
					// console.log(result);
					// result user does not haave token yet
					(result as UserSLA).AccessToken = this.user?.AccessToken as string;
					this.setUser(result as UserSLA);
					authService.setLogin(result);
					this.setState({ newRegister: true });
				},
				(error) => {
					this.onStatusError(error, Severity.Error);
				}
			);
		}
	}

	insertFieldAngkatan(name: string, label: string, placeholder: string) {
		let list = [];
		list.push(<option key={0} value={0}></option>);
		for (var i = 1959; i < 2022; i++) {
			let item = "" + i;
			list.push(
				<option key={item} value={item}>
					{item}
				</option>
			);
		}

		if (this.angkatan === "" && this.user?.suggests?.length === 1) {
			let suggest = this.user?.suggests[0];
			this.angkatan = "" + suggest.GraduationYear;
			this.angkatanInfo = GrupNames[grupIndex(parseInt(this.angkatan))];
			this.namaId = suggest.Id;
		}

		return (
			<div>
				<div className="input-group">
					<span className="input-group-text">
						<i className="fa fa-graduation-cap" />
					</span>
					<select value={this.angkatan} className="form-control input-lg form-group" id="inputAngkatan" onChange={this.onChangeAngkatan.bind(this)}>
						{list}
					</select>
					{/* <i className="fa fa-chevron-down" /> */}
				</div>
				<p className="angkatan-info">{parse(this.angkatanInfo)}</p>
			</div>
		);
	}

	onChangeAngkatan(e: any) {
		this.angkatan = e.target.value;
		this.angkatanInfo = GrupNames[grupIndex(parseInt(this.angkatan))];
		this.setState({});
	}

	insertFieldNama(name: string, label: string, placeholder: string) {
		let list = [];
		this.namas?.forEach((item, key) => {
			list.push(
				<li value={item.UserName} key={item.Id}>
					<a href="#-" className="dropdown-item" onClick={this.onNamaClick.bind(this, key)}>
						{item.UserName}
					</a>
				</li>
			);
		});

		if (this.namas && this.namas.length < this.namaCount) {
			list.push(
				<li value="x" key="x">
					<span className="filter-info"> {this.namaCount - this.namas.length} nama lain tidak ditampilkan</span>
				</li>
			);
		}

		if (this.nama === "" && this.user?.suggests?.length === 1) {
			let suggest = this.user?.suggests[0];
			this.nama = "" + suggest.Name.toLocaleUpperCase();
			this.namaInfo = "";
		}

		return (
			<div className="dropdown">
				<div className="input-group">
					<span className="input-group-text">
						<i className="fa fa-user" />
					</span>
					<input type="text" value={this.nama} data-bs-toggle="dropdown" className="form-control input-lg form-group text-start" placeholder="nama lengkap" id="inputNama" onChange={this.onNamaFilter.bind(this)} autoComplete="off" />
					<ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2" id="myDropdown">
						{list}
					</ul>
					{/* <i className="fa fa-chevron-down" /> */}
				</div>
				<p className="input-info">{parse(this.namaInfo)}</p>
			</div>
		);
	}

	onNamaFilter(e: any) {
		console.log("e", e);
		this.nama = e.target.value.toUpperCase();
		this.namaId = 0;
		this.setState({});

		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			if (this.nama && this.nama.length > 0) {
				authService
					.queryName(parseInt(this.angkatan), this.nama)
					.then((response) => {
						console.log("response", response);
						const { count, rows } = response;
						this.namaCount = count;
						this.namas = rows;
						this.setState({});
					})
					.catch((error) => {
						this.onStatusError(error, Severity.Error);
					});
			} else {
				this.setState({});
			}
		}, 500);
		this.setState({});
	}

	onNamaClick(key: number) {
		if (this.namas) {
			var item = this.namas[key];
			console.log(item);
			this.nama = item.UserName.toLocaleUpperCase();
			this.namaId = item.Id;
			this.setState({});
		}
	}

	onPopupRegisterInfo(e: any) {
		return (
			<div>
				<div className="center">
					<span>
						Selamat Uda/Uni/Adiak telah terdaftar. Registrasi ini akan digunakan untuk absensi di acara <b>SLA&nbsp;2022</b> pada tanggal <b>3&nbsp;sd&nbsp;5&nbsp;Juni&nbsp;2022</b> nanti. Sementara waktu, Uda/Uni/Adiak dapat
						memperbaharui dan melengkapi data alumni.
					</span>
				</div>

				<button type="button" className="btn" onClick={this.onPopupClose.bind(this)}>
					Tutup
				</button>
			</div>
		);
	}

	onPopupClose(e: any) {
		e.preventDefault();
		this.setState({ newRegister: false });
	}

	insertValidationMsg(valid: boolean, error: string) {
		let classNm = "validation-msg text-sm-left";
		if (valid) classNm = "validation-info text-sm-left ";
		return error && <p className={classNm}>{parse(error)}</p>;
	}

	gsiClientId: string = "1058359876929-6esuhjomsh3dlk2ncf6cjju004rs95fl.apps.googleusercontent.com";

	render() {
		return (
			<div className="container">
				{this.doStatusRender()}
				{!this.user && (
					<div className="center">
						<h3 className="title">SLA 2022</h3>
						<div className="gsi-button center">
							<GoogleSignIn callback={this.onSignIn.bind(this)} clientId={this.gsiClientId} />
						</div>
					</div>
				)}
				{this.user && !this.user.Alumni && (
					<>
						<h3 className="title">Registrasi SLA 2022</h3>
						<form>
							<div className="avatar">
								<img src={this.userPicture} alt="profile" />
							</div>

							<label htmlFor="inputAngkatan">
								<b>Angkatan</b>
							</label>
							{this.insertFieldAngkatan("inputAngkatan", "Angkatan", "Pilih Angkatan")}

							<label htmlFor="Nama">
								<b>Nama</b>
							</label>
							{this.insertFieldNama("Nama", "Nama", "Pilih Nama")}

							<div className="div-btn">
								<button type="button" className="btn" onClick={this.onSignUp.bind(this)}>
									Registrasi
								</button>
								<button type="button" className="btn" onClick={this.onSignOut.bind(this)}>
									<i className="fa fa-sign-out-alt"></i> keluar
								</button>
							</div>
						</form>
					</>
				)}
				{this.user && this.user.Alumni && this.user.Alumni?.Id > 0 && (
					<div>
						<div className="center">
							<h4 className="title">selamat datang di</h4>
							<h3 className="title">SLA 2022</h3>
							<div className="avatar">
								<img src={this.userPicture} alt="profile" />
							</div>
						</div>
						<div className="center">
							<span>
								<b>{this.user.Alumni.Name}</b>
							</span>
							<span>
								<b>{this.user.Alumni.GraduationYear}</b>
							</span>
						</div>
						<div className="div-btn">
							<button type="button" className="btn">
								<Link to="/showqr">Absensi</Link>
							</button>
							<button type="button" className="btn">
								<Link to={"/alumni/" + this.user.Alumni?.Id}>Lengkapi Data</Link>
							</button>
							{this.isPanitiaPindai && (
								<button type="button" className="btn">
									<Link to="/scanqr">Pindai</Link>
								</button>
							)}
							{this.isPanitiaAbsensi && (
								<button type="button" className="btn">
									<Link to="/absensi">Absensi Manual</Link>
								</button>
							)}
							{this.isSuperSuper && (
								<button type="button" className="btn">
									<Link to="/roles">Roles</Link>
								</button>
							)}
							{this.isViewChart && (
								<button type="button" className="btn">
									<Link to="/chart/regs">Statistik</Link>
								</button>
							)}
							{this.isViewChart && (
								<button type="button" className="btn">
									<Link to="/chart/presents">Kehadiran</Link>
								</button>
							)}
							<button type="button" className="btn" onClick={this.onSignOut.bind(this)}>
								<i className="fa fa-sign-out-alt"></i> keluar
							</button>
							{/* <i className="fa fa-user-circle fa-2">&nbsp;</i>
							<i className="fa fa-users fa-2">&nbsp;</i>
							<i className="fa fa-check-square fa-2">&nbsp;</i>
							<i className="fa fa-cog fa-2">&nbsp;</i>
							<i className="fa fa-cogs fa-2">&nbsp;</i>
							<i className="fa fa-sign-in-alt fa-2">&nbsp;</i>
							<i className="fa fa-sign-out-alt fa-2">&nbsp;</i>
							<i className="fa fa-trash fa-2">&nbsp;</i>

							<i className="fa fa-chart-area fa-2">&nbsp;</i>
							<i className="fa fa-chart-bar fa-2">&nbsp;</i>
							<i className="fa fa-chart-line fa-2">&nbsp;</i>
							<i className="fa fa-bar-chart fa-2">&nbsp;</i>
							<i className="fa fa-pie-chart fa-2">&nbsp;</i>
							<i className="fa fa-picture fa-2">&nbsp;</i> */}
						</div>
					</div>
				)}
				<Popup onContent={this.onPopupRegisterInfo.bind(this)} show={this.state.newRegister}></Popup>
			</div>
		);
	}
}
