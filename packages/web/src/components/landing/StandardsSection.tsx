import type { FC } from "react";
import { FeatureMatrix } from "./FeatureMatrix";
import { StandardCard } from "./StandardCard";

const standards = [
	{
		title: "SSS-1 MINIMAL",
		description: "Basic mint/burn with minimal overhead for utility tokens.",
		features: ["Mint & Burn Auth", "Supply Caps", "Permanent Delegate"],
		variant: "default" as const,
	},
	{
		title: "SSS-2 COMPLIANT",
		description:
			"Full regulatory controls for institutional issuers and fiat-backed assets.",
		features: [
			"Blacklisting / Freezing",
			"Asset Seizure Engine",
			"Token-2022 Transfer Hooks",
		],
		variant: "recommended" as const,
	},
	{
		title: "SSS-3 PRIVATE",
		description:
			"Zero-knowledge confidential transfers for enterprise privacy needs.",
		features: ["ElGamal Encryption", "Private Balances", "Auditable Privacy"],
		variant: "private" as const,
	},
];

export const StandardsSection: FC = () => {
	return (
		<section className="py-[100px] px-20 max-w-[1200px] mx-auto">
			<div className="border-l-2 border-(accent-primary) pl-4 mb-12">
				<div className="mono label-amber">CHOOSE YOUR STANDARD</div>
				<h2 className="mono text-2xl mt-2">COMPLIANCE PRESETS</h2>
			</div>

			{/* Standard Cards */}
			<div className="grid grid-cols-3 gap-6">
				{standards.map((standard) => (
					<StandardCard key={standard.title} {...standard} />
				))}
			</div>

			{/* Feature Matrix */}
			<FeatureMatrix />
		</section>
	);
};
