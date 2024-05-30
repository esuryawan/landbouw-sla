import React from "react";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { Severity, ViewStatus, ViewStatusProps, ViewStatusState } from "ababil-ui-views";
import { grupIndex, UserSLA } from "ababil-landbouw";

import { authService } from "../services/auth";
import { ResponseName } from "../utils";
import { GrupNames, ResponseCode } from "../constants";

import styles from "../styles/general.module.scss";

interface AbsensiProps extends ViewStatusProps { }

interface AbsensiState extends ViewStatusState {
	submit: boolean;
	absenStatus: number;
	absenName: string;
	absenGraduation: number;
	absenAttendanceAt: string;
}

export default class Absensi extends ViewStatus<AbsensiProps, AbsensiState> {
	angkatan: string = "";
	angkatanInfo = "";

	nama: string = "";
	namaId = 0;
	namas: UserSLA[] | undefined;
	namaCount = 0;
	namaInfo = "";

	user: UserSLA | undefined;
	timeout: any = null;

	constructor(props: AbsensiProps) {
		super(props);
		this.user = authService.getLogin();
		this.state = {
			...this.state,
			submit: false,
			absenStatus: ResponseCode.Unknown,
			absenName: "",
			absenGraduation: 0,
			absenAttendanceAt: "",
		};
	}

	doValidateForm() {
		return this.angkatan !== "" && this.nama !== "";
	}

	onAbsensi(e: any) {
		e.preventDefault();
		if (this.doValidateForm()) {
			let data = {
				GraduationYear: this.angkatan,
				Name: this.nama,
				AlumnusId: this.namaId,
			};
			console.log(data);
			authService.absensi(data).then(
				(result) => {
					this.setState({
						submit: true,
						absenStatus: result.status,
						absenName: result.name,
						absenGraduation: result.graduationYear,
						absenAttendanceAt: result.attendanceAt,
					});
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
		for (var i = 1959; i < 2024; i++) {
			let item = "" + i;
			list.push(
				<option key={item} value={item}>
					{item}
				</option>
			);
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
		this.setState({});
	}

	insertFieldNama(name: string, label: string, placeholder: string) {
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

	onNamaFilter(e: any) {
		this.nama = e.target.value.toUpperCase();
		this.namaId = 0;
		this.setState({});

		clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			if (this.nama && this.nama.length > 0) {
				authService
					.queryNameAll(parseInt(this.angkatan), this.nama)
					.then((response) => {
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
	timout(timout: any) {
		throw new Error("Method not implemented.");
	}

	onNamaClick(key: number) {
		if (this.namas) {
			var item = this.namas[key];
			console.log(item);
			this.nama = item.Name!.toLocaleUpperCase();
			this.namaId = item.Id;
			this.setState({});
		}
	}

	insertValidationMsg(valid: boolean, error: string) {
		if (valid) {
			return error && <p className={classNames("text-sm-left", "validation-info")}>{parse(error)}</p>;
		} else {
			return error && <p className={classNames("text-sm-left", "validation-msg")}>{parse(error)}</p >;
		}
	}


	render() {
		return (
			<div className={styles.container}>
				{this.doStatusRender()}
				{this.state.submit ? (
					<>
						{this.state.absenStatus === ResponseCode.Success ? (
							<>
								<div className={styles.center}>
									<h4>Absensi Berhasil</h4>
									<span>
										<b>{this.state.absenName}</b>
									</span>
									<br />
									<span>
										<b> (Angkatan {this.state.absenGraduation})</b>
									</span>
									<br />
									<span>
										<b>{this.state.absenAttendanceAt}</b>
									</span>
								</div>
							</>
						) : (
							<>
								<div className={styles.center}>
									<h4>Absensi Gagal</h4>
									<span>
										<b>{ResponseName(this.state.absenStatus)}</b>
									</span>
									<span>
										pada <b>{this.state.absenAttendanceAt}</b>
									</span>
								</div>
							</>
						)}
					</>
				) : (
					<>
						<h3 className={styles.title}>Absensi SLA 2023</h3>
						<form>
							<label htmlFor="inputAngkatan">Angkatan</label>
							{this.insertFieldAngkatan("inputAngkatan", "Angkatan", "Pilih Angkatan")}

							<label htmlFor="Nama">Nama</label>
							{this.insertFieldNama("Nama", "Nama", "Pilih Nama")}

							<button type="button" className={styles.btn} onClick={this.onAbsensi.bind(this)}>
								Absensi
							</button>
						</form>
					</>
				)}
				<button type="button" className={styles.btn}>
					<Link to="/">Tutup</Link>
				</button>
			</div>
		);
	}
}
