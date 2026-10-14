// image uploader
function readURL(input) {
    if (input.files && input.files[0]) {
        const reader = new FileReader();

        reader.onload = function(e) {
            const imgPreview = $('#imgPreview');
            imgPreview.css('background-image', `url(${e.target.result})`);
            imgPreview.hide().fadeIn(650);
        };

        reader.readAsDataURL(input.files[0]);
    }
}

$('#imageUpload').on('change', function () {
    readURL(this);
});

//  **------tab js**
$(document).on('click', '.tab-link', function () {
    const tabID = $(this).attr('data-tab');

    $(this).addClass('active').siblings().removeClass('active');

    $('#tab-' + tabID).addClass('active').siblings().removeClass('active');
});

//  **------image js**
GLightbox({
    touchNavigation: true,
    loop: true,
    width: "90vw",
    height: "90vh",
});

//  **-----post js**

const pond= FilePond.create(
    document.querySelector('.filepond-file'),
    {
        labelIdle: `<i class="fa-solid fa-cloud-upload fa-fw fs-4"></i> <div class="filepond--label-action text-decoration-none">Upload Your Files</div>`,
    }
);

FilePond.registerPlugin(FilePondPluginFileValidateType);
FilePond.registerPlugin(FilePondPluginImagePreview);
FilePond.registerPlugin(FilePondPluginFileEncode);
FilePond.registerPlugin(FilePondPluginFileValidateSize);
FilePond.registerPlugin(FilePondPluginImageExifOrientation);

const pondInput = FilePond.create(
    document.querySelector('#id'),
    {
        labelIdle: `<i class="fa-solid fa-cloud-upload fa-fw fs-4"></i> <div class="filepond--label-action text-decoration-none">Upload Your Files</div>`,
    }
);

//  **------post gallery js**
GLightbox({
    touchNavigation: true,
    loop: true,
    width: "90vw",
    height: "90vh",
});


//  **------ slider**
$('.story-container').slick({
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    autoplaySpeed: 1000,
    responsive: [
        {
            breakpoint: 1366,
            settings: {
                slidesToShow: 2
            }
        },
        {
            breakpoint: 992,
            settings: {
                slidesToShow: 4
            }
        },
        {
            breakpoint: 567,
            settings: {
                slidesToShow: 2,
            }
        },
    ]
});

// FollowButton
document.addEventListener("DOMContentLoaded", () => {
    const followButton = document.getElementById("followButton");

    if (!followButton) return;

    followButton.addEventListener("click", () => {
        const currentText = followButton.textContent.trim().toLowerCase();
        const isFollowing = currentText === "follow";

        followButton.innerHTML = isFollowing
            ? '<i class="ti ti-user-check"></i> Following'
            : '<i class="ti ti-user"></i> Follow';

        followButton.classList.toggle("btn-primary", !isFollowing);
        followButton.classList.toggle("btn-success", isFollowing);
    });
});

