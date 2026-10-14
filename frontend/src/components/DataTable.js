import React, { useEffect, useRef } from 'react';
// Ensure jQuery and DataTables are loaded via CDN in index.html, or we could import them if installed via npm.
// Based on index.html: <script src="https://cdn.datatables.net/1.13.6/js/jquery.dataTables.min.js"></script>

const DataTable = ({ children, className }) => {
    const tableRef = useRef(null);

    useEffect(() => {
        const $ = window.$;
        if (!$ || !$.fn.DataTable) return;

        const tableNode = tableRef.current;

        // Use a timeout to ensure React has flushed the DOM updates for rows
        const timeoutId = setTimeout(() => {
            if ($.fn.DataTable.isDataTable(tableNode)) {
                $(tableNode).DataTable().destroy();
            }

            $(tableNode).DataTable({
                pageLength: 5,
                lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "All"]],
                language: {
                    search: "_INPUT_",
                    searchPlaceholder: "Search records...",
                    emptyTable: "No data available in table"
                },
                retrieve: false, // Ensure fresh initialization
                order: [], // Respect server-side ordering
            });
        }, 50);

        return () => {
            clearTimeout(timeoutId);
            if ($.fn.DataTable.isDataTable(tableNode)) {
                $(tableNode).DataTable().destroy();
            }
        };
    }, [children]);

    return (
        <div className="table-responsive">
            <table ref={tableRef} className={`table table-hover align-middle ${className}`} style={{ width: '100%' }}>
                {children}
            </table>
        </div>
    );
};

export default DataTable;
