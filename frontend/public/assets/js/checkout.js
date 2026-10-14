$(document).on('click', '.checkout-tabs-step .tab', function () {

    const $this = $(this);
    const tab_id = $this.attr('data-tab');

    // Cache the selectors
    const $tabsStep = $('.checkout-tabs-step');
    const $tabsContents = $('.tabs-contents');
    const $tabs = $('.tab');

    try {
        $tabsStep.removeClass('checkout-current-step');
        $tabsContents.removeClass('checkout-current-step');
        $tabs.removeClass('checkout-current-step');

        $this.addClass('checkout-current-step');
        $("#" + tab_id).addClass('checkout-current-step');
    } catch (e) {
        console.error("Error in tab click event:", e);
    }
});
