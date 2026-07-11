"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import {
  Barcode,
  Camera,
  CreditCard,
  Minus,
  Package,
  Plus,
  Search,
  ShoppingCart,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createSaleAction } from "@/app/(dashboard)/pos/actions";

type Product = {
  id: string;
  name: string;
  barcode?: string | null;
  sku?: string | null;
  stock: number | null;
  sale_price: number | null;
};

type Customer = {
  id: string;
  name: string;
  credit_enabled?: boolean | null;
};

type CartItem = Product & {
  quantity: number;
};

type PaymentMethod =
  | "CASH"
  | "CARD"
  | "TRANSFER"
  | "CREDIT";

type BarcodeDetectorResult = {
  rawValue: string;
};

type BarcodeDetectorInstance = {
  detect(
    source: CanvasImageSource
  ): Promise<BarcodeDetectorResult[]>;
};

type BarcodeDetectorConstructor = new (options: {
  formats: string[];
}) => BarcodeDetectorInstance;

function getBarcodeDetector() {
  return (
    globalThis as typeof globalThis & {
      BarcodeDetector?: BarcodeDetectorConstructor;
    }
  ).BarcodeDetector;
}

function getBarcodeReader() {
  const hints =
    new Map<DecodeHintType, unknown>();

  hints.set(
    DecodeHintType.POSSIBLE_FORMATS,
    [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.ITF,
      BarcodeFormat.QR_CODE,
    ]
  );
  hints.set(
    DecodeHintType.TRY_HARDER,
    true
  );

  return new BrowserMultiFormatReader(
    hints
  );
}

function money(value: number) {
  return `L ${value.toFixed(2)}`;
}

export function PosClient({
  products,
  customers,
}: {
  products: Product[];
  customers: Customer[];
}) {
  const router = useRouter();
  const [search, setSearch] =
    useState("");
  const [cart, setCart] = useState<
    CartItem[]
  >([]);
  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState("");
  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState<PaymentMethod>("CASH");
  const [
    paidAmount,
    setPaidAmount,
  ] = useState("");
  const [
    reference,
    setReference,
  ] = useState("");
  const [
    scannerOpen,
    setScannerOpen,
  ] = useState(false);
  const [
    manualCode,
    setManualCode,
  ] = useState("");
  const [isPending, startTransition] =
    useTransition();

  const filteredProducts = useMemo(
    () =>
      products.filter((product) =>
        [
          product.name,
          product.sku,
          product.barcode,
        ].some((value) =>
          (value ?? "")
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
        )
      ),
    [products, search]
  );

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.sale_price ?? 0) *
        item.quantity,
    0
  );
  const hasPaidAmount =
    paidAmount.trim() !== "";
  const received =
    paymentMethod === "CREDIT"
      ? 0
      : Number(paidAmount);
  const hasEnoughPayment =
    paymentMethod === "CREDIT" ||
    (hasPaidAmount &&
      Number.isFinite(received) &&
      received >= total);
  const change =
    paymentMethod === "CASH"
      ? Math.max(
          0,
          Number(paidAmount || 0) -
            total
        )
      : 0;
  const missingAmount =
    paymentMethod === "CASH"
      ? Math.max(
          0,
          total -
            Number(paidAmount || 0)
        )
      : 0;
  const selectedCustomerData =
    customers.find(
      (customer) =>
        customer.id === selectedCustomer
    );

  function addToCart(product: Product) {
    const stock = product.stock ?? 0;

    if (stock <= 0) {
      toast.error(
        "Este producto no tiene stock."
      );
      return;
    }

    setCart((current) => {
      const existing = current.find(
        (item) => item.id === product.id
      );

      if (!existing) {
        return [
          ...current,
          {
            ...product,
            quantity: 1,
          },
        ];
      }

      if (existing.quantity >= stock) {
        toast.warning(
          `Solo hay ${stock} unidades disponibles.`
        );
        return current;
      }

      return current.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity:
                item.quantity + 1,
            }
          : item
      );
    });
  }

  const addProductByCode = useCallback(
    (code: string) => {
    const cleanCode = code.trim();

    if (!cleanCode) {
      return;
    }

    const product = products.find(
      (item) =>
        item.barcode === cleanCode ||
        item.sku === cleanCode
    );

    if (!product) {
      toast.error(
        `No encontre producto con codigo ${cleanCode}.`
      );
      setSearch(cleanCode);
      return;
    }

    addToCart(product);
    toast.success(
      `${product.name} agregado.`
    );
    setSearch("");
    setManualCode("");
    setScannerOpen(false);
    },
    [products]
  );

  function removeItem(productId: string) {
    setCart((current) =>
      current.filter(
        (item) => item.id !== productId
      )
    );
  }

  function updateQuantity(
    productId: string,
    quantity: number
  ) {
    const product = products.find(
      (item) => item.id === productId
    );
    const stock = product?.stock ?? 0;

    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    if (quantity > stock) {
      toast.warning(
        `Solo hay ${stock} unidades disponibles.`
      );
      return;
    }

    setCart((current) =>
      current.map((item) =>
        item.id === productId
          ? {
              ...item,
              quantity,
            }
          : item
      )
    );
  }

  function finishSale() {
    if (!cart.length) {
      toast.info(
        "Agrega productos al carrito."
      );
      return;
    }

    if (
      paymentMethod === "CREDIT" &&
      !selectedCustomer
    ) {
      toast.error(
        "Selecciona un cliente para venta al credito."
      );
      return;
    }

    if (
      paymentMethod !== "CREDIT" &&
      !hasEnoughPayment
    ) {
      toast.error(
        "Ingresa un monto recibido igual o mayor al total."
      );
      return;
    }

    const items = cart.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      price: Number(
        item.sale_price ?? 0
      ),
    }));

    startTransition(async () => {
      try {
        await createSaleAction(
          items,
          selectedCustomer || undefined,
          paymentMethod,
          received,
          reference || undefined
        );

        setCart([]);
        setPaidAmount("");
        setReference("");
        toast.success(
          "Venta registrada correctamente."
        );
        router.refresh();
      } catch (error) {
        console.error(error);
        toast.error(
          "Ocurrio un error al registrar la venta."
        );
      }
    });
  }

  function selectPaymentMethod(
    method: PaymentMethod
  ) {
    setPaymentMethod(method);

    if (method !== "CASH") {
      setPaidAmount(total.toFixed(2));
    }

    if (method === "CREDIT") {
      setPaidAmount("");
    }
  }

  return (
    <div className="grid gap-6 xl:h-[calc(100vh-11rem)] xl:grid-cols-[1fr_30rem] xl:overflow-hidden">
      <section className="flex min-h-[28rem] flex-col rounded-3xl border bg-white p-5 shadow-sm xl:min-h-0">
        <div className="mb-4 flex items-center gap-2">
          <Package size={20} />
          <h2 className="text-lg font-semibold">
            Productos
          </h2>
        </div>

        <div className="relative mb-5">
          <Search
            size={18}
            className="absolute left-3 top-3.5 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(
                event.target.value
              )
            }
            placeholder="Buscar producto..."
            className="w-full rounded-xl border py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-pink-300"
          />
        </div>

        <div className="mb-5 grid gap-2 sm:grid-cols-[1fr_auto]">
          <div className="relative">
            <Barcode
              size={18}
              className="absolute left-3 top-3.5 text-gray-400"
            />
            <input
              type="text"
              value={manualCode}
              onChange={(event) =>
                setManualCode(
                  event.target.value
                )
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter"
                ) {
                  event.preventDefault();
                  addProductByCode(
                    manualCode
                  );
                }
              }}
              placeholder="SKU o codigo de barra"
              className="w-full rounded-xl border py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-pink-300"
            />
          </div>

          <button
            type="button"
            onClick={() =>
              setScannerOpen(true)
            }
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            <Camera size={18} />
            Escanear
          </button>
        </div>

        <div className="grid max-h-[34rem] min-h-0 flex-1 gap-4 overflow-y-auto pr-1 sm:grid-cols-2 xl:max-h-none">
          {filteredProducts.map((product) => {
            const stock =
              product.stock ?? 0;
            const noStock = stock <= 0;

            return (
              <button
                key={product.id}
                type="button"
                disabled={noStock}
                onClick={() =>
                  addToCart(product)
                }
                className="rounded-2xl border p-4 text-left transition-all hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-semibold">
                    {product.name}
                  </h3>
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-medium ${
                      noStock
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {noStock
                      ? "Sin stock"
                      : `${stock} disponibles`}
                  </span>
                </div>
                <p className="mt-4 text-2xl font-bold text-pink-600">
                  {money(
                    Number(
                      product.sale_price ?? 0
                    )
                  )}
                </p>
                <div className="mt-4 rounded-xl bg-pink-600 px-4 py-2 text-center font-semibold text-white">
                  Agregar
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <aside className="flex min-h-0 flex-col rounded-3xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <ShoppingCart size={20} />
          <h2 className="text-lg font-semibold">
            Carrito
          </h2>
        </div>

        <label className="mb-2 block text-sm font-medium">
          Cliente
        </label>
        <select
          value={selectedCustomer}
          onChange={(event) =>
            setSelectedCustomer(
              event.target.value
            )
          }
          className="mb-4 w-full rounded-xl border p-3"
        >
          <option value="">
            Consumidor Final
          </option>
          {customers.map((customer) => (
            <option
              key={customer.id}
              value={customer.id}
            >
              {customer.name}
            </option>
          ))}
        </select>

        <section className="mb-4 rounded-2xl border border-pink-100 bg-pink-50/70 p-3">
          <div className="mb-3 flex items-center gap-2">
            <CreditCard size={18} />
            <h3 className="font-semibold">
              Cobro
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              ["CASH", "Efectivo"],
              ["TRANSFER", "Transferencia"],
              ["CARD", "Tarjeta"],
              ["CREDIT", "Credito"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  selectPaymentMethod(
                    value as PaymentMethod
                  )
                }
                className={`min-h-10 rounded-xl border text-sm font-semibold ${
                  paymentMethod === value
                    ? "border-pink-500 bg-pink-600 text-white"
                    : "bg-white text-gray-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {paymentMethod !== "CREDIT" && (
            <div className="mt-3 grid gap-2">
              <input
                type="number"
                min="0"
                step="0.01"
                value={paidAmount}
                onChange={(event) =>
                  setPaidAmount(
                    event.target.value
                  )
                }
                placeholder={
                  paymentMethod === "CASH"
                    ? "Efectivo recibido"
                    : "Monto pagado"
                }
                className="min-h-10 rounded-xl border bg-white px-3 text-sm"
              />

              {paymentMethod !== "CASH" && (
                <input
                  value={reference}
                  onChange={(event) =>
                    setReference(
                      event.target.value
                    )
                  }
                  placeholder="Referencia"
                  className="min-h-10 rounded-xl border bg-white px-3 text-sm"
                />
              )}

              {paymentMethod === "CASH" && (
                <div className="rounded-xl bg-white p-3 text-sm">
                  <span className="text-gray-500">
                    {missingAmount > 0
                      ? "Falta"
                      : "Vuelto"}
                  </span>
                  <p
                    className={
                      missingAmount > 0
                        ? "text-xl font-black text-red-600"
                        : "text-xl font-black text-pink-600"
                    }
                  >
                    {money(
                      missingAmount > 0
                        ? missingAmount
                        : change
                    )}
                  </p>
                </div>
              )}
            </div>
          )}

          {paymentMethod === "CREDIT" && (
            <div className="mt-3 rounded-xl bg-white p-3 text-sm text-gray-600">
              {selectedCustomerData
                ? `Se cargara al credito de ${selectedCustomerData.name}.`
                : "Selecciona un cliente para usar credito."}
            </div>
          )}
        </section>

        {cart.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-6 text-center text-gray-500">
            No hay productos agregados.
          </div>
        ) : (
          <div className="max-h-[26rem] min-h-0 flex-1 space-y-3 overflow-y-auto pr-1 xl:max-h-none">
            {cart.map((item) => {
              const subtotal =
                Number(item.sale_price ?? 0) *
                item.quantity;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium">
                        {item.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {money(
                          Number(
                            item.sale_price ?? 0
                          )
                        )}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        removeItem(item.id)
                      }
                      className="text-sm font-medium text-red-600"
                    >
                      Quitar
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity - 1
                          )
                        }
                        className="rounded-lg border p-2"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="min-w-[30px] text-center font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.id,
                            item.quantity + 1
                          )
                        }
                        className="rounded-lg border p-2"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs text-gray-500">
                        Subtotal
                      </p>
                      <p className="font-bold">
                        {money(subtotal)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="sticky bottom-0 mt-4 border-t bg-white pt-4">
          <p className="text-center text-sm text-gray-500">
            TOTAL
          </p>
          <p className="text-center text-4xl font-bold text-pink-600">
            {money(total)}
          </p>

          <button
            type="button"
            onClick={finishSale}
            disabled={
              isPending ||
              cart.length === 0 ||
              !hasEnoughPayment
            }
            className="mt-5 w-full rounded-xl bg-pink-500 px-4 py-3 font-medium text-white transition hover:bg-pink-600 disabled:opacity-50"
          >
            {isPending
              ? "Procesando..."
              : "Finalizar venta"}
          </button>
        </div>
      </aside>

      {scannerOpen && (
        <BarcodeScannerDialog
          onClose={() =>
            setScannerOpen(false)
          }
          onDetected={addProductByCode}
        />
      )}
    </div>
  );
}

function BarcodeScannerDialog({
  onClose,
  onDetected,
}: {
  onClose: () => void;
  onDetected: (code: string) => void;
}) {
  const videoRef =
    useRef<HTMLVideoElement | null>(null);
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null
    );
  const detectedRef = useRef(false);
  const [
    scannerMessage,
    setScannerMessage,
  ] = useState(
    "Apunta la camara al codigo de barras."
  );

  useEffect(() => {
    let active = true;
    let frameId = 0;
    let stream: MediaStream | null = null;
    let scannerControls: {
      stop: () => void;
    } | null = null;

    async function startScanner() {
      if (
        !navigator.mediaDevices
          ?.getUserMedia
      ) {
        setScannerMessage(
          "Este navegador no tiene acceso directo a la camara. Usa el campo de codigo manual."
        );
        return;
      }

      const BarcodeDetector =
        getBarcodeDetector();

      if (BarcodeDetector) {
        await startNativeScanner(
          BarcodeDetector
        );
        return;
      }

      try {
        await startCompatibleScanner();
      } catch {
        setScannerMessage(
          "No pude abrir la camara. Revisa permisos o usa el codigo manual."
        );
      }
    }

    async function startNativeScanner(
      BarcodeDetector: BarcodeDetectorConstructor
    ) {
      try {
        stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: {
                facingMode:
                  "environment",
                width: {
                  ideal: 1280,
                },
                height: {
                  ideal: 720,
                },
              },
              audio: false,
            }
          );

        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;
          await videoRef.current.play();
        }

        const detector =
          new BarcodeDetector({
            formats: [
              "ean_13",
              "ean_8",
              "code_128",
              "code_39",
              "upc_a",
              "upc_e",
              "qr_code",
            ],
          });

        async function scan() {
          if (
            !active ||
            detectedRef.current
          ) {
            return;
          }

          const video =
            videoRef.current;
          const canvas =
            canvasRef.current;

          if (
            video &&
            canvas &&
            video.readyState >= 2
          ) {
            canvas.width =
              video.videoWidth;
            canvas.height =
              video.videoHeight;
            const context =
              canvas.getContext("2d");

            if (context) {
              context.drawImage(
                video,
                0,
                0,
                canvas.width,
                canvas.height
              );
              const results =
                await detector.detect(
                  canvas
                );
              const code =
                results[0]?.rawValue;

              if (code) {
                detectedRef.current =
                  true;
                onDetected(code);
                return;
              }
            }
          }

          frameId =
            requestAnimationFrame(
              scan
            );
        }

        frameId =
          requestAnimationFrame(scan);
      } catch {
        setScannerMessage(
          "No pude abrir la camara. Revisa permisos o usa el codigo manual."
        );
      }
    }

    async function startCompatibleScanner() {
      const video = videoRef.current;

      if (!video) {
        return;
      }

      setScannerMessage(
        "Lector compatible activo. Acerca el codigo y manten la camara estable."
      );

      const reader = getBarcodeReader();

      scannerControls =
        await reader.decodeFromConstraints(
          {
            video: {
              facingMode: {
                ideal: "environment",
              },
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
            },
            audio: false,
          },
          video,
          (result) => {
            if (
              !active ||
              detectedRef.current
            ) {
              return;
            }

            const code =
              result?.getText();

            if (code) {
              detectedRef.current =
                true;
              scannerControls?.stop();
              onDetected(code);
            }
          }
        );
    }

    void startScanner();

    return () => {
      active = false;
      cancelAnimationFrame(frameId);
      scannerControls?.stop();
      stream
        ?.getTracks()
        .forEach((track) =>
          track.stop()
        );
    };
  }, [onDetected]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <p className="text-xs font-semibold uppercase text-pink-600">
              POS
            </p>
            <h3 className="text-lg font-bold">
              Escaner de codigo
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border p-2 text-zinc-600"
            aria-label="Cerrar escaner"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-4">
          <div className="overflow-hidden rounded-2xl bg-zinc-950">
            <video
              ref={videoRef}
              muted
              playsInline
              className="aspect-video w-full object-cover"
            />
          </div>
          <canvas
            ref={canvasRef}
            className="hidden"
          />
          <p className="rounded-2xl bg-pink-50 p-3 text-sm text-zinc-600">
            {scannerMessage}
          </p>
        </div>
      </div>
    </div>
  );
}
