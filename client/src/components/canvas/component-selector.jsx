import { useLocation } from 'react-router-dom';
import useLocationParams from '../../hooks/navigation';
import NoMatch from '../../routes/no-match';
import Home from '../home/home';
import BookSheet from '../book/book-sheet';
import BookNew from '../book/book-new';
import User from '../user/user';
import { setCtx } from '../../reducers/app.slice';
import { connect } from 'react-redux';
import SearchAdvanced from '../search/search-advanced';
import SearchResults from '../search/search-results';
import SearchBarcode from '../search/search-barcode';
import Login from '../login/login';
import Checkout from '../checkout/checkout';

const ComponentSelector = ({ loggedIn, setCtx }) => {
    const [page, pageParam] = useLocationParams();
    const { search, pathname } = useLocation();

    if (!loggedIn) {
        return <Login />;
    }

    switch (page) {
        case 'home': {
            setCtx({ ctx: page });
            return <Home ctx="home" pageParam={pageParam} />;
        }
        case null: {
            if (search === '' && pathname === '/') {
                setCtx({ ctx: 'home' });
                return <Home ctx="home" pageParam={pageParam} />;
            } else {
                return <NoMatch />;
            }
        }
        case 'book-sheet': {
            if (pageParam) {
                setCtx({ ctx: page });
                return <BookSheet ctx="book-sheet" pageParam={pageParam} />;
            } else {
                return <NoMatch />;
            }
        }
        case 'book-new': {
            setCtx({ ctx: page });
            return <BookNew ctx="book-new" pageParam={pageParam} />;
        }
        case 'search-advanced': {
            setCtx({ ctx: page });
            return (
                <SearchAdvanced ctx="search-advanced" pageParam={pageParam} />
            );
        }
        case 'search-barcode': {
            setCtx({ ctx: page });
            return <SearchBarcode ctx="search-barcode" pageParam={pageParam} />;
        }
        case 'search-results': {
            setCtx({ ctx: page });
            return <SearchResults ctx="search-results" pageParam={pageParam} />;
        }
        case 'user': {
            setCtx({ ctx: page });
            return <User ctx="user" pageParam={pageParam} />;
        }
        case 'checkout': {
            setCtx({ ctx: page });
            return <Checkout ctx="checkout" pageParam={pageParam} />;
        }
        default: {
            return <NoMatch />;
        }
    }
};

const mapStateToProps = (state) => ({
    loggedIn: state.user.loggedIn,
});

const mapDispatchToProps = (dispatch) => ({
    setCtx: (payload) => dispatch(setCtx(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ComponentSelector);
