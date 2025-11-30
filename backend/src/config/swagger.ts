import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SE 4458 - Midterm Project API",
      version: "1.0.0",
      description: "Mobile Provider Bill Payment System API Documentation",
      contact: {
        name: "Ahmet Kemal Biliciler",
      },
    },
    servers: [
      {
        url: "/api/v1",
        description: "API Gateway",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
