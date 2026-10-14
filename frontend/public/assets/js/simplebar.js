// Scroll JS
const verticalScroll = document.getElementById('vertical_scroll');
new SimpleBar(verticalScroll, { autoHide: true });

const verticalScrollContent = document.getElementById('vertical_scroll_content');
new SimpleBar(verticalScrollContent, { autoHide: false });

const horizontalScroll = document.getElementById('horizontal_scroll');
new SimpleBar(horizontalScroll, { autoHide: false });

const bothScroll = document.getElementById('both_scroll');
new SimpleBar(bothScroll, { autoHide: false });
