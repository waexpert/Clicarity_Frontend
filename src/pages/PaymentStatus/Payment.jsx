import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Import Shadcn UI components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Import Lucide React icons
import {
  Eye,
  EyeOff,
  Grid3X3,
  X,
  Save,
  Settings,
} from 'lucide-react';
import axios from 'axios';

function TagInput() {
  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    } else if (e.key === "Backspace" && inputValue === "") {
      setTags(tags.slice(0, -1));
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="webhook-input" className="text-sm font-medium">
        Outgoing Webhooks
      </Label>
      <div className="flex flex-wrap items-center border border-input rounded-md p-2 gap-2 min-h-[42px] focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20 px-2 py-1 flex items-center gap-1"
          >
            {tag}
            <Button
              variant="ghost"
              size="icon"
              className="h-4 w-4 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={() => removeTag(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </Badge>
        ))}
        <Input
          id="webhook-input"
          type="text"
          className="flex-grow border-0 outline-none min-w-[120px] p-0 h-6 focus-visible:ring-0 focus-visible:ring-offset-0"
          placeholder="Type webhook URL and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        Press Enter or comma to add multiple webhook URLs
      </p>
    </div>
  );
}

function SecretField() {
  const [isVisible, setIsVisible] = useState(false);
  const secretValue = "sk_test_9a8sd7f98asdf987sdf";

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="api-key" className="text-sm font-medium">
        API Key
      </Label>
      <div className="relative">
        <Input
          id="api-key"
          type={isVisible ? "text" : "password"}
          value={secretValue}
          readOnly
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleVisibility}
          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Eye className="h-4 w-4 text-muted-foreground" />
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Your API key is masked for security
      </p>
    </div>
  );
}

const PaymentSetup = () => {
  const [selectedOption, setSelectedOption] = useState("");
  const [paymentTerms,setPaymentTerms] = useState("");
  const [inputs, setInputs] = useState([]);

  const handleChange = (value) => {
    setSelectedOption(value);
    const num = parseInt(value, 10);
    if (!isNaN(num)) {
      setInputs(Array(num).fill(""));
    } else {
      setInputs([]);
    }
  };

    const handlePaymentTerms = (value) => {
    setPaymentTerms(value);
  };

  const handleInputChange = (index, newValue) => {
    const updatedInputs = [...inputs];
    updatedInputs[index] = newValue;
    setInputs(updatedInputs);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="reminder-count" className="text-sm font-medium">
          Number of Payment Reminders
        </Label>
        <Select value={selectedOption} onValueChange={handleChange}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Choose number of reminders" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Reminder</SelectItem>
            <SelectItem value="2">2 Reminders</SelectItem>
            <SelectItem value="3">3 Reminders</SelectItem>
            <SelectItem value="4">4 Reminders</SelectItem>
            <SelectItem value="5">5 Reminders</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Select how many reminder notifications to send
        </p>
      </div>

      <div className="">
        <h2>Payment terms</h2>
        <Select value={paymentTerms} onValueChange={handlePaymentTerms}>
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Choose Payment terms" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="15">15 Days</SelectItem>
            <SelectItem value="30">30 Days</SelectItem>
            <SelectItem value="45">45 Days</SelectItem>
            <SelectItem value="60">60 Days</SelectItem>
            <SelectItem value="75">75 Days</SelectItem>
            <SelectItem value="90">90 Days</SelectItem>
            <SelectItem value="105">105 Days</SelectItem>
            <SelectItem value="120">120 Days</SelectItem>
            <SelectItem value="150">150 Days</SelectItem>
            <SelectItem value="180">180 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {inputs.length > 0 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Days Before Due Date</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Configure when each reminder should be sent (days before the due date)
            </p>
          </div>

          <Card className="border border-border">
            <CardContent className="p-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    {inputs.map((_, index) => (
                      <TableHead key={index} className="text-center">
                        Reminder {index + 1}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    {inputs.map((value, index) => (
                      <TableCell key={index} className="p-2">
                        <div className="space-y-1">
                          <Input
                            type="number"
                            min="0"
                            className="text-center"
                            value={value}
                            onChange={(e) => handleInputChange(index, e.target.value)}
                            placeholder="Days"
                          />
                          <p className="text-xs text-muted-foreground text-center">
                            days before
                          </p>
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

const Payment = () => {
  const navigate = useNavigate();

  useEffect(()=>{
    const result = axios.get(`${import.meta.env.VITE_APP_BASE_URL}/reference/getSetup?owner_id=${owner_id}`);
  },[])

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-6">
          <div className="flex items-center gap-2">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <CardTitle className="text-2xl font-semibold text-foreground">
                Payment Configuration
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Configure payment reminders, webhooks, and API settings
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Payment Setup Section */}
          <div className="space-y-4">
            <div className="border-l-4 border-[#4285B4] pl-4">
              <h2 className="text-lg font-medium text-foreground">
                Reminder Schedule
              </h2>
              <p className="text-sm text-muted-foreground">
                Set up automated payment reminder notifications
              </p>
            </div>
            <PaymentSetup />
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* Webhooks Section */}
          <div className="space-y-4">
            <div className="border-l-4 border-[#4285B4] pl-4">
              <h2 className="text-lg font-medium text-foreground">
                Output Triggers
              </h2>
              <p className="text-sm text-muted-foreground">
                Configure webhook endpoints for payment notifications
              </p>
            </div>
            <TagInput />
          </div>

          {/* Divider */}
          <div className="border-t border-border" />

          {/* API Configuration Section */}
          <div className="space-y-4">
            <div className="border-l-4 border-[#4285B4] pl-4">
              <h2 className="text-lg font-medium text-foreground">
                API Configuration
              </h2>
              <p className="text-sm text-muted-foreground">
                Manage your API keys and authentication
              </p>
            </div>
            <SecretField />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-border">
            <Button className="flex items-center gap-2" size="default">
              <Save className="h-4 w-4" />
              Save Configuration
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => navigate('/paymentstatus/record')}
            >
              <Grid3X3 className="h-4 w-4" />
              View Records
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;