import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";

const expectedFields = ["Name", "Date of Birth", "Gender", "Address", "First Release Year", "No of Albums Released"];

const CSVImportModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => Promise<string[]>;
    uploadErrors: string[];
}> = ({ isOpen, onClose, onUpload, uploadErrors }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [dropZoneText, setDropZoneText] = useState("Drag & drop a CSV file here, or click to select a file");

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        accept: { "text/csv": [".csv"] },
        maxSize: 5 * 1024 * 1024,
        onDrop: async (acceptedFiles) => {
            if (acceptedFiles && acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                setSelectedFile(file);

                const errors = await validateCSV(file);
                if (errors.length > 0) {
                    setValidationErrors(errors);
                    setSelectedFile(null);
                } else {
                    setValidationErrors([]);
                }
                setDropZoneText(file.name);
            }
        },
        onDropRejected: () => {
            setValidationErrors(["Please upload a valid CSV file (Max 5MB)"]);
        }
    });

    const validateCSV = async (file: File) => {
        const text = await file.text();
        const rows = text.split('\n').map(row => row.trim());
        const errors: string[] = [];
        const headers = rows[0].split(',');
        if (!headers.every((header, index) => header.trim() === expectedFields[index])) {
            errors.push("Invalid headers. Expected headers are: " + expectedFields.join(', ') + ".");
        }
        for (const rowIndex in rows) {
            const row = rows[rowIndex];
            if (rowIndex === "0" || row === "") continue;
            const columns = row.split(',');
            if (columns.length !== expectedFields.length) {
                errors.push(`Row ${parseInt(rowIndex) + 1}: Invalid number of columns.`);
                continue;
            }
            const [name, dob, gender, address, firstReleaseYear, noOfAlbumsReleased] = columns;
            if (!name) errors.push(`Row ${parseInt(rowIndex) + 1}: ${expectedFields[0]} is required.`);
            if (!address) errors.push(`Row ${parseInt(rowIndex) + 1}: ${expectedFields[3]} is required.`);
            if (!isValidDate(dob)) errors.push(`Row ${parseInt(rowIndex) + 1}: Invalid ${expectedFields[1]}.`);
            if (!['Male', 'Female', 'Other'].includes(gender)) errors.push(`Row ${parseInt(rowIndex) + 1}: ${expectedFields[2]} must be Male, Female, or Other.`);
            if (!isValidYear(firstReleaseYear)) errors.push(`Row ${parseInt(rowIndex) + 1}: ${expectedFields[4]} must be a valid year (4 digits).`);
            if (!isInteger(noOfAlbumsReleased)) errors.push(`Row ${parseInt(rowIndex) + 1}: ${expectedFields[5]} must be a positive integer.`);
        }
        return errors;
    };

    const isValidDate = (dateString: string) => {
        const date = new Date(dateString);
        return !isNaN(date.getTime());
    };

    const isValidYear = (year: string) => {
        return /^\d{4}$/.test(year);
    };

    const isInteger = (value: string) => {
        return /^\d+$/.test(value);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setValidationErrors(["Please select a CSV file to upload."]);
            return;
        }
        setLoading(true);
        const backendErrors = await onUpload(selectedFile);
        setLoading(false);
        if (backendErrors && backendErrors.length > 0) {
            setValidationErrors(backendErrors);
        } else {
            onClose();
        }
    };

    const downloadSampleCSV = async () => {
        try {
            const response = await fetch('/sample-artist-import.csv');
            if (!response.ok) {
                throw new Error("Failed to fetch sample CSV file.");
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'sample-artist-import.csv');
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading sample CSV:", error);
            toast.error("Error downloading sample CSV file.");
        }
    };


    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-auto">
                <div className="flex justify-between">
                    <div>
                        <h2 className="text-xl font-semibold mb-4">Import Artists via CSV</h2>
                    </div>
                    <div>
                        <button
                            className=" text-gray-400 hover:text-gray-600"
                            onClick={onClose}
                        >
                            ✕
                        </button>

                    </div>
                </div>

                <div {...getRootProps()} className={`border-dashed border-2 p-4 h-20 flex text-center ${isDragActive ? "border-blue-400" : "border-gray-300"}`}>
                    <input {...getInputProps()} />
                    <p className="m-auto">{dropZoneText}</p>
                </div>

                {fileRejections.length > 0 && (
                    <p className="mt-2 text-red-500">File is too large or not a CSV</p>
                )}

                {validationErrors.length > 0 && (
                    <div className="mt-4">
                        <p className="text-red-500 font-semibold">Validation Errors:</p>
                        <ul className="list-disc list-inside text-red-500">
                            {validationErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {uploadErrors.length > 0 && (
                    <div className="mt-4">
                        <p className="text-red-500 font-semibold">Upload Errors:</p>
                        <ul className="list-disc list-inside text-red-500">
                            {uploadErrors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-4 bg-blue-50 p-4 rounded">
                    <p className="text-sm text-gray-800 font-semibold">Please ensure the following before uploading:</p>
                    <ul className="list-disc list-inside text-gray-800 mt-2">
                        <li>Only CSV files are accepted.</li>
                        <li>Maximum file upload size is 5MB.</li>
                        <li>The gender field must be "Male", "Female", or "Other".</li>
                        <li>The year must be a valid year (4 digits).</li>
                        <li>The number of albums released must be a positive integer.</li>
                    </ul>
                </div>

                <div className="flex justify-between items-center mt-4">
                    <button
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        onClick={downloadSampleCSV}
                    >
                        Download Sample
                    </button>
                    <button
                        className={`px-4 py-2 ${loading ? "bg-gray-400" : "bg-green-500"} text-white rounded-lg hover:bg-green-600`}
                        onClick={handleUpload}
                        disabled={loading}
                    >
                        {loading ? "Uploading..." : "Upload CSV"}
                    </button>
                </div>
            </div>
        </div>

    );
};

export default CSVImportModal;
