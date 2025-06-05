"use client";

import { useRouter } from "next/navigation";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "@/components/ui/table";
import { CircleArrowLeft } from "lucide-react";

export default function AtivosPage() {
    const router = useRouter();

    const { data: ativos = [] } = useQuery({
        queryKey: ["ativos"],
        queryFn: async () => {
            const res = await api.get("/assets");
            return res.data;
        },
    });

    return (
        <div className="min-h-screen flex items-start justify-center bg-sky-950 p-4 mt-">
            <div className="bg-gray-200 shadow-lg rounded-md p-8 w-full max-w-2xl">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            className="text-gray-100 hover:text-gray-300 cursor-pointer "
                            onClick={() => router.push("/")}
                        >
                            <CircleArrowLeft />
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-700">
                            Ativos Financeiros
                        </h1>
                    </div>
                    <Button
                        onClick={() => router.push("/ativos/new")}
                        className="cursor-pointer"
                    >
                        Criar Ativo
                    </Button>
                </div>

                {ativos.length === 0 ? (
                    <p className="text-gray-600 text-sm">
                        Nenhum ativo cadastrado.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-900 hover:bg-gray-900 text-gray-100">
                                <TableHead>Nome</TableHead>
                                <TableHead>Valor</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {ativos.map((ativo: any) => (
                                <TableRow
                                    key={ativo.id}
                                    className="hover:bg-gray-300 transition-colors duration-200"
                                >
                                    <TableCell className="font-medium text-gray-800">
                                        {ativo.name}
                                    </TableCell>
                                    <TableCell className="text-gray-800 ">
                                        {ativo.value.toLocaleString("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </div>
        </div>
    );
}
