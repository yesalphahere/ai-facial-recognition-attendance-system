const toastClose = () => {
    $(".app-toast").addClass('d-block');
}

$(".toast-close").on('click', function () {
  toastClose();
});

const handleToast = (ele) => {
  $("." + ele.id).removeClass('d-none');
  setTimeout(function () {
      $("." + ele.id).addClass("d-none");
  }, 5000);
}

//  **------close-button**
const toastBtn = document.getElementById("toastBtn");

if (toastBtn) {
    toastBtn.onclick = function () {
        // Cache the DOM query for '.toastbtn' elements
        const toastElList = Array.from(document.querySelectorAll('.toastbtn'));
        const toastList = toastElList.map(toastEl => new bootstrap.Toast(toastEl));

        // Show each toast
        toastList.forEach(toast => toast.show());
    };
}

const newToastBtn = document.getElementById("new-toast");

if (newToastBtn) {
    newToastBtn.addEventListener("click", () => {
        Toastify({
            text: "Welcome Back! This is a Toast Notification",
            duration: 3000,
            position: "center", // Valid values: "left", "center", "right"
            style: {
                background: "rgb(var(--primary),1)",
            },
        }).showToast();
    });
}

const leftToastBtn = document.getElementById("left-toast");

if (leftToastBtn) {
    leftToastBtn.addEventListener("click", () => {
        Toastify({
            text: "Welcome Back! This is a Toast Notification",
            duration: 3000,
            position: "left", // Valid: "left", "center", or "right"
            style: {
                background: "rgb(var(--success),1)",
            },
        }).showToast();
    });
}

const rightToastBtn = document.getElementById("right-toast");

if (rightToastBtn) {
    rightToastBtn.addEventListener("click", () => {
        Toastify({
            text: "Welcome Back! This is a Toast Notification",
            duration: 3000,
            position: "right", // Valid: "left", "center", or "right"
            style: {
                background: "rgb(var(--info),1)",
            },
        }).showToast();
    });
}

const bottomToastBtn = document.getElementById("bottom-toast");

if (bottomToastBtn) {
    bottomToastBtn.addEventListener("click", () => {
        Toastify({
            text: "Welcome Back! This is a Toast Notification",
            duration: 3000,
            gravity: "bottom", // Valid: "top" or "bottom"
            position: "bottom", // Valid: "left", "center", or "right"
            style: {
                background: "rgb(var(--warning),1)",
            },
        }).showToast();
    });
}

const centerToastBtn = document.getElementById("center-toast");

if (centerToastBtn) {
    centerToastBtn.addEventListener("click", () => {
        Toastify({
            text: "Welcome Back! This is a Toast Notification",
            duration: 3000,
            gravity: "top", // Valid values: "top" or "bottom"
            position: "center", // Valid values: "left", "center", or "right"
            style: {
                background: "rgb(var(--secondary),1)",
            },
        }).showToast();
    });
}
