import React from "react";

export type ApiResponse<T> =
  | {
      error: true;
      message: string;
      data: {};
    }
  | {
      error: false;
      message: "";
      data: T;
    };

function Api() {
  return <div>Api</div>;
}

export default Api;
