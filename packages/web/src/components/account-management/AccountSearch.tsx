import type { FC } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";

export const AccountSearch: FC = () => {
  return (
    <div className="flex border border-(--border-mid) bg-(--bg-input) mb-2">
      <Input
        placeholder="Search token account address..."
        defaultValue="8x2W...f93Z"
        className="flex-1 border-none bg-transparent"
      />
      <Button variant="primary" className="rounded-none">
        LOOKUP
      </Button>
    </div>
  );
};
