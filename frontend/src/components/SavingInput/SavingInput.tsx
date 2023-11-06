import React, { useRef } from "react";

interface SavingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onDoneEditing: () => Promise<void>;
}

const SavingInput = ({ onDoneEditing, ...props }: SavingInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  return (
    <input
      ref={inputRef}
      onBlur={() => onDoneEditing()}
      onKeyDown={(e) => {
        if (e.key === "Enter" && inputRef.current) {
          e.preventDefault();
          inputRef.current.blur();
          e.target.dispatchEvent(new FocusEvent("blur"));
        }
      }}
      {...props}
    />
  );
};

export default SavingInput;
