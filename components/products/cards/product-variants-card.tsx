type Props = {
    productId: string;
};

export function ProductVariantsCard({
    productId,
}: Props) {

    return (

        <div className="rounded-2xl border bg-white p-6 shadow-sm">

            <div className="flex items-center justify-between">

                <div>

                    <h2 className="text-xl font-semibold">

                        Variantes

                    </h2>

                    <p className="text-sm text-gray-500">

                        Administra tonos,
                        colores,
                        tallas y presentaciones.

                    </p>

                </div>

                <button
                    className="rounded-xl bg-pink-600 px-4 py-2 font-medium text-white hover:bg-pink-700"
                >

                    Nueva variante

                </button>

            </div>

            <div className="mt-8 rounded-xl border border-dashed p-10 text-center text-gray-400">

                Aquí aparecerá la tabla de variantes.

            </div>

        </div>

    );

}