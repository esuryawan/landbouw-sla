import React from "react";
import classNames from "classnames";
import styles from "./Popup.module.scss";

interface PopupProps {
	show: boolean;
	onContent: Function;
}

export class Popup extends React.Component<PopupProps, any> {
	override render() {
		return (
			<div className={classNames(styles.overlay, {
				[styles.show]: this.props.show,
				[styles.hide]: !this.props.show
			})}>
				<div className={styles.popup}>{this.props.onContent()}</div>
			</div>
		);
	}
}
