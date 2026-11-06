import type { ReactNode } from "react";

type AlertProps = {
  tone?: "info" | "success" | "danger" | "warning";
  title?: string;
  children: ReactNode;
};

export function Alert({ tone = "info", title, children }: AlertProps) {
  return (
    <div
      className={`alert alert--${tone}`}
      role={tone === "danger" ? "alert" : "status"}
    >
      {title ? <p className="alert__title">{title}</p> : null}
      <div className="alert__body">{children}</div>
    </div>
  );
}
