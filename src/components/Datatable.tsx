import { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface Column {
    label: string;
    data: string;
    searchable: boolean;
}

interface Props {
    columns: Column[];
    data: any[];
    loading: boolean;
}

export default function DynamicTable({ columns, data, loading }: Props) {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredData = data.filter((item) =>
        columns.some(
            (column) =>
                column.searchable &&
                String(item[column.data]).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(parseInt(event.target.value));
        setCurrentPage(1);
    };

    const handlePageChange = (page: any) => {
        setCurrentPage(page);
    };

    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

    const pageNumbers = [];

    if (totalPages <= 3) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        pageNumbers.push(1);

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pageNumbers.push(i);
        }

        if (!pageNumbers.includes(totalPages)) {
            pageNumbers.push(totalPages);
        }
    }


    return (
        <div className="container mx-auto py-4">
            <div className="flex justify-between items-center mb-4">
                <div className="col-8"></div>
                <div className="col-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="border border-gray-300 rounded-md p-2 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto bg-white border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            {columns.map((column, index) => (
                                <th
                                    key={index}
                                    className="px-4 py-2 text-left text-sm font-semibold text-gray-600"
                                >
                                    {column.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            loading ? (
                                <tr>
                                    <td colSpan={columns.length} className="text-center p-4">
                                        <div className="flex justify-center">
                                            <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                                            </svg>
                                        </div>
                                    </td>
                                </tr>
                            ) :
                                currentData.length != 0 ?
                                    currentData.map((item, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {columns.map((column, colIndex) => (
                                                <td key={colIndex} className="border px-4 py-2">
                                                    {typeof item[column.data] === 'function'
                                                        ? item[column.data]()
                                                        : item[column.data]}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                    :
                                    <tr>
                                        <td colSpan={columns.length} className='text-gray-600 text-center p-2'>No Records to show</td>
                                    </tr>
                        }

                    </tbody>
                </table>
            </div>

            {!loading && currentData.length != 0 &&
                <div className="flex justify-between items-center mt-4">
                    <div className="col-2">
                        <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
                        <select
                            id="itemsPerPage"
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                            className="border border-gray-300 rounded-md p-2"
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                        </select>
                    </div>

                    <div className="col-6"></div>

                    <div className="col-4 flex justify-end">
                        <nav aria-label="Pagination" className="inline-flex -space-x-px">
                            <button
                                onClick={handlePreviousPage}
                                className={`relative inline-flex items-center px-3 py-2 text-gray-600 ${currentPage === 1 ? 'cursor-not-allowed text-gray-300' : 'hover:text-indigo-600'}`}
                                disabled={currentPage === 1}
                            >
                                <FaChevronLeft aria-hidden="true" className="h-5 w-5" />
                            </button>

                            {pageNumbers.map((number) =>
                                number === currentPage ? (
                                    <span
                                        key={number}
                                        className="relative inline-flex items-center px-3 py-2 text-sm text-gray-600 bg-gray-200 rounded-full"
                                    >
                                        {number}
                                    </span>
                                ) : (
                                    <button
                                        key={number}
                                        onClick={() => handlePageChange(number)}
                                        className="relative inline-flex items-center px-3 py-2 text-sm text-gray-600 hover:text-indigo-600"
                                    >
                                        {number}
                                    </button>
                                )
                            )}

                            <button
                                onClick={handleNextPage}
                                className={`relative inline-flex items-center px-3 py-2 text-gray-600 ${currentPage === totalPages ? 'cursor-not-allowed text-gray-300' : 'hover:text-indigo-600'}`}
                                disabled={currentPage === totalPages}
                            >
                                <FaChevronRight aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            }
        </div>
    );
}
