process.env.NODE_ENV = 'test';

const { app } = await import('../server.js');

const server = app.listen(0, async () => {
    const { port } = server.address();

    try {
        const response = await fetch(`http://localhost:${port}/api/health`);
        if (!response.ok) {
            throw new Error(`Unexpected status: ${response.status}`);
        }

        const body = await response.text();
        console.log(body);
        server.close(() => process.exit(0));
    } catch (error) {
        console.error('Health check failed:', error);
        server.close(() => process.exit(1));
    }
});
