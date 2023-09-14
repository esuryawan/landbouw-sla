import React from "react";
import QRCode from "react-qr-code";
import { Link } from "react-router-dom";
import { ResponseCode } from "../constants";
import { authService } from "../services/auth";
import { UserSLA } from "ababil-landbouw";
import { Severity, ViewStatus, ViewStatusProps, ViewStatusState } from "ababil-ui-views";

import styles from "../styles/general.module.scss";

interface ShowQRProps extends ViewStatusProps {}

interface ShowQRState extends ViewStatusState {}

export default class ShowQR extends ViewStatus<ShowQRProps, ShowQRState> {
	code: string = "";
	attendanceAt: string = "";
	login: UserSLA | undefined;

	constructor(props: ShowQRProps) {
		super(props);
		this.login = authService.getLogin();
	}

	override componentDidMount() {
		authService.attendanceCode().then(
			(result) => {
				if (result.status === ResponseCode.Success) {
					this.code = result.code;
					this.attendanceAt = "";
					this.setState({});
				} else {
					this.code = "";
					this.attendanceAt = result.attendanceAt;
					this.setState({});
				}
			},
			(error) => {
				this.onStatusError(error, Severity.Error);
			}
		);
	}

	onCodeChange(e: any) {
		this.code = e.target.value;
		this.setState({});
	}

	override render() {
		return (
			<div className={styles.container}>
				{this.doStatusRender()}
				<div>
					<h4 className={styles.title}>Absensi QR</h4>
					{this.code.length > 0 && (
						<div className={styles.center}>
							<QRCode value={this.code} bgColor="#6C99BA" />
							<br></br>
							<span>tunjukan kode QR ini pada panitia absensi</span>
						</div>
					)}
					{this.attendanceAt.length > 0 && (
						<div className={styles.center}>
							<span>Sudah absensi pada {this.attendanceAt}</span>
						</div>
					)}

					<button type="button" className={styles.btn}>
						<Link to="/">Tutup</Link>
					</button>
				</div>
			</div>
		);
	}
}
