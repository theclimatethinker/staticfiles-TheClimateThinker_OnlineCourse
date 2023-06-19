
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
		'ckeditor_wiris',
	];
	config.clipboard_handleImages = false;
	// config.filebrowserBrowseUrl = '/ckfinder/?command=QuickUpload';
	// config.filebrowserImageBrowseUrl = '/ckfinder/?command=QuickUpload&type=Images';
    config.filebrowserUploadUrl = '/ckEditorFileUploader/';
    config.filebrowserImageUploadUrl = '/ckEditorFileUploader/';
	config.uploadUrl = '/ckEditorFileUploader/';
    config.filebrowserWindowWidth = '100';
    config.filebrowserWindowHeight = '100';

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

// CKEDITOR.on('fileUploadResponse', function (evt) {
// 	// Prevent the default response handler.
// 	evt.stop();

// 	// Get XHR and response.
// 	var data = evt.data,
// 		xhr = data.fileLoader.xhr,
// 		response = xhr.responseText.split('|');
// 	console.log(data)
// 	if (response[1]) {
// 		// An error occurred during upload.
// 		data.message = response[1];
// 		evt.cancel();
// 	} else {
// 		data.url = response[0];
// 	}
// });

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
		var uploadButton = uploadTab.get('uploadButton');
		uploadButton.label = 'Upload';
		// When a file is chosen, open the edit modal.
		fileChooserDef.onClick = function(ev){
			image_modified = false;
		}
		var upload_iframe_innerDoc;
		fileChooserDef.onChange = function (ev) {
			if (!image_modified){
				// var dialog = CKEDITOR.dialog.getCurrent();
				// var elements = dialog.getElement()
				// var editor = dialog.getParentEditor().name
				// var tUrl = this.getDialog().getContentElement('Upload', 'upload'); // Tab, Input/Button
				let iframe_id = this.getElement().find('iframe.cke_dialog_ui_input_file').getItem(0).getId()
				let iframe = document.getElementById(iframe_id)
				upload_iframe_innerDoc = iframe.contentDocument || iframe.contentWindow.document;
				let image = $(upload_iframe_innerDoc).find("input[name=upload]").first();
				let image_input_id = $(image).attr('id')
				image_input = upload_iframe_innerDoc.getElementById(image_input_id)
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


		// var uploadForm = $(upload_iframe_innerDoc).find("form").first()[0];
		// var theForm = new FormData(uploadForm);
		// uploadButton.onClick = function(e){
		// 	var dialog_event_instance = this;
		// 	input_field = dialog_event_instance.getDialog().getValueOf('Upload', 'upload');
		// 	if(input_field.length > 0){
		// 		uploadButton.label = 'Uploading';
		// 		var csrf = $('input[name=csrfmiddlewaretoken]').val();
		// 		theForm.append('csrfmiddlewaretoken', csrf);
		// 		$.ajax({
		// 			type: 'POST',
		// 			url: $(uploadForm).attr('action'),
		// 			data: theForm,
		// 			contentType: false,
		// 			processData: false,
		// 			dataType: 'json',
		// 			cache: false,
		// 			success: function (response) {
		// 				uploadButton.label = 'Upload';
		// 				if (response.uploaded == 1){
		// 					dialog_event_instance.getDialog().setValueOf('info', 'src', response.url);
		// 					dialog_event_instance.getDialog().selectPage('info');
		// 				}
		// 				else{
		// 					error_msg = response.error.message;
		// 					alert(error_msg);
		// 				}
		// 			},
		// 			error: function (response) {
		// 				uploadButton.label = 'Upload';
		// 				alert("Image upload failed! Try again.");
		// 			}
		// 		});
		// 	}
		// }
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