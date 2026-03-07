import type { FC } from "react";

const partners = ["PHANTOM", "SOLFLARE", "SWITCHBOARD", "PYTH", "CHAINLINK"];

export const IntegrationsSection: FC = () => {
	return (
		<section className="py-[100px] px-20 text-center">
			<div className="mono label-amber mb-5">
				BUILT WITH BEST-IN-CLASS INFRASTRUCTURE
			</div>
			<div className="flex justify-center gap-6 mono">
				{partners.map((partner) => (
					<div
						key={partner}
						className="border border-(border-dim) px-6 py-4 flex items-center gap-3 hover:border-(accent-primary) transition-colors"
					>
						<div className="w-6 h-6 bg-(border-mid)" />
						{partner}
					</div>
				))}
			</div>
		</section>
	);
};
