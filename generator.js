const fs = require('fs');

// Get font data
const fonts = require('./fonts.json');

function generateCSS() {
	let cssCode = "";
	for (let font of Object.keys(fonts)) {
		let fontData = fonts[font];

		// Add font weight if needed (for rendering on Safari)
		let fontWeightCSS = "";
		if (fontData["weight-css"].length > 0) {
			fontWeightCSS = `font-weight: ${fontData["weight-css"]};`;
		}

		// Set default values
		let defaultCSS = "";
		let axisNumber = 0;
		for (let axis of Object.keys(fontData["axes"])) {
			defaultCSS += `"${axis}" ${fontData["axes"][axis]["default"]}`
			axisNumber++;
			if (axisNumber < Object.keys(fontData["axes"]).length) {
				defaultCSS += ", ";
			}
		}

		// Put everything together
		// Note: previews are gated behind [data-loaded="1"] so the browser only
		// downloads a font file once its menu item has been marked as loaded
		cssCode += `
			@font-face {
				font-family: "${font}";
				src: url("/assets/fonts/${fontData["file"]}");
				${fontWeightCSS}
			}
			@keyframes preview-${font.toLowerCase().replace(/ /g, '-')} {
				${fontData["preview-animation"]}
			}
			[data-font="${font}"][data-loaded="1"] .menu-fonts-item-preview {
				font-family: "${font}";
				font-variation-settings: ${defaultCSS};
				${fontData["special-css"]}
			}
			[data-font="${font}"][data-loaded="1"]:hover .menu-fonts-item-preview {
				animation: preview-${font.toLowerCase().replace(/ /g, '-')} ${fontData["preview-css"]};
			}
		`
	}

	// Create CSS file
	fs.writeFile(`fonts.css`, cssCode, err => {
		if (err) {
			console.error(err);
		}
	});
}
generateCSS();