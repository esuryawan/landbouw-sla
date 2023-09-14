import React from "react";
import Cropper from "react-easy-crop";
import { Point, Area } from "react-easy-crop/types";
import { CropperDialog } from "./CropperDialog";

import { getCroppedImg } from "../../utils";
import { styles as classes } from "./CropperStyles";
import { blob } from "stream/consumers";

import { fileService } from "../../services/file";
import { Button, Slider } from "@mui/material";

interface CropperProfileProps {
	show: boolean;
	onContent: Function;
}

interface CropperProfileState {
	cropSrc: any;
	cropImage: any;
	cropArea: any;
	cropRotation: number;
	cropZoom: number;
	cropAxis: {
		x: number;
		y: number;
	};
}

export class CropperProfile extends React.Component<CropperProfileProps, CropperProfileState> {
	constructor(props: CropperProfileProps) {
		super(props);
		this.state = {
			cropSrc: undefined,
			cropImage: undefined,
			cropArea: undefined,
			cropRotation: 0,
			cropZoom: 1,
			cropAxis: { x: 0, y: 0 },
		};
		this.onContent = this.onContent.bind(this);
	}

	private onCropComplete(croppedArea: any, croppedAreaPixels: any) {
		this.setState({ cropArea: croppedAreaPixels });
	}

	private onCropClose(e: any) {
		this.setState({ cropImage: undefined });
	}

	setCropAxis(axis: any) {
		this.setState({
			cropAxis: { x: axis.x, y: axis.y },
		});
	}

	setCropRotation(r: number) {
		this.setState({
			cropRotation: r,
		});
	}

	setCropZoom(z: number) {
		this.setState({
			cropZoom: z,
		});
	}

	async showCroppedImage(e: any) {
		try {
			const croppedImage = await getCroppedImg(this.state.cropSrc, this.state.cropArea, this.state.cropRotation);
			console.log("donee", { croppedImage });
			this.setState(
				{
					cropImage: croppedImage,
					// uploadFile: e.target.files[0],
					// uploadPreview: URL.createObjectURL(e.target.files[0]),
					// uploadProgress: 0,
				},
				() => {
					let formData = new FormData();
					// // formData.append("filename", "sdfsadfa.jpg");
					// // formData.append("blob", this.state.cropImage);

					// // var blob = new Blob([JSON.stringify([0,1,2])], {type : 'application/json'});
					// var fileOfBlob = new File([this.state.cropImage], "aFileName.json");
					// formData.append("upload", fileOfBlob);

					// FileService.uploadProfile(formData, this.onUploadProgress.bind(this)).then(
					// 	(result) => {
					// 		console.log(result);
					// 		this.setState({
					// 			profileUrl: API_DOMAIN + result.profileUrl,
					// 		});
					// 	},
					// 	(error) => {
					// 		// this.onStatusError(error);
					// 	}
					// );
				}
			);
		} catch (e) {
			// this.onStatusError(e);
		}
	}

	onContent() {
		return (
			<React.Fragment>
				<div className="cropContainer">
					<Cropper
						image={this.state.cropSrc}
						crop={this.state.cropAxis}
						rotation={this.state.cropRotation}
						zoom={this.state.cropZoom}
						aspect={4 / 4}
						onCropChange={this.setCropAxis.bind(this)}
						onRotationChange={this.setCropRotation.bind(this)}
						onCropComplete={this.onCropComplete.bind(this)}
						onZoomChange={this.setCropZoom.bind(this)}
					/>
					<Slider value={this.state.cropZoom} min={1} max={3} step={0.1} aria-labelledby="Zoom" onChange={(e, zoom) => this.setCropZoom(Number(zoom))} />
					<Button onClick={this.showCroppedImage.bind(this)} variant="contained" color="primary">
						Simpan
					</Button>
				</div>
				<div className="controls"></div>
			</React.Fragment>
		);
	}
	override render() {
		return (
			<div className={"overlay " + (this.props.show ? "show" : "hide")}>
				<div className="popup">{this.onContent()}</div>
			</div>
		);
	}
}
