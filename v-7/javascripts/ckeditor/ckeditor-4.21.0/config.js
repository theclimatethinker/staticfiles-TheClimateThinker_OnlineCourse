
// @license Copyright (c) 2003-2023, CKSource Holding sp. z o.o. All rights reserved.
// For licensing, see https://ckeditor.com/legal/ckeditor-oss-license


CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.skin = 'moono-lisa';
	config.removePlugins = ["newpage", "forms", "save", "spreadsheet",];
	config.extraPlugins = [
		// "allowsave",
		// "autocorrect"
		'image2',
		'balloontoolbar',
		'docprops',
		'embed',
		'embedsemantic',
		'autoembed',
		'ckeditor_wiris'
	];
	config.clipboard_handleImages = false;
	config.filebrowserBrowseUrl = '/ckfinder/?command=QuickUpload';
	config.filebrowserImageBrowseUrl = '/ckfinder/?command=QuickUpload&type=Images';
    // config.filebrowserImageBrowseUrl = '/ckfinder.html?type=Images';
    config.filebrowserUploadUrl = '/ckEditorFileUploader/';
    config.filebrowserImageUploadUrl = '/ckEditorFileUploader/';
	config.uploadUrl = '/ckEditorFileUploader/';
    config.filebrowserWindowWidth = '1000';
    config.filebrowserWindowHeight = '700';

	config.allowedContent = true;
    config.disableNativeSpellChecker = false;

    config.mathJaxLib = '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-AMS_HTML';
	config.embed_provider = '//flickr.com/services/oembed?url={url}&callback={callback}';
	config.autoEmbed_widget = 'embed';
};

var image_modified = false
var image_input;
var image_file;
var current_opened_dialog;
//dialogDefinition is a ckeditor event it's fired when ckeditor dialog instance is called
CKEDITOR.on('dialogDefinition', function (ev) {
	// Take the dialog window name and its definition from the event data.
	var dialogName = ev.data.name;
	var dialogDefinition = ev.data.definition;
	// current_opened_dialog = this.getDialog();
	if (['image', 'image2'].includes(dialogName)) {
		
		// Get a reference to the "Upload" tab.
		var uploadTab = dialogDefinition.getContents('Upload'); // get tab of the dialog 
		// Get the "Choose file" input definition.
		var fileChooserDef = uploadTab.get('upload');
		// Get the "Send it to the Server" button definition, and hide that button.
		var sendButtonDef = uploadTab.get('uploadButton');
		sendButtonDef.label = 'Upload';

		// sendButtonDef.onClick = function(){

		// }

		// When a file is chosen, open the edit modal.
		fileChooserDef.onClick = function(ev){
			image_modified = false;
		}
		fileChooserDef.onChange = function (ev) {
			if (!image_modified){
				var dialog = CKEDITOR.dialog.getCurrent();
				var elements = dialog.getElement()
				var editor = dialog.getParentEditor().name
				var tUrl = this.getDialog().getContentElement('Upload', 'upload'); // Tab, Input/Button
				let iframe_id = this.getElement().find('iframe').getItem(0).getId()
				let iframe = document.getElementById(iframe_id)
				let iframe_innerDoc = iframe.contentDocument || iframe.contentWindow.document;
				let image = $(iframe_innerDoc).find("input[name=upload]").first();
				let image_input_id = $(image).attr('id')
				image_input = iframe_innerDoc.getElementById(image_input_id)
				image_file = image_input.files[0]
				// const reader = new FileReader();
				// reader.readAsDataURL(image_file);
				// reader.addEventListener('load', () => {
				// 	image_url = reader.result
				// 	// image_url = "https://i0.wp.com/www.cssscript.com/wp-content/uploads/2021/10/Powerful-Canvas-Based-Image-Editor-%E2%80%93-tui.image-editor.webp?fit=1225%2C741&ssl=1"
					
				// });
				imageEditor.loadImageFromFile(image_file, image_file.name).then(result => {
					imageEditor.ui.activeMenuEvent()
					console.log('old : ' + result.oldWidth + ', ' + result.oldHeight);
					console.log('new : ' + result.newWidth + ', ' + result.newHeight);
				});
				$("#tui-image-editor-modal").modal('show');
				$(image).val('');
			}

			// Get the "Send it to the Server" button element.
			// var sendButton = this.getDialog().getContentElement('Upload', 'uploadButton');
			// // Simulate clicking that button.
			// sendButton.click();
		};
	}
});

function dataURLtoBlob(dataurl) {
	var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
		bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new Blob([u8arr], { type: mime });
}
$(".tui-image-editor-done-btn").on('click', function(event){
	const imageUrl = imageEditor.toDataURL();
	fileName = imageEditor.getImageName()
	image_blob = dataURLtoBlob(imageUrl)
	let file = new File([image_blob], image_file.name, { type: image_file.type, }); //convert blob formated image to a image file
	let container = new DataTransfer();
	container.items.add(file);
	image_input.files = container.files;
	$("#tui-image-editor-modal").modal('hide');
	image_modified = true;
});