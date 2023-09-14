import React from "react";
import { Box, TextField } from "@mui/material";
import { withRouter, WithRouterProps } from "ababil-router";
import { UserSLA } from "ababil-landbouw";
import { Severity, ViewStatus, ViewStatusProps, ViewStatusState } from "ababil-ui-views";

import { IValues } from "../classes";
import { authService, API_DOMAIN } from "../services/auth";
import { fileService } from "../services/file";
import { readFile } from "../utils";

import styles from "./AlumniEdit.module.scss";
import classNames from "classnames";

interface AlumniEditParams extends ViewStatusProps {
	id: string;
}

interface AlumniEditState extends ViewStatusState {
	id: number;
	alumni: any;
	changes: IValues[];
	loading: boolean;
	submitSuccess: boolean;
	profileFile: any;
	profileUrl: any;
	uploadFile: any;
	uploadPreview: any;
	uploadProgress: number;
	imageBlob: any;
}

class AlumniEdit extends ViewStatus<WithRouterProps<AlumniEditParams>, AlumniEditState> {
	user: UserSLA | undefined;

	constructor(props: any) {
		super(props);
		this.user = authService.getLogin();
		this.state = {
			...this.state,
			id: parseInt(this.props.match.params.id),
			alumni: {},
			changes: [],
			loading: false,
			submitSuccess: false,
			profileFile: "",
			profileUrl: API_DOMAIN + this.user?.Picture,
			uploadFile: undefined,
			uploadPreview: undefined,
			uploadProgress: 0,
			imageBlob: undefined,
		};
	}

	override componentDidMount(): void {
		authService.queryAlumni(this.state.id).then(
			(result) => {
				// console.log(result);
				if (!result.BirthDate) result.BirthDate = `${result.GraduationYear - 20}-01-01`;
				this.setState({
					alumni: result,
				});
			},
			(error) => {
				this.onStatusError(error, Severity.Error);
			}
		);
	}

	private onChange(e: React.FormEvent<HTMLInputElement>) {
		e.preventDefault();

		let original = this.state.alumni[e.currentTarget.id];
		if (original == null) original = "";

		let newvalue: any = e.currentTarget.value;
		console.log(newvalue);
		if (typeof this.state.alumni[e.currentTarget.id] === "number") newvalue = Number(newvalue);

		console.log(newvalue);

		if (original === newvalue) {
			let changes = this.state.changes;
			delete changes[e.currentTarget.id as any];
			this.setState({ changes: changes });
		} else {
			let values = { [e.currentTarget.id]: e.currentTarget.value };
			this.setState({ changes: { ...this.state.changes, ...values } });
		}
	}

	private onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log(this.state.changes);
		this.setState({ loading: true });
		authService.updateAlumni(this.state.id, this.state.changes).then(
			(result) => {
				this.setState({ submitSuccess: true, loading: false });
				setTimeout(() => {
					this.props.history.push("/");
				}, 1500);
			},
			(error) => {
				this.onStatusError(error, Severity.Error);
			}
		);
	}

	private onClose(e: any) {
		this.props.history.push("/");
	}

	private onUploadProgress(e: any) {
		this.setState({
			uploadProgress: (e.loaded / e.total) * 50,
		});
	}

	private async onFileSelected(e: any) {
		if (true) {
			this.onUploadProfile(e);
		} else if (e.target.files && e.target.files.length > 0) {
			try {
				const file = e.target.files[0];
				let imageDataUrl = await readFile(file);
				this.setState({ imageBlob: imageDataUrl });
			} catch (e) {
				this.onStatusError(e, Severity.Error);
			}
		}
	}

	private onUploadProfile(e: any) {
		e.preventDefault();
		this.setState(
			{
				uploadFile: e.target.files[0],
				uploadPreview: URL.createObjectURL(e.target.files[0]),
				uploadProgress: 0,
			},
			() => {
				let formData = new FormData();
				formData.append("file", this.state.uploadFile);
				fileService.uploadProfile(formData, this.onUploadProgress.bind(this)).then(
					(result) => {
						console.log(result);
						this.user!.Picture = `${result.profileUrl}?${new Date().getTime()}`;
						authService.setLogin(this.user!);
						this.setState({
							profileUrl: API_DOMAIN + result.profileUrl + `?${new Date().getTime()}`,
						});
					},
					(error) => {
						this.onStatusError(error, Severity.Error);
					}
				);
			}
		);
	}

	override render() {
		// check if alumni already loaded
		if (this.state.alumni.Id) {
			return (
				<>
					{this.doStatusRender()}
					{this.state.imageBlob ? (
						<></>
					) : (
						<div className={styles.container}>
							<div className="col-md-12">
								<h3 className={styles.title}>Ubah Data Pribadi</h3>
								{/* <div className={styles.centerProfile}>
									<label htmlFor="photo-upload" className="fas">
										<div className={styles.avatar}>
											<img className={styles.avatarUpload} src={this.state.profileUrl} alt="profile" />
										</div>
										<input id="photo-upload" type="file" onChange={this.onFileSelected.bind(this)} accept="image/*" />
									</label>
								</div> */}
								<Box component="form" sx={{ "& > :not(style)": { m: 2, display: "grid" } }} noValidate autoComplete="off" onSubmit={this.onSubmit.bind(this)} textAlign="center">
									<TextField id="Name" label="Nama Lahir" variant="outlined" defaultValue={this.state.alumni.Name} onChange={(e: any) => this.onChange(e)} />
									<TextField id="Alias" label="Panggilan" variant="outlined" defaultValue={this.state.alumni.Alias} onChange={(e: any) => this.onChange(e)} />
									<TextField id="Title" label="Gelar" variant="outlined" defaultValue={this.state.alumni.Title} onChange={(e: any) => this.onChange(e)} />
									{/* <TextField id="GraduationYear" label="Angkatan Lulus SMA" variant="outlined" defaultValue={this.state.alumni.GraduationYear} onChange={(e: any) => this.onChange(e)} type="number" /> */}
									<TextField id="BirthDate" label="Tanggal Lahir" variant="outlined" defaultValue={this.state.alumni.BirthDate} onChange={(e: any) => this.onChange(e)} type="date" placeholder="dd-mm-yyyy" />
									<TextField id="Classes" label="Kelas" variant="outlined" defaultValue={this.state.alumni.Classes} onChange={(e: any) => this.onChange(e)} />
									<TextField id="Addresses" label="Alamat" multiline rows={4} variant="outlined" defaultValue={this.state.alumni.Addresses} onChange={(e: any) => this.onChange(e)} />
									<TextField id="Phones" label="Telepon" variant="outlined" defaultValue={this.state.alumni.Phones} onChange={(e: any) => this.onChange(e)} />
									<TextField id="Business" label="Pekerjaan" variant="outlined" defaultValue={this.state.alumni.Business} onChange={(e: any) => this.onChange(e)} />
									{/* <TextField id="NIS" label="NIS" variant="outlined" defaultValue={this.state.alumni.NIS} onChange={(e: any) => this.onChange(e)} /> */}
									<div className="row">
										{Object.keys(this.state.changes).length > 0 && (
											<button  type="submit" className={styles.btn}>
												Simpan
											</button>
										)}
										<button type="button" onClick={(e) => this.onClose(e)} className={classNames(styles.btn, "mt-2")}>
											Tutup
										</button>
									</div>
								</Box>

								{this.state.loading && <span className="fa fa-circle-o-notch fa-spin" />}
							</div>
						</div>
					)}
				</>
			);
		} else {
			return <div>{this.doStatusRender()}</div>;
		}
	}
}

export default withRouter(AlumniEdit);
