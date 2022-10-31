import { Nav } from '@fluentui/react/lib/Nav';

const navStyles = { root: { width: 200 } };

const navLinkGroups = [
    {
        name: 'Task Tracker',
        links: [
            {
                key: 'Projects',
                name: 'Projects',
                url: '/projects',
            },
            {
                key: 'ProjectsAssociated',
                name: 'Projects Associated',
                url: '/undifined'
            },
            {
                key: 'TasksAssociated',
                name: 'Tasks Associated',
                url: '/undifined'
            }
        ],
    },
];

const Nave = () => {
    return (
        <Nav
            styles={navStyles}
            groups={navLinkGroups}
            focusZoneProps={{
                defaultTabbableElement: "a[title='Projects']",
                allowFocusRoot: false,
            }}
        />
    );
}

export default Nave;