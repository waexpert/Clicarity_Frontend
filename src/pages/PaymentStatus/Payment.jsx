// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

// // Import Shadcn UI components
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";

// // Import Lucide React icons
// import {
//   Eye,
//   Table as TableIcon,
// } from 'lucide-react';


// function TagInput() {
//   const [tags, setTags] = useState([]);
//   const [inputValue, setInputValue] = useState("");

//   const handleKeyDown = (e) => {
//     if ((e.key === "Enter" || e.key === ",") && inputValue.trim() !== "") {
//       e.preventDefault();
//       if (!tags.includes(inputValue.trim())) {
//         setTags([...tags, inputValue.trim()]);
//       }
//       setInputValue("");
//     } else if (e.key === "Backspace" && inputValue === "") {
//       setTags(tags.slice(0, -1));
//     }
//   };
//   console.log(tags);


//   const removeTag = (indexToRemove) => {
//     setTags(tags.filter((_, idx) => idx !== indexToRemove));
//   };

//   return (
//     <div className="w-full max-w-md">
//       <label className="block text-sm font-medium mb-1">Enter Outgoing Webhooks:</label>
//       <div className="flex flex-wrap items-center border rounded p-2 gap-2 min-h-[48px]">
//         {tags.map((tag, index) => (
//           <div
//             key={index}
//             className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center gap-1"
//           >
//             {tag}
//             <button
//               onClick={() => removeTag(index)}
//               className="text-blue-600 hover:text-red-600 text-xs"
//             >
//               ×
//             </button>
//           </div>
//         ))}

//         <input
//           type="text"
//           className="flex-grow outline-none min-w-[100px]"
//           placeholder="Type and press Enter"
//           value={inputValue}
//           onChange={(e) => setInputValue(e.target.value)}
//           onKeyDown={handleKeyDown}
//         />
//       </div>
//     </div>
//   );
// }


// import { EyeOff } from "lucide-react"; // optional icons

// function SecretField() {
//   const [isVisible, setIsVisible] = useState(false);
//   const secretValue = "sk_test_9a8sd7f98asdf987sdf"; // example API key

//   const toggleVisibility = () => {
//     setIsVisible((prev) => !prev);
//   };

//   return (
//     <div className="w-full max-w-md">
//       <label className="block text-sm font-medium mb-1">API Key:</label>
//       <div className="relative">
//         <input
//           type={isVisible ? "text" : "password"}
//           value={secretValue}
//           readOnly
//           className="w-full pr-10 border px-3 py-2 rounded"
//         />
//         <button
//           type="button"
//           onClick={toggleVisibility}
//           className="absolute right-2 top-2 text-gray-600 hover:text-black"
//         >
//           {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
//         </button>
//       </div>
//     </div>
//   );
// }


// const PaymentSetup = () => {
//   const [selectedOption, setSelectedOption] = useState("");
//   const [inputs, setInputs] = useState([]);

//   const handleChange = (e) => {
//     const value = e.target.value;
//     setSelectedOption(value);

//     const num = parseInt(value, 10);
//     if (!isNaN(num)) {
//       setInputs(Array(num).fill(""));
//     } else {
//       setInputs([]);
//     }
//   };

//   const handleInputChange = (index, newValue) => {
//     const updatedInputs = [...inputs];
//     updatedInputs[index] = newValue;
//     setInputs(updatedInputs);
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-lg font-semibold mb-4">Payment Reminder Setup</h2>

//       <select
//         value={selectedOption}
//         onChange={handleChange}
//         className="border p-2 rounded"
//       >
//         <option value="">--Choose an option--</option>
//         <option value="1">1</option>
//         <option value="2">2</option>
//         <option value="3">3</option>
//         <option value="4">4</option>
//         <option value="5">5</option>
//       </select>

//       {inputs.length > 0 && (
//         <div className="mt-6">
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 {inputs.map((_, index) => (
//                   <TableHead key={index}>Diff{index + 1}</TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               <TableRow>
//                 {inputs.map((value, index) => (
//                   <TableCell key={index}>
//                     <input
//                       type="number"
//                       className="border rounded px-2 py-1 w-full"
//                       value={value}
//                       onChange={(e) => handleInputChange(index, e.target.value)}
//                       placeholder={`Value ${index + 1}`}
//                     />
//                   </TableCell>
//                 ))}
//               </TableRow>
//             </TableBody>
//           </Table>
//         </div>
//       )}

//       <h2>Output Triggers</h2>

//     </div>
//   );
// };




// const Payment = () => {
//   const navigate = useNavigate();

//   return (

//     <>
//       <Card className="border border-slate-200 rounded-lg shadow-sm">
//         <CardContent className="p-6">
//           {/* Header with title and search/button */}
//           <div className="space-y-1 mb-6">
//             <h1 className="text-2xl font-medium text-slate-800">Payment Status</h1>
//             <p className="text-sm text-slate-500">Manage your Payments  </p>
//           </div>
//           <PaymentSetup />
//           <TagInput />
//           <SecretField />
//           <div className="">
//             <Button>Save</Button>
//             <Button
//               className="gap-2 bg-[#4285B4] hover:bg-[#3778b4] w-full sm:w-auto"
//             >
//               <TableIcon className="h-4 w-4" /> Payment Setup
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//     </>

//   );
// };

// export default Payment;


import React, { useState } from 'react';
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