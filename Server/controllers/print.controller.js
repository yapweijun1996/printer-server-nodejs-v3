import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';
import { v4 as uuidv4 } from 'uuid';
import pkg from 'pdf-to-printer';
const { print, getPrinters } = pkg;

const __dirname = path.dirname(new URL(import.meta.url).pathname);

let sharedBrowser;
async function getSharedBrowser() {
    if (!sharedBrowser) {
        sharedBrowser = await puppeteer.launch({ headless: true });
        process.on('exit', () => sharedBrowser && sharedBrowser.close());
    }
    return sharedBrowser;
}

export const printHtml = async (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] Print request...`);
    const { htmlContent, paperSize = 'a4', printerName, printerOptions = {} } = req.body;

    let page;
    let tempFilePath;
    try {
        const browser = await getSharedBrowser();
        page = await browser.newPage();

        let viewportWidth = 1200, viewportHeight = 1600;
        if (Array.isArray(paperSize)) {
            viewportWidth = Math.ceil(Number(paperSize[0]) * 3.7795);
            viewportHeight = Math.ceil(Number(paperSize[1]) * 3.7795);
        }
        await page.setViewport({
            width: viewportWidth,
            height: viewportHeight,
            deviceScaleFactor: 2,
        });

        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        await page.emulateMediaType('screen');

        let pdfOptions = {
            printBackground: true,
            margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' },
        };
        if (Array.isArray(paperSize)) {
            pdfOptions.width = `${paperSize[0]}mm`;
            pdfOptions.height = `${paperSize[1]}mm`;
        } else {
            pdfOptions.format = paperSize || 'a4';
        }

        const pdfBuffer = await page.pdf(pdfOptions);
        
        tempFilePath = path.join(__dirname, `temp_print_${uuidv4()}.pdf`);
        await fs.promises.writeFile(tempFilePath, pdfBuffer);

        const options = {
            printer: printerName || undefined,
            ...printerOptions,
        };
        await print(tempFilePath, options);

        res.status(200).json({ message: 'High-quality print job sent successfully!' });
    } catch (error) {
        console.error('Error during Puppeteer printing:', error);
        return next(error); // Pass error to the centralized handler
    } finally {
        if (page) await page.close();
        if (tempFilePath) await fs.promises.unlink(tempFilePath).catch(err => console.error(`Failed to delete temp file ${tempFilePath}:`, err));
    }
};

export const printBase64 = async (req, res, next) => {
    const { base64Data, printerName, printerOptions = {} } = req.body;
    
    let tempFilePath;
    try {
        tempFilePath = path.join(__dirname, `temp_print_${uuidv4()}.pdf`);
        await fs.promises.writeFile(tempFilePath, Buffer.from(base64Data, 'base64'));

        const options = {
            printer: printerName || undefined,
            ...printerOptions,
        };
        await print(tempFilePath, options);
        
        res.status(200).json({ message: 'Base64 print job sent successfully!' });
    } catch (error) {
        console.error('Error during Base64 printing:', error);
        return next(error); // Pass error to the centralized handler
    } finally {
        if (tempFilePath) await fs.promises.unlink(tempFilePath).catch(err => console.error(`Failed to delete temp file ${tempFilePath}:`, err));
    }
};

export const getAvailablePrinters = async (req, res, next) => {
    try {
        const printers = await getPrinters();
        res.status(200).json(printers);
    } catch (error) {
        console.error('Error getting printers:', error);
        return next(error); // Pass error to the centralized handler
    }
};