const itemContainers = Array.from(document.querySelectorAll('.board-column-content'));
const columnGrids = [];
let boardGrid;

itemContainers.forEach((container) => {
    // **------Instantiate column grid.**
    const grid = new Muuri(container, {
        items: '.board-item',
        layoutDuration: 400,
        layoutEasing: 'ease',
        dragEnabled: true,
        dragSort: () => columnGrids,
        dragSortInterval: 0,
        dragContainer: document.body,
        dragReleaseDuration: 400,
        dragReleaseEasing: 'ease'
    })
        .on('dragStart', (item) => {
            const el = item.getElement();
            el.style.width = `${item.getWidth()}px`;
            el.style.height = `${item.getHeight()}px`;
        })
        .on('dragReleaseEnd', (item) => {
            const el = item.getElement();
            el.style.width = '';
            el.style.height = '';

            columnGrids.forEach((grid) => {
                grid.refreshItems();
            });
        })
        .on('layoutStart', () => {
            boardGrid.refreshItems().layout();
        });

    columnGrids.push(grid);
});

boardGrid = new Muuri('.board', {
    layout: {
        horizontal: true,
    },
    layoutDuration: 400,
    layoutEasing: 'ease',
    dragEnabled: true,
    dragSortInterval: 0,
    dragStartPredicate: {
        handle: '.board-column-header'
    },
    dragReleaseDuration: 400,
    dragReleaseEasing: 'ease'
});
