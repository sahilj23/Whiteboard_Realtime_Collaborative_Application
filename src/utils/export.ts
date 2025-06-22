import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportCanvasAsPNG = async (canvas: HTMLCanvasElement, filename: string = 'whiteboard') => {
  try {
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error exporting PNG:', error);
    return false;
  }
};

export const exportCanvasAsPDF = async (canvas: HTMLCanvasElement, filename: string = 'whiteboard') => {
  try {
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
      unit: 'px',
      format: [canvas.width, canvas.height]
    });
    
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Error exporting PDF:', error);
    return false;
  }
};

export const exportCanvasAsJPG = async (canvas: HTMLCanvasElement, filename: string = 'whiteboard') => {
  try {
    // Create a temporary canvas with white background for JPG
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    if (!tempCtx) return false;

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    
    // Fill with white background
    tempCtx.fillStyle = '#FFFFFF';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    
    // Draw the original canvas on top
    tempCtx.drawImage(canvas, 0, 0);
    
    const link = document.createElement('a');
    link.download = `${filename}.jpg`;
    link.href = tempCanvas.toDataURL('image/jpeg', 0.9);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    return true;
  } catch (error) {
    console.error('Error exporting JPG:', error);
    return false;
  }
};