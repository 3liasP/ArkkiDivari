// Add this at the top with other imports
import { useMemo } from 'react';

// Add this custom hook before the BookSheet component
const useSearchParams = (bookId) => {
    return useMemo(
        () => ({
            criteria: {
                bookid: bookId ? [bookId] : [],
            },
            args: {
                limit: 100,
                offset: 0,
                orderBy: 'createdat',
                sort: 'asc',
            },
        }),
        [bookId],
    );
};

export default useSearchParams;
