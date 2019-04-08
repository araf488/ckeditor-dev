/* bender-tags: editor */
/* bender-ckeditor-plugins: colordialog,wysiwygarea,toolbar,colorbutton */

( function() {
	'use strict';

	bender.editor = true;

	bender.test( {
		assertColor: function( inputColor, outputColor ) {
			var editor = this.editor;

			editor.once( 'dialogShow', function( evt ) {
				var dialog = evt.data;
				dialog.setValueOf( 'picker', 'selectedColor', inputColor );
				dialog.getButton( 'ok' ).click();

			} );

			editor.getColorFromDialog( function( color ) {
				resume( function() {
					assert.areSame( outputColor, color );
				} );
			} );
			wait();
		},

		'test colordialog add hash to color\'s values with 6 hexadecimal digits': function() {
			this.assertColor( '123456', '#123456' );
		},

		'test colordialog add hash to color\'s values with 3 hexadecimal digits': function() {
			this.assertColor( 'FDE', '#FDE' );
		},

		'test colordialog does not add hash to color value with 1 digit (incorrect css color value)': function() {
			// IE8 doesn't set incorrect values.
			if ( CKEDITOR.env.ie && CKEDITOR.env.version < 9 ) {
				assert.ignore();
			}
			this.assertColor( '1', '1' );
		},

		'test colordialog does not add hash to color name': function() {
			this.assertColor( 'red', 'red' );
		},

		'test colordialog does not add hash to rgb color value': function() {
			this.assertColor( 'rgb(10, 20, 30)', 'rgb(10, 20, 30)' );
		},

		'test colordialog does not add hash to empty value ': function() {
			this.assertColor( '', '' );
		},

		// (#2639)
		'test colordialog setting current text color on opening': function() {
			var editor = this.editor,
				bot = this.editorBot,
				txtColorBtn = editor.ui.get( 'TextColor' ),
				textColor = '#ff0000';

			bot.setHtmlWithSelection( '[<h1 style="color:' + textColor + '">Foo</h1>]' );
			editor.once( 'dialogShow', function( evt ) {
				resume( function() {
					var dialog = evt.data,
						test = dialog.getValueOf( 'picker', 'selectedColor' );
					dialog.getButton( 'ok' ).click();
					assert.areSame( textColor, test );
				} );
			} );

			txtColorBtn.click( editor );
			openColorDialog( txtColorBtn );
		},

		'test colordialog setting current background color on opening': function() {
			var editor = this.editor,
				bot = this.editorBot,
				bgColorBtn = editor.ui.get( 'BGColor' ),
				backgroundColor = '#0000ff';

			bot.setHtmlWithSelection( '[<h1 style="background:' + backgroundColor + '">Foo</h1>]' );
			editor.once( 'dialogShow', function( evt ) {
				resume( function() {
					var dialog = evt.data,
						test = dialog.getValueOf( 'picker', 'selectedColor' );
					dialog.getButton( 'ok' ).click();
					assert.areSame( backgroundColor, test );
				} );
			} );

			bgColorBtn.click( editor );
			openColorDialog( bgColorBtn );
		},

		'test omitting default text color': function() {
			var editor = this.editor,
				bot = this.editorBot,
				txtColorBtn = editor.ui.get( 'TextColor' );

			bot.setHtmlWithSelection( '[<h1>Foo</h1>]' );
			editor.once( 'dialogShow', function( evt ) {
				resume( function() {
					var dialog = evt.data,
						test = dialog.getValueOf( 'picker', 'selectedColor' );
					dialog.getButton( 'ok' ).click();
					assert.areSame( '', test );
				} );
			} );

			txtColorBtn.click( editor );
			openColorDialog( txtColorBtn );
		},

		'test omitting default background color': function() {
			var editor = this.editor,
				bot = this.editorBot,
				bgColorBtn = editor.ui.get( 'BGColor' );

			bot.setHtmlWithSelection( '[<h1>Foo</h1>]' );
			editor.once( 'dialogShow', function( evt ) {
				resume( function() {
					var dialog = evt.data,
						test = dialog.getValueOf( 'picker', 'selectedColor' );
					dialog.getButton( 'ok' ).click();
					assert.areSame( '', test );
				} );
			} );

			bgColorBtn.click( editor );
			openColorDialog( bgColorBtn );
		}
	} );

	function openColorDialog( button ) {
		setTimeout( function() {
			button._.panel.getBlock( button._.id ).element.findOne( '.cke_colormore' ).$.click();
		}, 0 );

		wait();
	}

} )();
