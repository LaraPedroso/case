"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { Fragment, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ChevronDown, CircleArrowLeft, Pencil } from "lucide-react";

interface Asset {
    id: number;
    name: string;
    value: number;
}

interface Client {
    id: number;
    name: string;
    email: string;
    status: boolean;
    assets: Asset[];
}

export default function ClientesPage() {
    const router = useRouter();
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const { data: clients = [] } = useQuery({
        queryKey: ["clients"],
        queryFn: async () => {
            const res = await api.get("/clients");
            return res.data;
        },
    });

    const handleToggleDropdown = (id: number) => {
        setOpenDropdown((prev) => (prev === id ? null : id));
    };

    return (
        <div className="min-h-screen flex items-start justify-center bg-sky-950 p-4">
            <div className="bg-gray-200 shadow-lg rounded-md p-8 w-full max-w-5xl">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            className="text-gray-100 hover:text-gray-300 cursor-pointer "
                            onClick={() => router.push("/")}
                        >
                            <CircleArrowLeft />
                        </Button>
                        <h1 className="text-2xl font-bold text-gray-700">
                            Clientes
                        </h1>
                    </div>

                    <Button onClick={() => router.push("/clientes/new")}>
                        Adicionar Cliente
                    </Button>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-900 hover:bg-gray-900 ">
                            <TableHead className="text-white">Nome</TableHead>
                            <TableHead className="text-white">Email</TableHead>
                            <TableHead className="text-white">Status</TableHead>
                            <TableHead className="text-white text-center">
                                Ações
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="rounded-md text-gray-700 hover:bg-transparent">
                        {clients.map((client: Client) => (
                            <Fragment key={client.id}>
                                <TableRow
                                    key={client.id}
                                    className="hover:bg-gray-300 transition-colors duration-200"
                                >
                                    <TableCell>{client.name}</TableCell>
                                    <TableCell>{client.email}</TableCell>
                                    <TableCell>
                                        {client.status ? "Ativo" : "Inativo"}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex justify-center gap-2">
                                            <Button
                                                size="sm"
                                                onClick={() =>
                                                    router.push(
                                                        `/clientes/${client.id}/edit`
                                                    )
                                                }
                                                className="cursor-pointer "
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="icon"
                                                variant="ghost"
                                                onClick={() =>
                                                    handleToggleDropdown(
                                                        client.id
                                                    )
                                                }
                                                className=" cursor-pointer transition-transform duration-200"
                                            >
                                                <ChevronDown
                                                    className={`h-4 w-4 transform transition-transform duration-200 ${
                                                        openDropdown ===
                                                        client.id
                                                            ? "rotate-180"
                                                            : "rotate-0"
                                                    }`}
                                                />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>

                                {openDropdown === client.id && (
                                    <TableRow>
                                        <TableCell
                                            colSpan={4}
                                            className="bg-gray-300 p-4"
                                        >
                                            {client.assets.length > 0 ? (
                                                <ul className="space-y-1">
                                                    {client.assets.map(
                                                        (asset: Asset) => (
                                                            <li
                                                                key={asset.id}
                                                                className="text-sm text-gray-700 flex justify-between mr-15"
                                                            >
                                                                <span>
                                                                    {asset.name}
                                                                </span>
                                                                <span>
                                                                    {new Intl.NumberFormat(
                                                                        "pt-BR",
                                                                        {
                                                                            style: "currency",
                                                                            currency:
                                                                                "BRL",
                                                                        }
                                                                    ).format(
                                                                        asset.value
                                                                    )}
                                                                </span>
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-gray-500">
                                                    Nenhum ativo vinculado.
                                                </p>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                )}
                            </Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
