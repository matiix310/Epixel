"use client";

import React, { useEffect } from "react";

type Props = {
  jwt: string;
};

function StoreJwt(props: Props) {
  useEffect(() => {
    window.localStorage.setItem("jwt", props.jwt);
  }, [props.jwt]);

  return <></>;
}

export default StoreJwt;
