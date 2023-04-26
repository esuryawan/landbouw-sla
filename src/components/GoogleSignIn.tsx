import { Component } from "react";

const gsiClientId: string = "1058359876929-6esuhjomsh3dlk2ncf6cjju004rs95fl.apps.googleusercontent.com";
const gsiScriptId: string = "gsiScript";
const gsiButtonId: string = "gsiButton";

interface GoogleSignInProps {
	callback?: Function;
}

export default class GoogleSignIn extends Component<GoogleSignInProps, any> {
	gsiScriptLoaded: boolean = false;
	user: any = undefined;

	constructor(props: any) {
		super(props);
		this.gsiInitialize = this.gsiInitialize.bind(this);
		this.gsiSignIn = this.gsiSignIn.bind(this);
	}

	override componentDidMount() {
		if (this.user || this.gsiScriptLoaded) return;
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.onload = this.gsiInitialize;
		script.async = true;
		script.id = gsiScriptId;
		document.querySelector("body")?.appendChild(script);
	}

	override componentWillUnmount() {
		window.google?.accounts.id.cancel();
		// document.getElementById(gsiScriptId)?.remove();
	}

	gsiInitialize() {
		if (!window.google || this.gsiScriptLoaded) return;

		this.gsiScriptLoaded = true;
		window.google.accounts.id.initialize({
			client_id: gsiClientId,
			callback: this.gsiSignIn,
			// auto_select?: boolean
			// login_uri?: string
			// native_callback?: Function
			// cancel_on_tap_outside?: boolean
			// prompt_parent_id?: string
			// nonce?: string
			// context?: string
			// state_cookie_domain?: string
			// ux_mode?: "popup" | "redirect"
			// allowed_parent_origin?: string | string[]
			// intermediate_iframe_close_callback?: Function
		});

		const buttonConfig: GsiButtonConfiguration = {
			type: "standard",
			theme: "filled_blue",
			size: "large",
			text: "signin_with",
			shape: "rectangular",
			// logo_alignment: "center",
			// width: "300px",
			// local: "ID-id",
		};

		window.google.accounts.id.renderButton(document.getElementById(gsiButtonId)!, buttonConfig);

		window.google.accounts.id.prompt(); // also display the One Tap dialog
	}

	gsiSignIn(res: CredentialResponse) {
		if (!res.clientId || !res.credential) return;
		if (this.props.callback) this.props.callback(res);
		window.google?.accounts.id.cancel();
		// document.getElementById(gsiButtonId)?.remove();
	}

	override render() {
		return <div id={gsiButtonId}></div>;
	}
}
