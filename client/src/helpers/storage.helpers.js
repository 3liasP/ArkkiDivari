export const getLocalStorage = (key, defaultValue) => {
    const storedValue = localStorage.getItem(key);
    return storedValue !== null ? JSON.parse(storedValue) : defaultValue;
};

export const setLocalStorage = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};
