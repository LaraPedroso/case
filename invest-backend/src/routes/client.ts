import { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../utils/prisma";

export async function clientRoutes(app: FastifyInstance) {
    app.post("/clients", async (request, reply) => {
        const schema = z.object({
            name: z.string().min(1, "O nome é obrigatório"),
            email: z.string().email("Digite um email válido"),
            status: z.boolean({ required_error: "O status é obrigatório" }),
        });

        const data = schema.parse(request.body);

        try {
            const client = await prisma.client.create({ data });
            return reply.status(201).send(client);
        } catch (error: any) {
            if (
                error.code === "P2002" &&
                error.meta?.target?.includes("email")
            ) {
                return reply
                    .status(409)
                    .send({ message: "Email já cadastrado" });
            }

            console.error(error);
            return reply
                .status(500)
                .send({ message: "Erro interno no servidor" });
        }
    });

    app.get("/clients", async () => {
        return prisma.client.findMany({ include: { assets: true } });
    });

    app.get("/clients/:id", async (request) => {
        const { id } = request.params as { id: string };

        const client = await prisma.client.findUnique({
            where: { id: Number(id) },
            include: { assets: true },
        });

        return client;
    });

    app.get("/clients/active", async () => {
        return prisma.client.findMany({
            where: { status: true },
        });
    });

    app.put("/clients/:id", async (request, reply) => {
        const params = request.params as { id: string };
        const id = Number(params.id);

        const schema = z.object({
            name: z.string().min(1, "O nome é obrigatório"),
            email: z.string().email("Digite um email válido"),
            status: z.boolean({ required_error: "O status é obrigatório" }),
        });

        const data = schema.parse(request.body);

        try {
            const client = await prisma.client.update({
                where: { id },
                data,
            });

            return reply.send(client);
        } catch (error: any) {
            if (
                error.code === "P2002" &&
                error.meta?.target?.includes("email")
            ) {
                return reply.status(409).send({
                    message: "Este e-mail já está cadastrado.",
                });
            }

            return reply.status(500).send({
                message: "Erro ao atualizar cliente.",
            });
        }
    });
}
