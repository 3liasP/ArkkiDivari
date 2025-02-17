import { useLocation } from 'react-router-dom';

const useLocationParams = () => {
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const page = searchParams.get('page');
    // pageParams in search results page should be parsed into an object
    const pageParam = searchParams.get('pageParam');

    return [page, pageParam];
};

export default useLocationParams;
