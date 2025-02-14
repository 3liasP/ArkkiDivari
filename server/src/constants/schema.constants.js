export const SCHEMA = {
    books: {
        bookid: {
            type: 'string',
            label: 'Teos ID',
            required: false,
            editable: false,
            automatic: true,
        },
        isbn: {
            type: 'string',
            label: 'ISBN',
            required: false,
            editable: true,
            automatic: false,
        },
        title: {
            type: 'string',
            label: 'Nimi',
            required: true,
            editable: true,
            automatic: false,
        },
        author: {
            type: 'string',
            label: 'Kirjailija',
            required: true,
            editable: true,
            automatic: false,
        },
        year: {
            type: 'integer',
            label: 'Vuosi',
            required: true,
            editable: true,
            automatic: false,
        },
        weight: {
            type: 'integer',
            label: 'Paino (g)',
            required: false,
            editable: true,
            automatic: false,
        },
        typeid: {
            type: 'type',
            label: 'Tyyppi',
            required: true,
            editable: true,
            automatic: false,
        },
        genreid: {
            type: 'genre',
            label: 'Genre',
            required: true,
            editable: true,
            automatic: false,
        },
    },
    copies: {
        copyid: {
            type: 'string',
            label: 'Myyntikappale ID',
            required: false,
            editable: false,
            automatic: true,
        },
        bookid: {
            type: 'book',
            label: 'Teos ID',
            required: true,
            editable: true,
            automatic: false,
        },
        sellerid: {
            type: 'seller',
            label: 'Myyjä',
            required: true,
            editable: true,
            automatic: false,
        },
        status: {
            type: 'status',
            label: 'Tila',
            required: true,
            editable: true,
            automatic: false,
        },
        price: {
            type: 'money',
            label: 'Hinta (€)',
            required: true,
            editable: true,
            automatic: false,
        },
    },
    associations: {
        seller: {
            id: 'sellerid',
            type: 'table',
            name: 'sellers',
        },
        type: {
            id: 'typeid',
            type: 'table',
            name: 'types',
        },
        genre: {
            id: 'genreid',
            type: 'table',
            name: 'genres',
        },
        status: {
            id: 'status',
            type: 'enum',
            name: 'bookstatus',
        },
    },
    user: {
        userid: '',
        username: '',
        group: '',
    },
};

export const ADMIN_SCHEMA = {
    copies: {
        buyinprice: {
            type: 'money',
            label: 'Sisäänstohinta (€)',
            required: false,
            editable: true,
            automatic: false,
        },
        solddate: {
            type: 'date',
            label: 'Myyntipäivä',
            required: false,
            editable: true,
            automatic: false,
        },
    },
};
