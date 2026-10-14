document.addEventListener("DOMContentLoaded", function () {
    const tabLinks = $(document).find('.tab-link');
    const toggleBtn = document.querySelector('.toggle-btn');
    const closeToggleBtn = document.querySelector('.close-toggle');
    const addEmailButton = document.querySelector('#addEmail');
    const emailBoxModal = $("#emailBox");
    const mailTable = document.querySelector("#tab-1 .mail-table");
    const userName = document.querySelector('#userName');
    const subject = document.querySelector('#subject');
    const status = document.querySelector('#status');

    try {
        tabLinks.on('click', function () {
            const tabID = $(this).attr('data-tab');
            $(this).addClass('active').siblings().removeClass('active');
            $('#tab-' + tabID).addClass('active').siblings().removeClass('active');
        });
    } catch (e) {
        console.error("Tab link binding error:", e);
    }

    try {
        toggleBtn?.addEventListener('click', () => {
            document.querySelector(".mailbox")?.classList.toggle("mailtoggle");
        });

        closeToggleBtn?.addEventListener('click', () => {
            document.querySelector(".mailbox")?.classList.remove("mailtoggle");
        });
    } catch (e) {
        console.error("Toggle button error:", e);
    }

    try {
        document.addEventListener('click', function (e) {
            if (e.target && e.target.classList.contains('star-icon')) {
                e.target.classList.toggle('ti-star');
                e.target.classList.toggle('ti-star-filled');
            }
        });
    } catch (e) {
        console.error("Star toggle error:", e);
    }

    function emailBoxContent() {
        return `
            <div class="mail-box">
                <input class="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1">
                <span class="ms-2 me-2">
                    <i class="ti ti-star text-warning star-icon fs-5"></i>
                </span>
                <div class="flex-grow-1 position-relative">
                    <div class="mail-img h-35 w-35 b-r-50 overflow-hidden text-bg-primary position-absolute mt-1">
                        <img src="../assets/images/avatar/14.png" alt="" class="img-fluid">
                    </div>
                    <div class="mg-s-45">
                        <h6 class="mb-0 f-w-600">${userName?.value || 'Unknown'}</h6>
                        <a href="./read_email.html"><span class="f-s-13 text-secondary">${subject?.value || 'No Subject'}</span></a>
                    </div>
                </div>
                <div>
                    <p class="text-center">Sep 23</p>
                    <span class="badge text-light-success">${status?.value || 'Unread'}</span>
                </div>
                <div>
                    <div class="btn-group dropdown-icon-none">
                        <button class="btn border-0 icon-btn b-r-4 dropdown-toggle" type="button"
                            data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">
                            <i class="ti ti-dots-vertical"></i>
                        </button>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="#"><i class="ti ti-archive"></i> Archive </a></li>
                            <li><a class="dropdown-item" href="#"><i class="ti ti-trash"></i> Delete </a></li>
                            <li><a class="dropdown-item" href="#"><i class="ti ti-mail-opened"></i> Read Mail </a></li>
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }

    function handleAddEmailClick() {
        try {
            const emailContent = emailBoxContent();
            if (mailTable) {
                mailTable.insertAdjacentHTML('afterbegin', emailContent);
            }
            if (emailBoxModal && typeof emailBoxModal.modal === 'function') {
                emailBoxModal.modal("hide");
            }
        } catch (e) {
            console.error("Failed to add email:", e);
        }
    }

    addEmailButton?.removeEventListener('click', handleAddEmailClick);
    addEmailButton?.addEventListener('click', handleAddEmailClick);
});
