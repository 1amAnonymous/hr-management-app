import React, { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
const useReadFiles = () => {
  if (typeof window !== "undefined") {
    // Ensure the code only runs in the browser (not during SSR)
    pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"; // Path to worker file
  }
  const [extractedText, setExtractedText] = useState(null);
  const extractTextFromPDF = async (file) => {
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const arrayBuffer = event.target.result;

      try {
        const pdfDoc = await pdfjsLib.getDocument(arrayBuffer).promise;
        const numPages = pdfDoc.numPages;
        let textContent = "";

        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdfDoc.getPage(pageNum);
          const content = await page.getTextContent();
          textContent += content.items.map((item) => item.str).join(" ") + "\n";
        }

        setExtractedText(textContent); // Set the extracted text

        console.log("Extracted PDF Text:", textContent);
      } catch (error) {
        console.error("Error extracting PDF text:", error);
      }
    };

    fileReader.readAsArrayBuffer(file);
  };

  const extractTextFromDOCX = async (file) => {
    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const arrayBuffer = event.target.result;

      try {
        const { value } = await mammoth.extractRawText({ arrayBuffer });
        setExtractedText(value); // Set the extracted text
        console.log("Extracted DOCX Text:", value);
      } catch (error) {
        console.error("Error extracting DOCX text:", error);
      }
    };

    fileReader.readAsArrayBuffer(file);
  };
  return { extractedText, extractTextFromPDF, extractTextFromDOCX };
};

export default useReadFiles;
