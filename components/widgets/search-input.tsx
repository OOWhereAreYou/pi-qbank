import { SearchIcon, XIcon } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";

type IProps = {
  className?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  onSearch?: (txt?: string) => void;
  loading?: boolean;
};

export const SearchInput = ({
  value,
  onChange,
  onSearch,
  onClear,
  className = "",
  placeholder = "搜索",
  loading = false,
}: IProps) => {
  const [txt, setTxt] = useState(value);
  return (
    <div className="w-full max-w-md">
      <div className="relative">
        <SearchIcon className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          className={`px-8 ${className}}`}
          value={txt ?? ""}
          onChange={(e) => {
            setTxt(e.target.value);
            onChange?.(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !loading) {
              onSearch?.(txt);
            }
          }}
          disabled={loading}
        />
        {txt && txt.length > 0 && (
          <Button
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
            disabled={loading}
            onClick={() => {
              setTxt("");
              onClear?.();
            }}
          >
            <XIcon className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  );
};
