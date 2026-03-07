import type { FC } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

const features = [
  { name: "Basic Mint/Burn", sss1: true, sss2: true, sss3: true },
  { name: "Freeze/Thaw", sss1: false, sss2: true, sss3: true },
  { name: "Blacklisting", sss1: false, sss2: true, sss3: true },
  { name: "Asset Seizure", sss1: false, sss2: true, sss3: true },
  { name: "Oracle Integration", sss1: true, sss2: true, sss3: true },
  { name: "Confidential Transfers", sss1: false, sss2: false, sss3: true },
  { name: "Transfer Hook", sss1: false, sss2: true, sss3: true },
  { name: "Permanent Delegate", sss1: true, sss2: true, sss3: true },
];

export const FeatureMatrix: FC = () => {
  return (
    <div className="mt-12 border border-(border-dim) bg-(bg-panel)">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-(border-dim) hover:bg-transparent">
            <TableHead className="text-(text-dim) font-mono text-xs p-4">
              FEATURE MATRIX
            </TableHead>
            <TableHead className="text-(text-dim) font-mono text-xs p-4">SSS-1</TableHead>
            <TableHead className="text-(text-dim) font-mono text-xs p-4">SSS-2</TableHead>
            <TableHead className="text-(text-dim) font-mono text-xs p-4">SSS-3</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {features.map((feature) => (
            <TableRow
              key={feature.name}
              className="border-b border-(border-dim) hover:bg-(bg-surface)"
            >
              <TableCell className="font-mono text-xs text-(text-main) p-3">
                {feature.name}
              </TableCell>
              <TableCell
                className={`font-mono text-xs p-3 ${feature.sss1 ? "text-[#22c55e]" : "text-(text-dark)"}`}
              >
                {feature.sss1 ? "✓" : "✕"}
              </TableCell>
              <TableCell
                className={`font-mono text-xs p-3 ${feature.sss2 ? "text-[#22c55e]" : "text-(text-dark)"}`}
              >
                {feature.sss2 ? "✓" : "✕"}
              </TableCell>
              <TableCell
                className={`font-mono text-xs p-3 ${feature.sss3 ? "text-[#22c55e]" : "text-(text-dark)"}`}
              >
                {feature.sss3 ? "✓" : "✕"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
