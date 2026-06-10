"use client";

function HeroGeometric({ children }: { badge?: string; title1?: string; title2?: string; children?: React.ReactNode }) {
    return (
        <div
            className="relative min-h-screen w-full flex items-end justify-center overflow-hidden"
            style={{
                backgroundImage: "url('/homepage-hero.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center top",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Subtle dark overlay so UI elements are readable */}
            <div className="absolute inset-0" style={{ background: "rgba(13,27,42,0.38)" }} />

            {/* Bottom fade into features section */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A] via-transparent to-transparent pointer-events-none" />

            {/* CTA sits at bottom, clear of the hero image text */}
            <div className="relative z-10 w-full pb-16 md:pb-20">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    {children}
                </div>
            </div>
        </div>
    );
}

export { HeroGeometric };
