const pdfFilesInput = document.getElementById('choose-btn'); // used to be 'pdfFiles'
const clearBtn = document.getElementById('clear-btn');
const mergeBtn = document.getElementById('merge-btn');
const downloadLink = document.getElementById('downloadLink');

async function mergePDFs(files) {
    const mergedPdf = await PDFLib.PDFDocument.create();

    for (let file of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

        const pages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
        pages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    return mergedPdfBytes;
}

mergeBtn.addEventListener('click', async () => {
    const files = pdfFilesInput.files;

    if (files.length < 2) {
        alert('Please select at least two PDF files to merge.');
        return;
    }

    const mergedPdfBytes = await mergePDFs(files);

    // Create a download link for the merged PDF
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'merged.pdf';
    downloadLink.style.display = 'block';
    downloadLink.textContent = 'Download Merged PDF';
});

//////////////////////////////////////////////////////

function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }

