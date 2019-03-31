import React from "react";
import { Button, Glyphicon } from "react-bootstrap";
import "./LoaderButton.css";

export default ({
	isLoading,
	text,
	loadingText,
	className = "",
	disabled = false,
	icon,
	...props
}) =>
	<Button
		className={`LoaderButton ${className}`}
		disabled={disabled || isLoading}
		{...props}
	>
		{isLoading && <Glyphicon glyph="refresh" className="spinning" />}
		{icon ? <i class={icon}/> : null}
		{!isLoading ? text : loadingText}
	</Button>;