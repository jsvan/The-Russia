/**
 * Unrelated:
 * If chrome extension page Error page is blank, insert this into console:
 * URL=class extends URL { constructor(href, ...rest) { super(href || 'dummy://', ...rest) } }
 */
const ACTIVE_STORAGE_TAG = 'ACTIVE_STORAGE_TAG';
chrome.runtime.onInstalled.addListener(function (rsn) {
	console.log("Set active")
	chrome.storage.sync.set({ACTIVE_STORAGE_TAG:true}, () => {});
})
