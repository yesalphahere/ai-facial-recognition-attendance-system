// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
    if (!event.target.matches(".dropbtn")) {
        const dropdowns = document.getElementsByClassName("dropdown-content");
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains("show")) {
                openDropdown.classList.remove("show");
            }
        }
    }
};

//  **------tab link js**
$(document).on('click', '.tab-link', function () {
    let tabID = $(this).attr('data-tab');

    $(this).addClass('active').siblings().removeClass('active');

    $('#tab-' + tabID).addClass('active').siblings().removeClass('active');
});

//  **------chart js**
const polar2Options = {
    series: [76],
    chart: {
        type: 'radialBar',
        offsetY: -20,
        sparkline: {
            enabled: true
        }
    },
    colors: ['rgba(var(--primary),1)'],
    plotOptions: {
        radialBar: {
            startAngle: -90,
            endAngle: 90,
            track: {
                background: "#e7e7e7",
                strokeWidth: '97%',
                margin: 5, // margin is in pixels
                dropShadow: {
                    enabled: true,
                    top: 2,
                    left: 0,
                    color: '#999',
                    opacity: 1,
                    blur: 2,
                }
            },
            dataLabels: {
                name: {
                    show: false
                },
                value: {
                    offsetY: -4,
                    fontSize: '22px'
                }
            }
        }
    },
    grid: {
        padding: {
            top: -20
        }
    },
    fill: {
        type: '',
        gradient: {
            shade: '',
            shadeIntensity: 0.4,
            inverseColors: false,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 60, 73, 108]
        },
    },
    labels: ['Average Results'],
};

const polar2Chart = new ApexCharts(document.querySelector("#polar2"), polar2Options);
polar2Chart.render();

function getActionsFeture() {
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", () => {
            try {
                const modal = $("#apiDeletModal");
                modal.modal("show");
                const confirmButton = document.getElementById("confirmDelete");
                confirmButton.onclick = () => {
                    const container = button.closest(".col-xxl-3");
                    document.querySelector(".documents-sections .card-body .row").appendChild(container.cloneNode(true));
                    container.remove();
                    modal.modal("hide");
                    confirmButton.onclick = null; // Detach the event listener
                };
            } catch (error) {
                console.error("Error during delete action:", error);
            }
        });
    });

    document.querySelectorAll('.fav-icon').forEach(icon => {
        icon.addEventListener('click', function (event) {
            try {
                this.classList.toggle('ph-bold');
                this.classList.toggle('ph-fill');
                const favBtn = this.closest(".col-xxl-3 ").cloneNode(true);
                if (event.target.classList.contains("ph-fill")) {
                    document.querySelector('#tab-2 .row').appendChild(favBtn.cloneNode(true));
                } else {
                    const existingElements = document.querySelectorAll('#tab-3 .row .col-xl-3');
                    existingElements.forEach(child => {
                        if (child.dataset.originalId === favBtn.dataset.originalId) {
                            child.remove();
                        }
                    });
                }
            } catch (error) {
                console.error("Error during favorite action:", error);
            }
        });
    });

    document.querySelectorAll('.star-icon').forEach(icon => {
        icon.addEventListener('click', function (event) {
            try {
                this.classList.toggle('ph-bold');
                this.classList.toggle('ph-fill');
                const favRow = this.closest("tr").cloneNode(true);
                if (event.target.classList.contains("ph-fill")) {
                    document.querySelector('#favorites-table tbody').appendChild(favRow);
                } else {
                    const existingRows = document.querySelectorAll('#favorites-table tbody tr');
                    existingRows.forEach(row => {
                        if (row.firstChild.textContent === favRow.firstChild.textContent) {
                            row.remove();
                        }
                    });
                }
            } catch (error) {
                console.error("Error during star action:", error);
            }
        });
    });
}

//-------- folder rename start-----//
function renameFolder() {
    const renameKeyButton = document.querySelector("#renamekey");

    document.querySelectorAll(".edit-folder-list").forEach((element) => {
        element.addEventListener("click", (event) => {
            try {
                const card = event.target.closest(".card-body");
                $("#renameModal").modal("show");
                const titleName = card.querySelector("p.text-center");
                const inputField = document.querySelector("#titlename");

                inputField.value = titleName.textContent;

                function handleRename() {
                    titleName.textContent = inputField.value;
                    $("#renameModal").modal("hide");
                    renameKeyButton.removeEventListener('click', handleRename);
                }

                renameKeyButton.removeEventListener('click', handleRename);
                renameKeyButton.addEventListener('click', handleRename);
            } catch (error) {
                console.error("Error during folder rename:", error);
            }
        });
    });
}
renameFolder();
//-------- folder rename end -----//


// Add to file function
function tableBodyFun() {
    return `
  <tr>
    <td>
      <div>
        <img src="../assets/images/icons/file-manager-icon/file.png" class="w-20 h-20" alt="">
        ${$('#recentName').val()}
      </div>
    </td>
    <td>17</td>
    <td>120MB</td>
    <td>21 May,2024</td>
    <td class="d-flex">
      <div class="dropdown folder-dropdown">
        <a class="" role="button" data-bs-toggle="dropdown" aria-expanded="true">
          <i class="ti ti-dots-vertical"></i>
        </a>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item view-item-btn" href=""><i class="ti ti-file-export"></i> view</a></li>
          <li><a class="dropdown-item edit-folder-list" href="" data-bs-toggle="modal" role="button"><i class="ti ti-edit"></i> Rename</a></li>
          <li><a class="dropdown-item" href="" data-bs-toggle="modal" role="button"><i class="ti ti-trash"></i> Delete</a></li>
        </ul>
      </div>
      <div class="starreddiv favBtn ms-3">
        <i class="ph-bold  ph-star text-warning f-s-18 fav-icon"></i>
      </div>
    </td>
  </tr>
`;
}

// Recent modal open and hide
$('#resentKey').on('click', function () {
    try {
        const tableBody = document.querySelector("#recent_key_body");
        tableBody.innerHTML = tableBodyFun() + tableBody.innerHTML;
        $("#resentModal").modal("hide");
        deleteAction();
    } catch (error) {
        console.error("Error during recent key click:", error);
    }
});

$('#create_recent_key').on('click', function () {
    $("#resentModal").modal("show");
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
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}
getActionsFeture();

// Recent table delete action
function deleteAction() {
    document.querySelectorAll(".delete-btn").forEach((element) => {
        element.addEventListener("click", () => {
            try {
                const modal = $("#apiDeletModal");
                modal.modal("show");
                const confirmButton = document.querySelector("#confirmDelete");
                confirmButton.addEventListener("click", () => {
                    element.closest("tr").remove();
                    modal.modal("hide");
                });
            } catch (error) {
                console.error("Error during delete action:", error);
            }
        });
    });
}
deleteAction();

// Folder content creation
function folderContent() {
    return `
  <div class="col-sm-6 col-md-4 col-xl-3">
    <div class="card">
      <div class="card-body folder-card">
        <div class="starreddiv favBtn">
          <i class="ph-bold  ph-star text-warning f-s-18 fav-icon"></i>
        </div>
        <div class="dropdown folder-dropdown">
          <a class="" role="button" data-bs-toggle="dropdown" aria-expanded="true">
            <i class="ti ti-dots-vertical"></i>
          </a>
          <ul class="dropdown-menu">
            <li><a class="dropdown-item view-item-btn" href=""><i class="ti ti-file-export text-primary"></i> view</a></li>
            <li><a class="dropdown-item edit-folder-list" href="" data-bs-toggle="modal" role="button"><i class="ti ti-edit text-success"></i> Rename</a></li>
            <li><a class="dropdown-item delete-btn" href="" data-bs-toggle="modal" role="button"><i class="ti ti-trash text-danger"></i> Delete</a></li>
          </ul>
        </div>
        <div class="fileimage mb-2">
          <img src="../assets/images/icons/file-manager-icon/folder.png" alt="" class="img-fluid">
          <p class="mb-0 mt-2 f-s-16 text-center">${$('#title').val()}</p>
        </div>
        <div class="d-flex justify-content-between">
          <p class="f-s-12 text-secondary">25.67GB</p>
          <p class="f-s-12 text-secondary text-end">50GB</p>
        </div>
      </div>
    </div>
  </div>`;
}

document.querySelector('#folderAdd').onclick = function () {
    const rowElement = document.querySelector("#newFolder .row");
    rowElement.insertAdjacentHTML('afterbegin', folderContent());
    $("#folderModal").modal("hide");
    getActionsFeture();
    renameFolder();
};

// Table data rename
function renameTableEntry() {
    const renameKeyButton = document.querySelector("#renamekey");
    document.querySelector("#recentdatatable").addEventListener("click", function(event) {
        if (event.target.closest(".edit-folder-name")) {
            try {
                const row = event.target.closest("tr");
                const nameCell = row.querySelector("td:first-child .table-text");
                if (nameCell) {
                    $("#renameModal").modal("show");
                    document.querySelector("#titlename").value = nameCell.textContent;
                    function handleRename() {
                        nameCell.textContent = document.querySelector("#titlename").value;
                        $("#renameModal").modal("hide");
                        renameKeyButton.removeEventListener('click', handleRename);
                    }
                    renameKeyButton.removeEventListener('click', handleRename);
                    renameKeyButton.addEventListener('click', handleRename);
                } else {
                    console.error("Name cell not found");
                }
            } catch (error) {
                console.error("Error during table rename:", error);
            }
        }
    });
}
renameTableEntry();

