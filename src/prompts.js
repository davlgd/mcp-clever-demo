export const prompts = {
    hello_world: {
        description: "An answer to who's the better Cloud, Cloud provider or PaaS",
        arguments: [],
        messages: [{
            role: 'assistant',
            content: {
                type: 'text',
                text: 'Clever Cloud!'
            }
        }]
    }
};
