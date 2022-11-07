import { project1, handleDeleteTask } from './ProjectDetailComponent';
import { Icon } from '@fluentui/react/lib/Icon';
import { DefaultButton } from '@fluentui/react/lib/Button';
import { useConst } from '@fluentui/react-hooks';

export const controlStyles = {
    root: {
        margin: '0 30px 20px 0',
        maxWidth: '500px',
    },
};

export const ContextualMenuDefaultExample = ({ project, task }) => {

    const menuProps = useConst({
        useTargetWidth: true,
        shouldFocusOnMount: true,
        items: [
            { key: 'page', text: <span><Icon className='ml-2' iconName='Forward' /></span>, href: 'http://localhost:3001/' + `projects/${project._id}/tasks/${task._id}` },
            { key: 'delete', text: <span><Icon className='ml-2' iconName='Cancel' /></span>, onClick: () => handleDeleteTask(project._id, task._id) },
        ],
    });

    return <DefaultButton menuProps={menuProps} />
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
        minWidth: 100,
        maxWidth: 100,
        isRowHeader: true,
        isResizable: true,
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
        name: 'Created',
        fieldName: 'createdAt',
        minWidth: 135,
        maxWidth: 200,
        isRowHeader: true,
        isResizable: true,
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
        key: 'column6',
        name: 'Updated',
        fieldName: 'updatedAt',
        minWidth: 135,
        maxWidth: 200,
        isRowHeader: true,
        isResizable: true,
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
        key: 'column7',
        name: 'Progress',
        fieldName: 'progress',
        minWidth: 50,
        maxWidth: 200,
        isRowHeader: true,
        isResizable: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        data: 'number',
        onRender: (item) => {
            return (parseFloat(item.progress.$numberDecimal) * 100) + ' %'
        },
        isPadded: true,
    },
    {
        key: 'column8',
        name: 'Options',
        minWidth: 100,
        maxWidth: 100,
        isRowHeader: true,
        isResizable: true,
        isSortedDescending: false,
        sortAscendingAriaLabel: 'Sorted A to Z',
        sortDescendingAriaLabel: 'Sorted Z to A',
        onRender: (item) => {
            return <ContextualMenuDefaultExample project={project1} task={item} />
        },
    }
];