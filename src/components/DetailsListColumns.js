import { Link } from "react-router-dom";
import { project1 } from './ProjectDetailComponent';

export const controlStyles = {
    root: {
        margin: '0 30px 20px 0',
        maxWidth: '300px',
    },
};

export const columns = [
    {
        key: 'column1',
        name: 'Name',
        fieldName: 'taskName',
        minWidth: 100,
        maxWidth: 200,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'string',
        isPadded: true,
    },
    {
        key: 'column2',
        name: 'Status',
        fieldName: 'status',
        minWidth: 50,
        maxWidth: 100,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'string',
        isPadded: true,
    },
    {
        key: 'column3',
        name: 'Assigned To',
        fieldName: 'dev',
        minWidth: 150,
        maxWidth: 200,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'string',
        onRender: (item) => {
            if (!(item.dev.length === 0))
                return <span>{item.dev[0].firstname} {item.dev[0].lastname} {item.dev[0].role}</span>;
            else
                return <span>Not Assigned</span>;
        },
        isPadded: true,
    },
    {
        key: 'column4',
        name: 'Comments',
        fieldName: 'comments',
        minWidth: 50,
        maxWidth: 50,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'number',
        onRender: (item) => {
            return <span>{item.comments.length}</span>;
        },
        isPadded: true,
    },
    {
        key: 'column5',
        name: 'Taks Details Page',
        fieldName: '_id',
        minWidth: 95,
        maxWidth: 200,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'string',
        onRender: (item) => {
            return <Link to={`/projects/${project1._id}/tasks/${item._id}`}>Link</Link>;
        },
        isPadded: true,
    },
    {
        key: 'column6',
        name: 'Created',
        fieldName: 'createdAt',
        minWidth: 125,
        maxWidth: 200,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'number',
        onRender: (item) => {
            return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric' }).format(new Date(Date.parse(item.createdAt)));
        },
        isPadded: true,
    },
    {
        key: 'column7',
        name: 'Updated',
        fieldName: 'updatedAt',
        minWidth: 125,
        maxWidth: 200,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'number',
        onRender: (item) => {
            return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit', hour: 'numeric' }).format(new Date(Date.parse(item.updatedAt)));
        },
        isPadded: true,
    },
    {
        key: 'column8',
        name: 'Progress',
        fieldName: 'progress',
        minWidth: 50,
        maxWidth: 200,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'number',
        onRender: (item) => {
            return (parseFloat(item.progress.$numberDecimal) * 100) + ' %'
        },
        isPadded: true,
    }
];