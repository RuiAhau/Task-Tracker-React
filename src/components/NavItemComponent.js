import { Nav } from '@fluentui/react/lib/Nav';

const navStyles = { root: { width: 200, backgroundColor: '#FFFFFF', top: 7 } };

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
                url: '/projectsassociated',
            }
        ],
        forceAnchor: false
    },
];

const Nave = () => {
    return (
        <Nav
            styles={navStyles}
            groups={navLinkGroups}
            isOnTop
            focusZoneProps={{
                defaultTabbableElement: "a[title='Projects']",
                allowFocusRoot: false,
            }}
        />
    );
}

export default Nave;