export const DEFAULT_SEARCH_PARAMS = {
    criteria: {},
    args: {
        limit: 10000, // hard limit on results per query
        offset: 0,
        sort: 'desc',
    },
};

// Local storage key
export const COLUMN_CONFIG_KEY = 'searchGridColumnConfig';
