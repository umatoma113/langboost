// components/ui/Pagination.tsx
type PaginationProps = {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="mt-4 flex flex-wrap justify-center items-center space-x-2 text-sm">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                className={`px-3 py-1 rounded border ${page === 1
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'hover:bg-gray-100'
                    }`}
            >
                前へ
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                    key={p}
                    onClick={() => onPageChange(p)}
                    className={`px-3 py-1 rounded border ${page === p
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'hover:bg-gray-100'
                        }`}
                >
                    {p}
                </button>
            ))}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                className={`px-3 py-1 rounded border ${page === totalPages
                        ? 'text-gray-400 border-gray-300 cursor-not-allowed'
                        : 'hover:bg-gray-100'
                    }`}
            >
                次へ
            </button>
        </div>
    );
}

