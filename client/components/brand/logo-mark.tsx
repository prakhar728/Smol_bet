export function LogoMark() {
  return (
    <div
      aria-label="SMOL BET"
      className="font-black tracking-tight text-lime text-lg select-none"
      style={{
        textShadow: "0 0 16px rgba(195,245,59,0.35)",
      }}
    >
      SMOL{" "}
      <span className="text-off" style={{ textShadow: "none" }}>
        BET
      </span>
    </div>
  )
}
