export const mockFileSystem = {
    name: "Home",
    slug: "",
    type: "root",
    children: [
        {
            name: "Projects",
            slug: "projects",
            type: "folder",
            children: [
                {
                    name: "2025",
                    slug: "2025",
                    type: "folder",
                    children: []
                },
                {
                    name: "2026",
                    slug: "2026",
                    type: "folder",
                    children: [
                        {
                            name: "Q1",
                            slug: "q1",
                            type: "folder",
                            children: [
                                {
                                    name: "Marketing",
                                    slug: "marketing",
                                    type: "folder",
                                    children: [
                                        {
                                            name: "Social Ads",
                                            slug: "social-ads",
                                            type: "folder",
                                            children: [
                                                { name: "Campaign A", slug: "campaign-a", type: "file" },
                                                { name: "Campaign B", slug: "campaign-b", type: "file" },
                                                { name: "Analytics", slug: "analytics", type: "file" }
                                            ]
                                        },
                                        {
                                            name: "Email Campaigns",
                                            slug: "email-campaigns",
                                            type: "folder",
                                            children: []
                                        },
                                        {
                                            name: "SEO",
                                            slug: "seo",
                                            type: "folder",
                                            children: []
                                        }
                                    ]
                                },
                                {
                                    name: "Engineering",
                                    slug: "engineering",
                                    type: "folder",
                                    children: [
                                        { name: "Backend", slug: "backend", type: "folder", children: [] },
                                        { name: "Frontend", slug: "frontend", type: "folder", children: [] }
                                    ]
                                },
                                {
                                    name: "Design",
                                    slug: "design",
                                    type: "folder",
                                    children: [
                                        { name: "Assets", slug: "assets", type: "folder", children: [] },
                                        { name: "Mockups", slug: "mockups", type: "folder", children: [] }
                                    ]
                                }
                            ]
                        },
                        {
                            name: "Q2",
                            slug: "q2",
                            type: "folder",
                            children: []
                        }
                    ]
                }
            ]
        },
        {
            name: "Documents",
            slug: "documents",
            type: "folder",
            children: [
                { name: "Invoices", slug: "invoices", type: "folder", children: [] },
                { name: "Contracts", slug: "contracts", type: "folder", children: [] }
            ]
        },
        {
            name: "Settings",
            slug: "settings",
            type: "folder",
            children: [
                { name: "Profile", slug: "profile", type: "page" },
                { name: "Security", slug: "security", type: "page" }
            ]
        }
    ]
};
