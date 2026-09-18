import './Pagination.css'

export default function Pagination({
    currentPage,
    nextPage,
    previousPage,
    totalCount,
    setCurrentPage
}) {
    const pageSize = 6
    const totalPages = Math.ceil(totalCount / pageSize)
    const pages = []
    for (let page = 1; page <= totalPages; page++) {
        pages.push(page)
    }

    return (
        <div className="pagination">

            <button disabled={!previousPage} onClick={() => setCurrentPage(currentPage - 1)}>
                Previous
            </button>

            <div className="pagination-pages">
                {pages.map(page => (
                    <button key={page} className={currentPage === page ? 'active' : ''} onClick={() => setCurrentPage(page)}>
                        {page}
                    </button>
                ))}
            </div>

            <button disabled={!nextPage} onClick={() => setCurrentPage(currentPage + 1)}>
                Next
            </button>

        </div>
    )
}