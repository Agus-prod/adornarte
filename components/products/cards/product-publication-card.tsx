type Props = {
    productId: string;
};

export function ProductPublicationCard({
    productId,
}: Props) {

    return (

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <h2 className="mb-4 text-xl font-semibold">

                Publicación

            </h2>

            <div className="rounded-xl border border-dashed p-10 text-center text-gray-400">

                Configuración del catálogo web.

            </div>

        </div>

    );

}