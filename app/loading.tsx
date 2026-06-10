export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="w-12 h-12 rounded-full animate-spin"
        style={{ border: "4px solid rgba(212,175,55,0.2)", borderTopColor: "#EF9F27" }}
      />
    </div>
  );
}

