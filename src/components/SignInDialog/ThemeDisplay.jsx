function ThemeDisplay({ theme }) {
	const order = [
		"desktop-bg",
		"main-window-bg",
		"popout-window-bg",
		"text",
		"button-text",
		"indicator-accent",
		"field-bg",
		"accent-1",
		"accent-2",
		"header-text",
		"border-2",
	];

	return (
		<p>
			{order.map((key) => (
				<span style={{ color: theme[key] }}>█</span>
			))}
		</p>
	);
}

export default ThemeDisplay;
