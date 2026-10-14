jQuery(document).ready(function () {

    // **------ click on next button **
    jQuery(document).off('click', '.next-btn').on('click', '.next-btn', function () {
        const $btn = jQuery(this);
        const $formWizard = $btn.parents('.form-wizard');
        const $parentFieldset = $btn.parents('.wizard-fieldset');
        const $currentActiveStep = $formWizard.find('.form-wizard-steps .active');
        const $currentActiveSteps = $formWizard.find('.vertica-wizard-steps .active');
        let nextWizardStep = true;

        $parentFieldset.find('.wizard-required').each(function () {
            const $input = jQuery(this);
            const value = $input.val();
            const $error = $input.siblings(".wizard-form-error");

            if (!value) {
                $error.slideDown();
                nextWizardStep = false;
            } else {
                $error.slideUp();
            }
        });

        if (nextWizardStep) {
            $parentFieldset.removeClass("show");
            $parentFieldset.next('.wizard-fieldset').addClass("show");

            $currentActiveStep.removeClass('active').addClass('activated').next().addClass('active');
            $currentActiveSteps.removeClass('active').addClass('activated').next().addClass('active');

            jQuery('.wizard-fieldset.show').each(function () {
                const $fieldset = jQuery(this);
                const formAttr = $fieldset.attr('data-tab-content');

                jQuery('.form-wizard-steps .form-wizard-step-item').each(function () {
                    const $stepItem = jQuery(this);
                    const isCurrent = $stepItem.attr('data-attr') === formAttr;
                    $stepItem.toggleClass('active', isCurrent);

                    if (isCurrent) {
                        try {
                            const width = $stepItem.innerWidth();
                            const pos = $stepItem.position();
                            jQuery('.form-wizard-step-move').css({ left: pos.left, width });
                        } catch (err) {
                            console.warn("Positioning error:", err);
                        }
                    }
                });
            });
        }
    });

    // **------ click on previous button **
    jQuery(document).off('click', '.pre-btn').on('click', '.pre-btn', function () {
        const $btn = jQuery(this);
        const $formWizard = $btn.parents('.form-wizard');
        const $parentFieldset = $btn.parents('.wizard-fieldset');
        const $currentActiveStep = $formWizard.find('.form-wizard-steps .active');
        const $currentActiveSteps = $formWizard.find('.vertica-wizard-steps .active');

        $parentFieldset.removeClass("show");
        $parentFieldset.prev('.wizard-fieldset').addClass("show");

        $currentActiveStep.removeClass('active').prev().removeClass('activated').addClass('active');
        $currentActiveSteps.removeClass('active').prev().removeClass('activated').addClass('active');

        jQuery('.wizard-fieldset.show').each(function () {
            const $fieldset = jQuery(this);
            const formAttr = $fieldset.attr('data-tab-content');

            jQuery('.form-wizard-steps .form-wizard-step-item').each(function () {
                const $stepItem = jQuery(this);
                const isCurrent = $stepItem.attr('data-attr') === formAttr;
                $stepItem.toggleClass('active', isCurrent);

                if (isCurrent) {
                    try {
                        const width = $stepItem.innerWidth();
                        const pos = $stepItem.position();
                        jQuery('.form-wizard-step-move').css({ left: pos.left, width });
                    } catch (err) {
                        console.warn("Positioning error:", err);
                    }
                }
            });
        });
    });

    // **------ click on form submit button **
    jQuery(document).off('click', '.form-wizard .form-wizard-submit').on('click', '.form-wizard .form-wizard-submit', function () {
        const $parentFieldset = jQuery(this).parents('.wizard-fieldset');

        $parentFieldset.find('.wizard-required').each(function () {
            const $input = jQuery(this);
            const $error = $input.siblings(".wizard-form-error");

            if (!$input.val()) {
                $error.slideDown();
            } else {
                $error.slideUp();
            }
        });
    });

    // **------ input focus and blur **
    jQuery(document).off('focus blur', '.form-control').on('focus blur', '.form-control', function (e) {
        const $input = jQuery(this);
        const value = $input.val();
        const $parent = $input.parent();
        const $error = $input.siblings('.wizard-form-error');

        if (e.type === 'focus' || value !== '') {
            $parent.addClass("focus-input");
            $error.slideUp(300);
        } else {
            $parent.removeClass("focus-input");
            $error.slideDown(300);
        }
    });
});
