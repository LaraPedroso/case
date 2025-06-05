import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function Home() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-sky-950 p-4">
            <Card className="w-full max-w-xl bg-gray-200 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-center text-gray-700 text-2xl">
                        Dashboard de Investimentos
                    </CardTitle>
                </CardHeader>

                <CardContent className="text-center text-gray-700">
                    <p className="mb-6 text-gray-600">
                        Gerencie clientes e veja ativos financeiros
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link href="/clientes" className="w-full sm:w-auto">
                            <Button className="w-full sm:w-auto cursor-pointer">
                                Gerenciar Clientes
                            </Button>
                        </Link>
                        <Link href="/ativos" className="w-full sm:w-auto">
                            <Button
                                variant="secondary"
                                className="w-full sm:w-1/1 bg-sky-950 hover:bg-sky-800 text-white cursor-pointer"
                            >
                                Ver Ativos
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
