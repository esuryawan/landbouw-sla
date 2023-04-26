import React from "react";
import "./Popup.css";

interface PopupProps {
	show: boolean;
	onContent: Function;
}

export class Popup extends React.Component<PopupProps, any> {
	override render() {
		return (
			<div className={"overlay " + (this.props.show ? "show" : "hide")}>
				<div className="popup">{this.props.onContent()}</div>
			</div>
		);
	}
}
