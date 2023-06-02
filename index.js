const RollingSkyData = {
	ThemeName: themesdata.themename,
	ThemeData: themesdata.themetextures.data,
	DisplayThemes: [117, 118, 119],
	ThemesList: document.querySelector('#ThemesList'),
	SpriteURL: "WebAssets/Spritesheets/"
}

function GetTheme(num) {
	let theme = RollingSkyData.ThemeData.find((themeObject) => { if (themeObject.id == num) { return true; } });
	return theme;
}

function ClickDownload(num) {
	console.log('下载Theme', num);
	
	zipFiles(num);
}

window.addEventListener('touchmove', () => {
	window.isTouchMoving = true;
	window.isTouchEnded = false;
	window.touchMovedEnd = false;
});
window.addEventListener('touchend', () => {
	if (window.isTouchMoving) {
		window.touchMovedEnd = true;
	}
	window.isTouchMoving = false;
	window.isTouchEnded = true;
});

RollingSkyData.DisplayThemes.forEach((num) => {
	let theme = GetTheme(num);
	
	let listElement = document.createElement('li');
	
	listElement.setAttribute('data-theme', num);
	
	let leftDiv = document.createElement('div');
	let leftDivSpriteDownload = document.createElement('img');
	leftDivSpriteDownload.src = 'WebAssets/Assets/下载.svg';
	leftDiv.appendChild(leftDivSpriteDownload);
	let leftDivSpriteBackground = document.createElement('img');
	leftDivSpriteBackground.src = `${RollingSkyData.SpriteURL}${theme.files.background}.png`;
	leftDiv.appendChild(leftDivSpriteBackground);
	
	const clickEvent = () => {
		if (!window.touchMovedEnd) {
			ClickDownload(num);
		}
	}
	
	leftDiv.addEventListener('click', clickEvent);
	leftDiv.addEventListener('touchend', clickEvent);
	
	let rightDiv = document.createElement('div');
	let rightDivTitle = document.createElement('span');
	rightDivTitle.innerHTML = `${RollingSkyData.ThemeName[num]} <span>${num}</span>`;
	rightDiv.appendChild(rightDivTitle);
	let rightDivImageContainer = document.createElement('div');
	Object.keys(theme.files).forEach((spriteName) => {
		if (spriteName == 'background') {
			return;
		}
		let img = document.createElement('img');
		img.src = `${RollingSkyData.SpriteURL}${theme.files[spriteName]}.png`;
		rightDivImageContainer.appendChild(img);
	});
	rightDiv.appendChild(rightDivImageContainer);
	
	listElement.appendChild(leftDiv);
	listElement.appendChild(rightDiv);
	
	RollingSkyData.ThemesList.appendChild(listElement);
});

String.prototype.hash = function(seed = 0) {
	let str = this;
	let h1 = 0xdeadbeef ^ seed,
	h2 = 0x41c6ce57 ^ seed;
	for (let i = 0, ch; i < str.length; i++) {
		ch = str.charCodeAt(i);
		h1 = Math.imul(h1 ^ ch, 2654435761);
		h2 = Math.imul(h2 ^ ch, 1597334677);
	}

	h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
	h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

	return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

function zipFiles(id) {
	let name = RollingSkyData.ThemeName[id];
	let b = [];
	let c = GetTheme(id).files;
	Object.keys(c).forEach((e) => {
		b.push(c[e]);
	});
	makeZip(b, RollingSkyData.SpriteURL, name);
}

function makeZip(fileNames, directoryPath, zipName) {
	var zip = new JSZip();
	var promises = fileNames.map(f => {
	var fileName = f + '.png';
		return fetch(directoryPath + fileName)
			.then(response => response.blob())
			.then(blob => {
				zip.file(fileName, blob);
			});
	});
	Promise.all(promises)
		.then(() => {
			zip.generateAsync({type:"blob"})
				.then(function(content) {
					saveAs(content, zipName.replaceAll(' ', '_') + '_' + zipName.hash() + ".zip");
				});
		});
}
