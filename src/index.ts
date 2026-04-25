import { serve } from "bun";
import index from "./index.html";
import { save, getAll, getById, update, remove } from "./services/ContactService";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/hello": {
      async GET(req) {
        return Response.json({
          message: "Hello, world!",
          method: "GET",
        });
      },
      async PUT(req) {
        return Response.json({
          message: "Hello, world!",
          method: "PUT",
        });
      },
    },
    "/api/contacts": {
      async GET(req) {
        return Response.json(getAll());
      },
      async POST(req) {
        const contact = await req.json();
        save(contact);
        return Response.json({ message: "Contact saved successfully" });
      },
      async PUT(req) {
        const contact = await req.json();
        update(contact.id, contact);
        return Response.json({ message: "Contact updated successfully" });
      },
      async DELETE(req) {
        const contact = await req.json();
        remove(contact.id);
        return Response.json({ message: "Contact deleted successfully" });
      },
    },
    "/api/contacts/:id": {
      async GET(req) {
        const id = Number(req.params.id);
        return Response.json(getById(id));
      },
      async PUT(req) {
        const id = Number(req.params.id);
        const contact = await req.json();
        update(id, contact);
        return Response.json({ message: "Contact updated successfully" });
      },
      async DELETE(req) {
        const id = Number(req.params.id);
        remove(id);
        return Response.json({ message: "Contact deleted successfully" });
      },
    },
    "/api/hello/:name": async req => {
      const name = req.params.name;
      return Response.json({
        message: `Hello, ${name}!`,
      });
    },
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
