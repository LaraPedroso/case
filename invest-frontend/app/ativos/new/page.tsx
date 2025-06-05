"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type Client = {
    id: number | string;
    name: string;
};

const assetSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    value: z.number({ required_error: "O valor é obrigatório" }),
    clientId: z.string().min(1, "Cliente é obrigatório"),
});

type AssetForm = z.infer<typeof assetSchema>;

export default function NewAssetsPage() {
    const { data: clients = [] } = useQuery({
        queryKey: ["activeClients"],
        queryFn: async () => {
            const res = await api.get("/clients/active");
            return res.data;
        },
    });
    const router = useRouter();

    const form = useForm<AssetForm>({
        resolver: zodResolver(assetSchema),
        defaultValues: {
            name: "",
            value: undefined,
            clientId: "",
        },
    });

    const onSubmit = async (data: AssetForm) => {
        try {
            await api.post("/assets", {
                name: data.name,
                value: Number(data.value),
                clientId: Number(data.clientId),
            });

            router.push("/ativos");
        } catch (error: any) {
            const issues = error.response?.data?.issues;
            if (issues && Array.isArray(issues)) {
                issues.forEach((issue) => {
                    const fieldName = issue.path?.[0];
                    const message = issue.message;

                    if (fieldName && message) {
                        form.setError(fieldName as keyof AssetForm, {
                            type: "manual",
                            message,
                        });
                    }
                });
            }
        }
    };

    function formatCurrency(value: number) {
        if (isNaN(value)) return "";
        return value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        });
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-sky-950 p-4">
            <div className="bg-gray-200 shadow-lg rounded-md p-8 w-full max-w-xl">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
                    Criar Ativo Financeiro
                </h1>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 text-gray-700"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nome do Ativo</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Ações XYZ"
                                            {...field}
                                            className="border-sky-950"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="value"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Valor (R$)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            inputMode="numeric"
                                            placeholder="Ex: 1.000,50"
                                            value={formatCurrency(
                                                Number(field.value)
                                            )}
                                            onChange={(e) => {
                                                const rawValue =
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    );
                                                const numericValue =
                                                    Number(rawValue) / 100;
                                                field.onChange(numericValue);
                                            }}
                                            className="border-sky-950"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="clientId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cliente</FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full border-sky-950 cursor-pointer">
                                                <SelectValue placeholder="Selecione um cliente" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="w-full border-sky-950 ">
                                            {clients.map((client: Client) => (
                                                <SelectItem
                                                    key={client.id}
                                                    value={String(client.id)}
                                                >
                                                    {client.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex flex-col sm:flex-row gap-4 mt-6">
                            <Button
                                type="button"
                                onClick={() => router.push("/ativos")}
                                className="w-full sm:w-1/2 bg-sky-950 hover:bg-sky-800 text-white cursor-pointer"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                className="w-full sm:w-1/2 cursor-pointer"
                            >
                                Criar
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
}
