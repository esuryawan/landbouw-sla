import React, { Component } from "react";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import PropTypes from "prop-types";
import { withStyles } from "@mui/styles";

let self;

const styles = theme => ({
	container: {
		display: "flex",
		flexWrap: "wrap"
	},
	textField: {
		marginLeft: theme.spacing.unit,
		marginRight: theme.spacing.unit,
		width: 280
	},
	cssLabel: {
		color: "#d3d3d3",
		"&.Mui-focused": {
			color: "#23A5EB"
		}
	},
	cssOutlinedInput: {
		"&:not(hover):not($disabled):not($cssFocused):not($error) $notchedOutline": {
			borderColor: "#d3d3d3" //default
		},
		"&:hover:not($disabled):not($cssFocused):not($error) $notchedOutline": {
			borderColor: "#d3d3d3" //hovered #DCDCDC
		},
		"&$cssFocused $notchedOutline": {
			borderColor: "#23A5EB" //focused
		}
	},
	notchedOutline: {},
	cssFocused: {},
	error: {},
	disabled: {}
});

class NewLoginComponent extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			user: "",
			errorMsg: "",
			errorMsgLength: "",
			loginErrorMsg: "",
			flag: false,
			password: "",
			hidden: true,
			valuePassText: "SHOW"
		};
		self = this;
	}

	componentDidMount() {
		this._isMounted = true;
		if (this.props.password) {
			this.setState({ password: this.props.password });
		}
	}

	componentDidUpdate(prevProps) { }

	render() {
		const { classes } = this.props;
		let username = "";
		let password = "";
		return (
			<div className="container-fluid backround">
				<div className="container" id="loginform">
					<div className="form-group">
						<div>
							<div className="emailInput">
								<TextField
									className={classes.textField}
									id="email-txt-input"
									label="Email"
									variant="outlined"
									inputRef={node => (username = node)}
									InputLabelProps={{
										classes: {
											root: classes.cssLabel,
											focused: classes.cssFocused
										}
									}}
									InputProps={{
										classes: {
											root: classes.cssOutlinedInput,
											focused: classes.cssFocused,
											notchedOutline: classes.notchedOutline
										},
										inputMode: "numeric"
									}}
								/>
							</div>
							<div className="passwordInput">
								<TextField
									className={classes.textField}
									id="password-txt-input"
									label="Password"
									variant="outlined"
									inputRef={node => (password = node)}
									type={this.state.hidden ? "password" : "text"}
									value={this.state.password}
									onChange={this.handlePasswordChange}
									InputLabelProps={{
										classes: {
											root: classes.cssLabel,
											focused: classes.cssFocused
										}
									}}
									InputProps={{
										classes: {
											root: classes.cssOutlinedInput,
											focused: classes.cssFocused,
											notchedOutline: classes.notchedOutline
										},
										inputMode: "numeric"
									}}
								/>
							</div>
						</div>
						<div className="form-group form">
							<Button
								variant="contained"
								id="normal-signin-Btn"
								type={"submit"}
								className={"btn btn-primary loginButton"}
							>
								LogIn
							</Button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

NewLoginComponent.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(NewLoginComponent);
