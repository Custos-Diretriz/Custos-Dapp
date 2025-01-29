import { jsPDF } from 'jspdf';

export const generatePDFWithWatermark = async (agreement, logoUrl = '/CustosLogo.png') => {
  const doc = new jsPDF();
  const watermarkWidth = 150;
  const watermarkHeight = 60;

  const getBase64Image = async (url) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error loading image:', error);
      throw new Error('Failed to load watermark image');
    }
  };

  try {
    const logoBase64 = await getBase64Image(logoUrl);
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    doc.saveGraphicsState();
    doc.setGState(new doc.GState({ opacity: 0.1 }));

    const centerX = (pageWidth - watermarkWidth) / 2;
    const centerY = (pageHeight - watermarkHeight) / 2;

    doc.addImage(
      logoBase64,
      'PNG',
      centerX,
      centerY,
      watermarkWidth,
      watermarkHeight,
      undefined, 
      undefined,
      45
    );

    const bottomX = pageWidth - watermarkWidth - 20;
    const bottomY = pageHeight - watermarkHeight - 20;
    
    doc.addImage(
      logoBase64,
      'PNG',
      bottomX,
      bottomY,
      watermarkWidth,
      watermarkHeight,
      undefined,
      undefined,
      45
    );

    doc.restoreGraphicsState();

    doc.setFontSize(16);
    doc.text('Agreement Document', 20, 20);
    doc.setFontSize(12);
    doc.text(`Agreement ID: ${agreement.id}`, 20, 40);
    doc.text(`First Party: ${agreement.first_party_fullname}`, 20, 50);
    doc.text(`Second Party: ${agreement.second_party_fullname}`, 20, 60);

    const splitContent = doc.splitTextToSize(agreement.content, pageWidth - 40);
    doc.text(splitContent, 20, 80);

    if (agreement.first_party_signature) {
      doc.text('First Party Signature: ✓', 20, pageHeight - 40);
    }
    if (agreement.second_party_signature) {
      doc.text('Second Party Signature: ✓', 20, pageHeight - 30);
    }

    return doc;
  } catch (error) {
    console.error('Error generating Pdf:', error);
    throw error;
  }
};

export const printAgreement = async (agreement) => {
  try {
    const doc = await generatePDFWithWatermark(agreement);
    doc.autoPrint();
    doc.output('dataurlnewwindow');
  } catch (error) {
    console.error('Error printing agreement:', error);
  }
};

export const downloadAgreement = async (agreement) => {
  try {
    const doc = await generatePDFWithWatermark(agreement);
    doc.save(`agreement-${agreement.id}.pdf`);
  } catch (error) {
    console.error('Error downloading agreement:', error);
  }
};
