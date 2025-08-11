import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";


function TagInput({ webhooks, setWebhooks, disabled = false }) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();
      if (!webhooks.includes(inputValue.trim())) {
        setWebhooks([...webhooks, inputValue.trim()]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && inputValue === "") {
      setWebhooks(webhooks.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    setWebhooks(webhooks.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2 mb-8">
      {/* <Label htmlFor="webhook-input" className="text-sm font-medium">
        Outgoing Webhooks
      </Label> */}
      <div className="flex flex-wrap items-center border border-input rounded-md p-2 gap-2 min-h-[42px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {webhooks.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 flex items-center gap-1"
          >
            {tag}
            {!disabled && (
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => removeTag(index)}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </Badge>
        ))}
        {!disabled && (
          <Input
            id="webhook-input"
            type="text"
            className="flex-grow border-0 outline-none min-w-[120px] p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
            placeholder="Type webhook URL and press Enter"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
          />
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {disabled ? "Webhooks are read-only in view mode" : "Press Enter or comma to add multiple webhook URLs"}
      </p>
    </div>
  );
}

export default TagInput;