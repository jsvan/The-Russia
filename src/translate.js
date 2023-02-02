const DEBUG = true;
const RE_FIND = /(?<!the |a |The |A |\b.*’s |\b.*'s )Russia(?![ns])/g;
const RE_UPPER_THE = /(^|[.!?]\s|["'‘“])the Russia/g;
const ACTIVE_STORAGE_TAG = 'ACTIVE_STORAGE_TAG';


// Was really having trouble with new URL loading new pages not proccing the content script. Nothing worked!
//That is until I found Minj on stackoverflow. Thanks for the code! https://stackoverflow.com/a/34607278

run_if_active();

function run_if_active() {
	console.log("Running if active!")
	return chrome.storage.sync.get([ACTIVE_STORAGE_TAG]).then((response) => {
		console.log("Getting active:")
		console.log(response.ACTIVE_STORAGE_TAG)
		if (response.ACTIVE_STORAGE_TAG) {
			initMO();
		}
	});

}

function initMO(root = document.body) {
	let MO = window.MutationObserver || window.WebKitMutationObserver;
	let observer = new MO(function(mutations) {
		observer.disconnect();
		mutations.forEach(function(mutation){
			let node = mutation.target;
			search(node);
		});
		observe();
	});
	let opts = { characterData: true, childList: true, subtree: true };
	let observe = function() {
		observer.takeRecords();
		observer.observe(root, opts);
	};
	observe();
}

function search(parent = document.body){
    for (parent = parent.firstChild; parent; parent = parent.nextSibling) {
        if (['SCRIPT','STYLE', 'CODE', 'BUTTON', 'META', "NOSCRIPT"].indexOf(parent.tagName) >= 0) {
			continue;
		}
        if (parent.nodeType === Node.TEXT_NODE) {
			edit(parent);
		} else {
			search(parent);
		}
    }
}

function edit(node) {
	let text = node.textContent;
	if (text && text.includes("Russia")) {
		jprint('DOING '+text);
		text = text.replaceAll(RE_FIND, "the Russia");
		text = text.replaceAll(RE_UPPER_THE, "$1The Russia");
		jprint('DID '+text);
		node.textContent = text;
	}
}

function jprint(s) {
	if (DEBUG) {
		console.log(s);
	}
}

