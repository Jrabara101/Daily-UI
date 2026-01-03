import { mockFileSystem } from './mockFileSystem';

export function parsePath(pathStr) {
    // Normalize path
    const cleanPath = pathStr === '/' ? '/' : pathStr.replace(/\/$/, '');
    const segments = cleanPath.split('/').filter(Boolean);

    const breadcrumbs = [];

    // Root setup
    let currentNode = mockFileSystem;
    // We can treat Root as the first breadcrumb or implicit. user example has "Home".
    // Let's add Home.
    breadcrumbs.push({
        id: 'root',
        label: mockFileSystem.name,
        url: '/',
        siblings: [], // Root usually logic handled elsewhere or no siblings for single-root FS
    });

    let parentPath = '';

    for (const segment of segments) {
        // If we lost track of the tree, just add generic segments
        if (!currentNode || !currentNode.children) {
            parentPath += `/${segment}`;
            breadcrumbs.push({
                id: segment,
                label: segment.charAt(0).toUpperCase() + segment.slice(1),
                url: parentPath,
                siblings: []
            });
            continue;
        }

        const parent = currentNode;
        const matchedChild = parent.children.find(c => c.slug.toLowerCase() === segment.toLowerCase());

        if (matchedChild) {
            const parentUrl = parentPath === '' ? '' : parentPath; // Handle root slash correctly

            const siblings = parent.children
                .filter(c => c.slug !== matchedChild.slug)
                .map(s => ({
                    label: s.name,
                    url: `${parentUrl}/${s.slug}`
                }));

            parentPath += `/${matchedChild.slug}`;

            breadcrumbs.push({
                id: matchedChild.slug,
                label: matchedChild.name,
                url: parentPath,
                siblings: siblings
            });

            currentNode = matchedChild;
        } else {
            // Not found
            parentPath += `/${segment}`;
            breadcrumbs.push({
                id: segment,
                label: segment.charAt(0).toUpperCase() + segment.slice(1),
                url: parentPath,
                siblings: []
            });
            currentNode = null;
        }
    }

    return breadcrumbs;
}
