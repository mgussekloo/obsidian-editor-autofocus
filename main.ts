import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';

// Remember to rename these classes and interfaces!

interface EditorAutofocusSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: EditorAutofocusSettings = {
	mySetting: 'default'
}

export default class EditorAutofocus extends Plugin {
	settings: EditorAutofocusSettings;

	async onload() {
		await this.loadSettings();

	 	this.registerEvent(
	      this.app.workspace.on('file-open', async (file) => {
	      	let editor = this.getEditor();
	      	if (editor) {
	      		// if we have more than two lines, it's probably not a new file. just bail.
	      		if (editor.lineCount() > 2) {
	      			return
	      		}

	      		// focus on the editor, skip the tab title bar
	        	editor.focus();

	        	// wait a while, so obsidian filename heading sync can do its thing
	      		await this.delay(100);

	      		// select the heading inserted by filename heading sync
	        	let lastCh = editor.getLine(0).length;
	        	if (lastCh > 1) {
		        	editor.setSelection(
						{ line: 0, ch: 2 },
						{ line: 0, ch: lastCh }
					);
	        	}
	        }
    	  })
	    );
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	private getEditor(): Editor | undefined {
		return this.app.workspace.getActiveViewOfType(MarkdownView)?.editor;
	}

	private delay(ms: number): Promise<void> {
	    return new Promise((resolve) => setTimeout(resolve, ms));
	}
}
