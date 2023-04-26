// source: https://ncoughlin.com/posts/react-navigation-without-react-router/

export const Route = ({ path, children }) => {
	// state to track URL and force component to re-render on change
	const [currentPath, setCurrentPath] = useState(window.location.pathname);

	useEffect(() => {
		// define callback as separate function so it can be removed later with cleanup function
		const onLocationChange = () => {
			// update path state to current window URL
			setCurrentPath(window.location.pathname);
		}
		window.addEventListener('popstate', onLocationChange);

		// clean up event listener
		return () => {
			window.removeEventListener('popstate', onLocationChange)
		};
	}, []);

	return currentPath === path ? children : null;
};

export const Link = ({ className, href, children }) => {
	// prevent full page reload
	const onClick = (event) => {
		event.preventDefault();
		window.history.pushState({}, "", href);

		const navEvent = new PopStateEvent('popstate');
		window.dispatchEvent(navEvent);
	};

	return (
		<a className={className} href={href} onClick={onClick}>
			{children}
		</a>
	);
};