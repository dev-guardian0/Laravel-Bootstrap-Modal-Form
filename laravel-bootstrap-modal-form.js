$('document').ready(function() {

	// Prepare reset.
	function resetModalFormErrors() {
		$('.form-group').removeClass('has-error');
		$('.form-group').find('.help-block').remove();
	}

	// Intercept submit.
	$('form.bootstrap-modal-form').on('submit', function() {
		
		// Set vars.
		var form = $(this),
		    url = form.attr('action'),
		    data = form.serialize();
		    submit = form.find('[type=submit]');

		// Please wait.
		if (submit.is('button')) {
			var submitOriginal = submit.html();
			submit.html('Please wait...');
		} else if (submit.is('input')) {
			var submitOriginal = submit.val();
			submit.val('Please wait...');
		}

		// Request.
		$.ajax({
			type: "POST",
			url: url,
			data: data,
			dataType: 'json'

		// Response.
		}).always(function(response, status) {

			// Reset errors.
			resetModalFormErrors();

			// Check for errors.
			if (response.status == 422) {
				var errors = $.parseJSON(response.responseText);
				
				// Iterate through errors object.
				$.each(errors, function(field, message) {
					var formGroup = $('[name='+field+']', form).closest('.form-group');
					formGroup.addClass('has-error').append('<p class="help-block">'+message+'</div>');
				});

				// Reset submit.
				if (submit.is('button')) {
					submit.html(submitOriginal);
				} else if (submit.is('input')) {
					submit.val(submitOriginal);
				}

			// If successful, reload.
			} else {
				location.reload();
			}

		});

		// Return false to prevent the page from being reloaded.
		return false;
		
	});
	
	// Reset errors when opening modal.
	$('.bootstrap-modal-form-open').click(function() {
		resetModalFormErrors();
	});

});