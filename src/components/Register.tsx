import React from "react";
import parse from "html-react-parser";
import { authService, API_DOMAIN } from "../services/auth";
import { Link } from "react-router-dom";
import { grupIndex, UserSLA } from "ababil-landbouw";
import { Severity, ViewStatus, ViewStatusProps, ViewStatusState } from "ababil-ui-views";

import { GrupNames } from "../constants";
import { CredentialResponse, GoogleSignIn } from "ababil-auth";

import styles from "./Register.module.scss";
import classNames from "classnames";

interface RegisterProps extends ViewStatusProps { }

interface RegisterState extends ViewStatusState {
	isPanitiaPindai: boolean;
	isPanitiaAbsensi: boolean;
	isSuperSuper: boolean;
	isViewChart: boolean;
	updateKehadiran: boolean;
	showInfoSLA: boolean;
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


	constructor(props: RegisterProps) {
		super(props);
		this.setState({
			...this.state,
			isPanitiaPindai: false,
			isPanitiaAbsensi: false,
			isSuperSuper: false,
			isViewChart: false,
			updateKehadiran: false,
			showInfoSLA: false,
		});

		this.getContent = this.getContent.bind(this);
		this.doInsertFieldAngkatan = this.doInsertFieldAngkatan.bind(this);
		this.doInsertFieldNama = this.doInsertFieldNama.bind(this);
		this.doSetUser = this.doSetUser.bind(this);
		this.doSetUser(authService.getLogin());

		/* -----------------------------------------------  demo only -----------------------------------------------
		this.user = { Id: 1, Name: "Erick Suryawan", Email: "erick.suryawan@gmail.com", Kind: 0, 
			suggests: [ { Id: 1, Name: "Erick Suryawan", GraduationYear: 1993, }, ],
			Alumni : { Id: 1, GraduationYear: 1993, Classes: "1::1, 2:A1:2, 3:A1:2", Status: 0, Alias: null, Title: null, BirthDate: null, DateOfDeath: null,}
			Picture: "https://lh3.googleusercontent.com/a-/AOh14GhsyKuGjQkV89GsGUqvIeQgv1su6JGAYf3HHUbaOA=s96-c",
			AccessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjExMDQ0OTA4MzI0NDkzMDk2NzYzOCIsInVzZXJuYW1lIjoiRXJpY2sgU3VyeWF3YW4iLCJzZXNzaW9uIjoiZjkyMDVlYjA2MjgyODE3MTU4NDgzZjkxNmNmNmUyYzdhYzBiYjJhYSIsImlhdCI6MTY1Mjc1ODI1MCwiZXhwIjoxNjUyNzYwMDUwfQ.5wYXgnCd99lP-H0EbxUD4P4Mez1wdBo_Tjq-vHvDtVI",
		}; */
	}

	componentDidMount() {  }

	render() {
		return (
			<div className={styles.container}>
				{this.doStatusRender()}
				{this.getContent()}
			</div>
		);
	}

	getContent() {
		let result = <></>;
		if (!this.user) {
			let gsiClientId: string = "1058359876929-6esuhjomsh3dlk2ncf6cjju004rs95fl.apps.googleusercontent.com";
			const buttonConfig: GsiButtonConfiguration = {
				type: "standard",
				theme: "outline",
				size: "large",
				text: "signin_with",
				shape: "circle",
				logo_alignment: "left",
				// width: "240px",
				local: "id_ID",

			};

			result = (
				<div className={styles.center}>
					<div className={styles.avatar}>
						<img className={styles.avatarImg} src="/iasma-logo.png" alt="profile" />
					</div>
					<div className={styles.welcomeText}>
						<p>Assalamualaikum Warahmatullahi Wabarakatuh<br />Uda Uni Dunsanak Alumni</p>
						<p className={styles.welcomeTextEm}>SMA 1 Landbouw Bukittinggi</p>
						<p>Ini adalah aplikasi untuk registrasi data alumni dan sistem absensi acara Silaturahmi Lintas Angkatan di lokasi. Silakan masuk dengan menggunakan Akun Google Uda Uni Dunsanak dibawah ini:</p>
					</div>
					<br />
					<div className={styles.signin}>
						<GoogleSignIn buttonConfig={buttonConfig} callback={this.onSignIn.bind(this)} clientId={gsiClientId} />
					</div>
				</div>)

		} else if (!this.user.Alumni) {
			result = (
				<>
					<div className={styles.center}>
						<h3 className={styles.title}>Registrasi Alumni</h3>
						<h4>Silakan isi angkatan jo namo lengkap</h4>
					</div>
					<form>
						<label htmlFor="inputAngkatan">
							<b>Angkatan</b>
						</label>
						{this.doInsertFieldAngkatan("inputAngkatan", "Angkatan", "Pilih Angkatan")}

						<label htmlFor="Nama">
							<b>Nama</b>
						</label>
						{this.doInsertFieldNama("Nama", "Nama", "Pilih Nama")}

						<div className={styles.btnContainer}>
							<button type="button" className={styles.btn} onClick={this.onSignUp.bind(this)}>Registrasi</button>
							<button type="button" className={styles.btn} onClick={this.onSignOut.bind(this)}><i className={classNames("fa", "fa-sign-out-alt")}></i> keluar</button>
						</div>
					</form>
				</>)

		} else if (this.state.showInfoSLA) {
			result = (
				<div>
					<form>
						<div className={styles.center}>
							<span>
								<p>
									Assalamu’alaikum Wr. Wb.
								</p>
								<p>
									Uda Uni Dunsanak kami ucapkan tarimo kasih alah mandaftar di portal registrasi IASMA 1 Bukittinggi.
								</p>
								<p>
									Kaganti siriah nan sacabiak, pinang nan sagatok, Panitia SLA 2023 jo hati nan putiah, nan putiahnyo indak babacak, baringankan langkah Uda Uni Dunsanak untuak hadir pado alek SLA 2023 wak ko di wakatu jo tampek barikuik:
								</p>
								Hari/Tanggal: <br />
								<b>Sabtu, 2 September 2023</b><br />
								Waktu: <br />
								<b>Jam 10:00 s/d salasai</b><br />
								Tampek: <br />
								<b>Balai Sarbini, Jakarta</b>

								<p>
									Salam hormat kami silang nan bapangka
								</p>

								<b>Panitia SLA 2023</b>
							</span>
							<hr></hr>
							<h4>Konfirmasi Kehadiran</h4>
							<div><label><input type="radio" value="0" checked={this.user.kehadiran === 0} onChange={this.onKehadiranChange.bind(this)} /> Belum Tahu</label></div>
							<div><label><input type="radio" value="1" checked={this.user.kehadiran === 1} onChange={this.onKehadiranChange.bind(this)} /> InsyaAllah Hadir</label></div>
							<div><label><input type="radio" value="2" checked={this.user.kehadiran === 2} onChange={this.onKehadiranChange.bind(this)} /> Tidak Hadir</label></div>
							<div className={classNames(styles.btnContainer, "mt-3")}>
								{this.state.updateKehadiran && (<button type="button" className={styles.btn} onClick={this.onSimpanKehadiran.bind(this)}>Simpan</button>)}
								<button type="button" className={styles.btn} onClick={this.onKehadiranClose.bind(this)}>Tutup</button>
							</div>
						</div>
					</form>
				</div>
			)

		} else if (this.user.Alumni.Id > 0) {
			result = (
				<div>
					<div className={styles.center}>
						<h4 className={styles.welcomeText}>selamat datang alumni</h4>
						<h3 className={styles.welcomeTextEm}>SMA 1 Landbouw Bukittinggi</h3>
						<div className={styles.avatar}>
							<img className={styles.avatarImg} src={API_DOMAIN + "/res/SLA2023-logo.png"} alt="profile" />
						</div>
					</div>
					<div className={styles.namaAngkatan}>
						<span>
							<b>{this.user.Alumni.Name}</b>
						</span>
						<span>
							<b>{this.user.Alumni.GraduationYear}</b>
						</span>
					</div>
					<div className={styles.btnContainer}>
						<button type="button" className={styles.btn}><Link to="/sla2023">SLA 2023</Link></button>
						<button type="button" className={styles.btn}><Link to="/showqr">Absensi</Link></button>
						<button type="button" className={styles.btn}><Link to={"/alumni/" + this.user.Alumni?.Id}>Lengkapi Data</Link></button>
						<button type="button" className={styles.btn} onClick={this.onSignOut.bind(this)}><i className={classNames("fa", "fa-sign-out-alt")}></i> keluar</button>
					</div>
					<div className={styles.btnContainerAdmin}>
						{this.state.isPanitiaPindai && (<button type="button" className={styles.btnAdmin}><Link to="/scanqr">Pindai</Link></button>)}
						{this.state.isPanitiaAbsensi && (<button type="button" className={styles.btnAdmin}><Link to="/absensi">Absensi Manual</Link></button>)}
						{this.state.isSuperSuper && (<button type="button" className={styles.btnAdmin}><Link to="/roles">Roles</Link></button>)}
						{/* {this.state.isViewChart && (<button type="button" className={styles.btnAdmin}><Link to="/chart/regs">Statistik</Link></button>)} */}
						{/* {this.state.isViewChart && (<button type="button" className={styles.btnAdmin}><Link to="/chart/presents">Kehadiran</Link></button>)} */}
					</div>
				</div>)
		}
		return result;
	}

	onSignIn(credential: CredentialResponse) {
		authService.signin(credential).then(
			(result) => {
				this.doSetUser(result as UserSLA);
				this.forceUpdate();
			},
			(error) => {
				this.onStatusError(error, Severity.Error);
			}
		);
	}

	onSignOut(e: any) {
		authService.logout();
		this.doSetUser(undefined);
		this.forceUpdate();
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
					// result user does not have token yet
					(result as UserSLA).AccessToken = this.user?.AccessToken as string;
					this.doSetUser(result as UserSLA);
					authService.setLogin(result);
					this.setState({ updateKehadiran: true });
				},
				(error) => {
					this.onStatusError(error, Severity.Error);
				}
			);
		}
	}

	doSetUser(user: UserSLA | undefined) {
		// console.log("user", user);
		this.user = user;
		if (this.user) {
			if (this.user.Picture) {
				this.userPicture = API_DOMAIN + this.user.Picture;
			}
			let newState: RegisterState = this.state;
			if (this.user.Roles) {
				newState.isPanitiaAbsensi = this.user.Roles.includes("panitia.absensi");
				newState.isPanitiaPindai = this.user.Roles.includes("panitia.pindai");
				newState.isSuperSuper = this.user.Roles.includes("super.super");
				newState.isViewChart = this.user.Roles.includes("view.chart");
			}

			newState.showInfoSLA = this.user.kehadiran === undefined;
			this.setState(newState);
		}
	}

	doValidateForm() {
		return this.angkatan !== "" && this.nama !== "";
	}

	doInsertFieldAngkatan(name: string, label: string, placeholder: string) {
		let list = [];
		list.push(<option key={0} value={0}></option>);
		for (var i = 1959; i < 2024; i++) {
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
				</div>
				<p>{parse(this.angkatanInfo)}</p>
			</div>
		);
	}

	onChangeAngkatan(e: any) {
		this.angkatan = e.target.value;
		this.angkatanInfo = GrupNames[grupIndex(parseInt(this.angkatan))];
		this.forceUpdate();
	}

	doInsertFieldNama(name: string, label: string, placeholder: string) {
		let list = [];
		this.namas?.forEach((item, key) => {
			list.push(
				<li value={item.Name} key={item.Id}>
					<a href="#-" className="dropdown-item" onClick={this.onNamaClick.bind(this, key)}>
						{item.Name}
					</a>
				</li>
			);
		});

		if (this.namas && this.namas.length < this.namaCount) {
			list.push(
				<li value="x" key="x">
					<span> {this.namaCount - this.namas.length} nama lain tidak ditampilkan</span>
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
				</div>
				<p>{parse(this.namaInfo)}</p>
			</div>
		);
	}

	onNamaClick(key: number) {
		if (this.namas) {
			var item = this.namas[key];
			console.log(item);
			this.nama = item.Name!.toLocaleUpperCase();
			this.namaId = item.Id;
			this.forceUpdate();
		}
	}

	onNamaFilter(e: any) {
		console.log("e", e);
		this.nama = e.target.value.toUpperCase();
		this.namaId = 0;
		this.forceUpdate();

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
						this.forceUpdate();
					})
					.catch((error) => {
						this.onStatusError(error, Severity.Error);
					});
			} else {
				this.forceUpdate();
			}
		}, 500);
		this.forceUpdate();
	}

	onKehadiranChange(e: any) {
		if (this.user) {
			let value = Number(e.target.value);
			if (this.user.kehadiran !== value) {
				this.user.kehadiran = value;
				this.setState({ updateKehadiran: true });
			}
		}
	}

	onSimpanKehadiran() {
		if (this.user) {
			authService.updateKehadiran({ kehadiran: this.user.kehadiran }).then(
				(result) => {
					// store update to localStorage
					authService.setLogin(this.user as UserSLA);
					this.setState({ showInfoSLA: false });
				},
				(error) => {
					this.onStatusError(error, Severity.Error);
				}
			);
		}
	}

	onKehadiranClose(e: any) {
		e.preventDefault();
		this.setState({ showInfoSLA: false });
	}

}
