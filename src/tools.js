export const tools = {
    get_clever_zones: {
        description: 'Get the list of Clever Cloud deployment zones',
        handler: async () => {
            const response = await fetch('https://api.clever-cloud.com/v4/products/zones', {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json'
                }
            });
            const data = await response.text();
            return data;
        },
        schema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    get_doc_urls: {
        description: 'Get the list of Clever Cloud documentation URLs in Markdown format',
        handler: async () => {
            const response = await fetch('https://www.clever-cloud.com/developers/llms.txt', {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json'
                }
            });
            const data = await response.text();
            return data;
        },
        schema: {
            type: 'object',
            properties: {},
            required: []
        }
    },
    fetch_webpage_markdown: {
        description: 'Get the content of a given URL in Markdown format',
        handler: async ({ url }) => {
            const encodedUrl = encodeURIComponent(url);
            const response = await fetch(`https://site2md.com/${encodedUrl}`, {
                method: 'GET',
                headers: {
                    "Content-Type": 'application/json'
                }
            });
            const data = await response.text();
            return data;
        },
        schema: {
            type: 'object',
            properties: {
                url: { type: 'string' },
            },
            required: ['url']
        }
    }
};