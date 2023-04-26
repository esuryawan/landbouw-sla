import React from "react";
import { Html5QrcodeScanner, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { Html5QrcodeError, Html5QrcodeResult } from "html5-qrcode/esm/core";
import { Link } from "react-router-dom";
import { Severity, ViewStatus, ViewStatusProps, ViewStatusState } from "ababil-ui-views";
import { authService } from "../services/auth";
import { UserSLA } from "ababil-landbouw";
import { Popup } from "./Popup";

import "./ScanQR.css";
import { ResponseCode } from "../constants";
import { ResponseName } from "../utils";

interface ScanQRProps extends ViewStatusProps {}

interface ScanQRState extends ViewStatusState {}

const qrcodeRegionId = "html5qr-code-full-region";

export default class ScanQR extends ViewStatus<ScanQRProps, ScanQRState> {
	html5QrcodeScanner: Html5QrcodeScanner | undefined;
	login: UserSLA | undefined;
	prevCode: string = "";
	decodedText: string = "";
	AlumniNama: string = "";
	AlumniYear: number = 0;
	Status: number = ResponseCode.Unknown;
	popupShow: boolean = false;

	constructor(props: ScanQRProps) {
		super(props);
		this.login = authService.getLogin();
	}

	override componentDidMount() {
		// Creates the configuration object for Html5QrcodeScanner.
		var config: any = {
			fps: 10,
			qrbox: 250,
			// aspectRatio?: number | undefined;
			disableFlip: false,
			// videoConstraints?: MediaTrackConstraints | undefined;
			// rememberLastUsedCamera?: boolean | undefined;
			// supportedScanTypes: Array<Html5QrcodeScanType> | [];
			formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
			// experimentalFeatures?: ExperimentalFeaturesConfig | undefined;
			facingMode: "user",
		};

		var verbose = true;
		this.html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose);
		this.html5QrcodeScanner.render(this.onQrCodeSuccess.bind(this), this.onQrCodeError.bind(this));
	}

	override componentWillUnmount() {
		// TODO(mebjas): See if there is a better way to handle
		//  promise in `componentWillUnmount`.
		this.html5QrcodeScanner?.clear().catch((error) => {
			this.onStatusError(error, Severity.Error);
		});
	}

	onQrCodeSuccess(decodedText: string, result: Html5QrcodeResult) {
		if (decodedText !== this.prevCode) {
			this.prevCode = decodedText;
			let data = {
				Id: this.login?.Id,
				Code: decodedText,
			};

			console.log(data);

			authService.attendanceCheck(data).then(
				(result) => {
					console.log(result);
					this.AlumniNama = result.Name;
					this.AlumniYear = result.GraduationYear;
					this.Status = result.Status;
					this.popupShow = true;
					this.setState({});
				},
				(error) => {
					this.onStatusError(error, Severity.Error);
				}
			);
			this.decodedText = decodedText;
			this.setState({});
		}
	}

	onQrCodeError(errorMessage: string, error: Html5QrcodeError) {
		this.onStatusError(errorMessage, Severity.Error);
	}

	onPopupClose(e: any) {
		e.preventDefault();
		this.popupShow = false;
		this.setState({});
	}

	onPopupRender() {
		return (
			<div>
				<h2>Hasil Pindai</h2>
				<div className="center">
					{this.Status === 0 ? (
						<div>
							<span>
								<b>{this.AlumniNama}</b>
							</span>
							<br />
							<span>
								<b>{this.AlumniYear}</b>
							</span>
						</div>
					) : (
						<div>
							<span>Pemindaian Gagal</span>
							<br />
							<span>{<b>{ResponseName(this.Status)}</b>}</span>
						</div>
					)}
				</div>

				<button type="button" className="btn" onClick={this.onPopupClose.bind(this)}>
					Tutup
				</button>
			</div>
		);
	}

	override render() {
		return (
			<div className="container">
				{this.doStatusRender()}
				<div>
					<h4 className="title">Absensi Scanner</h4>
					<div id={qrcodeRegionId} />
					<button type="button" className="btn">
						<Link to="/">Tutup</Link>
					</button>
				</div>
				<Popup onContent={this.onPopupRender.bind(this)} show={this.popupShow}></Popup>
			</div>
		);
	}
}
