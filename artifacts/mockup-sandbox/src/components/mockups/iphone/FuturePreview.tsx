const FUTURE_URL =
  "https://1fc55918-5067-4787-9aa8-7074129aaffd-00-1291swnr4qwiy.picard.replit.dev/future/";

export default function FuturePreview() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-neutral-100 p-6">
      <div
        className="relative"
        style={{
          width: 422,
          height: 868,
        }}
      >
        <div
          className="absolute inset-0 rounded-[58px] bg-neutral-900"
          style={{
            boxShadow:
              "0 30px 60px -20px rgba(0,0,0,0.35), 0 8px 24px -8px rgba(0,0,0,0.25), inset 0 0 0 1.5px rgba(255,255,255,0.06)",
          }}
        />
        <div className="absolute inset-[3px] rounded-[55px] bg-neutral-800" />
        <div
          className="absolute rounded-[48px] overflow-hidden bg-black"
          style={{
            top: 14,
            left: 14,
            right: 14,
            bottom: 14,
          }}
        >
          <iframe
            src={FUTURE_URL}
            title="Future on iPhone"
            className="w-full h-full border-0 block"
            style={{ background: "#000" }}
          />
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 bg-black rounded-full"
            style={{
              top: 11,
              width: 118,
              height: 35,
            }}
          />
        </div>
      </div>
    </div>
  );
}
