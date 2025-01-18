const fileInput = document.getElementById('choose-btn');
const clearBtn = document.getElementById('clear-btn');
const mergeBtn = document.getElementById('merge-btn');
const downloadLink = document.getElementById('downloadLink');
const dropZone = document.getElementById('drop-zone');
const fileList = document.getElementById('file-list'); // Display the files

// Store uploaded files
let filesArray = [];

// Prevent default drag-and-drop behavior
function dragOverHandler(event) {
    event.preventDefault();
    dropZone.classList.add('drag-over'); // Highlight the drop zone
}

// Remove highlight when dragging leaves the drop zone
function dragLeaveHandler() {
    dropZone.classList.remove('drag-over');
}

// Handle file drop
function dropHandler(event) {
    event.preventDefault();
    dropZone.classList.remove('drag-over');

    const droppedFiles = Array.from(event.dataTransfer.files);

    // Ensure only PDFs are added
    const validFiles = droppedFiles.filter(file => file.type === 'application/pdf');
    filesArray.push(...validFiles);
    updateFileList();
}

// Handle file input change
fileInput.addEventListener('change', (event) => {
    const selectedFiles = Array.from(event.target.files);

    // Ensure only PDFs are added
    const validFiles = selectedFiles.filter(file => file.type === 'application/pdf');
    filesArray.push(...validFiles);
    updateFileList();
});

// Clear the file queue
clearBtn.addEventListener('click', () => {
    filesArray = [];
    clearFileList();
    fileInput.value = ''; // Reset file input
});

// Merge PDFs
mergeBtn.addEventListener('click', async () => {
    if (filesArray.length < 2) {
        alert('Please add at least two PDF files to merge.');
        return;
    }

    const mergedPdf = await PDFLib.PDFDocument.create();

    for (let file of filesArray) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    downloadLink.href = url;
    downloadLink.download = 'merged.pdf';
    downloadLink.style.display = 'block';
    downloadLink.textContent = 'Download Merged PDF';
});

// Update the file list
function updateFileList() {
    fileList.innerHTML = ''; // Clear existing list

    filesArray.forEach((file, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${file.name}`;
        fileList.appendChild(listItem);
    });
}

// Clear the file list
function clearFileList() {
    fileList.innerHTML = ''; // Clear existing list
}

// Make drop zone clickable
dropZone.addEventListener('click', () => {
    fileInput.click();
});

// Remove drag-over class on drag leave
dropZone.addEventListener('dragleave', dragLeaveHandler);

// Add drag-over class on drag over
dropZone.addEventListener('dragover', dragOverHandler);

// Handle file drops
dropZone.addEventListener('drop', dropHandler);
