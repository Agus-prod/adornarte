"use client";

import { BrowserMultiFormatReader } from "@zxing/browser";
import {
  BarcodeFormat,
  DecodeHintType,
} from "@zxing/library";
import { X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
} from "react";

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

export function BarcodeScannerDialog({
  title = "Escaner de codigo",
  label = "POS",
  onClose,
  onDetected,
}: {
  title?: string;
  label?: string;
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

    function emitDetected(code: string) {
      if (detectedRef.current) {
        return;
      }

      detectedRef.current = true;
      onDetected(code);
      onClose();
    }

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
                  ideal: 1920,
                },
                height: {
                  ideal: 1080,
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
                emitDetected(code);
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
                ideal: 1920,
              },
              height: {
                ideal: 1080,
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
              scannerControls?.stop();
              emitDetected(code);
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
  }, [onClose, onDetected]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b p-4">
          <div>
            <p className="text-xs font-semibold uppercase text-pink-600">
              {label}
            </p>
            <h3 className="text-lg font-bold">
              {title}
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
