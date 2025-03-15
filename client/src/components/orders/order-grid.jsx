import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { connect } from 'react-redux';

const columns = [
    { field: 'id', headerName: 'Tunniste', width: 150 },
    { field: 'time', headerName: 'Tilauspäivämäärä', width: 200 },
    { field: 'status', headerName: 'Tila', width: 150 },
    {
        field: 'items',
        headerName: 'Myyntikappaleita',
        width: 200,
        type: 'number',
    },
    {
        field: 'total',
        headerName: 'Yhteensä',
        width: 150,
        type: 'number',
        sortable: false,
    },
];

const rows = [
    { id: 1, time: '2021-10-01', status: 'Toimitettu', items: 5, total: 100 },
    { id: 2, time: '2021-10-02', status: 'Toimitettu', items: 3, total: 50 },
    { id: 3, time: '2021-10-03', status: 'Toimitettu', items: 2, total: 30 },
    { id: 4, time: '2021-10-04', status: 'Toimitettu', items: 1, total: 20 },
    { id: 5, time: '2021-10-05', status: 'Toimitettu', items: 4, total: 80 },
];

const OrderGrid = () => {
    // const [orders, setOrders] = useState([]);

    /** useEffect(() => {
        // fetch orders
    }, []);
    */

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <DataGrid
                columns={columns}
                rows={rows}
                pageSize={10}
                rowsPerPageOptions={[10]}
            />
        </Box>
    );
};

export default connect(null, null)(OrderGrid);
