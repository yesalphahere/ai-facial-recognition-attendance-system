$(document).on('click', '.tab-link', function () {
    const $this = $(this);
    const tabID = $this.data('tab');

    // Activate clicked tab
    $this.addClass('active').siblings().removeClass('active');

    // Activate corresponding tab content
    $('#tab-' + tabID).addClass('active').siblings().removeClass('active');
});
