// bootstrap-ckeditor-modal-fix.js
// hack to fix ckeditor/bootstrap compatiability bug when ckeditor appears in a bootstrap modal dialog
//
// Include this AFTER both bootstrap and ckeditor are loaded.

// $.fn.modal.Constructor.prototype.enforceFocus = function() {
//     modal_this = this
//     $(document).on('focusin.modal', function (e) {
//       if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length 
//       && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') 
//       && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
//         modal_this.$element.focus()
//       }
//     })
//   };


// bootstrap-ckeditor-modal-fix.js
// hack to fix ckeditor/bootstrap compatiability bug when ckeditor appears in a bootstrap modal dialog
//
// Include this AFTER both jQuery and bootstrap are loaded.

// $.fn.modal.Constructor.prototype.enforceFocus = function() {
//     modal_this = this
//     $(document).on('focusin.modal', function (e) {
//       if (modal_this.$element[0] !== e.target && !modal_this.$element.has(e.target).length 
//       // add whatever conditions you need here:
//       && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_select') && !$(e.target.parentNode).hasClass('cke_dialog_ui_input_text')) {
//         modal_this.$element.focus()
//       }
//     })
//   };

// CKEDITOR.bootstrapModalFix = function (modal, $) {
//     modal.on('shown', function () {
//       var that = $(this).data('modal');
//       $(document)
//         .off('focusin.modal')
//         .on('focusin.modal', function (e) {
//           // Add this line
//           if( e.target.className && e.target.className.indexOf('cke_') == 0 ) return;
  
//           // Original
//           if (that.$element[0] !== e.target && !that.$element.has(e.target).length) {
//             that.$element.focus()
//           }
//         });
//     });
//   };

//   CKEDITOR.bootstrapModalFix( $('.modal'), $ )