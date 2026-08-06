import type { SVGProps } from "react";

export function EditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path
        d="M16.7 3.3a1 1 0 011.4 0l2.6 2.6a1 1 0 010 1.4l-11 11L6 19l.7-3.7 11-11zM5 20h14v2H5z"
        fill="currentColor"
      />
    </svg>
  );
}

export function DeleteIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true" {...props}>
      <path
        d="M9 3h6l1 2h4v2H4V5h4l1-2zm-3 6h12l-1 11H7L6 9zm4 2v7h2v-7h-2zm4 0v7h2v-7h-2z"
        fill="currentColor"
      />
    </svg>
  );
}
