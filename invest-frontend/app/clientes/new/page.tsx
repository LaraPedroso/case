"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { toast } from "react-toastify";

const schema = z.object({
    name: z.string().min(1, "O nome é obrigatório"),
    email: z.string().email("Digite um email válido"),
    status: z.boolean({ required_error: "O status é obrigatório" }),
});

type ClientForm = z.infer<typeof schema>;

export default function NewClient() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        setValue,
        setError,
        watch,
        formState: { errors },
    } = useForm<ClientForm>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (data: ClientForm) => {
        try {
            await api.post("/clients", data);
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

    const statusValue = watch("status");
    return (
        <div className="min-h-screen flex items-center justify-center bg-sky-950 p-4">
            <div className="bg-gray-200 shadow-lg rounded-md p-8 w-full max-w-xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
                    Adicionar Cliente
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
                            placeholder="Digite o nome do cliente"
                        />
                        {errors.name && (
                            <p className="text-sm text-red-500">
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
                            placeholder="Digite o email do cliente"
                        />
                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Label>Status</Label>
                        <Select
                            onValueChange={(value) =>
                                setValue("status", value === "true")
                            }
                            value={
                                statusValue === undefined
                                    ? ""
                                    : String(statusValue)
                            }
                        >
                            <SelectTrigger className="w-full border-sky-950">
                                <SelectValue placeholder="Selecione o status" />
                            </SelectTrigger>
                            <SelectContent className="w-full border-sky-950">
                                <SelectItem value="true">Ativo</SelectItem>
                                <SelectItem value="false">Inativo</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.status && (
                            <p className="text-sm text-red-500">
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
                            Salvar
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
