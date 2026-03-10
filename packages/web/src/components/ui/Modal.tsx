import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import type { FC, ReactNode } from "react";

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	title: string;
	children: ReactNode;
	variant?: "default" | "danger";
}

export const Modal: FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
	variant = "default",
}) => {
	return (
		<AnimatePresence>
			{isOpen && (
				<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="absolute inset-0 bg-black/80 backdrop-blur-sm"
					/>

					{/* Modal Content */}
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: 10 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: 10 }}
						className="relative w-full max-w-lg bg-(--bg-panel) border border-(--border-bright) shadow-2xl overflow-hidden"
					>
						<div className="flex items-center justify-between p-6 border-b border-(--border-mid)">
							<div
								className={`text-sm font-bold uppercase tracking-wider border-l-2 pl-3 ${
									variant === "danger"
										? "text-(--danger) border-(--danger)"
										: "text-(--accent-active) border-(--accent-primary)"
								}`}
							>
								{title}
							</div>
							<button
								onClick={onClose}
								className="text-(--text-dim) hover:text-(--text-main) transition-colors"
							>
								<X className="w-5 h-5" />
							</button>
						</div>

						<div className="p-8">{children}</div>
					</motion.div>
				</div>
			)}
		</AnimatePresence>
	);
};
