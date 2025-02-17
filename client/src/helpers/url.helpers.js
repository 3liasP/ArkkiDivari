export const paramsToUrl = (params) => {
    const queryString = Object.keys(params)
        .map((key) => key + '=' + params[key])
        .join('&');
    return `?${queryString}`;
};

export const urlToParams = (url) => {
    const searchParams = new URLSearchParams(url);
    const params = {};
    for (const [key, value] of searchParams) {
        params[key] = value;
    }
    return params;
};

export const fixUrlCriteria = (criteria) => {
    const fixedCriteria = {};
    for (const key in criteria) {
        if (criteria[key] && criteria[key].length > 0) {
            fixedCriteria[key] = criteria[key].split(',');
        }
    }
    return fixedCriteria;
};
