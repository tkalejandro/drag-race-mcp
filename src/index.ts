
import { StdioServerTransport } from "@modelcontextprotocol/server/stdio";
import { createServer } from "./server.ts";


const main = async () => {
    const transport = new StdioServerTransport();
    const server = createServer();
    await server.connect(transport);
    console.error("Server is running on stdio");
};

main().catch(error => {
    console.error("Fatal error in main():", error);
    process.exit(1);
});