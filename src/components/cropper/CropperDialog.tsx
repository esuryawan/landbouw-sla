import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";

import "./CropperDialog.css";

interface CropperDialogProps {
	image: string;
	onClose: any;
}

interface CropperDialogState {}

export class CropperDialog extends React.Component<CropperDialogProps, CropperDialogState> {
	constructor(props: CropperDialogProps) {
		super(props);
	}

	onTransition(props: any) {
		return <Slide direction="up" {...props} />;
	}

	render() {
		return (
			<Dialog fullScreen open={true} onClose={this.props.onClose} TransitionComponent={this.onTransition}>
				<div>
					<AppBar className="appBar">
						<Toolbar>
							<IconButton color="inherit" onClick={this.props.onClose} aria-label="Close">
								<CloseIcon />
							</IconButton>
							<Typography variant="caption" color="inherit" className="flex">
								Cropped image
							</Typography>
						</Toolbar>
					</AppBar>
					<div className="imgContainer">
						<img src={this.props.image} alt="Cropped" className="img" />
					</div>
				</div>
			</Dialog>
		);
	}
}
