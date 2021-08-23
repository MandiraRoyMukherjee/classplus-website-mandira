let editor
let editorData = []
function ckedit(value){

	
	ClassicEditor
			.create( document.querySelector( '#'+value.id ), {
				
				toolbar: {
					items: [
						'heading',
						'|',
						'bold',
						'italic',
						'link',
						'bulletedList',
						'numberedList',
						'|',
						'outdent',
						'indent',
						'|',
						'imageUpload',
						'blockQuote',
						'insertTable',
						'undo',
						'redo',
						'MathType',
						'ChemType',
						'htmlEmbed'
					]
				},
				simpleUpload: {
					uploadUrl: '/postData',
			
			// Enable the XMLHttpRequest.withCredentials property.
			withCredentials: false,
			// headers: {
            //     // 'X-CSRF-TOKEN': 'CSRF-Token',
            //     Authorization: 'Bearer <JSON Web Token>'
            // }
			},
			
				language: 'en',
				image: {
					toolbar: [
						'imageTextAlternative',
						'imageStyle:full',
						'imageStyle:side'
					]
				},
				table: {
					contentToolbar: [
						'tableColumn',
						'tableRow',
						'mergeTableCells'
					]
				},
				licenseKey: '',
				
				
			} )
			.then( newEditor => {
				editor = newEditor;
				
		
				
				
				
		
				
				
				
			} )
			.catch( error => {
				console.error( 'Oops, something went wrong!' );
				console.error( 'Please, report the following error on https://github.com/ckeditor/ckeditor5/issues with the build id and the error stack trace:' );
				console.warn( 'Build id: 7xuexbevwbb-d327242bmkbt' );
				console.error( error );
			} );
			
		}
		
		
		
			// $('#submit').on('click', function(){  
				
			// 	console.log(editorData);
			// })
