import { ReactQueryProvider } from "@/src/providers/react-query";
import "./globals.css";

export const metadata = {
    title: "Invest App",
    description: "Gestão de clientes e ativos",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            <body>
                <ReactQueryProvider>{children}</ReactQueryProvider>
            </body>
        </html>
    );
}
