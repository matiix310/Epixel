"use client";

import React, { useEffect } from "react";

type Props = {
  url: string;
};

function Redirect(props: Props) {
  useEffect(() => {
    window.location.href = props.url;
  }, [props.url]);

  return (
    <>
      <span>You will be redirected...</span>
    </>
  );
}

export default Redirect;
