// ------chart js -----//
const options = {
    series: [
        {
            name: '',
            data: [19.0, 20, 19.8, 19, 19.67, 19.45, 20.99, 30.45, 19.45, 19.09, 19.8, 19.6, 20, 20.89, 21.4, 19.09, 20.8, 23.78, 25.0, 20, 19.65, 25, 24.89, 23, 19.0, 19.56, 20.36, 22.90, 24.90, 19.78]
        },
    ],
    chart: {
        type: 'area',
        height: 350,
        offsetY: 0,
        offsetX: 0,
        toolbar: {
            show: false,
        },
    },
    stroke: {
        width: 2,
        curve: 'smooth'
    },
    dataLabels: {
        enabled: false,
    },
    fill: {
        type: "gradient",
        gradient: {
            shadeIntensity: 1,
            colorStops: [
                {
                    offset: 0,
                    color: 'rgba(var(--info),.4)',
                    opacity: 1,
                },
                {
                    offset: 50,
                    color: 'rgba(var(--info),.4)',
                    opacity: 1,
                },
                {
                    offset: 100,
                    color: 'rgba(var(--info),.1)',
                    opacity: 1,
                },
            ]
        }
    },
    legend: {
        show: false,
    },
    colors: ['rgba(var(--info))'],
    xaxis: {
        tooltip: {
            enabled: false,
        },
        labels: {
            show: false,
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    tooltip: {
        x: {
            show: false,
        },
        style: {
            fontSize: '16px',
            fontFamily: '"Outfit", sans-serif',
        },
    },
    responsive: [{
        breakpoint: 1660,
        options: {
            chart: {
                height: 365
            }
        }
    }]
};

const chart = new ApexCharts(document.querySelector("#apikey"), options);
chart.render();
//----- end chart js----- //

$(function () {
    $('#apikeydtatable').DataTable();
});

// api generator //
(function () {
    const usernameInput = $('#username');
    const keygenValueInput = $('#keygenValue');
    const apiModel = $("#apiModel");
    const apiKeyContent = $(".api_key_content");
    const tableBody = document.querySelector("#api_key_body");

    function tableBodyFun() {
        return `
            <tr>
                <td>
                    <div class="checkbox-wrapper">
                        <label class="check-box m-0">
                            <input type="checkbox">
                            <span class="checkmark light-primary"></span>
                        </label>
                    </div>
                </td>
                <td>
                    <div class="d-flex align-items-center">
                        <div class="h-30 w-30 d-flex-center b-r-50 overflow-hidden text-bg-primary me-2">
                            <img src="../assets/images/avatar/1.png" alt="" class="img-fluid">
                        </div>
                        ${usernameInput.val()}
                    </div>
                </td>
                <td>Gavin Cortez</td>
                <td>${keygenValueInput.val()}</td>
                <td>1 Jan 2024</td>
                <td>cristipola@gmailod.com</td>
                <td>
                    <button type="button" class="btn btn-danger icon-btn b-r-4 delete-btn" id="account_delete" data-bs-toggle="modal">
                        <i class="ti ti-trash"></i>
                    </button>
                    <button type="button" class="btn btn-success icon-btn b-r-4">
                        <i class="ti ti-edit"></i>
                    </button>
                </td>
            </tr>
        `;
    }

    // Handle creating a unique key
    $('#create_unique_key').on('click', function () {
        apiModel.modal("show");
    });

    $('#keygen').on('click', function () {
        try {
            const username = usernameInput.val().trim();

            if (username) {
                if (apiKeyContent.hasClass("d-none")) {
                    apiKeyContent.removeClass("d-none");
                    keygenValueInput.val(generateUUID());
                } else {
                    tableBody.innerHTML = tableBodyFun() + tableBody.innerHTML;
                    apiModel.modal("hide");
                    keygenValueInput.val("");
                    usernameInput.val("");
                    deletAction();
                    apiKeyContent.addClass("d-none");
                }
            } else {
                alert('Please enter a username.');
            }
        } catch (error) {
            console.error("Error generating unique key:", error);
        }
    });

    // Generate UUID function
    function generateUUID() {
        let d = new Date().getTime();
        if (window.performance && typeof window.performance.now === "function") {
            d += performance.now();
        }
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    // Handle delete action with event listener cleanup
    function deletAction() {
        document.querySelectorAll(".delete-btn").forEach((element) => {
            element.addEventListener("click", function handleDeleteClick() {
                try {
                    $("#apiDeletModal").modal("show");
                    document.querySelector("#confirmDelete").addEventListener("click", function () {
                        element.closest("tr").remove();
                        $("#apiDeletModal").modal("hide");
                        element.removeEventListener("click", handleDeleteClick);
                    });
                } catch (error) {
                    console.error("Error handling delete action:", error);
                }
            });
        });
    }

    deletAction();
})();
