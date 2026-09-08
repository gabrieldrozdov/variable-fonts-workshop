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
function clamp(value, min, max) {
	return Math.min(Math.max(value, min), max);
}

// ——————————————————————————————————
// INTERFACE
// ——————————————————————————————————

// Interface background and colors
function changeBackground() {
	const background = document.querySelector('.background');
	background.style.transform = `scale(${Math.random()*2+.5}, ${Math.random()*2+.5})`;
}
let colors = ['pink', 'green', 'blue', 'yellow', 'purple', 'red'];
shuffle(colors);
let currentColor = 0;
function changePrimaryColor() {
	currentColor++;
	if (currentColor >= colors.length) {
		currentColor = 0;
	}
	const root = document.querySelector('html');
	root.style.setProperty('--primary', `var(--${colors[currentColor]})`);

	for (let backgroundColorToggle of document.querySelectorAll('[data-background-color')) {
		backgroundColorToggle.dataset.state = 0;
	}
	const backgroundColorToggle = document.querySelector(`[data-background-color="${colors[currentColor]}"]`);
	backgroundColorToggle.dataset.state = 1;
}
let backgroundLoop, colorLoop;
function startBackgroundCycle() {
	backgroundLoop = setInterval(changeBackground, 2000);
	colorLoop = setInterval(changePrimaryColor, 2000);
}
function endBackgroundCycle() {
	clearInterval(backgroundLoop);
	clearInterval(colorLoop);
	setColor(colors[currentColor]);
	changeBackground();
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
function randomColor() {
	return `#${Math.floor(Math.random()*16777216).toString(16).padStart(6, "0")}`;
}
function colorLuminance(color) {
	const red = parseInt(color.slice(1,3), 16)/255;
	const green = parseInt(color.slice(3,5), 16)/255;
	const blue = parseInt(color.slice(5,7), 16)/255;
	return .2126*red + .7152*green + .0722*blue;
}
function randomColors() {
	let text = randomColor();
	let display = randomColor();

	// Keep the two far enough apart that the text stays readable
	let attempts = 0;
	while (Math.abs(colorLuminance(text)-colorLuminance(display)) < .35 && attempts < 25) {
		text = randomColor();
		display = randomColor();
		attempts++;
	}

	const textColor = document.querySelector(`#textcolor`);
	textColor.value = text;
	const displayColor = document.querySelector(`#displaycolor`);
	displayColor.value = display;

	displayForegroundColor(text);
	displayBackgroundColor(display);
}
function swapColors() {
	const textColor = document.querySelector(`#textcolor`);
	const displayColor = document.querySelector(`#displaycolor`);

	const swap = textColor.value;
	textColor.value = displayColor.value;
	displayColor.value = swap;

	displayForegroundColor(textColor.value);
	displayBackgroundColor(displayColor.value);
}
function resetColors() {
	const display = document.querySelector(`#${activeInstrument} .instrument-text`);
	display.style.color = "#1a1a1a";
	display.style.backgroundColor = "#fafafa";
	const textColor = document.querySelector(`#textcolor`);
	textColor.value = "#1a1a1a";
	const displayColor = document.querySelector(`#displaycolor`);
	displayColor.value = "#fafafa";
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
		"min": 5,
		"max": 300
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
		slider.addEventListener('touchstart', (e) => {startControlsSlider(slider, slider.dataset.controlsSlider); updateControlsSlider(e);});
	}
}
function setControlsSlider(target, value) {
	const slider = document.querySelector(`[data-controls-slider="${target}"]`);
	if (!slider) {
		return;
	}

	// Normalize and round to appropriate value
	const min = controlsSliders[target]["min"];
	const max = controlsSliders[target]["max"];
	const rounding = controlsSliders[target]["rounding"];
	const range = max-min;
	controlsSliders[target]["value"] = clamp(value, min, max).toFixed(rounding);

	// Update slider element
	const sliderFill = slider.querySelector('.controls-menu-slider-fill');
	sliderFill.style.width = `${((controlsSliders[target]["value"]-min)/range)*100}%`;

	// Update text element
	const sliderValue = slider.querySelector('.controls-menu-slider-value');
	sliderValue.innerText = `${controlsSliders[target]["value"]}`;

	applyControlsSlider(target);
}

// Push a slider’s value out to wherever it actually does something
function applyControlsSlider(target) {
	const value = controlsSliders[target]["value"];
	const units = controlsSliders[target]["units"];
	if (target == "volume") {
		Tone.Destination.volume.value = Tone.gainToDb(value / 100); // convert value to decibels
	} else {
		document.querySelector('body').style.setProperty(`--${target}`, value+units);
	}
}
function resetControlsSliders() {
	for (let slider of document.querySelectorAll('[data-controls-slider]')) {
		const target = slider.dataset.controlsSlider;
		setControlsSlider(target, controlsSliders[target]["default"]);
	}
}
initControlsSliders();
resetControlsSliders();

let activeControlsSlider, activeControlsSliderTarget;
function startControlsSlider(element, target) {
	activeControlsSlider = element;
	activeControlsSliderTarget = target;
	document.addEventListener('mousemove', updateControlsSlider, {passive:false});
	document.addEventListener('mouseup', endControlsSlider);
	document.addEventListener("touchmove", updateControlsSlider, {passive:false});
	document.addEventListener("touchend", endControlsSlider);
}
function updateControlsSlider(e) {
	e.preventDefault();
	let offsets = activeControlsSlider.getBoundingClientRect();

	// Calculate percentage
	let percentFill;
	if (e.touches != null) {
		percentFill = (e.touches[0].clientX-offsets.left)/(offsets.right-offsets.left);
	} else {
		percentFill = (e.clientX-offsets.left)/(offsets.right-offsets.left);
	}
	if (percentFill >= 1) {
		percentFill = 1;
	} else if (percentFill <= 0) {
		percentFill = 0;
	}
	
	// Normalize and round to appropriate value
	const min = controlsSliders[activeControlsSliderTarget]["min"];
	const max = controlsSliders[activeControlsSliderTarget]["max"];
	const rounding = controlsSliders[activeControlsSliderTarget]["rounding"];
	const range = max-min;
	controlsSliders[activeControlsSliderTarget]["value"] = (percentFill*range+min).toFixed(rounding);

	// Update slider element
	const sliderFill = activeControlsSlider.querySelector('.controls-menu-slider-fill');
	sliderFill.style.width = `${percentFill*100}%`;

	// Update text element
	const sliderValue = activeControlsSlider.querySelector('.controls-menu-slider-value');
	sliderValue.innerText = `${controlsSliders[activeControlsSliderTarget]["value"]}`;

	// Apply settings
	if (activeControlsSliderTarget == "volume") {
		disableMute();
	}
	applyControlsSlider(activeControlsSliderTarget);
}
function endControlsSlider() {
	document.removeEventListener('mousemove', updateControlsSlider);
	document.removeEventListener('mouseup', endControlsSlider);
	document.removeEventListener("touchmove", updateControlsSlider);
	document.removeEventListener("touchend", endControlsSlider);
}

// Mute
let muted = false;
function toggleMute() {
	let muteBtn = document.querySelector('[data-controls-toggle="mute"]');
	muted = !muted;
	Tone.Destination.mute = muted;
	if (muted) {
		muteBtn.dataset.state = 1;
	} else {
		muteBtn.dataset.state = 0;
	}
}
function disableMute() {
	muted = false;
	Tone.Destination.mute = false;
	let muteBtn = document.querySelector('[data-controls-toggle="mute"]');
	muteBtn.dataset.state = 0;
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

	// Wait for the font collection, then open whatever the URL asked for
	fontsLoaded.then(async () => {
		const startupFont = fontFromSlug(startupParams.get('font'));
		if (startupFont) {
			await pickFont(startupFont);
		} else {
			await pickRandomFont();
		}
		if (startupParams.get('menu') == "fonts") {
			openMenuFonts();
			closeNav();
			hideControls();
		}
	})
}
setLogoDelays();
setTimeout(introIn, 50);

// ——————————————————————————————————
// FONTS
// ——————————————————————————————————

// Generate font menu
let fontData, fontNames;
const fontsLoaded = fetch('fonts.json')
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

		let itemTransform = '';
		if (window.innerWidth > 800) {
			itemTransform = `translateX(-${Math.round(Math.random()*100+100)}vw) translateY(${Math.round(Math.random()*200-100)}vh) translateZ(0px);`;
		}

		htmlTemp += `
			<div class="menu-fonts-item-transform" style="transform: ${itemTransform}" data-filter="1" data-search="1">
				<button class="menu-fonts-item" style="transform: rotate(${Math.round(Math.random()*20-10)}deg);" data-font="${font}" data-loaded="0" data-designer="${fontInfo["designer"].toLowerCase()}" data-tags ="${fontInfo["tags"]}" data-default="${fontInfo['preview-text']}" onclick="pickFont('${font}'); playPercussion('C2');" onmouseenter="playTomRandom();">
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

// Lazy font loading
// Font files are only downloaded once a menu item is marked as loaded, either
// because it scrolled into view or because the font was opened directly
let menuFontsObserver = new IntersectionObserver((entries) => {
	for (let entry of entries) {
		if (entry.isIntersecting) {
			loadMenuFont(entry.target.dataset.font);
		}
	}
}, {rootMargin: "200px"});
function loadMenuFont(font) {
	const item = document.querySelector(`.menu-fonts-item[data-font="${font}"]`);
	if (!item || parseInt(item.dataset.loaded) == 1) {
		return;
	}
	item.dataset.loaded = 1;
	menuFontsObserver.unobserve(item);
}
function observeMenuFonts() {
	for (let item of document.querySelectorAll('.menu-fonts-item[data-loaded="0"]')) {
		menuFontsObserver.observe(item);
	}
}

// Warm the browser cache for the fonts on either side of the current one,
// so the previous/next arrows in the nav feel instant
let preloadedFonts = [];
function preloadFont(font) {
	if (!fontData[font] || preloadedFonts.includes(font)) {
		return;
	}
	preloadedFonts.push(font);
	fetch(`/assets/fonts/${fontData[font]["file"]}`);
}
function preloadNeighborFonts(font) {
	const currentFontIndex = fontOrder.indexOf(font);
	if (currentFontIndex < 0) {
		return;
	}
	preloadFont(fontOrder[(currentFontIndex+1)%fontOrder.length]);
	preloadFont(fontOrder[(currentFontIndex-1+fontOrder.length)%fontOrder.length]);
}

// Fonts menu
// The open and close animations stagger each item on its own timer, so they have
// to be cancellable — otherwise a close still in flight re-scatters a fresh open
let menuFontsAnimation = [];
function clearMenuFontsAnimation() {
	for (let timeout of menuFontsAnimation) {
		clearTimeout(timeout);
	}
	menuFontsAnimation = [];
}
function openMenuFonts() {
	instrumentPlaying = false;

	const menuFonts = document.querySelector('.menu-fonts');
	menuFonts.dataset.active = 1;

	const instrument = document.querySelector(`#${activeInstrument}`);
	instrument.dataset.position = "right";

	// Animation in
	clearMenuFontsAnimation();
	for (let menuItem of document.querySelectorAll('.menu-fonts-item-transform')) {
		menuFontsAnimation.push(setTimeout(() => {
			menuItem.style.transform = ``;
		}, Math.random()*250))
	}

	// Start loading previews as they come into view
	observeMenuFonts();
	updateURL();
}
function closeMenuFonts() {
	const menuFonts = document.querySelector('.menu-fonts');
	menuFonts.dataset.active = 0;

	// Stop watching for previews to load
	menuFontsObserver.disconnect();
	updateURL();

	// Animation out
	clearMenuFontsAnimation();
	if (window.innerWidth > 800) {
		for (let menuItem of document.querySelectorAll('.menu-fonts-item-transform')) {
			menuFontsAnimation.push(setTimeout(() => {
				menuItem.style.transform = `translateX(-${Math.round(Math.random()*50+50)}vw) translateY(${Math.round(Math.random()*200-100)}vh) translateZ(0px)`;
			}, Math.random()*250))
		}
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
			for (let item of document.querySelectorAll(`[data-designer="${font}"]`)) {
				item.parentElement.style.order = orderNumber;
				orderNumber++;
			}
		}

	} else if (sortingName == "author-") {
		menuSortingDisplay.innerText = `Sort by: Designer Z–A`;
		
		fontOrder = fontOrderDesigners.sort().reverse();
		
		let orderNumber = 0;
		for (let font of fontOrder) {
			for (let item of document.querySelectorAll(`[data-designer="${font}"]`)) {
				item.parentElement.style.order = orderNumber;
				orderNumber++;
			}
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
		if (menuFontsItem.dataset.font.toLowerCase().includes(text) || menuFontsItem.dataset.designer.toLowerCase().includes(text)) {
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
			preview.innerHTML = menuFontsItem.dataset.default;
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
	return pickFont(randomFont);
}
async function pickFont(fontName) {
	userFont = false;

	// Fetch font data and load using Opentype.js
	await loadFontData(await fetch(`/assets/fonts/${fontData[fontName]["file"]}`), fontName);

	// Show this font in the menu and warm up the ones on either side of it
	loadMenuFont(fontName);
	preloadNeighborFonts(fontName);

	changeBackground();
	changePrimaryColor();
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

	// Populate font and credits if included in collection
	const navFontSectionInfo = document.querySelector('#nav-font .nav-section-info');
	if (!userFont) {
		navFontSectionInfo.innerText = `${fontData[activeFont]["name"]} by ${fontData[activeFont]["designer"]}`;
	} else {
		navFontSectionInfo.innerText = `Something you uploaded!`;
	}

	// Build axes object — a static font simply has none
	activeFontAxes = {}; // formatted data
	let fontDataAxes = []; // actual data
	if ("fvar" in activeFontData.tables) {
		fontDataAxes = activeFontData.tables.fvar.axes;
	}
	activeFontAxesCount = fontDataAxes.length;
	for (let axis of fontDataAxes) {
		// Narrow axes need decimal places, or they step instead of sliding
		let axisRange = Math.abs(axis.maxValue-axis.minValue);
		let axisRounding = 0;
		if (axisRange < 10) {
			axisRounding = 2;
		} else if (axisRange < 100) {
			axisRounding = 1;
		}

		activeFontAxes[axis.tag] = {
			"value": axis.defaultValue,
			"min": axis.minValue,
			"max": axis.maxValue,
			"capmin": axis.minValue,
			"capmax": axis.maxValue,
			"range": Math.abs(axis.maxValue-axis.minValue),
			"rounding": axisRounding,
			"default": axis.defaultValue,
			"name": axis.name.en
		}
	}

	buildFontFeatures();
	resetSettings();

	// Show interface
	closeMenuFonts();
	showControls();
	openNav();
	updateURL();

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
// FONT FEATURES
// ——————————————————————————————————

// Shaping and script features that don’t make sense as on/off toggles
let ignoredFontFeatures = ["aalt", "abvf", "abvm", "abvs", "akhn", "blwf", "blwm", "blws", "ccmp", "cfar", "cjct", "curs", "dist", "dtls", "falt", "fin2", "fin3", "fina", "flac", "half", "haln", "init", "isol", "ljmo", "locl", "mark", "med2", "medi", "mkmk", "mset", "nukt", "pref", "pres", "pstf", "psts", "rand", "rclt", "rkrf", "rlig", "rphf", "rtbd", "rtla", "rtlm", "rvrn", "size", "stch", "tjmo", "valt", "vatu", "vert", "vhal", "vjmo", "vkrn", "vpal", "vrt2"];

// Features the browser already switches on by itself
let defaultFontFeatures = ["calt", "clig", "kern", "liga"];

let fontFeatureNames = {
	"afrc": "Alternative Fractions",
	"c2pc": "Petite Caps from Capitals",
	"c2sc": "Small Caps from Capitals",
	"calt": "Contextual Alternates",
	"case": "Case Sensitive Forms",
	"clig": "Contextual Ligatures",
	"cpsp": "Capital Spacing",
	"cswh": "Contextual Swash",
	"dlig": "Discretionary Ligatures",
	"dnom": "Denominators",
	"expt": "Expert Forms",
	"frac": "Fractions",
	"hist": "Historical Forms",
	"hlig": "Historical Ligatures",
	"hwid": "Half Widths",
	"ital": "Italics",
	"kern": "Kerning",
	"liga": "Standard Ligatures",
	"lnum": "Lining Figures",
	"nalt": "Alternate Annotation Forms",
	"onum": "Oldstyle Figures",
	"ordn": "Ordinals",
	"ornm": "Ornaments",
	"pcap": "Petite Caps",
	"pnum": "Proportional Figures",
	"pwid": "Proportional Widths",
	"qwid": "Quarter Widths",
	"ruby": "Ruby Notation Forms",
	"salt": "Stylistic Alternates",
	"sinf": "Scientific Inferiors",
	"smcp": "Small Caps",
	"smpl": "Simplified Forms",
	"subs": "Subscript",
	"sups": "Superscript",
	"swsh": "Swash",
	"titl": "Titling",
	"tnum": "Tabular Figures",
	"trad": "Traditional Forms",
	"twid": "Third Widths",
	"unic": "Unicase",
	"zero": "Slashed Zero"
};
function fontFeatureName(tag) {
	if (tag in fontFeatureNames) {
		return fontFeatureNames[tag];
	}
	if (tag.startsWith("ss")) {
		return `Stylistic Set ${parseInt(tag.slice(2))}`;
	}
	if (tag.startsWith("cv")) {
		return `Character Variant ${parseInt(tag.slice(2))}`;
	}
	return tag.toUpperCase();
}

// Read the features the font actually carries and build a toggle for each
let activeFontFeatures = {};
function buildFontFeatures() {
	activeFontFeatures = {};

	let tags = [];
	for (let table of ["gsub", "gpos"]) {
		const featureTable = activeFontData.tables[table];
		if (!featureTable || !featureTable.features) {
			continue;
		}
		for (let feature of featureTable.features) {
			if (!tags.includes(feature.tag) && !ignoredFontFeatures.includes(feature.tag)) {
				tags.push(feature.tag);
			}
		}
	}
	tags.sort();

	// Plenty of fonts have nothing to offer here, so the section hides itself
	const fontFeatures = document.querySelector('#font-features');
	const fontFeaturesButtons = fontFeatures.querySelector('.instrument-settings-buttons-group');
	if (tags.length == 0) {
		fontFeatures.dataset.active = 0;
		fontFeaturesButtons.innerHTML = "";
		applyFontFeatures();
		return;
	}

	let featuresHTML = "";
	for (let tag of tags) {
		activeFontFeatures[tag] = false;
		featuresHTML += `
			<button class="controls-menu-button" data-font-feature="${tag}" data-state="0" title="${fontFeatureName(tag)}" onclick="toggleFontFeature('${tag}'); playBlockRandom();">
				<span>${tag.toUpperCase()}</span>
			</button>
		`;
	}
	fontFeaturesButtons.innerHTML = featuresHTML;
	fontFeatures.dataset.active = 1;

	resetFontFeatures();
}
function applyFontFeatures() {
	let settings = [];
	for (let tag of Object.keys(activeFontFeatures)) {
		let state = 0;
		if (activeFontFeatures[tag]) {
			state = 1;
		}
		settings.push(`"${tag}" ${state}`);
	}

	const display = document.querySelector(`#${activeInstrument} .instrument-text`);
	display.style.fontFeatureSettings = settings.join(", ");
}
function displayFontFeature(tag) {
	const button = document.querySelector(`[data-font-feature="${tag}"]`);
	if (!button) {
		return;
	}
	if (activeFontFeatures[tag]) {
		button.dataset.state = 1;
	} else {
		button.dataset.state = 0;
	}
}
function toggleFontFeature(tag) {
	activeFontFeatures[tag] = !activeFontFeatures[tag];
	displayFontFeature(tag);
	applyFontFeatures();
}
function resetFontFeatures() {
	for (let tag of Object.keys(activeFontFeatures)) {
		activeFontFeatures[tag] = defaultFontFeatures.includes(tag);
		displayFontFeature(tag);
	}
	applyFontFeatures();
}
function randomizeFontFeatures() {
	for (let tag of Object.keys(activeFontFeatures)) {
		activeFontFeatures[tag] = Math.random() < .5;
		displayFontFeature(tag);
	}
	applyFontFeatures();
}

// ——————————————————————————————————
// SETTINGS ACTIONS
// ——————————————————————————————————
let typographySliders = ["fontsize", "letterspacing", "lineheight"];
let alignments = ["left", "center", "right"];
let capitalizations = ["normal", "uppercase", "lowercase"];

function resetSettings() {
	for (let target of typographySliders) {
		setControlsSlider(target, controlsSliders[target]["default"]);
	}
	setAlignment("center");
	setCapitalization("normal");
	resetColors();
	resetFontFeatures();
}
function randomizeSettings() {
	// Stay out of the last tenth at either end, where the display stops being readable
	for (let target of typographySliders) {
		const min = controlsSliders[target]["min"];
		const max = controlsSliders[target]["max"];
		const range = max-min;
		setControlsSlider(target, Math.random()*range*.8 + min + range*.1);
	}

	setAlignment(alignments[Math.floor(Math.random()*alignments.length)]);
	setCapitalization(capitalizations[Math.floor(Math.random()*capitalizations.length)]);
	randomColors();
	randomizeFontFeatures();
}

// ——————————————————————————————————
// URL PARAMETERS
// ——————————————————————————————————
const startupParams = new URLSearchParams(window.location.search);

// Font names become URL-friendly slugs: "Pixel Pastry" -> "pixel-pastry"
function fontSlug(font) {
	return font.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}
function fontFromSlug(slug) {
	if (!slug) {
		return false;
	}
	slug = fontSlug(slug);
	for (let font of fontNames) {
		if (fontSlug(font) == slug) {
			return font;
		}
	}
	return false;
}

// Keep the address bar in sync so any state can be linked to directly
function updateURL() {
	const url = new URL(window.location);
	const menuFonts = document.querySelector('.menu-fonts');

	if (parseInt(menuFonts.dataset.active) == 1) {
		// The menu isn’t about any one font, so the font drops off the link
		url.searchParams.set('menu', 'fonts');
		url.searchParams.delete('font');
	} else {
		url.searchParams.delete('menu');
		if (activeFont != "" && !userFont) {
			url.searchParams.set('font', fontSlug(activeFont));
		} else {
			url.searchParams.delete('font');
		}
	}

	history.replaceState({}, '', url);
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
// Each slider covers the axis’s full range. The two caps sitting at the top and
// bottom can be dragged inwards to shrink the range the instrument plays with
let axisSliderElements = {};
function initAxisSliders(instrument) {
	const instrumentDOM = document.querySelector(`#${instrument}`);
	let sliders = instrumentDOM.querySelectorAll('[data-axis-slider]');

	axisSliderElements = {};
	for (let slider of sliders) {
		const axis = slider.dataset.axisSlider;

		// Cache the pieces we redraw on every frame
		axisSliderElements[axis] = {
			"slider": slider,
			"fill": slider.querySelector('.instrument-axis-slider-fill'),
			"value": slider.querySelector('.instrument-axis-slider-value'),
			"capmin": slider.querySelector('[data-axis-cap="capmin"]'),
			"capmax": slider.querySelector('[data-axis-cap="capmax"]'),
			"capminValue": slider.querySelector('[data-axis-cap="capmin"] .instrument-axis-slider-cap-value'),
			"capmaxValue": slider.querySelector('[data-axis-cap="capmax"] .instrument-axis-slider-cap-value'),
			"drawn": {}
		}

		slider.addEventListener('mousedown', (e) => {startAxisSlider(slider, axis); updateAxisSlider(e);});
		slider.addEventListener('touchstart', (e) => {startAxisSlider(slider, axis); updateAxisSlider(e);});

		// Caps sit inside the slider, so they stop the drag from reaching it
		for (let cap of slider.querySelectorAll('[data-axis-cap]')) {
			const type = cap.dataset.axisCap;
			cap.addEventListener('mousedown', (e) => {e.stopPropagation(); startAxisCap(slider, axis, type); updateAxisCap(e);});
			cap.addEventListener('touchstart', (e) => {e.stopPropagation(); startAxisCap(slider, axis, type); updateAxisCap(e);});
			cap.addEventListener('dblclick', () => {resetAxisCap(axis, type); playBlock(400);});
		}
	}

	// Set volumes according to number of sliders
	for (let synthType of monoSynths) {
		for (let synth of synthType) {
			synth.volume.value = -24 - sliders.length*1.2;
		}
	}
}
function resetAxisSliders(instrument) {
	for (let axis of Object.keys(axisSliderElements)) {
		activeFontAxes[axis]["value"] = activeFontAxes[axis]["default"];
		displayAxisSlider(axis);
	}
}

// Convert a value into a percentage of an axis’s full range
function axisPercent(axis, value) {
	const range = activeFontAxes[axis]["max"] - activeFontAxes[axis]["min"];
	if (range == 0) {
		return 0;
	}
	return (value - activeFontAxes[axis]["min"]) / range;
}

// Convert a value into a percentage of an axis’s capped range
function axisCappedPercent(axis, value) {
	const range = activeFontAxes[axis]["range"];
	if (range == 0) {
		return 0;
	}
	return (value - Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"])) / range;
}

// Convert a pointer event into a percentage of a slider’s full range
function axisSliderPercent(slider, e) {
	const track = slider.querySelector('.instrument-axis-slider-track');
	const offsets = track.getBoundingClientRect();

	let percent;
	if (e.touches != null) {
		percent = 1-(e.touches[0].clientY-offsets.top)/(offsets.bottom-offsets.top);
	} else {
		percent = 1-(e.clientY-offsets.top)/(offsets.bottom-offsets.top);
	}
	return clamp(percent, 0, 1);
}

// Values are stored at full precision so the animation stays smooth on narrow
// axes — the rounding only ever happens on the way to the screen
function displayAxisValue(axis, value) {
	return Number(value).toFixed(activeFontAxes[axis]["rounding"]);
}

// Draw the current value and the range caps
function displayAxisSlider(axis) {
	const elements = axisSliderElements[axis];
	if (!elements) {
		return;
	}

	const capmin = Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);
	const capmax = Math.max(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);

	// Keep the value inside the capped range
	activeFontAxes[axis]["value"] = clamp(activeFontAxes[axis]["value"], capmin, capmax);

	const percentMin = axisPercent(axis, capmin);
	const percentMax = axisPercent(axis, capmax);
	const percentValue = axisPercent(axis, activeFontAxes[axis]["value"]);

	// Each cap is drawn as its percentage plus its own 2px line, so the fill
	// clears it by another 2px — the gap holds even with the caps wide open
	elements["fill"].style.bottom = `calc(${percentMin*100}% + 4px)`;
	elements["fill"].style.top = `calc(${(1-percentValue)*100}% + 4px)`;
	elements["value"].innerText = displayAxisValue(axis, activeFontAxes[axis]["value"]);

	// Grey out everything above the maximum cap and below the minimum cap, and
	// park the value label halfway between them
	if (elements["drawn"]["capmin"] != capmin || elements["drawn"]["capmax"] != capmax) {
		elements["capmax"].style.height = `calc(${(1-percentMax)*100}% + 2px)`;
		elements["capmaxValue"].innerText = displayAxisValue(axis, capmax);
		elements["capmin"].style.height = `calc(${percentMin*100}% + 2px)`;
		elements["capminValue"].innerText = displayAxisValue(axis, capmin);
		elements["value"].style.top = `${(1-(percentMin+percentMax)/2)*100}%`;
		elements["drawn"]["capmin"] = capmin;
		elements["drawn"]["capmax"] = capmax;
	}
}
function setAxisSlider(instrument, axis, percent) {
	const capmin = Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);
	activeFontAxes[axis]["value"] = percent*activeFontAxes[axis]["range"]+capmin;
	displayAxisSlider(axis);
}

// Dragging the body of a slider sets the value
let activeAxisSlider, activeAxisSliderTarget;
let activeAxisSliderPower = "on";
function startAxisSlider(element, target) {
	activeAxisSlider = element;
	activeAxisSliderTarget = target;

	// Temporarily disable slider. The buttons and the panel stay put, so a
	// running stagger isn’t torn down and rebuilt on every drag
	activeAxisSliderPower = oscillatorSettings[activeAxisSliderTarget]["power"];
	oscillatorSettings[activeAxisSliderTarget]["power"] = "off";

	document.addEventListener('mousemove', updateAxisSlider, {passive:false});
	document.addEventListener('mouseup', endAxisSlider);
	document.addEventListener("touchmove", updateAxisSlider, {passive:false});
	document.addEventListener("touchend", endAxisSlider);
}
function updateAxisSlider(e) {
	e.preventDefault();

	const axis = activeAxisSliderTarget;
	const percentFull = axisSliderPercent(activeAxisSlider, e);
	const capmin = Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);
	const capmax = Math.max(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);
	const fullRange = activeFontAxes[axis]["max"] - activeFontAxes[axis]["min"];

	// The pointer covers the full range, but the value stays inside the caps
	const value = clamp(percentFull*fullRange + activeFontAxes[axis]["min"], capmin, capmax);
	activeFontAxes[axis]["value"] = Number(displayAxisValue(axis, value));
	displayAxisSlider(axis);

	// Per-instrument controls
	if (activeInstrument != "oscillator") {
		return;
	}
	const percentCapped = axisCappedPercent(axis, activeFontAxes[axis]["value"]);
	const percentRaw = oscillatorWaveformPercent(axis, percentCapped);
	oscillatorSettings[axis]["percent"] = percentRaw;

	// With settings locked together, every other axis follows this one
	if (oscillatorLock) {
		for (let other of Object.keys(oscillatorSettings)) {
			if (other == axis) {
				continue;
			}
			setAxisSlider("oscillator", other, percentCapped);
			oscillatorSettings[other]["percent"] = percentRaw;
		}
	}
}
function endAxisSlider() {
	// Reactivate slider if needed
	if (activeAxisSliderPower != "off") {
		oscillatorSettings[activeAxisSliderTarget]["power"] = activeAxisSliderPower;
	}
	
	document.removeEventListener('mousemove', updateAxisSlider);
	document.removeEventListener('mouseup', endAxisSlider);
	document.removeEventListener("touchmove", updateAxisSlider);
	document.removeEventListener("touchend", endAxisSlider);
}

// Dragging a cap shrinks the range the instrument plays with
let activeAxisCapSlider, activeAxisCapTarget, activeAxisCapType;
function startAxisCap(slider, axis, type) {
	activeAxisCapSlider = slider;
	activeAxisCapTarget = axis;
	activeAxisCapType = type;

	document.addEventListener('mousemove', updateAxisCap, {passive:false});
	document.addEventListener('mouseup', endAxisCap);
	document.addEventListener("touchmove", updateAxisCap, {passive:false});
	document.addEventListener("touchend", endAxisCap);
}
function updateAxisCap(e) {
	e.preventDefault();

	const axis = activeAxisCapTarget;
	const track = activeAxisCapSlider.querySelector('.instrument-axis-slider-track');
	const trackHeight = track.getBoundingClientRect().height;
	const percentFull = axisSliderPercent(activeAxisCapSlider, e);
	const fullRange = activeFontAxes[axis]["max"] - activeFontAxes[axis]["min"];
	let value = Number(displayAxisValue(axis, percentFull*fullRange + activeFontAxes[axis]["min"]));

	// Caps always leave 2px of slider showing between their two 2px lines
	let capGap = 0;
	if (trackHeight > 0) {
		capGap = (6/trackHeight)*fullRange;
	}
	if (activeAxisCapType == "capmin") {
		value = clamp(value, activeFontAxes[axis]["min"], Math.max(activeFontAxes[axis]["min"], activeFontAxes[axis]["capmax"]-capGap));
	} else {
		value = clamp(value, Math.min(activeFontAxes[axis]["max"], activeFontAxes[axis]["capmin"]+capGap), activeFontAxes[axis]["max"]);
	}
	activeFontAxes[axis][activeAxisCapType] = value;
	activeFontAxes[axis]["range"] = Math.abs(activeFontAxes[axis]["capmax"]-activeFontAxes[axis]["capmin"]);
	displayAxisSlider(axis);

	// A paused axis keeps its spot in the new range
	if (activeInstrument == "oscillator" && oscillatorSettings[axis]["power"] == "off") {
		oscillatorSettings[axis]["percent"] = axisCappedPercent(axis, activeFontAxes[axis]["value"]);
	}
}
function endAxisCap() {
	document.removeEventListener('mousemove', updateAxisCap);
	document.removeEventListener('mouseup', endAxisCap);
	document.removeEventListener("touchmove", updateAxisCap);
	document.removeEventListener("touchend", endAxisCap);
}

// Double-clicking a cap puts it back to the font’s own limit
function resetAxisCap(axis, type) {
	if (type == "capmin") {
		activeFontAxes[axis]["capmin"] = activeFontAxes[axis]["min"];
	} else {
		activeFontAxes[axis]["capmax"] = activeFontAxes[axis]["max"];
	}
	activeFontAxes[axis]["range"] = Math.abs(activeFontAxes[axis]["capmax"]-activeFontAxes[axis]["capmin"]);
	displayAxisSlider(axis);
}

// ——————————————————————————————————
// MICROPHONE
// ——————————————————————————————————
let micInput, micMeter;
let micReady = false;
let micDecibels = -100;
async function startMic() {
	if (micReady) {
		return true;
	}

	try {
		await Tone.start();
		micInput = new Tone.UserMedia();
		micMeter = new Tone.Meter({smoothing: .8});
		await micInput.open();
		micInput.connect(micMeter);
		micReady = true;
	} catch (err) {
		alert("Couldn’t reach your microphone! Check your browser’s permissions and try again.");
		micInput = undefined;
		micMeter = undefined;
		micReady = false;
	}

	return micReady;
}

let micDirections = ["up", "down"];
let staggerStates = ["off", "on"];

// One reading per frame, shared by every axis
function readMic() {
	if (!micReady) {
		micDecibels = -100;
		return;
	}

	let level = micMeter.getValue();
	if (!Number.isFinite(level)) {
		level = -100;
	}
	micDecibels = level;
}

// Sensitivity is the threshold a sound has to clear before it registers: turn it
// up and quieter sounds start moving the axis. A loud room tops out around -10dB
function micAxisLevel(axis) {
	const floor = -25 - 55*oscillatorSettings[axis]["sensitivity"];
	let level = clamp((micDecibels-floor)/(-10-floor), 0, 1);
	if (oscillatorSettings[axis]["micdirection"] == "down") {
		level = 1-level;
	}
	return level;
}

// ——————————————————————————————————
// STAGGER
// ——————————————————————————————————
// Stagger runs every letter through the axis’s own waveform, each one starting a
// little later than the letter before it
let staggerActive = false;
let staggerLetters = [];
let staggerRebuild;

// A waveform that turns around covers its ground twice per cycle, so its period
// is 2; the sawtooths run straight through and reset, so theirs is 1
function oscillatorWaveformPeriod(waveform) {
	if (waveform == "sawtooth" || waveform == "sawtoothreverse") {
		return 1;
	}
	return 2;
}

// Is this axis handing its letters their own animations?
function oscillatorStaggering(axis) {
	const settings = oscillatorEffective(axis);
	return settings["mode"] == "synth" && settings["stagger"] == "on";
}

function updateStagger() {
	let active = false;
	for (let axis of Object.keys(oscillatorSettings)) {
		if (oscillatorStaggering(axis)) {
			active = true;
		}
	}
	if (active == staggerActive) {
		return;
	}

	staggerActive = active;
	if (staggerActive) {
		buildStaggerText();
	} else {
		flattenStaggerText();
	}
}

// One span per letter, with whitespace left as plain text. Inline spans don’t
// add break opportunities, so words still wrap exactly where they used to
function buildStaggerText() {
	const instrumentText = document.querySelector(`#${activeInstrument} .instrument-text`);
	const text = instrumentText.innerText;
	const caret = getCaretOffset(instrumentText);

	// The display is a flex container, so everything goes inside one item
	const inner = document.createElement('span');
	inner.className = "instrument-text-inner";

	staggerLetters = [];
	for (let character of text) {
		if (character == "\n") {
			inner.appendChild(document.createElement('br'));
			continue;
		}
		if (character == " " || character == "\t") {
			inner.appendChild(document.createTextNode(character));
			continue;
		}

		const letter = document.createElement('span');
		letter.className = "instrument-text-letter";
		letter.textContent = character;
		inner.appendChild(letter);
		staggerLetters.push(letter);
	}

	instrumentText.replaceChildren(inner);
	setCaretOffset(instrumentText, caret);
}
function flattenStaggerText() {
	const instrumentText = document.querySelector(`#${activeInstrument} .instrument-text`);
	const caret = getCaretOffset(instrumentText);

	instrumentText.innerText = instrumentText.innerText;
	staggerLetters = [];

	setCaretOffset(instrumentText, caret);
}

// Whenever the text itself changes underneath us
function refreshStaggerText() {
	if (!staggerActive) {
		return;
	}
	buildStaggerText();
}

// The per-axis settings the letters should follow. Locked axes take theirs from
// the first axis, the same way the loop does
function oscillatorEffective(axis) {
	if (!oscillatorLock) {
		return oscillatorSettings[axis];
	}
	return oscillatorSettings[Object.keys(oscillatorSettings)[0]];
}

// The noise waveform gives every letter its own oscillator, so nothing ties one
// letter to the next
function buildStaggerLetters(settings) {
	let letters = [];
	for (let i=0; i<staggerLetters.length; i++) {
		let direction = 1;
		if (Math.random() < .5) {
			direction = -1;
		}
		letters.push({"percent": Math.random(), "direction": direction});
	}
	settings["letters"] = letters;
}
function advanceStaggerLetters(settings) {
	if (settings["letters"].length != staggerLetters.length) {
		buildStaggerLetters(settings);
	}

	// A paused axis holds every letter where it is
	if (settings["power"] == "off") {
		return;
	}

	for (let letter of settings["letters"]) {
		letter["percent"] += (settings["speed"])/100 * letter["direction"];
		if (Math.random() < .25) {
			letter["direction"] *= -1;
		}
		if (letter["percent"] >= 1) {
			letter["percent"] = 1;
			letter["direction"] *= -1;
		} else if (letter["percent"] <= 0) {
			letter["percent"] = 0;
			letter["direction"] *= -1;
		}
	}
}

// Where one letter sits on the axis. Every letter runs the axis’s whole waveform
// on its own clock, started a step later than the letter before it — so they
// turn around at different moments rather than all at once. Group size is how
// many letters it takes to come back around to the first letter’s animation
function staggerLetterValue(axis, letterNumber) {
	const settings = oscillatorEffective(axis);
	const capmin = Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);

	if (settings["waveform"] == "noise") {
		return settings["letters"][letterNumber]["percent"]*activeFontAxes[axis]["range"] + capmin;
	}

	const period = oscillatorWaveformPeriod(settings["waveform"]);
	let position = (settings["phase"] + letterNumber*period/settings["groupsize"]) % period;
	if (position < 0) {
		position += period;
	}

	if (period == 2) {
		// Up the first half of the cycle and back down the second
		if (position > 1) {
			position = 2-position;
		}
		if (settings["waveform"] == "sine") {
			position = easeInOutQuad(position);
		} else if (settings["waveform"] == "square") {
			position = easeInOutExpo(position);
		}
	} else if (settings["waveform"] == "sawtoothreverse") {
		position = 1-position;
	}

	return position*activeFontAxes[axis]["range"] + capmin;
}

// Paint each letter, running it a little further along the wave than the one before
function applyStaggerVariation() {
	const axes = Object.keys(oscillatorSettings);

	// Move the per-letter oscillators on. Locked axes share one set of settings,
	// so each set only gets advanced once
	let advanced = [];
	for (let axis of axes) {
		const settings = oscillatorEffective(axis);
		if (!oscillatorStaggering(axis) || settings["waveform"] != "noise" || advanced.includes(settings)) {
			continue;
		}
		advanced.push(settings);
		advanceStaggerLetters(settings);
	}

	let letterNumber = 0;
	for (let letter of staggerLetters) {
		let variation = "";
		let axisNumber = 0;
		for (let axis of axes) {
			let value = activeFontAxes[axis]["value"];
			if (oscillatorStaggering(axis)) {
				value = staggerLetterValue(axis, letterNumber);
			}

			variation += `"${axis}" ${value}`;
			if (axisNumber < axes.length-1) {
				variation += ", ";
			}
			axisNumber++;
		}

		letter.style.fontVariationSettings = variation;
		letterNumber++;
	}
}

// Typing rebuilds the spans, so the caret has to be put back where it was
function getCaretOffset(element) {
	const selection = window.getSelection();
	if (!selection.rangeCount || !element.contains(selection.anchorNode)) {
		return false;
	}

	const selected = selection.getRangeAt(0);
	const range = selected.cloneRange();
	range.selectNodeContents(element);
	range.setEnd(selected.endContainer, selected.endOffset);
	return range.toString().length;
}
function setCaretOffset(element, offset) {
	if (offset === false) {
		return;
	}

	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
	const range = document.createRange();
	let counted = 0;
	let node = walker.nextNode();
	let placed = false;
	while (node) {
		if (counted + node.length >= offset) {
			range.setStart(node, offset-counted);
			placed = true;
			break;
		}
		counted += node.length;
		node = walker.nextNode();
	}

	// Nothing to land on, so sit at the very end
	if (!placed) {
		range.selectNodeContents(element);
	}
	range.collapse(!placed);

	const selection = window.getSelection();
	selection.removeAllRanges();
	selection.addRange(range);
}

// Rebuild a moment after typing stops, so every keystroke isn’t a teardown
document.querySelector('#oscillator .instrument-text').addEventListener('input', () => {
	if (!staggerActive) {
		return;
	}
	clearTimeout(staggerRebuild);
	staggerRebuild = setTimeout(buildStaggerText, 300);
});

// ——————————————————————————————————
// OSCILLATOR
// ——————————————————————————————————
let oscillatorSettings = {};
let oscillatorLoop, oscillatorEntrance;
let oscillatorLoopID = 0;
function initializeOscillator() {
	clearTimeout(oscillatorLoop);
	clearTimeout(oscillatorEntrance);
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

	// Hide the whole axes panel for a font that doesn’t vary
	if (activeFontAxesCount > 0) {
		instrumentOscillator.dataset.axes = 1;
	} else {
		instrumentOscillator.dataset.axes = 0;
		instrumentText.style.fontVariationSettings = "";
	}

	// A new font always starts plain
	staggerActive = false;
	staggerLetters = [];

	// Build axes
	const oscillatorAxes = instrumentOscillator.querySelector('.instrument-axes');

	let oscillatorAxesHTML = "";
	let oscillatorAxisNumber = 0;
	oscillatorSettings = {};
	for (let axis of Object.keys(activeFontAxes)) {
		// Build controls
		oscillatorSettings[axis] = {
			"percent": 0,
			"phase": 0, // stagger counts up without turning around, so letters can
			"waveform": "sine",
			"speed": 1,
			"groupsize": 10,
			"sensitivity": .3,
			"micdirection": "up",
			"power": "on",
			"mode": "synth",
			"stagger": "off",
			"direction": 1,
			"letters": [] // one oscillator per letter, for the noise waveform
		}

		// Generate HTML
		oscillatorAxesHTML += `
			<div class="instrument-axis" data-axis="${axis}" data-mode="synth" data-stagger="0">
				<div class="instrument-axis-slider" data-axis-slider="${axis}">
					<div class="instrument-axis-slider-track">
						<div class="instrument-axis-slider-fill"></div>
						<div class="instrument-axis-slider-cap" data-axis-cap="capmax">
							<div class="instrument-axis-slider-cap-value"></div>
						</div>
						<div class="instrument-axis-slider-cap" data-axis-cap="capmin">
							<div class="instrument-axis-slider-cap-value"></div>
						</div>
						<div class="instrument-axis-slider-value"></div>
					</div>
				</div>

				<section class="instrument-axis-section" data-instrument-section="power">
					<h4 class="instrument-axis-section-label">Power</h4>
					<div class="instrument-axis-buttons">
						<button class="instrument-axis-button" data-active="0" onclick="oscillatorSetPower('${axis}', 'off'); playBlock(500);" data-value="off">
							<span>Off</span>
						</button>
						<button class="instrument-axis-button" data-active="1" onclick="oscillatorSetPower('${axis}', 'on'); playBlock(1000);" data-value="on">
							<span>On</span>
						</button>
					</div>
				</section>

				<section class="instrument-axis-section" data-instrument-section="mode">
					<h4 class="instrument-axis-section-label">Mode</h4>
					<div class="instrument-axis-buttons">
						<button class="instrument-axis-button" data-active="1" onclick="oscillatorSetMode('${axis}', 'synth'); playBlock(1000);" data-value="synth">
							<span>Synth</span>
						</button>
						<button class="instrument-axis-button" data-active="0" onclick="oscillatorSetMode('${axis}', 'mic'); playBlock(800);" data-value="mic">
							<span>Mic</span>
						</button>
					</div>
				</section>

				<section class="instrument-axis-section" data-instrument-section="waveform" data-modes="synth">
					<h4 class="instrument-axis-section-label">Waveform</h4>
					<div class="instrument-axis-buttons">
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'sine'); playBlock(450);" data-active="1" data-value="sine">
							<svg viewBox="0 0 100 56"><path d="m60.66,42.42c-7.77,0-11.34-6.99-14.21-12.6-2.62-5.13-4.4-8.24-7.09-8.24s-4.47,3.11-7.09,8.24c-2.87,5.61-6.44,12.6-14.21,12.6h-4v-8h4c2.68,0,4.47-3.11,7.09-8.24,2.87-5.61,6.44-12.6,14.21-12.6s11.34,6.99,14.21,12.6c2.62,5.13,4.4,8.24,7.09,8.24s4.46-3.11,7.08-8.24c2.87-5.61,6.43-12.6,14.2-12.6h4v8h-4c-2.68,0-4.46,3.11-7.08,8.24-2.87,5.61-6.43,12.6-14.2,12.6Z"/></svg>
						</button>
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'triangle'); playBlock(550);" data-active="0" data-value="triangle">
							<svg viewBox="0 0 100 56"><polygon points="18 44.08 12.41 38.36 39.36 11.98 60.65 32.82 82 11.92 87.59 17.64 60.66 44.02 39.36 23.18 18 44.08"/></svg>
						</button>
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'square'); playBlock(650);" data-active="0" data-value="square">
							<svg viewBox="0 0 100 56"><polygon points="75.29 42.42 46.01 42.42 46.01 21.58 32.71 21.58 32.71 42.42 11.87 42.42 11.87 34.42 24.71 34.42 24.71 13.58 54.01 13.58 54.01 34.42 67.29 34.42 67.29 13.58 88.13 13.58 88.13 21.58 75.29 21.58 75.29 42.42"/></svg>
						</button>
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'sawtooth'); playBlock(750);" data-active="0" data-value="sawtooth">
							<svg viewBox="0 0 100 56"><polygon points="46.01 45.55 46.01 24.71 14.54 43.92 10.37 37.09 54.01 10.45 54.01 31.29 88.13 10.45 88.13 42.42 80.13 42.42 80.13 24.71 46.01 45.55"/></svg>
						</button>
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'sawtoothreverse'); playBlock(850);" data-active="0" data-value="sawtoothreverse">
							<svg viewBox="0 0 100 56"><polygon points="53.99 45.55 19.87 24.71 19.87 42.42 11.87 42.42 11.87 10.45 45.99 31.29 45.99 10.45 89.63 37.09 85.46 43.92 53.99 24.71 53.99 45.55"/></svg>
						</button>
						<button class="instrument-axis-button" onclick="oscillatorPickWaveform('${axis}', 'noise'); playBlock(950);" data-active="0" data-value="noise">
							<svg viewBox="0 0 100 56"><path d="m54.35,50.22c-5.19,0-6.23-6.99-7.81-17.57-.37-2.51-.9-6.05-1.48-8.73-.16.46-.31.91-.44,1.29-1.32,3.99-2.97,8.96-7.67,8.96-5.04,0-6.31-6.25-7.78-13.5-.19-.94-.43-2.1-.69-3.25-.43,2.33-.83,4.96-1.12,6.93-1.58,10.56-2.62,17.54-7.81,17.54h-8.5v-7h7.14c.86-2.25,1.71-7.98,2.25-11.57,1.58-10.56,2.62-17.54,7.81-17.54s6.31,6.25,7.78,13.5c.33,1.62.79,3.89,1.28,5.69.25-.69.48-1.39.67-1.95,1.32-3.99,2.97-8.96,7.67-8.96,5.19,0,6.23,6.99,7.81,17.57.2,1.35.45,3,.72,4.66.4-2.72.75-5.68,1.04-8.11,1.69-14.13,2.54-21.22,7.82-21.22s6.23,7.01,7.81,17.62c.38,2.53.91,6.1,1.49,8.8.16-.45.3-.89.43-1.27,1.33-3.96,2.97-8.89,7.67-8.89h8.5v7h-7.9c-.54.83-1.21,2.85-1.63,4.11-1.33,3.96-2.97,8.89-7.67,8.89-5.19,0-6.23-7.01-7.81-17.62-.2-1.36-.45-3.02-.72-4.68-.39,2.71-.75,5.66-1.04,8.08-1.7,14.13-2.54,21.22-7.83,21.22Z"/></svg>
						</button>
					</div>
				</section>

				<section class="instrument-axis-section" data-instrument-section="speed" data-modes="synth">
					<h4 class="instrument-axis-section-label">Speed</h4>
					<div class="instrument-axis-increment">
						<button class="instrument-axis-increment-button" data-axis-increment="speed" data-axis-step="down">
							<svg viewBox="0 0 24 24"><path d="M0 9h24v6h-24z"/></svg>
						</button>
						<div class="instrument-axis-increment-display">
							&times; 1.0
						</div>
						<button class="instrument-axis-increment-button" data-axis-increment="speed" data-axis-step="up">
							<svg viewBox="0 0 24 24"><path d="M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z"/></svg>
						</button>
					</div>
				</section>

				<section class="instrument-axis-section" data-instrument-section="stagger" data-modes="synth">
					<h4 class="instrument-axis-section-label">Stagger</h4>
					<div class="instrument-axis-buttons">
						<button class="instrument-axis-button" data-active="1" onclick="oscillatorSetStagger('${axis}', 'off'); playBlock(500);" data-value="off">
							<span>Off</span>
						</button>
						<button class="instrument-axis-button" data-active="0" onclick="oscillatorSetStagger('${axis}', 'on'); playBlockRandom();" data-value="on">
							<span>On</span>
						</button>
					</div>
				</section>

				<section class="instrument-axis-section" data-instrument-section="groupsize" data-modes="synth">
					<h4 class="instrument-axis-section-label">Group Size</h4>
					<div class="instrument-axis-increment">
						<button class="instrument-axis-increment-button" data-axis-increment="groupsize" data-axis-step="down">
							<svg viewBox="0 0 24 24"><path d="M0 9h24v6h-24z"/></svg>
						</button>
						<div class="instrument-axis-increment-display">
							10
						</div>
						<button class="instrument-axis-increment-button" data-axis-increment="groupsize" data-axis-step="up">
							<svg viewBox="0 0 24 24"><path d="M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z"/></svg>
						</button>
					</div>
				</section>

				<section class="instrument-axis-section" data-instrument-section="direction" data-modes="mic">
					<h4 class="instrument-axis-section-label">Direction</h4>
					<div class="instrument-axis-buttons">
						<button class="instrument-axis-button" onclick="oscillatorPickMicDirection('${axis}', 'up'); playBlock(900);" data-active="1" data-value="up">
							<span>Up</span>
						</button>
						<button class="instrument-axis-button" onclick="oscillatorPickMicDirection('${axis}', 'down'); playBlock(500);" data-active="0" data-value="down">
							<span>Down</span>
						</button>
					</div>
				</section>

				<section class="instrument-axis-section" data-instrument-section="sensitivity" data-modes="mic">
					<h4 class="instrument-axis-section-label">Sensitivity</h4>
					<div class="instrument-axis-increment">
						<button class="instrument-axis-increment-button" data-axis-increment="sensitivity" data-axis-step="down">
							<svg viewBox="0 0 24 24"><path d="M0 9h24v6h-24z"/></svg>
						</button>
						<div class="instrument-axis-increment-display">
							0.3
						</div>
						<button class="instrument-axis-increment-button" data-axis-increment="sensitivity" data-axis-step="up">
							<svg viewBox="0 0 24 24"><path d="M24 9h-9v-9h-6v9h-9v6h9v9h6v-9h9z"/></svg>
						</button>
					</div>
				</section>

				<section class="instrument-axis-section" data-instrument-section="actions">
					<h4 class="instrument-axis-section-label">Actions</h4>
					<div class="instrument-axis-buttons">
						<button class="instrument-axis-button" data-active="0" onclick="oscillatorRando('${axis}'); playBlockRandom();">
							<span>Rando</span>
						</button>
						<button class="instrument-axis-button" data-active="0" onclick="oscillatorReset('${axis}'); playBlock(400);">
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
	initOscillatorIncrements();

	// Generate text
	generateText("randomsentence");

	// Move instrument in, unless the fonts menu is sitting on top of it
	oscillatorEntrance = setTimeout(() => {
		if (parseInt(document.querySelector('.menu-fonts').dataset.active) == 1) {
			return;
		}
		instrumentOscillator.dataset.position = "center";
		instrumentOscillatorLoop();
	}, 100)
}

function resumeOscillator() {
	clearTimeout(oscillatorEntrance);
	instrumentOscillatorLoop();

	// Move instrument in, unless the fonts menu is sitting on top of it
	oscillatorEntrance = setTimeout(() => {
		if (parseInt(document.querySelector('.menu-fonts').dataset.active) == 1) {
			return;
		}
		const instrumentOscillator = document.querySelector('#oscillator');
		instrumentOscillator.dataset.position = "center";
	}, 100)
}

function instrumentOscillatorLoop(loopID = ++oscillatorLoopID) {
	// Only the newest loop keeps running, so switching fonts quickly can’t stack
	// two loops on top of each other and double the speed
	if (!instrumentPlaying || loopID != oscillatorLoopID) {
		return
	}

	// Nothing to animate on a static font
	if (activeFontAxesCount == 0) {
		return
	}

	readMic();
	let axes = Object.keys(oscillatorSettings);
	let axisNumber = 0;
	let fontVariation = "";

	// Snapshot the first axis before anything moves, so locked axes all advance
	// from the same starting point it does
	let lockedFrom = false;
	if (oscillatorLock) {
		lockedFrom = {
			"waveform": oscillatorSettings[axes[0]]["waveform"],
			"percent": oscillatorSettings[axes[0]]["percent"],
			"direction": oscillatorSettings[axes[0]]["direction"],
			"mode": oscillatorSettings[axes[0]]["mode"],
			"power": oscillatorSettings[axes[0]]["power"],
			"stagger": oscillatorSettings[axes[0]]["stagger"],
			"phase": oscillatorSettings[axes[0]]["phase"],
			"groupsize": oscillatorSettings[axes[0]]["groupsize"],
			"micdirection": oscillatorSettings[axes[0]]["micdirection"],
			"sensitivity": oscillatorSettings[axes[0]]["sensitivity"],
			"speed": oscillatorSettings[axes[0]]["speed"]
		};
	}
	for (let axis of axes) {
		let axisOscillatorInfo = oscillatorSettings[axis];

		// When locked, set to first axis
		let backup = [
			axisOscillatorInfo["waveform"],
			axisOscillatorInfo["percent"],
			axisOscillatorInfo["direction"],
			axisOscillatorInfo["mode"],
			axisOscillatorInfo["power"],
			axisOscillatorInfo["stagger"],
			axisOscillatorInfo["phase"],
			axisOscillatorInfo["groupsize"],
			axisOscillatorInfo["micdirection"],
			axisOscillatorInfo["sensitivity"],
			axisOscillatorInfo["speed"]
		]
		if (lockedFrom && axisNumber > 0) {
			for (let setting of Object.keys(lockedFrom)) {
				axisOscillatorInfo[setting] = lockedFrom[setting];
			}
		}
		
		let baseFrequency = oscillatorFrequencies[axisNumber%oscillatorFrequencies.length];
		const axisMode = axisOscillatorInfo["mode"];
		if (axisOscillatorInfo["power"] == "off") {
			// Paused: the axis holds wherever it got to

		} else if (axisMode == "mic") {
			// The mic drives the axis directly — no tone, or it would feed back
			const level = micAxisLevel(axis);
			axisOscillatorInfo["percent"] = level;
			setAxisSlider("oscillator", axis, level);

		} else {
			// Stagger reads off a phase that keeps counting up, so each letter can
			// turn around at its own moment instead of all of them at once
			axisOscillatorInfo["phase"] += (axisOscillatorInfo["speed"])/100;
			if (axisOscillatorInfo["phase"] >= 2) {
				axisOscillatorInfo["phase"] -= 2;
			}

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
				playMono(baseFrequency+(easeInOutQuad(axisOscillatorInfo["percent"]))*baseFrequency, axisNumber, 'sine');

				activeFontAxes[axis]["value"] = easeInOutQuad(axisOscillatorInfo["percent"])*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);

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
				playMono(baseFrequency+(axisOscillatorInfo["percent"])*baseFrequency, axisNumber, 'triangle');

				activeFontAxes[axis]["value"] = axisOscillatorInfo["percent"]*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);

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
				playMono(baseFrequency+(easeInOutExpo(axisOscillatorInfo["percent"]))*baseFrequency, axisNumber, 'square');

				activeFontAxes[axis]["value"] = easeInOutExpo(axisOscillatorInfo["percent"])*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);

			} else if (axisOscillatorInfo["waveform"] == "sawtooth") {
				axisOscillatorInfo["percent"] += (axisOscillatorInfo["speed"])/100;
				if (axisOscillatorInfo["percent"] > 1) {
					axisOscillatorInfo["percent"] = 0;
				}
				setAxisSlider("oscillator", axis, axisOscillatorInfo["percent"]);
				playMono(baseFrequency+(axisOscillatorInfo["percent"])*baseFrequency, axisNumber, 'sawtooth');

				activeFontAxes[axis]["value"] = axisOscillatorInfo["percent"]*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);

			} else if (axisOscillatorInfo["waveform"] == "sawtoothreverse") {
				axisOscillatorInfo["percent"] -= (axisOscillatorInfo["speed"])/100;
				if (axisOscillatorInfo["percent"] < 0) {
					axisOscillatorInfo["percent"] = 1;
				}
				setAxisSlider("oscillator", axis, axisOscillatorInfo["percent"]);
				playMono(baseFrequency+(axisOscillatorInfo["percent"])*baseFrequency, axisNumber, 'sawtooth');

				activeFontAxes[axis]["value"] = axisOscillatorInfo["percent"]*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);

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
				playMono(baseFrequency+(axisOscillatorInfo["percent"])*baseFrequency, axisNumber, synthTypes[Math.floor(Math.random()*synthTypes.length)]);

				activeFontAxes[axis]["value"] = axisOscillatorInfo["percent"]*activeFontAxes[axis]["range"] + Math.min(activeFontAxes[axis]["capmin"], activeFontAxes[axis]["capmax"]);

			}
		}

		// When locked, set to first axis
		if (oscillatorLock && axisNumber > 0) {
			axisOscillatorInfo["waveform"] = backup[0];
			axisOscillatorInfo["percent"] = backup[1];
			axisOscillatorInfo["direction"] = backup[2];
			axisOscillatorInfo["mode"] = backup[3];
			axisOscillatorInfo["power"] = backup[4];
			axisOscillatorInfo["stagger"] = backup[5];
			axisOscillatorInfo["phase"] = backup[6];
			axisOscillatorInfo["groupsize"] = backup[7];
			axisOscillatorInfo["micdirection"] = backup[8];
			axisOscillatorInfo["sensitivity"] = backup[9];
			axisOscillatorInfo["speed"] = backup[10];
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
	if (staggerActive) {
		applyStaggerVariation();
	}

	oscillatorLoop = setTimeout(() => instrumentOscillatorLoop(loopID), 17);
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
function easeInOutQuadInverse(y) {
	if (y < 0.5) {
		return Math.sqrt(y/2);
	}
	return 1 - Math.sqrt((1-y)*2)/2;
}
function easeInOutExpoInverse(y) {
	if (y <= 0) {
		return 0;
	}
	if (y >= 1) {
		return 1;
	}
	if (y < 0.5) {
		return (Math.log2(y*2)+10)/20;
	}
	return (10-Math.log2((1-y)*2))/20;
}

// Sliders show the eased value, but the oscillator counts in raw progress. Going
// backwards through the easing keeps a released slider from jumping
function oscillatorWaveformPercent(axis, percent) {
	const waveform = oscillatorSettings[axis]["waveform"];
	if (waveform == "sine") {
		return clamp(easeInOutQuadInverse(percent), 0, 1);
	} else if (waveform == "square") {
		return clamp(easeInOutExpoInverse(percent), 0, 1);
	}
	return percent;
}	

// Oscillator controls
let oscillatorWaveforms = ["sine", "triangle", "square", "sawtooth", "sawtoothreverse", "noise"];
function oscillatorPickWaveform(axis, waveform) {
	// Change settings
	oscillatorSettings[axis]["waveform"] = waveform;
	oscillatorSettings[axis]["letters"] = []; // reseed the per-letter oscillators

	oscillatorDisplayValue(axis, "waveform", waveform);
}
// Speed and sensitivity are the same sort of control, so they share the machinery
let oscillatorIncrements = {
	"speed": {"step": .1, "min": .1, "max": 5, "rounding": 1, "prefix": "&times; "},
	"sensitivity": {"step": .1, "min": .1, "max": 1, "rounding": 1, "prefix": ""},
	"groupsize": {"step": 1, "min": 2, "max": 20, "rounding": 0, "prefix": ""}
};
function oscillatorSetSetting(axis, setting, value) {
	const limits = oscillatorIncrements[setting];
	oscillatorSettings[axis][setting] = clamp(Number(value.toFixed(limits["rounding"])), limits["min"], limits["max"]);
	oscillatorDisplaySetting(axis, setting);
}
function oscillatorDisplaySetting(axis, setting) {
	const limits = oscillatorIncrements[setting];
	const axisControls = document.querySelector(`#oscillator .instrument-axis[data-axis='${axis}']`);
	const display = axisControls.querySelector(`[data-instrument-section="${setting}"] .instrument-axis-increment-display`);
	if (!display) {
		return;
	}
	display.innerHTML = limits["prefix"] + oscillatorSettings[axis][setting].toFixed(limits["rounding"]);
}
function oscillatorSetSpeed(axis, value) {
	oscillatorSetSetting(axis, "speed", value);
}

// Holding one of the buttons keeps nudging the number along
let oscillatorIncrementDelay, oscillatorIncrementRepeat;
function initOscillatorIncrements() {
	for (let button of document.querySelectorAll('#oscillator [data-axis-increment]')) {
		const axis = button.closest('.instrument-axis').dataset.axis;
		const setting = button.dataset.axisIncrement;
		const direction = button.dataset.axisStep;
		button.addEventListener('mousedown', () => {startOscillatorIncrement(axis, setting, direction);});
		button.addEventListener('touchstart', (e) => {e.preventDefault(); startOscillatorIncrement(axis, setting, direction);});
	}
}
function stepOscillatorIncrement(axis, setting, direction) {
	const before = oscillatorSettings[axis][setting];
	let step = oscillatorIncrements[setting]["step"];
	if (direction == "down") {
		step = -step;
	}
	oscillatorSetSetting(axis, setting, before + step);

	// Only click when the number actually moved, so the floor and ceiling go quiet
	if (oscillatorSettings[axis][setting] != before) {
		if (direction == "up") {
			playBlock(1200);
		} else {
			playBlock(600);
		}
	}
}
function startOscillatorIncrement(axis, setting, direction) {
	endOscillatorIncrement();
	stepOscillatorIncrement(axis, setting, direction);

	// Then keep stepping for as long as the button is held
	oscillatorIncrementDelay = setTimeout(() => {
		oscillatorIncrementRepeat = setInterval(() => {
			stepOscillatorIncrement(axis, setting, direction);
		}, 80);
	}, 400);

	document.addEventListener('mouseup', endOscillatorIncrement);
	document.addEventListener('touchend', endOscillatorIncrement);
}
function endOscillatorIncrement() {
	clearTimeout(oscillatorIncrementDelay);
	clearInterval(oscillatorIncrementRepeat);
	document.removeEventListener('mouseup', endOscillatorIncrement);
	document.removeEventListener('touchend', endOscillatorIncrement);
}

// Which way the mic pushes an axis
function oscillatorPickMicDirection(axis, direction) {
	oscillatorSettings[axis]["micdirection"] = direction;
	oscillatorDisplayValue(axis, "direction", direction);
}

// Power is the play/pause for an axis: everything it was doing stays on screen,
// it just stops moving
function oscillatorSetPower(axis, power) {
	oscillatorSettings[axis]["power"] = power;
	oscillatorDisplayValue(axis, "power", power);
}
function oscillatorOff(axis) {
	oscillatorSetPower(axis, "off");
}
function oscillatorOffAll() {
	for (let axis of Object.keys(activeFontAxes)) {
		oscillatorSetPower(axis, "off");
	}
}
function oscillatorOn(axis) {
	oscillatorSetPower(axis, "on");
}
function oscillatorOnAll() {
	for (let axis of Object.keys(activeFontAxes)) {
		oscillatorSetPower(axis, "on");
	}
}

let oscillatorModes = ["synth", "mic"];
async function oscillatorSetMode(axis, mode) {
	// The mic needs permission before it can do anything
	if (mode == "mic") {
		const ready = await startMic();
		if (!ready) {
			mode = "synth";
		}
	}

	oscillatorSettings[axis]["mode"] = mode;
	oscillatorDisplayValue(axis, "mode", mode);

	// The rest of the axis panel changes with the mode
	const axisControls = document.querySelector(`#oscillator .instrument-axis[data-axis='${axis}']`);
	axisControls.dataset.mode = mode;

	updateStagger();
}

// Stagger hands each letter its own run of the waveform
function oscillatorSetStagger(axis, stagger) {
	oscillatorSettings[axis]["stagger"] = stagger;
	oscillatorDisplayValue(axis, "stagger", stagger);

	const axisControls = document.querySelector(`#oscillator .instrument-axis[data-axis='${axis}']`);
	if (stagger == "on") {
		axisControls.dataset.stagger = 1;
	} else {
		axisControls.dataset.stagger = 0;
	}

	updateStagger();
}
// Rando and Reset take the mode with them. Mic only joins the shuffle once it’s
// already open, so a random press never springs a permission prompt
function oscillatorRando(axis) {
	let modes = ["synth"];
	if (micReady) {
		modes.push("mic");
	}
	oscillatorSetPower(axis, "on");
	oscillatorSetMode(axis, modes[Math.floor(Math.random()*modes.length)]);
	oscillatorSetStagger(axis, staggerStates[Math.floor(Math.random()*staggerStates.length)]);
	oscillatorSetSetting(axis, "groupsize", Math.random()*18 + 2);
	oscillatorPickWaveform(axis, oscillatorWaveforms[Math.floor(Math.random()*oscillatorWaveforms.length)]);
	oscillatorPickMicDirection(axis, micDirections[Math.floor(Math.random()*micDirections.length)]);
	oscillatorSetSpeed(axis, (Math.random()*4.5 + .5));
	oscillatorSetSetting(axis, "sensitivity", Math.random()*.9 + .1);
	oscillatorSettings[axis]["percent"] = Math.random();
	setAxisSlider("oscillator", axis, oscillatorSettings[axis]["percent"]);
}
function oscillatorRandoAll() {
	for (let axis of Object.keys(activeFontAxes)) {
		oscillatorRando(axis);
	}
}
function oscillatorReset(axis) {
	oscillatorSetPower(axis, "on");
	oscillatorSetMode(axis, "synth");
	oscillatorSetStagger(axis, "off");
	oscillatorSetSetting(axis, "groupsize", 10);
	oscillatorPickWaveform(axis, "sine");
	oscillatorPickMicDirection(axis, "up");
	oscillatorSetSpeed(axis, 1);
	oscillatorSetSetting(axis, "sensitivity", .3);
	oscillatorSettings[axis]["percent"] = 0;
	oscillatorSettings[axis]["phase"] = 0;
	setAxisSlider("oscillator", axis, oscillatorSettings[axis]["percent"]);
}
function oscillatorResetAll() {
	for (let axis of Object.keys(activeFontAxes)) {
		oscillatorReset(axis);
	}
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
		instrumentDisplay.innerText = randomCharacters(Math.round(Math.random()*200+30));
	} else if (textType == "repeatedcharacters") {
		instrumentDisplay.innerText = repeatedCharacters(Math.round(Math.random()*200+30));
	}

	refreshStaggerText();
}

// ——————————————————————————————————————————
// INSTRUMENTS
// ——————————————————————————————————————————

// Mono synths
let oscillatorFrequencies = [130, 165, 196, 262];
let sineSynths = [];
let triangleSynths = [];
let squareSynths = [];
let sawtoothSynths = [];
for (let i=0; i<20; i++) {
	sineSynths.push(new Tone.MonoSynth());
	sineSynths[sineSynths.length-1].set({
		oscillator: {
			type: 'sine'
		},
		envelope: {
			attack: 0.01,
			decay: 0.01,
			sustain: 1,
			release: 0.05
		},
		portamento: 0.1,
		volume: -24
	}).toDestination();

	triangleSynths.push(new Tone.MonoSynth());
	triangleSynths[triangleSynths.length-1].set({
		oscillator: {
			type: 'triangle'
		},
		envelope: {
			attack: 0.01,
			decay: 0.01,
			sustain: 1,
			release: 0.05
		},
		portamento: 0.1,
		volume: -24
	}).toDestination();

	squareSynths.push(new Tone.MonoSynth());
	squareSynths[squareSynths.length-1].set({
		oscillator: {
			type: 'square'
		},
		envelope: {
			attack: 0.01,
			decay: 0.01,
			sustain: 1,
			release: 0.05
		},
		portamento: 0.1,
		volume: -24
	}).toDestination();

	sawtoothSynths.push(new Tone.MonoSynth());
	sawtoothSynths[sawtoothSynths.length-1].set({
		oscillator: {
			type: 'sawtooth'
		},
		envelope: {
			attack: 0.01,
			decay: 0.01,
			sustain: 1,
			release: 0.05
		},
		portamento: 0.1,
		volume: -24
	}).toDestination();
}
let synthTypes = ['sine', 'triangle', 'square', 'sawtooth'];
let monoSynths = [
	sineSynths,
	triangleSynths,
	squareSynths,
	sawtoothSynths
]
function playMono(freq, synthNumber, type) {
	if (type == 'sine') {
		sineSynths[synthNumber].triggerAttackRelease(freq, .2);
	} else if (type == "triangle") {
		triangleSynths[synthNumber].triggerAttackRelease(freq, .2);
	} else if (type == "square") {
		squareSynths[synthNumber].triggerAttackRelease(freq, .2);
	} else if (type == 'sawtooth') {
		sawtoothSynths[synthNumber].triggerAttackRelease(freq, .2);
	}
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
	baseUrl: "assets/audio/instruments/",
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
	baseUrl: "assets/audio/instruments/",
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
	baseUrl: "assets/audio/instruments/",
	volume: -12,
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
	baseUrl: "assets/audio/instruments/",
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
	baseUrl: "assets/audio/instruments/",
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
	baseUrl: "assets/audio/instruments/",
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
	baseUrl: "assets/audio/instruments/",
	volume: -5,
}).toDestination();
function playBlock(freq) {
	blockSampler.triggerAttackRelease(freq, 1);
}
function playBlockRandom() {
	blockSampler.triggerAttackRelease(Math.random()*800+400, 1);
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
	baseUrl: "assets/audio/instruments/",
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
	baseUrl: "assets/audio/instruments/",
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
		baseUrl: "assets/audio/voice/",
		volume: -10,
	}).toDestination();
}
function playVoice(letter, pitch) {
	letter = letter.toLowerCase();
	if (letter != " " && voiceSamplerLetters.includes(letter)) {
		voiceSamplers[letter].triggerAttackRelease(pitch, 1);
	}
}
let animalese = true;
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
function triggerAnimalese(input) {
	let letter = input.toLowerCase();
	if (voiceSamplerLetters.includes(letter) && animalese) {
		playVoice(letter, Math.random()*100+100);
	}
}

// Percussion sampler
const percussionSampler = new Tone.Sampler({
	urls: {
		C0: "agogo-low.mp3",
		D0: "agogo-high.mp3",
		E0: "block.mp3",
		F0: "bongo-low.mp3",
		G0: "bongo-high.mp3",
		A0: "cabasa-low.mp3",
		B0: "cabasa-high.mp3",
		C1: "castanet.mp3",
		D1: "chimes.mp3",
		E1: "clap.mp3",
		F1: "conga-low.mp3",
		G1: "conga-high.mp3",
		A1: "cowbell.mp3",
		B1: "crash-low.mp3",
		C2: "crash-mid.mp3",
		D2: "crash-high.mp3",
		E2: "cuica-low.mp3",
		F2: "cuica-high.mp3",
		G2: "drum-low.mp3",
		A2: "drum-high.mp3",
		B2: "gong.mp3",
		C3: "guiro.mp3",
		D3: "guiro-hit.mp3",
		E3: "hat-closed.mp3",
		F3: "hat-open.mp3",
		G3: "jingle.mp3",
		A3: "kick-low.mp3",
		B3: "kick-high.mp3",
		C4: "kick-808.mp3",
		D4: "ride-low.mp3",
		E4: "ride-mid.mp3",
		F4: "ride-high.mp3",
		G4: "rim-low.mp3",
		A4: "rim-high.mp3",
		B4: "rim-ring.mp3",
		C5: "shaker.mp3",
		D5: "snare.mp3",
		E5: "snare-deep.mp3",
		F5: "snare-loose.mp3",
		G5: "snare-808.mp3",
		A5: "spin-down.mp3",
		B5: "spin-up.mp3",
		C6: "sticks.mp3",
		D6: "tambourine.mp3",
		E6: "tom0.mp3",
		F6: "tom1.mp3",
		G6: "tom2.mp3",
		A6: "tom3.mp3",
		B6: "tom4.mp3",
		C7: "tom5.mp3",
		D7: "triangle-muted.mp3",
		E7: "triangle-open.mp3",
		F7: "vibraslap.mp3",
		G7: "whistle-low.mp3",
		A7: "whistle-high.mp3",
		B7: "woodblock-low.mp3",
		C8: "woodblock-high.mp3",
		D8: "woodblock-higher.mp3"
	},
	baseUrl: "assets/audio/percussion/",
	volume: -10,
}).toDestination();
let percussionNotes = ["C0","D0","E0","F0","G0","A0","B0","C1","D1","E1","F1","G1","A1","B1","C2","D2","E2","F2","G2","A2","B2","C3","D3","E3","F3","G3","A3","B3","C4","D4","E4","F4","G4","A4","B4","C5","D5","E5","F5","G5","A5","B5","C6","D6","E6","F6","G6","A6","B6","C7","D7","E7","F7","G7","A7","B7","C8","D8"]
function playPercussion(sample) {
	if (sample == "random") {
		percussionSampler.triggerAttackRelease(percussionNotes[Math.floor(Math.random()*percussionNotes.length)], 1);
	} else {
		percussionSampler.triggerAttackRelease(sample, 1);
	}
}

// TODO
// - add scrambler instrument (or find way to activate via oscillator?)
// - add conversator inside of oscillator instrument