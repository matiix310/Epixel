import React from "react";
import Button from "../Button";

type Props = {
  label: string,
  submit?: boolean
  onClick?: () => void
  buttonClass?: string,
}

function LoginButton({ label, buttonClass, onClick = () => {}, submit = false }: Props) {
  return (
    <Button primary={true} onClick={onClick} submit={submit} className={buttonClass}>
      {label}
    </Button>
  );
}

export default LoginButton;
