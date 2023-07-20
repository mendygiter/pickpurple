const fs = require ('fs');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


function removeLastFiveChars(address) {
    return address.slice(0, -5)
}

function removePhoneFormatting(phone) {
    return phone.replace(/[^\d]/g, '');
}

const inputFile = 'Thurs 7.20.23 5T.csv';
const outputFile = 'outputfile.csv';

const modifiedData = [];

fs.createReadStream(inputFile)
    .pipe(csvParser())
    .on('data', (row) => {
        row['Full Address'] = removeLastFiveChars(row['Full Address']);

        row['Phone (from Donor Information)'] = removePhoneFormatting(row['Phone (from Donor Information)']);

        modifiedData.push(row);
    })
    .on('end', () => {
        const csvWriter = createCsvWriter({
            path: outputFile,
            header: Object.keys(modifiedData[0]).map((colName) => ({id: colName, title: colName}))
        });

    csvWriter.writeRecords(modifiedData)
        .then(() => console.log('CSV file processing completed.'))
        .catch((err) => console.error('Error writing CSV file:', err));
    });