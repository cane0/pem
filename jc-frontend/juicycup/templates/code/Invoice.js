import axios from 'axios';
import RNFS from 'react-native-fs';
import RNHTMLtoPDF from 'react-native-html-to-pdf';

const fetchData = async () => {
  try {
    const response = await axios.get('your-api-endpoint');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

const fillTemplate = (template, data) => {
  // Implement your logic to replace placeholders in the HTML template
  const filledHTML = template.replace('{{itemName}}', data.items[0].item_name);

  return filledHTML;
};

const downloadPDF = async (htmlContent, fileName) => {
  const options = {
    html: htmlContent,
    fileName: fileName,
    directory: RNFS.DocumentDirectoryPath,
  };

  try {
    const pdfFile = await RNHTMLtoPDF.convert(options);
    console.log('PDF saved to:', pdfFile.filePath);
    return pdfFile.filePath;
  } catch (error) {
    console.error('Error saving PDF:', error);
    throw error;
  }
};

const handleRequestAndDownload = async () => {
  try {
    const jsonData = await fetchData();

    // Provide your HTML template content here
    const template = await fetchTemplate(); // Implement fetchTemplate to load your template

    const filledHTML = fillTemplate(template, jsonData);
    const pdfFilePath = await downloadPDF(filledHTML, 'output');

    // Now you can use pdfFilePath for further actions or display a success message.
  } catch (error) {
    console.error('Error in the entire process:', error);
    // Handle errors appropriately
  }
};

// Function to fetch your HTML template (replace with your actual implementation)
const fetchTemplate = async () => {
  const response = await axios.get('url-to-your-template');
  return response.data;
};
