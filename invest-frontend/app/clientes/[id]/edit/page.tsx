"use client";

import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useEffect } from "react";
import { toast } from "react-toastify";

const schema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Digite um email válido"),
    status: z.boolean({ required_error: "O status é obrigatório" }),
});

type ClientForm = z.infer<typeof schema>;

export default function EditClient() {
    const { id } = useParams();
    const router = useRouter();

    const { data: client } = useQuery({
        queryKey: ["client", id],
        queryFn: async () => {
            const res = await api.get(`/clients/${id}`);
            return res.data;
        },
        enabled: !!id,
    });

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        setError,
        formState: { errors },
    } = useForm<ClientForm>({
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        if (client) {
            reset({
                name: client.name,
                email: client.email,
                status: client.status,
            });
        }
    }, [client, reset]);

    const onSubmit = async (data: ClientForm) => {
        try {
            await api.put(`/clients/${id}`, data);

            router.push("/clientes");
        } catch (error: any) {
            if (error.response) {
                const status = error.response.status;

                if (status === 409) {
                    setError("email", {
                        type: "manual",
                        message: "Este email já está cadastrado",
                    });
                    return;
                }

                if (status === 400) {
                    toast.error("Dados inválidos");
                    return;
                }
            }
            toast.error("Erro ao cadastrar cliente");
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-sky-950 p-4">
            <div className="bg-gray-200 shadow-lg rounded-md p-8 w-full max-w-xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
                    Editar Cliente
                </h1>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 text-gray-700"
                >
                    <div className="space-y-1">
                        <Label htmlFor="name">Nome</Label>
                        <Input
                            id="name"
                            {...register("name")}
                            className="border-sky-950"
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm">
                                {errors.name.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            {...register("email")}
                            className="border-sky-950"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            onValueChange={(value: string) =>
                                setValue("status", value === "true")
                            }
                            value={String(watch("status"))}
                        >
                            <SelectTrigger
                                className="w-full border-sky-950"
                                id="status"
                            >
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent className="w-full border-sky-950">
                                <SelectItem value="true">Ativo</SelectItem>
                                <SelectItem value="false">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="text-red-500 text-sm">
                                {errors.status.message}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-6">
                        <Button
                            type="button"
                            onClick={() => router.push("/clientes")}
                            className="w-full sm:w-1/2 bg-sky-950 hover:bg-sky-800 text-white"
                        >
                            Cancelar
                        </Button>
                        <Button type="submit" className="w-full sm:w-1/2">
                            Atualizar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
