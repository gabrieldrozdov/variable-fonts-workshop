// ——————————————————————————————————
// HELPER FUNCTIONS
// ——————————————————————————————————
function shuffle (array) {
	let currentIndex = array.length;
	while (currentIndex != 0) {
		let randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;
		[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
	}
}
function toTitleCase(str) {
	return str.replace(
		/\w\S*/g,
		function(txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		}
	);
}

// ——————————————————————————————————
// INTERFACE
// ——————————————————————————————————

// Interface background and colors
function changeBackground() {
	const background = document.querySelector('.background');
	background.style.transform = `scale(${Math.random()*2+.5}, ${Math.random()*2+.5})`;
}
let colors = ['purple', 'yellow', 'blue', 'red', 'pink', 'green'];
shuffle(colors);
let currentColor = 0;
function changePrimaryColor() {
	const root = document.querySelector('html');
	root.style.setProperty('--primary', `var(--${colors[currentColor]}`);
	currentColor++;
	if (currentColor >= colors.length) {
		currentColor = 0;
	}
}
let backgroundLoop, colorLoop;
function startBackgroundCycle() {
	backgroundLoop = setInterval(changeBackground, 2000);
	colorLoop = setInterval(changePrimaryColor, 2000);
}
function endBackgroundCycle() {
	clearInterval(backgroundLoop);
	clearInterval(colorLoop);
}
setTimeout(changeBackground, 100);
setTimeout(changePrimaryColor, 100);

// Flash to hide transitions
function flashScreen() {
	const flash = document.querySelector('.flash');
	flash.dataset.active = 1;
	setTimeout(() => {
		flash.dataset.active = 0;
	}, 50)
}

// Nav
function closeNav() {
	const nav = document.querySelector('.nav');
	nav.dataset.active = 0;
}
function openNav() {
	const nav = document.querySelector('.nav');
	nav.dataset.active = 1;
}
function toggleNav() {
	const nav = document.querySelector('.nav');
	if (parseInt(nav.dataset.active) == 0) {
		openNav();
	} else {
		closeNav();
	}
}

// Controls
function hideControls() {
	const controls = document.querySelector('.controls');
	controls.dataset.active = 0;
}
function showControls() {
	const controls = document.querySelector('.controls');
	controls.dataset.active = 1;
}
function toggleShowControls() {
	const controls = document.querySelector('.controls');
	if (parseInt(controls.dataset.active) == 0) {
		showControls();
	} else {
		hideControls();
	}
}
function toggleControlsTab(tab, e) {
	for (let controlsTab of document.querySelectorAll('.controls-tab')) {
		controlsTab.dataset.active = 0;
	}
	for (let controlsMenuContent of document.querySelectorAll('.controls-menu-content')) {
		controlsMenuContent.dataset.active = 0;
	}

	const controls = document.querySelector('.controls');
	const targetMenu = document.querySelector(`.controls-menu-content[data-tab="${tab}"]`);
	if (controls.dataset.tab == tab) {
		controls.dataset.open = 0;
		e.dataset.active = 0;
		controls.dataset.tab = "";
	} else {
		controls.dataset.open = 1;
		controls.dataset.tab = tab;
		e.dataset.active = 1;
		targetMenu.dataset.active = 1;
	}
}

function setColor(color) {
	for (let backgroundColorToggle of document.querySelectorAll('[data-background-color')) {
		backgroundColorToggle.dataset.state = 0;
	}
	const backgroundColorToggle = document.querySelector(`[data-background-color="${color}"]`);
	backgroundColorToggle.dataset.state = 1;

	const root = document.querySelector('html');
	clearInterval(colorLoop);
	if (color == 'cycle') {
		changePrimaryColor();
		colorLoop = setInterval(changePrimaryColor, 2000);
	} else if (color == "white") {
		root.style.setProperty('--primary', `white`);
	} else {
		root.style.setProperty('--primary', `var(--${color}`);
	}
}
function toggleBackgroundMotion() {
	const background = document.querySelector('.background');
	const toggle = document.querySelector('#controls-background-motion');
	if (parseInt(background.dataset.motion) == 1) {
		background.dataset.motion = 0;
		toggle.dataset.state = 0;
	} else {
		background.dataset.motion = 1;
		toggle.dataset.state = 1;
	}
}
function toggleBackgroundCheckerboard() {
	const background = document.querySelector('.background');
	const toggle = document.querySelector('#controls-background-checkerboard');
	if (parseInt(background.dataset.checkerboard) == 1) {
		background.dataset.checkerboard = 0;
		toggle.dataset.state = 0;
	} else {
		background.dataset.checkerboard = 1;
		toggle.dataset.state = 1;
	}
}

// Display color
function displayForegroundColor(color) {
	const display = document.querySelector(`#${activeInstrument} .instrument-text`);
	display.style.color = color;
}
function displayBackgroundColor(color) {
	const display = document.querySelector(`#${activeInstrument} .instrument-text`);
	display.style.backgroundColor = color;
}
function resetColors() {
	const display = document.querySelector(`#${activeInstrument} .instrument-text`);
	display.style.color = "#353535";
	display.style.backgroundColor = "#e5e5e5";
	const textColor = document.querySelector(`#textcolor`);
	textColor.value = "#353535";
	const displayColor = document.querySelector(`#displaycolor`);
	displayColor.value = "#e5e5e5";
}

// Text alignment
function setAlignment(setting) {
	for (let button of document.querySelectorAll('#alignment .controls-menu-button')) {
		button.dataset.state = 0;
	}

	const activeSetting = document.querySelector(`[data-alignment="${setting}"]`);
	activeSetting.dataset.state = 1;

	const body = document.querySelector('body');
	body.style.setProperty("--alignment", setting);
}

// Capitalization
function setCapitalization(setting) {
	for (let button of document.querySelectorAll('#capitalization .controls-menu-button')) {
		button.dataset.state = 0;
	}

	const activeSetting = document.querySelector(`[data-capitalization="${setting}"]`);
	activeSetting.dataset.state = 1;

	const body = document.querySelector('body');
	body.style.setProperty("--capitalization", setting);
}

// Controls sliders
let controlsSliders = {
	"volume": {
		"value": 100,
		"units": "%",
		"rounding": 0,
		"default": 100,
		"min": 0,
		"max": 100
	},
	"fontsize": {
		"value": 72,
		"units": "px",
		"rounding": 0,
		"default": 72,
		"min": 8,
		"max": 200
	},
	"letterspacing": {
		"value": 0,
		"units": "em",
		"rounding": 2,
		"default": 0,
		"min": -.5,
		"max": 2
	},
	"lineheight": {
		"value": 1.1,
		"units": "em",
		"rounding": 2,
		"default": 1.1,
		"min": 0,
		"max": 4
	}
}
function initControlsSliders() {
	for (let slider of document.querySelectorAll('[data-controls-slider]')) {
		slider.addEventListener('mousedown', (e) => {startControlsSlider(slider, slider.dataset.controlsSlider); updateControlsSlider(e);});
	}
}
function resetControlsSliders() {
	for (let slider of document.querySelectorAll('[data-controls-slider]')) {
		const target = slider.dataset.controlsSlider;
		controlsSliders[target]["value"] = controlsSliders[target]["default"];

		// Display default values
		const defaultValue = controlsSliders[target]["default"];
		const min = controlsSliders[target]["min"];
		const max = controlsSliders[target]["max"];
		const units = controlsSliders[target]["units"];
		const range = max-min;

		const sliderFill = slider.querySelector('.controls-menu-slider-fill');
		sliderFill.style.width = `${((defaultValue-min)/(range))*100}%`;
		const sliderValue = slider.querySelector('.controls-menu-slider-value');
		sliderValue.innerText = `${controlsSliders[target]["default"]}${units}`;
	}

	document.querySelector('body').style.setProperty('--fontsize', `${controlsSliders["fontsize"]["default"]}${controlsSliders["fontsize"]["units"]}`);
	document.querySelector('body').style.setProperty('--letterspacing', `${controlsSliders["letterspacing"]["default"]}${controlsSliders["letterspacing"]["units"]}`);
	document.querySelector('body').style.setProperty('--lineheight', `${controlsSliders["lineheight"]["default"]}${controlsSliders["lineheight"]["units"]}`);
}
initControlsSliders();
resetControlsSliders();

let activeControlsSlider, activeControlsSliderTarget;
function startControlsSlider(element, target) {
	activeControlsSlider = element;
	activeControlsSliderTarget = target;
	document.addEventListener('mousemove', updateControlsSlider);
	document.addEventListener('mouseup', endControlsSlider);
}
function updateControlsSlider(e) {
	let offsets = activeControlsSlider.getBoundingClientRect();

	// Calculate percentage
	let percentFill = (e.clientX-offsets.left)/(offsets.right-offsets.left);
	if (percentFill >= 1) {
		percentFill = 1;
	} else if (percentFill <= 0) {
		percentFill = 0;
	}
	
	// Normalize and round to appropriate value
	const min = controlsSliders[activeControlsSliderTarget]["min"];
	const max = controlsSliders[activeControlsSliderTarget]["max"];
	const rounding = controlsSliders[activeControlsSliderTarget]["rounding"];
	const units = controlsSliders[activeControlsSliderTarget]["units"];
	const range = max-min;
	controlsSliders[activeControlsSliderTarget]["value"] = (percentFill*range+min).toFixed(rounding);

	// Update slider element
	const sliderFill = activeControlsSlider.querySelector('.controls-menu-slider-fill');
	sliderFill.style.width = `${percentFill*100}%`;

	// Update text element
	const sliderValue = activeControlsSlider.querySelector('.controls-menu-slider-value');
	sliderValue.innerText = `${controlsSliders[activeControlsSliderTarget]["value"]}${units}`;

	// Apply settings
	if (activeControlsSliderTarget == "volume") {

	} else if (activeControlsSliderTarget == "fontsize") {
		document.querySelector('body').style.setProperty("--fontsize", controlsSliders[activeControlsSliderTarget]["value"]+units);
	} else if (activeControlsSliderTarget == "letterspacing") {
		document.querySelector('body').style.setProperty("--letterspacing", controlsSliders[activeControlsSliderTarget]["value"]+units);
	} else if (activeControlsSliderTarget == "lineheight") {
		document.querySelector('body').style.setProperty("--lineheight", controlsSliders[activeControlsSliderTarget]["value"]+units);
	}
}
function endControlsSlider() {
	document.removeEventListener('mousemove', updateControlsSlider);
	document.removeEventListener('mouseup', endControlsSlider);
}

// Min/max axis cap sliders
let controlsAxisSliders = {};
function initControlsAxisSliders() {
	const controlsVariable = document.querySelector('.controls-menu-content[data-tab="variable"]')
	for (let slider of controlsVariable.querySelectorAll('[data-controls-axis-slider]')) {
		slider.addEventListener('mousedown', (e) => {startControlsAxisSlider(slider, slider.dataset.controlsAxisSlider); updateControlsAxisSlider(e);});
	}
}
function resetControlsAxisSliders() {
	for (let slider of document.querySelectorAll('[data-controls-axis-slider]')) {
		const target = slider.dataset.controlsAxisSlider;
		controlsAxisSliders[target]["value"] = controlsAxisSliders[target]["default"];

		// Display default values
		const defaultValue = controlsAxisSliders[target]["default"];
		const min = controlsAxisSliders[target]["min"];
		const max = controlsAxisSliders[target]["max"];
		const units = controlsAxisSliders[target]["units"];
		const range = max-min;

		const sliderFill = slider.querySelector('.controls-menu-slider-fill');
		sliderFill.style.width = `${((defaultValue-min)/(range))*100}%`;
		const sliderValue = slider.querySelector('.controls-menu-slider-value');
		sliderValue.innerText = `${controlsAxisSliders[target]["default"]}${units}`;
	}
}
let activeControlsAxisSlider, activeControlsAxisSliderTarget;
function startControlsAxisSlider(element, target) {
	activeControlsAxisSlider = element;
	activeControlsAxisSliderTarget = target;
	document.addEventListener('mousemove', updateControlsAxisSlider);
	document.addEventListener('mouseup', endControlsAxisSlider);
}
function updateControlsAxisSlider(e) {
	let offsets = activeControlsAxisSlider.getBoundingClientRect();

	// Calculate percentage
	let percentFill = (e.clientX-offsets.left)/(offsets.right-offsets.left);
	if (percentFill >= 1) {
		percentFill = 1;
	} else if (percentFill <= 0) {
		percentFill = 0;
	}
	
	// Normalize and round to appropriate value
	const min = controlsAxisSliders[activeControlsAxisSliderTarget]["min"];
	const max = controlsAxisSliders[activeControlsAxisSliderTarget]["max"];
	const rounding = controlsAxisSliders[activeControlsAxisSliderTarget]["rounding"];
	const units = controlsAxisSliders[activeControlsAxisSliderTarget]["units"];
	const range = max-min;
	controlsAxisSliders[activeControlsAxisSliderTarget]["value"] = (percentFill*range+min).toFixed(rounding);

	// Update slider element
	const sliderFill = activeControlsAxisSlider.querySelector('.controls-menu-slider-fill');
	sliderFill.style.width = `${percentFill*100}%`;

	// Update text element
	const sliderValue = activeControlsAxisSlider.querySelector('.controls-menu-slider-value');
	sliderValue.innerText = `${controlsAxisSliders[activeControlsAxisSliderTarget]["value"]}${units}`;

	// Apply settings
	let axis = controlsAxisSliders[activeControlsAxisSliderTarget]["axis"];
	let type = controlsAxisSliders[activeControlsAxisSliderTarget]["type"];
	activeFontAxes[axis][type] = parseInt(controlsAxisSliders[activeControlsAxisSliderTarget]["value"]);

	// Recalculate range
	let newRange = Math.abs(activeFontAxes[axis]["capmax"]-activeFontAxes[axis]["capmin"]);
	activeFontAxes[axis]["range"] = newRange;

	// Per-instrument settings
	if (activeInstrument == "oscillator") {
		refreshAxisSlider(axis);
	}
}
function endControlsAxisSlider() {
	document.removeEventListener('mousemove', updateControlsAxisSlider);
	document.removeEventListener('mouseup', endControlsAxisSlider);
}

// ——————————————————————————————————
// INTRO SCREEN
// ——————————————————————————————————
function setLogoDelays() {
	let delay = .5;
	for (let span of document.querySelectorAll('.intro-logo span')) {
		span.style.animationDelay = `${delay}s`;
		delay += .05;
	}
}
function introIn() {
	const intro = document.querySelector('.intro');
	intro.dataset.active = 1;
	startBackgroundCycle();
}
function introOut() {
	const intro = document.querySelector('.intro');
	intro.dataset.active = 0;
	endBackgroundCycle();
	openNav();
	showControls();
	pickRandomFont();
}
setLogoDelays();
setTimeout(introIn, 50);

// ——————————————————————————————————
// FONTS
// ——————————————————————————————————

// Generate font menu
let fontData, fontNames;
fetch('fonts.json')
	.then((response) => response.json())
	.then((json) => {
		fontData = json;
		fontNames = Object.keys(fontData);
		generateMenuFonts();
	})

let fontOrder = [];
let fontOrderNames = []; // alpha by font name
let fontOrderDesigners = []; // alpha by designer
function generateMenuFonts() {
	let htmlTemp = "";
	for (let font of fontNames) {
		fontInfo = fontData[font];

		fontOrderNames.push(font);
		fontOrderDesigners.push(fontInfo["designer"].toLowerCase());

		let credit = "";
		if (fontInfo['credit'].length > 0) {
			credit = `<div class="menu-fonts-item-credit">${fontInfo['credit']}</div>`;
		}

		htmlTemp += `
			<div class="menu-fonts-item-transform" style="transform: translate(-${Math.round(Math.random()*100+100)}vw, ${Math.round(Math.random()*200-100)}vh);" data-filter="1" data-search="1">
				<button class="menu-fonts-item" style="transform: rotate(${Math.round(Math.random()*20-10)}deg);" data-font="${font}" data-designer="${fontInfo["designer"].toLowerCase()}" data-tags ="${fontInfo["tags"]}" data-default="${fontInfo['preview-text']}" onclick="pickFont('${font}');" onmouseenter="playTomRandom();">
					${credit}
					<div class="menu-fonts-item-preview">${fontInfo['preview-text']}</div>
					<div class="menu-fonts-item-info">
						<div class="menu-fonts-item-name">${fontInfo['name']}</div>
						<div class="menu-fonts-item-designer">by ${fontInfo['designer']}</div>
					</div>
					<div class="menu-fonts-item-bolt" data-position="0"></div>
					<div class="menu-fonts-item-bolt" data-position="1"></div>
					<div class="menu-fonts-item-bolt" data-position="2"></div>
					<div class="menu-fonts-item-bolt" data-position="3"></div>
				</button>
			</div>
		`;
	}
	const menuFontsItems = document.querySelector('.menu-fonts-items');
	menuFontsItems.innerHTML = htmlTemp;

	// Randomize order
	for (let menuFontsItem of document.querySelectorAll('.menu-fonts-item')) {
		fontOrder.push(menuFontsItem.dataset.font);
	}
	shuffle(fontOrder);
	let orderNumber = 0;
	for (let font of fontOrder) {
		let item = document.querySelector(`[data-font="${font}"]`);
		item.parentElement.style.order = orderNumber;
		orderNumber++;
	}
}

// Fonts menu
function openMenuFonts() {
	instrumentPlaying = false;

	const menuFonts = document.querySelector('.menu-fonts');
	menuFonts.dataset.active = 1;

	const instrument = document.querySelector(`#${activeInstrument}`);
	instrument.dataset.position = "right";

	// Animation in
	for (let menuItem of document.querySelectorAll('.menu-fonts-item-transform')) {
		setTimeout(() => {
			menuItem.style.transform = ``;
		}, Math.random()*250)
	}
}
function closeMenuFonts() {
	const menuFonts = document.querySelector('.menu-fonts');
	menuFonts.dataset.active = 0;

	// Animation out
	for (let menuItem of document.querySelectorAll('.menu-fonts-item-transform')) {
		setTimeout(() => {
			menuItem.style.transform = `translate(-${Math.round(Math.random()*50+50)}vw, ${Math.round(Math.random()*200-100)}vh)`;
		}, Math.random()*250)
	}
}
function toggleMenuFonts() {
	const menuFonts = document.querySelector('.menu-fonts');
	if (parseInt(menuFonts.dataset.active) == 0) {
		openMenuFonts();
	} else {
		closeMenuFonts();
	}
}

// Fonts menu sorting
let fontSorting = ["random", "fontname+", "fontname-", "author+", "author-"];
let currentFontSorting = 0;
function sortMenuFonts() {
	currentFontSorting++;
	if (currentFontSorting >= fontSorting.length) {
		currentFontSorting = 0;
	}

	// Apply sorting
	let sortingName = fontSorting[currentFontSorting];
	const menuSortingDisplay = document.querySelector(`#menu-fonts-sorting span`);
	if (sortingName == "random") {
		menuSortingDisplay.innerText = `Sort by: Random`;
		
		fontOrder = fontOrderNames;
		shuffle(fontOrder);

		let orderNumber = 0;
		for (let font of fontOrder) {
			let item = document.querySelector(`[data-font="${font}"]`);
			item.parentElement.style.order = orderNumber;
			orderNumber++;
		}

	} else if (sortingName == "fontname+") {
		menuSortingDisplay.innerText = `Sort by: Name A–Z`;

		fontOrder = fontOrderNames.sort();

		let orderNumber = 0;
		for (let font of fontOrder) {
			let item = document.querySelector(`[data-font="${font}"]`);
			item.parentElement.style.order = orderNumber;
			orderNumber++;
		}

	} else if (sortingName == "fontname-") {
		menuSortingDisplay.innerText = `Sort by: Name Z—A`;

		fontOrder = fontOrderNames.sort().reverse();
		
		let orderNumber = 0;
		for (let font of fontOrder) {
			let item = document.querySelector(`[data-font="${font}"]`);
			item.parentElement.style.order = orderNumber;
			orderNumber++;
		}

	} else if (sortingName == "author+") {
		menuSortingDisplay.innerText = `Sort by: Designer A–Z`;
		
		fontOrder = fontOrderDesigners.sort();
		
		let orderNumber = 0;
		for (let font of fontOrder) {
			let item = document.querySelector(`[data-designer="${font}"]`);
			item.parentElement.style.order = orderNumber;
			orderNumber++;
		}

	} else if (sortingName == "author-") {
		menuSortingDisplay.innerText = `Sort by: Designer Z–A`;
		
		fontOrder = fontOrderDesigners.sort().reverse();
		
		let orderNumber = 0;
		for (let font of fontOrder) {
			let item = document.querySelector(`[data-designer="${font}"]`);
			item.parentElement.style.order = orderNumber;
			orderNumber++;
		}

	}
}

// Fonts menu filters
let fontFilters = ["all", "original", "remixed", "pixel", "vector"];
let currentFontFilter = 0;
function filterMenuFonts() {
	currentFontFilter++;
	if (currentFontFilter >= fontFilters.length) {
		currentFontFilter = 0;
	}

	// Apply filter
	let filterName = fontFilters[currentFontFilter];
	const menuFilterDisplay = document.querySelector(`#menu-fonts-filters span`);
	let notEmpty = false;
	if (filterName == "all") {
		menuFilterDisplay.innerText = `Filter by: Show All`;

		for (let menuFontsItem of document.querySelectorAll('.menu-fonts-item')) {
			menuFontsItem.parentElement.dataset.filter = 1;
			if (parseInt(menuFontsItem.parentElement.dataset.search) != 0) {
				notEmpty = true;
			}
		}

	} else if (filterName == "original") {
		menuFilterDisplay.innerText = `Filter by: Original Fonts`;

		for (let menuFontsItem of document.querySelectorAll('.menu-fonts-item')) {
			if (menuFontsItem.dataset.tags.includes("original")) {
				menuFontsItem.parentElement.dataset.filter = 1;
				if (parseInt(menuFontsItem.parentElement.dataset.search) != 0) {
					notEmpty = true;
				}
			} else {
				menuFontsItem.parentElement.dataset.filter = 0;
			}
		}

	} else if (filterName == "remixed") {
		menuFilterDisplay.innerText = `Filter by: Remixed Fonts`;

		for (let menuFontsItem of document.querySelectorAll('.menu-fonts-item')) {
			if (menuFontsItem.dataset.tags.includes("remixed")) {
				menuFontsItem.parentElement.dataset.filter = 1;
				if (parseInt(menuFontsItem.parentElement.dataset.search) != 0) {
					notEmpty = true;
				}
			} else {
				menuFontsItem.parentElement.dataset.filter = 0;
			}
		}

	} else if (filterName == "pixel") {
		menuFilterDisplay.innerText = `Filter by: Pixel Fonts`;
		
		for (let menuFontsItem of document.querySelectorAll('.menu-fonts-item')) {
			if (menuFontsItem.dataset.tags.includes("pixel")) {
				menuFontsItem.parentElement.dataset.filter = 1;
				if (parseInt(menuFontsItem.parentElement.dataset.search) != 0) {
					notEmpty = true;
				}
			} else {
				menuFontsItem.parentElement.dataset.filter = 0;
			}
		}

	} else if (filterName == "vector") {
		menuFilterDisplay.innerText = `Filter by: Not Pixel Fonts`;
		
		for (let menuFontsItem of document.querySelectorAll('.menu-fonts-item')) {
			if (menuFontsItem.dataset.tags.includes("vector")) {
				menuFontsItem.parentElement.dataset.filter = 1;
				if (parseInt(menuFontsItem.parentElement.dataset.search) != 0) {
					notEmpty = true;
				}
			} else {
				menuFontsItem.parentElement.dataset.filter = 0;
			}
		}
	}

	// Show empty notice if needed
	const menuFonts = document.querySelector(".menu-fonts");
	if (!notEmpty) {
		menuFonts.dataset.empty = 1;
	} else {
		menuFonts.dataset.empty = 0;
	}
}

// Fonts menu search
let fontsSearch = "";
function searchMenuFonts(text) {
	text = text.toLowerCase();
	let notEmpty = false;
	for (let menuFontsItem of document.querySelectorAll('.menu-fonts-item')) {
		if (menuFontsItem.dataset.font.includes(text) || menuFontsItem.dataset.designer.includes(text)) {
			menuFontsItem.parentElement.dataset.search = 1;
			if (parseInt(menuFontsItem.parentElement.dataset.filter) == 1) {
				notEmpty = true;
			}
		} else {
			menuFontsItem.parentElement.dataset.search = 0;
		}
	}

	// Show empty notice if needed
	const menuFonts = document.querySelector(".menu-fonts");
	if (!notEmpty) {
		menuFonts.dataset.empty = 1;
	} else {
		menuFonts.dataset.empty = 0;
	}
}

// Fonts menu text preview
function sampleMenuFonts(text) {
	for (let menuFontsItem of document.querySelectorAll('.menu-fonts-item')) {
		const preview = menuFontsItem.querySelector('.menu-fonts-item-preview');
		if (text.length > 0) {
			preview.innerText = text;
		} else {
			preview.innerText = menuFontsItem.dataset.default;
		}
	}
}

// Reset fonts menu settings
function resetMenuFonts() {
	currentFontSorting = fontSorting.length;
	sortMenuFonts();
	currentFontFilter = fontFilters.length;
	filterMenuFonts();
	const menuFontsSearch = document.querySelector("#menu-fonts-search");
	menuFontsSearch.value = "";
	searchMenuFonts("");
	const menuFontsSample = document.querySelector("#menu-fonts-sample");
	menuFontsSample.value = "";
	sampleMenuFonts("");
}

// Drag and drop font files
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	document.querySelector(".container").addEventListener(eventName, preventDefaults, false)
})
function preventDefaults (e) {
	e.preventDefault();
	e.stopPropagation();
}
document.querySelector(".container").addEventListener("dragenter", dropHighlight, false);
document.querySelector(".container").addEventListener("dragover", dropHighlight, false);
document.querySelector(".container").addEventListener("dragleave", dropUnhighlight, false);
document.querySelector(".container").addEventListener("drop", dropUnhighlight, false);
function dropHighlight() {
	document.querySelector(".droparea-message").dataset.active = 1;
}
function dropUnhighlight() {
	document.querySelector(".droparea-message").dataset.active = 0;
}
document.querySelector(".container").addEventListener('drop', handleFileSelect, false);
function handleFileSelect(event) {
	userFont = true;
	loadFontData(event.dataTransfer.files[0], event.dataTransfer.files[0].name);
}

// User-uploaded fonts
let userFont = false;
document.querySelector("#menu-fonts-input").addEventListener('change', (e) => {
	userFont = true;
	loadFontData(e.target.files[0], e.target.files[0].name);
});

// Select font
let activeFont = "";
let activeFontAxes = {};
let activeFontAxesCount = 0;
let activeFontData;
function pickRandomFont() {
	let randomFont = fontNames[Math.floor(Math.random()*fontNames.length)];
	pickFont(randomFont);
}
async function pickFont(fontName) {
	userFont = false;

	// Fetch font data and load using Opentype.js
	loadFontData(await fetch(`/assets/fonts/${fontData[fontName]["file"]}`), fontName);
}
async function loadFontData(file, fontName) {
    const isWoff2 = fontName.endsWith('.woff2');
	const backup = activeFontData;
	try {
		const data = await file.arrayBuffer();
		activeFontData = opentype.parse(isWoff2 ? Module.decompress(data) : data);
	} catch (err) {
		alert("That font file didn’t work! Please try using another file.");
		return
    }

	if (!("fvar" in activeFontData.tables)) {
		alert("That wasn’t a variable font! Please try using another file.");
		activeFontData = backup;
		return
	}

	// On success, load in new font
	if (!userFont) {
		activeFont = fontName;
	} else {
		activeFont = "user";
		const userFontFace = document.querySelector("#user-font");
		userFontFace.innerHTML = `
			@font-face {
				font-family: "user";
				src: url("${URL.createObjectURL(file)}");
			}
		`;
	}

	// Remove previous sliders from controls object
	if (activeFont != "") {
		for (let axis of Object.keys(activeFontAxes)) {
			delete controlsSliders[`${axis}-min`];
			delete controlsSliders[`${axis}-max`];
		}
	}

	// Populate font and credits if included in collection
	const navFontSectionInfo = document.querySelector('#nav-font .nav-section-info');
	if (!userFont) {
		navFontSectionInfo.innerText = `${fontData[activeFont]["name"]} by ${fontData[activeFont]["designer"]}`;
	} else {
		navFontSectionInfo.innerText = `Something you uploaded!`;
	}

	// Build axes object and animation settings
	activeFontAxes = {}; // formatted data
	let fontDataAxes = activeFontData.tables.fvar.axes; // actual data
	let animationSettingsHTML = ''; // temp html string
	let currentAxisNumber = 0; // for divider formatting
	activeFontAxesCount = fontDataAxes.length;
	for (let axis of fontDataAxes) {
		activeFontAxes[axis.tag] = {
			"value": axis.defaultValue,
			"min": axis.minValue,
			"max": axis.maxValue,
			"capmin": axis.minValue,
			"capmax": axis.maxValue,
			"range": Math.abs(axis.maxValue-axis.minValue),
			"default": axis.defaultValue,
			"name": axis.name.en
		}

		// Build sliders
		animationSettingsHTML += `
			<div class="controls-menu-item">
				<div class="controls-menu-item-label">${axis.name.en} [${axis.tag}]<br>Minimum Value</div>
				<div class="controls-menu-slider" data-controls-axis-slider="${axis.tag}-min">
					<div class="controls-menu-slider-value"></div>
					<div class="controls-menu-slider-fill"></div>
				</div>
			</div>

			<div class="controls-menu-divider"></div>

			<div class="controls-menu-item">
				<div class="controls-menu-item-label">${axis.name.en} [${axis.tag}]<br>Maximum Value</div>
				<div class="controls-menu-slider" data-controls-axis-slider="${axis.tag}-max">
					<div class="controls-menu-slider-value"></div>
					<div class="controls-menu-slider-fill"></div>
				</div>
			</div>
		`;
		if (currentAxisNumber < activeFontAxesCount-1) {
			animationSettingsHTML += `<div class="controls-menu-divider"></div>`;
		}
		currentAxisNumber++;

		// Add to controls axis object
		controlsAxisSliders[`${axis.tag}-min`] = {
			"axis": axis.tag,
			"type": "capmin",
			"value": axis.minValue,
			"units": "",
			"rounding": 0,
			"default": axis.minValue,
			"min": axis.minValue,
			"max": axis.maxValue
		};
		controlsAxisSliders[`${axis.tag}-max`] = {
			"axis": axis.tag,
			"type": "capmax",
			"value": axis.maxValue,
			"units": "",
			"rounding": 0,
			"default": axis.maxValue,
			"min": axis.minValue,
			"max": axis.maxValue
		};
	}

	const animationSettings = document.querySelector('.controls-menu-content[data-tab="variable"]');
	animationSettings.innerHTML = animationSettingsHTML;
	initControlsAxisSliders();
	resetControlsAxisSliders();
	resetControlsSliders();
	setAlignment('center');
	setCapitalization('normal');
	resetColors();

	// Show interface
	closeMenuFonts();
	showControls();
	openNav();

	// Initailize current instrument
	initializeInstrument();
}

// Previous and next font shortcuts
function prevFont() {
	let currentFontIndex = fontOrder.indexOf(activeFont);
	currentFontIndex--;
	if (currentFontIndex < 0) {
		currentFontIndex = fontOrder.length-1;
	}
	pickFont(fontOrder[currentFontIndex]);
	flashScreen();
}
function nextFont() {
	let currentFontIndex = fontOrder.indexOf(activeFont);
	currentFontIndex++;
	if (currentFontIndex >= fontOrder.length) {
		currentFontIndex = 0;
	}
	pickFont(fontOrder[currentFontIndex]);
	flashScreen();
}

// ——————————————————————————————————
// INSTRUMENTS
// ——————————————————————————————————
let instrumentPlaying = false;
let activeInstrument = "oscillator";
function initializeInstrument() {
	instrumentPlaying = true;
	switch (activeInstrument) {
		case 'oscillator': initializeOscillator(); break;
		case 'conversator': initializeConversator(); break;
		case 'scrambler': initializeScrambler(); break;
		case 'sequencer': initializeSequencer(); break;
		case 'interpolator': initializeInterpolator(); break;
	}

	// Populate instrument name
	const navInstrumentSectionInfo = document.querySelector('#nav-instrument .nav-section-info');
	navInstrumentSectionInfo.innerText = toTitleCase(activeInstrument);
}

// Resume instrument without resetting
function resumeInstrument() {
	instrumentPlaying = true;
	switch (activeInstrument) {
		case 'oscillator': resumeOscillator(); break;
		case 'conversator': resumeConversator(); break;
		case 'scrambler': resumeScrambler(); break;
		case 'sequencer': resumeSequencer(); break;
		case 'interpolator': resumeInterpolator(); break;
	}
}

// Instrument sliders
function initAxisSliders(instrument) {
	const instrumentDOM = document.querySelector(`#${instrument}`);
	for (let slider of instrumentDOM.querySelectorAll('[data-axis-slider]')) {
		slider.addEventListener('mousedown', (e) => {startAxisSlider(slider, slider.dataset.axisSlider); updateAxisSlider(e);});
	}
}
function resetAxisSliders(instrument) {
	const instrumentDOM = document.querySelector(`#${instrument}`);
	for (let slider of instrumentDOM.querySelectorAll('[data-axis-slider]')) {
		const target = slider.dataset.axisSlider;
		activeFontAxes[target]["value"] = activeFontAxes[target]["default"];

		// Display default values
		const defaultValue = activeFontAxes[target]["default"];
		const min = activeFontAxes[target]["capmin"];
		const max = activeFontAxes[target]["capmax"];
		const range = max-min;

		const sliderFill = slider.querySelector('.instrument-axis-slider-fill');
		sliderFill.style.height = `${((defaultValue-min)/(range))*100}%`;
		const sliderValue = slider.querySelector('.instrument-axis-slider-value');
		sliderValue.innerText = `${activeFontAxes[target]["default"]}`;
	}
}
let activeAxisSlider, activeAxisSliderTarget;
function startAxisSlider(element, target) {
	activeAxisSlider = element;
	activeAxisSliderTarget = target;
	document.addEventListener('mousemove', updateAxisSlider);
	document.addEventListener('mouseup', endAxisSlider);
}
function updateAxisSlider(e) {
	let offsets = activeAxisSlider.getBoundingClientRect();

	// Calculate percentage
	let percentFill = 1-(e.clientY-offsets.top)/(offsets.bottom-offsets.top);
	if (percentFill >= 1) {
		percentFill = 1;
	} else if (percentFill <= 0) {
		percentFill = 0;
	}
	
	// Normalize and round to appropriate value
	const min = activeFontAxes[activeAxisSliderTarget]["capmin"];
	const max = activeFontAxes[activeAxisSliderTarget]["capmax"];
	const rounding = activeFontAxes[activeAxisSliderTarget]["rounding"];
	const range = max-min;
	activeFontAxes[activeAxisSliderTarget]["value"] = (percentFill*range+min).toFixed(rounding);

	// Update slider element
	const sliderFill = activeAxisSlider.querySelector('.instrument-axis-slider-fill');
	sliderFill.style.height = `${percentFill*100}%`;

	// Update text element
	const sliderValue = activeAxisSlider.querySelector('.instrument-axis-slider-value');
	sliderValue.innerText = `${activeFontAxes[activeAxisSliderTarget]["value"]}`;

	// Per-instrument controls
	if (activeInstrument == "oscillator") {
		oscillatorSettings[activeAxisSliderTarget]["percent"] = percentFill;
	}
}
function endAxisSlider() {
	document.removeEventListener('mousemove', updateAxisSlider);
	document.removeEventListener('mouseup', endAxisSlider);
}
function setAxisSlider(instrument, axis, percent) {
	const instrumentDOM = document.querySelector(`#${instrument}`);
	const activeAxisSlider = instrumentDOM.querySelector(`[data-axis-slider="${axis}"]`);

	// Normalize and round to appropriate value
	const min = activeFontAxes[axis]["capmin"];
	const max = activeFontAxes[axis]["capmax"];
	const rounding = activeFontAxes[axis]["rounding"];
	const range = max-min;
	activeFontAxes[axis]["value"] = (percent*range+min).toFixed(rounding);

	// Update slider element
	const sliderFill = activeAxisSlider.querySelector('.instrument-axis-slider-fill');
	sliderFill.style.height = `${percent*100}%`;

	// Update text element
	const sliderValue = activeAxisSlider.querySelector('.instrument-axis-slider-value');
	sliderValue.innerText = `${activeFontAxes[axis]["value"]}`;
}

// Refresh slider to account for axis cap changes
function refreshAxisSlider(axis) {
	const sliderElement = document.querySelector(`#${activeInstrument} [data-axis-slider="${axis}"]`);
	const sliderFill = sliderElement.querySelector('.instrument-axis-slider-fill');
	const sliderValue = sliderElement.querySelector('.instrument-axis-slider-value');
	
	// Adjust value if needed
	const min = Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);
	const max = Math.max(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);
	const range = max-min;
	if (activeFontAxes[axis]["value"] < min) {
		activeFontAxes[axis]["value"] = min;
	} else if (activeFontAxes[axis]["value"] > max) {
		activeFontAxes[axis]["value"] = max;
	}

	// Calculate percent filled
	const percentFill = ((activeFontAxes[axis]["value"] - min)/range)*100;

	// Update slider elements
	sliderFill.style.height = `${percentFill}%`;
	sliderValue.innerText = `${activeFontAxes[axis]["value"]}`;
}

// ——————————————————————————————————
// OSCILLATOR
// ——————————————————————————————————
let oscillatorSettings = {};
let oscillatorLoop;
function initializeOscillator() {
	clearTimeout(oscillatorLoop);
	const instrumentOscillator = document.querySelector('#oscillator');

	// Turn off lock
	oscillatorLockSettingsOff();

	// Apply font
	const instrumentText = instrumentOscillator.querySelector('.instrument-text');
	if (!userFont) {
		instrumentText.style.fontFamily = activeFont;
	} else {
		instrumentText.style.fontFamily = "user";
	}

	// Show global controls if more than one axis
	if (activeFontAxesCount > 1) {
		instrumentOscillator.dataset.global = 1;
	} else {
		instrumentOscillator.dataset.global = 0;
	}

	// Build axes
	const oscillatorAxes = instrumentOscillator.querySelector('.instrument-axes');

	let oscillatorAxesHTML = "";
	let oscillatorAxisNumber = 0;
	oscillatorSettings = {};
	for (let axis of Object.keys(activeFontAxes)) {
		// Build controls
		oscillatorSettings[axis] = {
			"percent": 0,
			"waveform": "sine",
			"speed": 1,
			"state": true,
			"direction": 1,
		}

		// Generate HTML
		oscillatorAxesHTML += `
			<div class="instrument-axis" data-axis="${axis}">
				<div class="instrument-axis-slider" data-axis-slider="${axis}">
					<div class="instrument-axis-slider-fill"></div>
					<div class="instrument-axis-slider-value"></div>
				</div>

				<section class="instrument-axis-section" data-instrument-section="waveform">
					<h4 class="instrument-axis-section-label">Waveform</h4>
					<div class="instrument-axis-buttons">
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'sine')" data-active="1" data-value="sine">
							<svg viewBox="0 0 100 56"><path d="m60.66,42.42c-7.77,0-11.34-6.99-14.21-12.6-2.62-5.13-4.4-8.24-7.09-8.24s-4.47,3.11-7.09,8.24c-2.87,5.61-6.44,12.6-14.21,12.6h-4v-8h4c2.68,0,4.47-3.11,7.09-8.24,2.87-5.61,6.44-12.6,14.21-12.6s11.34,6.99,14.21,12.6c2.62,5.13,4.4,8.24,7.09,8.24s4.46-3.11,7.08-8.24c2.87-5.61,6.43-12.6,14.2-12.6h4v8h-4c-2.68,0-4.46,3.11-7.08,8.24-2.87,5.61-6.43,12.6-14.2,12.6Z"/></svg>
						</button>
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'triangle')" data-active="0" data-value="triangle">
							<svg viewBox="0 0 100 56"><polygon points="18 44.08 12.41 38.36 39.36 11.98 60.65 32.82 82 11.92 87.59 17.64 60.66 44.02 39.36 23.18 18 44.08"/></svg>
						</button>
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'square')" data-active="0" data-value="square">
							<svg viewBox="0 0 100 56"><polygon points="75.29 42.42 46.01 42.42 46.01 21.58 32.71 21.58 32.71 42.42 11.87 42.42 11.87 34.42 24.71 34.42 24.71 13.58 54.01 13.58 54.01 34.42 67.29 34.42 67.29 13.58 88.13 13.58 88.13 21.58 75.29 21.58 75.29 42.42"/></svg>
						</button>
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'sawtooth')" data-active="0" data-value="sawtooth">
							<svg viewBox="0 0 100 56"><polygon points="46.01 45.55 46.01 24.71 14.54 43.92 10.37 37.09 54.01 10.45 54.01 31.29 88.13 10.45 88.13 42.42 80.13 42.42 80.13 24.71 46.01 45.55"/></svg>
						</button>
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'sawtoothreverse')" data-active="0" data-value="sawtoothreverse">
							<svg viewBox="0 0 100 56"><polygon points="53.99 45.55 19.87 24.71 19.87 42.42 11.87 42.42 11.87 10.45 45.99 31.29 45.99 10.45 89.63 37.09 85.46 43.92 53.99 24.71 53.99 45.55"/></svg>
						</button>
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'noise')" data-active="0" data-value="noise">
							<svg viewBox="0 0 100 56"><path d="m54.35,50.22c-5.19,0-6.23-6.99-7.81-17.57-.37-2.51-.9-6.05-1.48-8.73-.16.46-.31.91-.44,1.29-1.32,3.99-2.97,8.96-7.67,8.96-5.04,0-6.31-6.25-7.78-13.5-.19-.94-.43-2.1-.69-3.25-.43,2.33-.83,4.96-1.12,6.93-1.58,10.56-2.62,17.54-7.81,17.54h-8.5v-7h7.14c.86-2.25,1.71-7.98,2.25-11.57,1.58-10.56,2.62-17.54,7.81-17.54s6.31,6.25,7.78,13.5c.33,1.62.79,3.89,1.28,5.69.25-.69.48-1.39.67-1.95,1.32-3.99,2.97-8.96,7.67-8.96,5.19,0,6.23,6.99,7.81,17.57.2,1.35.45,3,.72,4.66.4-2.72.75-5.68,1.04-8.11,1.69-14.13,2.54-21.22,7.82-21.22s6.23,7.01,7.81,17.62c.38,2.53.91,6.1,1.49,8.8.16-.45.3-.89.43-1.27,1.33-3.96,2.97-8.89,7.67-8.89h8.5v7h-7.9c-.54.83-1.21,2.85-1.63,4.11-1.33,3.96-2.97,8.89-7.67,8.89-5.19,0-6.23-7.01-7.81-17.62-.2-1.36-.45-3.02-.72-4.68-.39,2.71-.75,5.66-1.04,8.08-1.7,14.13-2.54,21.22-7.83,21.22Z"/></svg>
						</button>
					</div>
				</section>

				<section class="instrument-axis-section" data-instrument-section="speed">
					<h4 class="instrument-axis-section-label">Speed</h4>
					<div class="instrument-axis-increment">
						<button class="instrument-axis-increment-button" onclick="oscillatorSpeedDown('${axis}');">
							<svg viewBox="0 0 24 24"><path d="M0 9h24v6h-24z"/></svg>
						</button>
						<div class="instrument-axis-increment-display">
							&times;1.0
						</div>
						<button class="instrument-axis-increment-button" onclick="oscillatorSpeedUp('${axis}');">
							<svg viewBox="0 0 24 24"><path d="M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z"/></svg>
						</button>
					</div>
				</section>

				<section class="instrument-axis-section" data-instrument-section="state">
					<h4 class="instrument-axis-section-label">State</h4>
					<div class="instrument-axis-buttons">
						<button class="instrument-axis-button" data-active="0" onclick="oscillatorOff('${axis}');" data-value="false">
							<span>Off</span>
						</button>
						<button class="instrument-axis-button" data-active="1" onclick="oscillatorOn('${axis}');" data-value="true">
							<span>On</span>
						</button>
					</div>
				</section>

				<section class="instrument-axis-section" data-instrument-section="actions">
					<h4 class="instrument-axis-section-label">Actions</h4>
					<div class="instrument-axis-buttons">
						<button class="instrument-axis-button" data-active="0" onclick="oscillatorRando('${axis}');">
							<span>Rando</span>
						</button>
						<button class="instrument-axis-button" data-active="0" onclick="oscillatorReset('${axis}');">
							<span>Reset</span>
						</button>
					</div>
				</section>

				<div class="instrument-axis-label">
					<span class="instrument-axis-label-code">${axis}</span>
					<span class="instrument-axis-label-name">${activeFontAxes[axis]["name"]}</span>
				</div>
			</div>
		`;

		if (oscillatorAxisNumber < activeFontAxesCount-1) {
			oscillatorAxesHTML += `<div class="instrument-axis-divider"></div>`;
		}
		oscillatorAxisNumber++;
	}
	oscillatorAxes.innerHTML = oscillatorAxesHTML;

	// Initialize sliders
	initAxisSliders("oscillator");
	resetAxisSliders("oscillator");

	// Generate text
	generateText("randomsentence");

	// Move instrument in
	setTimeout(() => {
		instrumentOscillator.dataset.position = "center";
		instrumentOscillatorLoop();
	}, 100)
}

function resumeOscillator() {
	instrumentOscillatorLoop();

	// Move instrument in
	setTimeout(() => {
		const instrumentOscillator = document.querySelector('#oscillator');
		instrumentOscillator.dataset.position = "center";
	}, 100)
}

function instrumentOscillatorLoop() {
	if (!instrumentPlaying) {
		return
	}
	let axes = Object.keys(oscillatorSettings);
	let axisNumber = 0;
	let fontVariation = "";
	for (let axis of axes) {
		let axisOscillatorInfo = oscillatorSettings[axis];

		// When locked, set to first axis
		if (oscillatorLock && axisNumber > 0) {
			axisOscillatorInfo["waveform"] = oscillatorSettings[axes[0]]["waveform"];
			axisOscillatorInfo["percent"] = oscillatorSettings[axes[0]]["percent"];
			axisOscillatorInfo["direction"] = oscillatorSettings[axes[0]]["direction"];
		}
		
		let baseFrequency = oscillatorFrequencies[axisNumber%oscillatorFrequencies.length];
		if (axisOscillatorInfo["state"]) {
			if (axisOscillatorInfo["waveform"] == "sine") {
				axisOscillatorInfo["percent"] += (axisOscillatorInfo["speed"])/100 * axisOscillatorInfo["direction"];
				if (axisOscillatorInfo["percent"] >= 1) {
					axisOscillatorInfo["percent"] = 1;
					axisOscillatorInfo["direction"] = axisOscillatorInfo["direction"]*-1;
				} else if (axisOscillatorInfo["percent"] <= 0) {
					axisOscillatorInfo["percent"] = 0;
					axisOscillatorInfo["direction"] = axisOscillatorInfo["direction"]*-1;
				}
				setAxisSlider("oscillator", axis, easeInOutQuad(axisOscillatorInfo["percent"]));
				playMono(baseFrequency+(easeInOutQuad(axisOscillatorInfo["percent"]))*baseFrequency, axisNumber);

				activeFontAxes[axis]["value"] = Math.round(easeInOutQuad(axisOscillatorInfo["percent"])*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]));

			} else if (axisOscillatorInfo["waveform"] == "triangle") {
				axisOscillatorInfo["percent"] += (axisOscillatorInfo["speed"])/100 * axisOscillatorInfo["direction"];
				if (axisOscillatorInfo["percent"] >= 1) {
					axisOscillatorInfo["percent"] = 1;
					axisOscillatorInfo["direction"] = axisOscillatorInfo["direction"]*-1;
				} else if (axisOscillatorInfo["percent"] <= 0) {
					axisOscillatorInfo["percent"] = 0;
					axisOscillatorInfo["direction"] = axisOscillatorInfo["direction"]*-1;
				}
				setAxisSlider("oscillator", axis, axisOscillatorInfo["percent"]);
				playMono(baseFrequency+(axisOscillatorInfo["percent"])*baseFrequency, axisNumber);

				activeFontAxes[axis]["value"] = Math.round(axisOscillatorInfo["percent"]*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]));

			} else if (axisOscillatorInfo["waveform"] == "square") {
				axisOscillatorInfo["percent"] += (axisOscillatorInfo["speed"])/100 * axisOscillatorInfo["direction"];
				if (axisOscillatorInfo["percent"] >= 1) {
					axisOscillatorInfo["percent"] = 1;
					axisOscillatorInfo["direction"] = axisOscillatorInfo["direction"]*-1;
				} else if (axisOscillatorInfo["percent"] <= 0) {
					axisOscillatorInfo["percent"] = 0;
					axisOscillatorInfo["direction"] = axisOscillatorInfo["direction"]*-1;
				}
				setAxisSlider("oscillator", axis, easeInOutExpo(axisOscillatorInfo["percent"]));
				playMono(baseFrequency+(easeInOutExpo(axisOscillatorInfo["percent"]))*baseFrequency, axisNumber);

				activeFontAxes[axis]["value"] = Math.round(easeInOutExpo(axisOscillatorInfo["percent"])*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]));

			} else if (axisOscillatorInfo["waveform"] == "sawtooth") {
				axisOscillatorInfo["percent"] += (axisOscillatorInfo["speed"])/100;
				if (axisOscillatorInfo["percent"] > 1) {
					axisOscillatorInfo["percent"] = 0;
				}
				setAxisSlider("oscillator", axis, axisOscillatorInfo["percent"]);
				playMono(baseFrequency+(axisOscillatorInfo["percent"])*baseFrequency, axisNumber);

				activeFontAxes[axis]["value"] = Math.round(axisOscillatorInfo["percent"]*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]));

			} else if (axisOscillatorInfo["waveform"] == "sawtoothreverse") {
				axisOscillatorInfo["percent"] -= (axisOscillatorInfo["speed"])/100;
				if (axisOscillatorInfo["percent"] < 0) {
					axisOscillatorInfo["percent"] = 1;
				}
				setAxisSlider("oscillator", axis, axisOscillatorInfo["percent"]);
				playMono(baseFrequency+(axisOscillatorInfo["percent"])*baseFrequency, axisNumber);

				activeFontAxes[axis]["value"] = Math.round(axisOscillatorInfo["percent"]*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]));

			} else if (axisOscillatorInfo["waveform"] == "noise") {
				axisOscillatorInfo["percent"] += (axisOscillatorInfo["speed"])/100 * axisOscillatorInfo["direction"];
				if (Math.random()<.25) {
					axisOscillatorInfo["direction"] *= -1;
				}
				if (axisOscillatorInfo["percent"] >= 1) {
					axisOscillatorInfo["percent"] = 1;
					axisOscillatorInfo["direction"] *= -1;
				} else if (axisOscillatorInfo["percent"] <= 0) {
					axisOscillatorInfo["percent"] = 0;
					axisOscillatorInfo["direction"] *= -1;
				}
				setAxisSlider("oscillator", axis, axisOscillatorInfo["percent"]);
				playMono(baseFrequency+(axisOscillatorInfo["percent"])*baseFrequency, axisNumber);

				activeFontAxes[axis]["value"] = Math.round((axisOscillatorInfo["percent"]*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"])));

			}
		}

		fontVariation += `"${axis}" ${activeFontAxes[axis]["value"]}`;
		if (axisNumber < axes.length-1) {
			fontVariation += ", ";
		}
		axisNumber++;
	}

	// Apply styles to display
	const instrumentText = document.querySelector(`#oscillator .instrument-text`);
	instrumentText.style.fontVariationSettings = fontVariation;

	oscillatorLoop = setTimeout(instrumentOscillatorLoop, 17);
}
function easeInOutQuad(x) {
	return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
function easeInOutExpo(x) {
	return x === 0
		? 0
		: x === 1
		? 1
		: x < 0.5 ? Math.pow(2, 20 * x - 10) / 2
		: (2 - Math.pow(2, -20 * x + 10)) / 2;
}	

// Oscillator controls
let oscillatorWaveforms = ["sine", "triangle", "square", "sawtooth", "sawtoothreverse", "noise"];
function oscillatorPickWaveform(axis, waveform) {
	// Change settings
	oscillatorSettings[axis]["waveform"] = waveform;

	oscillatorDisplayValue(axis, "waveform", waveform);
}
function oscillatorSpeedDown(axis) {
	oscillatorSettings[axis]["speed"] = oscillatorSettings[axis]["speed"]-.1;
	if (oscillatorSettings[axis]["speed"] <= .1) {
		oscillatorSettings[axis]["speed"] = .1;
	}
	oscillatorDisplaySpeed(axis);
}
function oscillatorSpeedUp(axis) {
	oscillatorSettings[axis]["speed"] = oscillatorSettings[axis]["speed"]+.1;
	if (oscillatorSettings[axis]["speed"] >= 4) {
		oscillatorSettings[axis]["speed"] = 4;
	}
	oscillatorDisplaySpeed(axis);
}
function oscillatorSetSpeed(axis, value) {
	oscillatorSettings[axis]["speed"] = value;
	oscillatorDisplaySpeed(axis);
}
function oscillatorDisplaySpeed(axis) {
	// Fix floating point rounding
	oscillatorSettings[axis]["speed"] = Math.round(oscillatorSettings[axis]["speed"] * 10) / 10;

	// Display correct speed
	const axisControls = document.querySelector(`#oscillator .instrument-axis[data-axis='${axis}']`);
	const axisControlsSpeed = axisControls.querySelector(`[data-instrument-section="speed"] .instrument-axis-increment-display`);
	if (Number.isInteger(oscillatorSettings[axis]["speed"])) {
		axisControlsSpeed.innerHTML = "&times; "+oscillatorSettings[axis]["speed"]+".0";
	} else {
		axisControlsSpeed.innerHTML = "&times; "+oscillatorSettings[axis]["speed"];
	}
}
function oscillatorOff(axis) {
	oscillatorSettings[axis]["state"] = false;
	oscillatorDisplayValue(axis, "state", "false");
}
function oscillatorOn(axis) {
	oscillatorSettings[axis]["state"] = true;
	oscillatorDisplayValue(axis, "state", "true");
}
function oscillatorRando(axis) {
	oscillatorPickWaveform(axis, oscillatorWaveforms[Math.floor(Math.random()*oscillatorWaveforms.length)]);
	oscillatorSetSpeed(axis, (Math.round((Math.random()*3.9+.1) * 10)) / 10);
}
function oscillatorReset(axis) {
	oscillatorPickWaveform(axis, "sine");
	oscillatorSetSpeed(axis, 1);
}

// Display correct value for button sections
function oscillatorDisplayValue(axis, section, target) {
	const axisControls = document.querySelector(`#oscillator .instrument-axis[data-axis='${axis}']`);
	const axisControlsSection = axisControls.querySelector(`[data-instrument-section="${section}"] .instrument-axis-buttons`);
	for (let button of axisControlsSection.querySelectorAll('.instrument-axis-button')) {
		button.dataset.active = 0;
	}
	let activeButton = axisControlsSection.querySelector(`[data-value="${target}"]`);
	activeButton.dataset.active = 1;
}

// Lock settings together
let oscillatorLock = false;
function oscillatorLockSettings() {
	const oscillatorAxes = document.querySelector(`#oscillator .instrument-axes`);
	const oscillatlorLockToggle = document.querySelector('#oscillator-lock');
	if (oscillatorLock) {
		oscillatorLock = false;
		oscillatlorLockToggle.dataset.active = 0;
		oscillatorAxes.dataset.lock = 0;
	} else {
		oscillatorLock = true;
		oscillatlorLockToggle.dataset.active = 1;
		oscillatorAxes.dataset.lock = 1;
	}
}
function oscillatorLockSettingsOff() {
	const oscillatorAxes = document.querySelector(`#oscillator .instrument-axes`);
	const oscillatlorLockToggle = document.querySelector('#oscillator-lock');
	oscillatorLock = false;
	oscillatlorLockToggle.dataset.active = 0;
	oscillatorAxes.dataset.lock = 0;
}

// —————————————————————————————————————————————————————————————————————
// TEXT GENERATOR
// —————————————————————————————————————————————————————————————————————

// Random sentences
let nouns = ["arrangement", "art", "artwork", "build", "body", "character", "construction", "contour", "design", "drawing", "figure", "font", "form", "formation", "glyph", "graphic", "letter", "letterform", "line", "object", "outline", "piece", "scene", "shape", "sketch", "structure", "subject", "typeface", "typography"];
let verbs = ["adapted", "adjusted", "animated", "altered", "changed", "converted", "diverged", "evolved", "interpolated", "mutated", "reshaped", "reassembled", "reconstructued", "regenerated", "transfigured", "transformed", "transmuted", "translated", "tuned", "turned", "varied"];
let adjectives = ["abstract", "absorbing", "aesthetic", "appealing", "authentic", "balanced", "bold", "clean", "colorful", "contemplative", "creative", "daring", "dazzling", "decorative", "delicate", "dense", "divine", "dramatic", "dynamic", "elegant", "elevated", "emotional", "exquisite", "fluid", "geometric", "gorgeous", "grand", "harmonious", "imaginative", "impassioned", "impeccable", "inspired", "jagged", "lifelike", "light", "maximalist", "minimalist", "moving", "musical", "organic", "ornamental", "pleasing", "polished", "profound", "radiant", "rich", "stunning", "stylish", "sublime", "surreal", "tasteful", "traditional", "tranquil", "unforgettable", "unpredictable", "varied"];
let adverbs = ["abnormally", "awkwardly", "beautifully", "briskly", "calmly", "cleverly", "cooly", "deliberately", "delightfully", "elegantly", "energetically", "excitedly", "frantically", "frightfully", "gently", "gleefully", "hastily", "intensely", "jubilantly", "kookily", "lavishly", "lazily", "lightly", "loudly", "lovingly", "majestically", "naturally", "neatly", "nervously", "noisily", "playfully", "precisely", "punctually", "quickly", "quizzically", "randomly", "rapidly", "repeatedly", "sharply", "shockingly", "sleepily", "slowly", "suddenly", "tenderly", "tremendously", "unexpectedly", "viciously", "warmly", "zestfully"];
let prepositions = ["into", "to", "toward"];
function isVowel(x) {
	let result = x == "a" || x == "e" || x == "i" || x == "o" || x == "u";
	return result;
}
function randomSentence() {
	let noun1 = nouns[Math.floor(Math.random()*nouns.length)];
	let noun2 = nouns[Math.floor(Math.random()*nouns.length)];
	let verb = verbs[Math.floor(Math.random()*verbs.length)];
	let adjective1 = adjectives[Math.floor(Math.random()*adjectives.length)];
	let adjective2 = adjectives[Math.floor(Math.random()*adjectives.length)];
	let article = "a";
	if (isVowel(adjective2.charAt(0)) == true) {
		article = "an";
	}
	let adverb = adverbs[Math.floor(Math.random()*adverbs.length)];
	let preposition = prepositions[Math.floor(Math.random()*prepositions.length)];
	return `The ${adjective1} ${noun1} ${adverb} ${verb} ${preposition} ${article} ${adjective2} ${noun2}`;
};

// Generate random letters
function randomCharacters(quantity) {
	let temp = "";
	for (let i=0; i<quantity; i++) {
		temp += characters[Math.floor(Math.random()*characters.length)];
	}
	return temp;
}

// Generate a whole bunch of the same letter
function repeatedCharacters(quantity) {
	let temp = "";
	let letter = characters[Math.floor(Math.random()*characters.length)];
	for (let i=0; i<quantity; i++) {
		temp += letter;
	}
	return temp;
}

// Generate text
let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
function generateText(textType) {
	const instrumentDisplay = document.querySelector(`#${activeInstrument} .instrument-text`);
	if (textType == "allglyphs") {
		let textTemp = "";
		for (const [key, value] of Object.entries(activeFontData.glyphs.glyphs)) {
			if (value.unicode == undefined || value.unicode == 32) {
				continue
			}
			textTemp += `&#${value.unicode};`;
		}
		instrumentDisplay.innerHTML = textTemp;
	} else if (textType == "lettersnumbers") {
		instrumentDisplay.innerText = characters;
	} else if (textType == "randomsentence") {
		instrumentDisplay.innerText = randomSentence();
	} else if (textType == "randomcharacters") {
		instrumentDisplay.innerText = randomCharacters(Math.round(Math.random()*50+30));
	} else if (textType == "repeatedcharacters") {
		instrumentDisplay.innerText = repeatedCharacters(Math.round(Math.random()*50+30));
	}
}

// ——————————————————————————————————————————
// INSTRUMENTS
// ——————————————————————————————————————————

// Mono synths
let monoSynths = [];
let oscillatorTypes = ["sine", "triangle", "square", "sawtooth"];
let oscillatorFrequencies = [130, 165, 196, 262];
for (let i=0; i<12; i++) {
	monoSynths.push(new Tone.MonoSynth());
	monoSynths[monoSynths.length-1].set({
		oscillator: {
			type: oscillatorTypes[i%4]
		},
		envelope: {
			attack: 0.01,
			decay: 0.01,
			sustain: 1,
			release: 0.05
		},
		portamento: 0.1,
		volume: -18
	}).toDestination();
}
function playMono(freq, synthNumber) {
	monoSynths[synthNumber].triggerAttackRelease(freq, .2);
}

// Piano sampler
const pianoSampler = new Tone.Sampler({
	urls: {
		C1: "piano-c1.mp3",
		C2: "piano-c2.mp3",
		C3: "piano-c3.mp3",
		C4: "piano-c4.mp3",
		C5: "piano-c5.mp3"
	},
	envelope: {
		attack: 0,
		decay: 0.2,
		sustain: 1,
		release: 1
	},
	baseUrl: "assets/audio/piano/",
	volume: 2,
}).toDestination();
function playPiano(sample, duration) {
	pianoSampler.triggerAttackRelease(sample, duration/500);
}

// Synth sampler
const synthSampler = new Tone.Sampler({
	urls: {
		C1: "synth-c1.mp3",
		C2: "synth-c2.mp3",
		C3: "synth-c3.mp3",
		C4: "synth-c4.mp3",
		C5: "synth-c5.mp3"
	},
	envelope: {
		attack: 0,
		decay: 0.2,
		sustain: 1,
		release: 1
	},
	baseUrl: "assets/audio/synth/",
	volume: -8,
}).toDestination();
function playSynth(sample, duration) {
	synthSampler.triggerAttackRelease(sample, duration/500);
}

// Pitched tom sampler
const tomSampler = new Tone.Sampler({
	urls: {
		C1: "tom-c1.mp3",
		C2: "tom-c2.mp3",
		C3: "tom-c3.mp3",
		C4: "tom-c4.mp3",
		C5: "tom-c5.mp3"
	},
	baseUrl: "assets/audio/toms/",
	volume: -3,
}).toDestination();
function playTom(freq) {
	tomSampler.triggerAttackRelease(freq, 1);
}
function playTomRandom() {
	tomSampler.triggerAttackRelease(Math.random()*100+50, 1);
}

// Kick sampler
const kickSampler = new Tone.Sampler({
	urls: {
		C1: "kick-c1.mp3",
		C2: "kick-c2.mp3",
		C3: "kick-c3.mp3",
		C4: "kick-c4.mp3",
		C5: "kick-c5.mp3"
	},
	baseUrl: "assets/audio/kick/",
	volume: 0,
}).toDestination();
function playKick(freq) {
	kickSampler.triggerAttackRelease(freq, 1);
}

// Snare sampler
const snareSampler = new Tone.Sampler({
	urls: {
		C1: "snare-c1.mp3",
		C2: "snare-c2.mp3",
		C3: "snare-c3.mp3",
		C4: "snare-c4.mp3",
		C5: "snare-c5.mp3"
	},
	baseUrl: "assets/audio/snare/",
	volume: 0,
}).toDestination();
function playSnare(freq) {
	snareSampler.triggerAttackRelease(freq, 1);
}

// Hihat sampler
const hihatSampler = new Tone.Sampler({
	urls: {
		C1: "hihat-c1.mp3",
		C2: "hihat-c2.mp3",
		C3: "hihat-c3.mp3",
		C4: "hihat-c4.mp3",
		C5: "hihat-c5.mp3"
	},
	baseUrl: "assets/audio/hihat/",
	volume: 0,
}).toDestination();
function playHihat(freq) {
	hihatSampler.triggerAttackRelease(freq, 1);
}

// Pitched woodblock sampler
const blockSampler = new Tone.Sampler({
	urls: {
		C1: "woodblock-c1.mp3",
		C2: "woodblock-c2.mp3",
		C3: "woodblock-c3.mp3",
		C4: "woodblock-c4.mp3",
		C5: "woodblock-c5.mp3"
	},
	baseUrl: "assets/audio/woodblock/",
	volume: 0,
}).toDestination();
function playBlock(freq) {
	blockSampler.triggerAttackRelease(freq, 1);
}

// Guitar sampler
const guitarSampler = new Tone.Sampler({
	urls: {
		C1: "guitar-c1.mp3",
		C2: "guitar-c2.mp3",
		C3: "guitar-c3.mp3",
		C4: "guitar-c4.mp3",
		C5: "guitar-c5.mp3"
	},
	baseUrl: "assets/audio/guitar/",
	volume: -5,
}).toDestination();
function playGuitar(freq, duration) {
	guitarSampler.triggerAttackRelease(freq, duration/500);
}

// Horn sampler
const hornSampler = new Tone.Sampler({
	urls: {
		C1: "horn-c1.mp3",
		C2: "horn-c2.mp3",
		C3: "horn-c3.mp3",
		C4: "horn-c4.mp3",
		C5: "horn-c5.mp3"
	},
	baseUrl: "assets/audio/horn/",
	volume: -5,
}).toDestination();
function playHorn(freq, duration) {
	hornSampler.triggerAttackRelease(freq, duration/800);
}

// Voice sampler ("Animalese")
let voiceSamplerLetters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z","0","1","2","3","4","5","6","7","8","9"];
let voiceSamplers = {}
for (let letter of voiceSamplerLetters) {
	voiceSamplers[letter] = new Tone.Sampler({
		urls: {
			C2: `voice-${letter}.mp3`
		},
		baseUrl: "assets/audio/newvoice/",
		volume: -10,
	}).toDestination();
}
function playVoice(letter, pitch) {
	letter = letter.toLowerCase();
	if (letter != " " && voiceSamplerLetters.includes(letter)) {
		voiceSamplers[letter].triggerAttackRelease(pitch, 1);
	}
}
let animalese = false;
function toggleAnimalese() {
	const animaleseToggle = document.querySelector("#animalese-toggle");
	if (animalese) {
		animalese = false;
		animaleseToggle.dataset.state = 0;
	} else {
		animalese = true;
		animaleseToggle.dataset.state = 1;
	}
}
document.addEventListener('keypress', typeAnimalese);
function typeAnimalese(e) {
	let letter = e.key.toLowerCase();
	if (voiceSamplerLetters.includes(letter) && animalese) {
		playVoice(letter, Math.random()*100+100);
	}
}

// TODO
// volume controls
// text outline mode
// interface sfx
// fix axis rounding issues
// instrument menu

// WISHLIST
// URL options with font name and instrument name
// linkable credits to student websites, social, etc.

// BUGS
// fonts with a ton of axes like roboto flex not working
// manage volume when multiple oscillator axes used