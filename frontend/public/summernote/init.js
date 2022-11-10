console.log('loaded')

window.addEventListener('load', () => {

    jQuery('#summernote').summernote({
        placeholder: 'Hello stand alone ui',
        tabsize: 2,
        height: 120,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['table', ['table']],
            ['insert', ['link', 'picture', 'video']],
            ['view', ['fullscreen', 'codeview', 'help']]
        ],
        callbacks: {
            onChange: function (contents, $editable) {
                jQuery('#inp_content').html(contents)
            }
        }
    });

    //get the code
    // jQuery('#inp_content').html(jQuery('#summernote').summernote('code'))
})