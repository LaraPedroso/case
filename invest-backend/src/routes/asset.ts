import { FastifyInstance } from "fastify";
import { z, ZodError } from "zod";
import { prisma } from "../utils/prisma";

export async function assetsRoutes(app: FastifyInstance) {
    app.post("/assets", async (request, reply) => {
        try {
            const schema = z.object({
                name: z.string().min(1, "O nome é obrigatório"),
                value: z.preprocess(
                    (arg) => {
                        if (typeof arg === "string") {
                            const parsed = Number(arg);
                            return isNaN(parsed) ? undefined : parsed;
                        }
                        return arg;
                    },
                    z.number({
                        required_error: "O valor é obrigatório",
                    })
                ),
                clientId: z.number({
                    required_error: "O cliente é obrigatório",
                }),
            });

            const { name, value, clientId } = schema.parse(request.body);

            const asset = await prisma.asset.create({
                data: { name, value, clientId },
            });

            return reply.status(201).send(asset);
        } catch (err) {
            if (err instanceof ZodError) {
                return reply.status(400).send({ issues: err.errors });
            }

            console.error(err);
            return reply
                .status(500)
                .send({ message: "Erro interno no servidor" });
        }
    });

    app.get("/assets", async (request, reply) => {
        const assets = await prisma.asset.findMany({
            select: {
                id: true,
                name: true,
                value: true,
            },
        });

        return assets;
    });
}
