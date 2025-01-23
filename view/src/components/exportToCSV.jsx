import * as XLSX from "xlsx";

export const exportToCSV = (data, fileName) => {
    // Convert data to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);

    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Export the workbook to a file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};