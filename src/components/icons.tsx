//
// All icons are imported from https://fontawesome.com/icons?d=gallery
// Icons are under the license https://fontawesome.com/license
//

// Note: when adding new icons, review https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/RTL_Guidelines
// to determine whether or not the icons should be mirrored in right-to-left languages.

import React from "react";

import oc from "open-color";
import clsx from "clsx";
import { Theme } from "../element/types";
import { THEME } from "../constants";

const activeElementColor = (theme: Theme) =>
  theme === THEME.LIGHT ? oc.orange[4] : oc.orange[9];

const iconFillColor = (theme: Theme) => "var(--icon-fill-color)";

const handlerColor = (theme: Theme) =>
  theme === THEME.LIGHT ? oc.white : "#1e1e1e";

type Opts = {
  width?: number;
  height?: number;
  mirror?: true;
} & React.SVGProps<SVGSVGElement>;

export const createIcon = (
  d: string | React.ReactNode,
  opts: number | Opts = 512,
) => {
  const {
    width = 512,
    height = width,
    mirror,
    style,
  } = typeof opts === "number" ? ({ width: opts } as Opts) : opts;
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox={`0 0 ${width} ${height}`}
      className={clsx({ "rtl-mirror": mirror })}
      style={style}
    >
      {typeof d === "string" ? <path fill="currentColor" d={d} /> : d}
    </svg>
  );
};

export const checkIcon = createIcon(
  <polyline fill="none" stroke="currentColor" points="20 6 9 17 4 12" />,
  {
    width: 24,
    height: 24,
  },
);

export const link = createIcon(
  "M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z",
  { mirror: true },
);

export const save = createIcon(
  "M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z",
  { width: 448, height: 512 },
);

export const saveAs = createIcon(
  "M252 54L203 8a28 27 0 00-20-8H28C12 0 0 12 0 27v195c0 15 12 26 28 26h204c15 0 28-11 28-26V73a28 27 0 00-8-19zM130 213c-21 0-37-16-37-36 0-19 16-35 37-35 20 0 37 16 37 35 0 20-17 36-37 36zm56-169v56c0 4-4 6-7 6H44c-4 0-7-2-7-6V42c0-4 3-7 7-7h133l4 2 3 2a7 7 0 012 5z M296 201l87 95-188 205-78 9c-10 1-19-8-18-20l9-84zm141-14l-41-44a31 31 0 00-46 0l-38 41 87 95 38-42c13-14 13-36 0-50z",
  { width: 448, height: 512 },
);

export const load = createIcon(
  "M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z",
  { width: 576, height: 512, mirror: true },
);

export const clipboard = createIcon(
  "M384 112v352c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h80c0-35.29 28.71-64 64-64s64 28.71 64 64h80c26.51 0 48 21.49 48 48zM192 40c-13.255 0-24 10.745-24 24s10.745 24 24 24 24-10.745 24-24-10.745-24-24-24m96 114v-20a6 6 0 0 0-6-6H102a6 6 0 0 0-6 6v20a6 6 0 0 0 6 6h180a6 6 0 0 0 6-6z",
  { width: 384, height: 512 },
);

export const trash = createIcon(
  "M32 464a48 48 0 0 0 48 48h288a48 48 0 0 0 48-48V128H32zm272-256a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zm-96 0a16 16 0 0 1 32 0v224a16 16 0 0 1-32 0zM432 32H312l-9.4-18.7A24 24 0 0 0 281.1 0H166.8a23.72 23.72 0 0 0-21.4 13.3L136 32H16A16 16 0 0 0 0 48v32a16 16 0 0 0 16 16h416a16 16 0 0 0 16-16V48a16 16 0 0 0-16-16z",

  { width: 448, height: 512 },
);

export const palette = createIcon(
  "M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7 41.2-6.4 61.4-54.6 42.5-91.7-23.1-45.4 9.9-98.4 60.9-98.4h79.7c35.8 0 64.8-29.6 64.9-65.3C511.5 97.1 368.1-26.9 204.3 5zM96 320c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm32-128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128-64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z",
);

export const exportFile = createIcon(
  "M384 121.9c0-6.3-2.5-12.4-7-16.9L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128zM571 308l-95.7-96.4c-10.1-10.1-27.4-3-27.4 11.3V288h-64v64h64v65.2c0 14.3 17.3 21.4 27.4 11.3L571 332c6.6-6.6 6.6-17.4 0-24zm-379 28v-32c0-8.8 7.2-16 16-16h176V160H248c-13.2 0-24-10.8-24-24V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V352H208c-8.8 0-16-7.2-16-16z",
  { width: 576, height: 512, mirror: true },
);

export const exportImage = createIcon(
  <>
    <path d="M571 308l-95.7-96.4c-10.1-10.1-27.4-3-27.4 11.3V288h-64v64h64v65.2c0 14.3 17.3 21.4 27.4 11.3L571 332c6.6-6.6 6.6-17.4 0-24zm-187 44v-64 64z" />
    <path d="M384 121.941V128H256V0h6.059c6.362 0 12.471 2.53 16.97 7.029l97.941 97.941a24.01 24.01 0 017.03 16.971zM248 160c-13.2 0-24-10.8-24-24V0H24C10.745 0 0 10.745 0 24v464c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24V160H248zm-135.455 16c26.51 0 48 21.49 48 48s-21.49 48-48 48-48-21.49-48-48 21.491-48 48-48zm208 240h-256l.485-48.485L104.545 328c4.686-4.686 11.799-4.201 16.485.485L160.545 368 264.06 264.485c4.686-4.686 12.284-4.686 16.971 0L320.545 304v112z" />
  </>,
  { width: 576, height: 512, mirror: true },
);

export const exportToFileIcon = createIcon(
  "M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z",
  { width: 512, height: 512 },
);

export const zoomIn = createIcon(
  "M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z",
  { width: 448, height: 512 },
);

export const zoomOut = createIcon(
  "M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z",
  { width: 448, height: 512 },
);

export const done = createIcon(
  "M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z",
);

export const menu = createIcon(
  "M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z",
);

export const undo = createIcon(
  "M4.29289 10.7069C3.90237 10.3164 3.90237 9.68323 4.29289 9.29271C4.30445 9.28115 4.31622 9.26994 4.32819 9.25906L7.29436 6.29289C7.68489 5.90237 8.31805 5.90237 8.70858 6.29289C8.90379 6.48811 9.00142 6.74396 9.00147 6.99982H9.00156V9.00009H15.5C17.9853 9.00009 20 11.0148 20 13.5001C20 15.9854 17.9853 18.0001 15.5 18.0001H12C11.4477 18.0001 11 17.5524 11 17.0001C11 16.4478 11.4477 16.0001 12 16.0001H15.5C16.8807 16.0001 18 14.8808 18 13.5001C18 12.1194 16.8807 11.0001 15.5 11.0001H9.00156V12.9998H9.00076C9.00096 13.256 8.90333 13.5122 8.70787 13.7077C8.31735 14.0982 7.68418 14.0982 7.29366 13.7077L4.29289 10.7069Z",
  { width: 24, mirror: true },
);

export const redo = createIcon(
  "M19.7091 9.29366C20.0996 9.68418 20.0996 10.3173 19.7091 10.7079C19.6975 10.7194 19.6857 10.7306 19.6738 10.7415L16.7076 13.7077C16.3171 14.0982 15.6839 14.0982 15.2934 13.7077C15.0982 13.5125 15.0005 13.2566 15.0005 13.0008H15.0004V11H8.5C7.11929 11 6 12.1193 6 13.5C6 14.8807 7.11929 16 8.5 16H12C12.5523 16 13 16.4477 13 17C13 17.5523 12.5523 18 12 18H8.5C6.01472 18 4 15.9853 4 13.5C4 11.0147 6.01472 9 8.5 9H15.0004V7.00076H15.0012C15.001 6.74459 15.0986 6.48835 15.2941 6.29289C15.6846 5.90237 16.3178 5.90237 16.7083 6.29289L19.7091 9.29366Z",
  { width: 24, mirror: true },
);

export const questionCircle = createIcon(
  "M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z",
  { mirror: true },
);

export const share = createIcon(
  "M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z",
  { width: 24, height: 24 },
);

export const shareIOS = createIcon(
  "M16 5l-1.42 1.42-1.59-1.59V16h-1.98V4.83L9.42 6.42 8 5l4-4 4 4zm4 5v11c0 1.1-.9 2-2 2H6c-1.11 0-2-.9-2-2V10c0-1.11.89-2 2-2h3v2H6v11h12V10h-3V8h3c1.1 0 2 .89 2 2z",
  { width: 24, height: 24 },
);

export const shareWindows = createIcon(
  <>
    <path
      stroke="currentColor"
      fill="currentColor"
      d="M40 5.6v6.1l-4.1.7c-8.9 1.4-16.5 6.9-20.6 15C13 32 10.9 43 12.4 43c.4 0 2.4-1.3 4.4-3 5-3.9 12.1-7 18.2-7.7l5-.6v12.8l11.2-11.3L62.5 22 51.2 10.8 40-.5v6.1zm10.2 22.6L44 34.5v-6.8l-6.9.6c-3.9.3-9.8 1.7-13.2 3.1-3.5 1.4-6.5 2.4-6.7 2.2-.9-1 3-7.5 6.4-10.8C28 18.6 34.4 16 40.1 16c3.7 0 3.9-.1 3.9-3.2V9.5l6.2 6.3 6.3 6.2-6.3 6.2z"
    />
    <path
      stroke="currentColor"
      fill="currentColor"
      d="M0 36v20h48v-6.2c0-6 0-6.1-2-4.3-1.1 1-2 2.9-2 4.2V52H4V34c0-17.3-.1-18-2-18s-2 .7-2 20z"
    />
  </>,
  { width: 64, height: 64 },
);

// Icon imported form Storybook
// Storybook is licensed under MIT https://github.com/storybookjs/storybook/blob/next/LICENSE
export const resetZoom = createIcon(
  <path
    stroke="currentColor"
    strokeWidth="40"
    fill="currentColor"
    d="M148 560a318 318 0 0 0 522 110 316 316 0 0 0 0-450 316 316 0 0 0-450 0c-11 11-21 22-30 34v4h47c25 0 46 21 46 46s-21 45-46 45H90c-13 0-25-6-33-14-9-9-14-20-14-33V156c0-25 20-45 45-45s45 20 45 45v32l1 1a401 401 0 0 1 623 509l212 212a42 42 0 0 1-59 59L698 757A401 401 0 0 1 65 570a42 42 0 0 1 83-10z"
  />,
  { width: 1024 },
);

export const BringForwardIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <>
      <path
        d="M22 9.556C22 8.696 21.303 8 20.444 8H16v8H8v4.444C8 21.304 8.697 22 9.556 22h10.888c.86 0 1.556-.697 1.556-1.556V9.556z"
        fill={iconFillColor(theme)}
        stroke={iconFillColor(theme)}
        strokeWidth="2"
      />
      <path
        d="M16 3.556C16 2.696 15.303 2 14.444 2H3.556C2.696 2 2 2.697 2 3.556v10.888C2 15.304 2.697 16 3.556 16h10.888c.86 0 1.556-.697 1.556-1.556V3.556z"
        fill={activeElementColor(theme)}
        stroke={activeElementColor(theme)}
        strokeWidth="2"
      />
    </>,
    { width: 24, mirror: true },
  ),
);

export const SendBackwardIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <>
      <path
        d="M16 3.556C16 2.696 15.303 2 14.444 2H3.556C2.696 2 2 2.697 2 3.556v10.888C2 15.304 2.697 16 3.556 16h10.888c.86 0 1.556-.697 1.556-1.556V3.556z"
        fill={activeElementColor(theme)}
        stroke={activeElementColor(theme)}
        strokeWidth="2"
      />
      <path
        d="M22 9.556C22 8.696 21.303 8 20.444 8H9.556C8.696 8 8 8.697 8 9.556v10.888C8 21.304 8.697 22 9.556 22h10.888c.86 0 1.556-.697 1.556-1.556V9.556z"
        fill={iconFillColor(theme)}
        stroke={iconFillColor(theme)}
        strokeWidth="2"
      />
    </>,
    { width: 24, mirror: true },
  ),
);

export const BringToFrontIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <>
      <path
        d="M13 21a1 1 0 001 1h7a1 1 0 001-1v-7a1 1 0 00-1-1h-3v5h-5v3zM11 3a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h3V6h5V3z"
        fill={iconFillColor(theme)}
        stroke={iconFillColor(theme)}
        strokeWidth="2"
      />
      <path
        d="M18 7.333C18 6.597 17.403 6 16.667 6H7.333C6.597 6 6 6.597 6 7.333v9.334C6 17.403 6.597 18 7.333 18h9.334c.736 0 1.333-.597 1.333-1.333V7.333z"
        fill={activeElementColor(theme)}
        stroke={activeElementColor(theme)}
        strokeWidth="2"
      />
    </>,
    { width: 24, mirror: true },
  ),
);

export const SendToBackIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <>
      <path
        d="M18 7.333C18 6.597 17.403 6 16.667 6H7.333C6.597 6 6 6.597 6 7.333v9.334C6 17.403 6.597 18 7.333 18h9.334c.736 0 1.333-.597 1.333-1.333V7.333z"
        fill={activeElementColor(theme)}
        stroke={activeElementColor(theme)}
        strokeWidth="2"
      />
      <path
        d="M11 3a1 1 0 00-1-1H3a1 1 0 00-1 1v7a1 1 0 001 1h8V3zM22 14a1 1 0 00-1-1h-7a1 1 0 00-1 1v7a1 1 0 001 1h8v-8z"
        fill={iconFillColor(theme)}
        stroke={iconFillColor(theme)}
        strokeWidth="2"
      />
    </>,
    { width: 24, mirror: true },
  ),
);

//
// Align action icons created from scratch to match those of z-index actions
// Note: vertical align icons are flipped so the larger item is always the
// first one the user sees. Horizontal align icons should not be flipped since
// that would make them lie about their function.
//
export const AlignTopIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2C2.44772 2 2 2.44772 2 3C2 3.55228 2.44772 4 3 4H21C21.5523 4 22 3.55228 22 3C22 2.44772 21.5523 2 21 2H3ZM9 18.5V9.5C9 8.67157 8.32843 8 7.5 8C6.67157 8 6 8.67157 6 9.5V18.5C6 19.3284 6.67157 20 7.5 20C8.32843 20 9 19.3284 9 18.5ZM7.5 6C5.567 6 4 7.567 4 9.5V18.5C4 20.433 5.567 22 7.5 22C9.433 22 11 20.433 11 18.5V9.5C11 7.567 9.433 6 7.5 6ZM18 14.5V9.5C18 8.67157 17.3284 8 16.5 8C15.6716 8 15 8.67157 15 9.5V14.5C15 15.3284 15.6716 16 16.5 16C17.3284 16 18 15.3284 18 14.5ZM16.5 6C14.567 6 13 7.567 13 9.5V14.5C13 16.433 14.567 18 16.5 18C18.433 18 20 16.433 20 14.5V9.5C20 7.567 18.433 6 16.5 6Z"
    />,
    { width: 24, mirror: true },
  ),
);

export const AlignBottomIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M9 14.5V5.5C9 4.67157 8.32843 4 7.5 4C6.67157 4 6 4.67157 6 5.5V14.5C6 15.3284 6.67157 16 7.5 16C8.32843 16 9 15.3284 9 14.5ZM7.5 2C5.567 2 4 3.567 4 5.5V14.5C4 16.433 5.567 18 7.5 18C9.433 18 11 16.433 11 14.5V5.5C11 3.567 9.433 2 7.5 2ZM18 14.5V9.5C18 8.67157 17.3284 8 16.5 8C15.6716 8 15 8.67157 15 9.5V14.5C15 15.3284 15.6716 16 16.5 16C17.3284 16 18 15.3284 18 14.5ZM16.5 6C14.567 6 13 7.567 13 9.5V14.5C13 16.433 14.567 18 16.5 18C18.433 18 20 16.433 20 14.5V9.5C20 7.567 18.433 6 16.5 6ZM3 20C2.44772 20 2 20.4477 2 21C2 21.5523 2.44772 22 3 22H21C21.5523 22 22 21.5523 22 21C22 20.4477 21.5523 20 21 20H3Z"
    />,
    { width: 24, mirror: true },
  ),
);

export const AlignLeftIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 2C2.44772 2 2 2.44772 2 3V21C2 21.5523 2.44772 22 3 22C3.55228 22 4 21.5523 4 21V3C4 2.44772 3.55228 2 3 2ZM18.5 6H9.5C8.67157 6 8 6.67157 8 7.5C8 8.32843 8.67157 9 9.5 9H18.5C19.3284 9 20 8.32843 20 7.5C20 6.67157 19.3284 6 18.5 6ZM9.5 4C7.567 4 6 5.567 6 7.5C6 9.433 7.567 11 9.5 11H18.5C20.433 11 22 9.433 22 7.5C22 5.567 20.433 4 18.5 4H9.5ZM14.5 15H9.5C8.67157 15 8 15.6716 8 16.5C8 17.3284 8.67157 18 9.5 18H14.5C15.3284 18 16 17.3284 16 16.5C16 15.6716 15.3284 15 14.5 15ZM9.5 13C7.567 13 6 14.567 6 16.5C6 18.433 7.567 20 9.5 20H14.5C16.433 20 18 18.433 18 16.5C18 14.567 16.433 13 14.5 13H9.5Z"
    />,
    { width: 24 },
  ),
);

export const AlignRightIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M21 2C20.4477 2 20 2.44772 20 3V21C20 21.5523 20.4477 22 21 22C21.5523 22 22 21.5523 22 21V3C22 2.44772 21.5523 2 21 2ZM14.5 6H5.5C4.67157 6 4 6.67157 4 7.5C4 8.32843 4.67157 9 5.5 9H14.5C15.3284 9 16 8.32843 16 7.5C16 6.67157 15.3284 6 14.5 6ZM5.5 4C3.567 4 2 5.567 2 7.5C2 9.433 3.567 11 5.5 11H14.5C16.433 11 18 9.433 18 7.5C18 5.567 16.433 4 14.5 4H5.5ZM14.5 15H9.5C8.67157 15 8 15.6716 8 16.5C8 17.3284 8.67157 18 9.5 18H14.5C15.3284 18 16 17.3284 16 16.5C16 15.6716 15.3284 15 14.5 15ZM9.5 13C7.567 13 6 14.567 6 16.5C6 18.433 7.567 20 9.5 20H14.5C16.433 20 18 18.433 18 16.5C18 14.567 16.433 13 14.5 13H9.5Z"
    />,
    { width: 24 },
  ),
);

export const DistributeHorizontallyIcon = React.memo(
  ({ theme }: { theme: Theme }) =>
    createIcon(
      <>
        <path
          d="M19 5V19M5 5V19"
          stroke={iconFillColor(theme)}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 9C15.554 9 16 9.446 16 10V14C16 14.554 15.554 15 15 15H9C8.446 15 8 14.554 8 14V10C8 9.446 8.446 9 9 9H15Z"
          fill={activeElementColor(theme)}
          stroke={activeElementColor(theme)}
          strokeWidth="2"
        />
      </>,
      { width: 24 },
    ),
);

export const DistributeVerticallyIcon = React.memo(
  ({ theme }: { theme: Theme }) =>
    createIcon(
      <>
        <path
          d="M5 5L19 5M5 19H19"
          fill={iconFillColor(theme)}
          stroke={iconFillColor(theme)}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M15 9C15.554 9 16 9.446 16 10V14C16 14.554 15.554 15 15 15H9C8.446 15 8 14.554 8 14V10C8 9.446 8.446 9 9 9H15Z"
          fill={activeElementColor(theme)}
          stroke={activeElementColor(theme)}
          strokeWidth="2"
        />
      </>,
      { width: 24 },
    ),
);

export const CenterVerticallyIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M7.5 18C8.32843 18 9 17.3284 9 16.5V12V7.5C9 6.67157 8.32843 6 7.5 6C6.67157 6 6 6.67157 6 7.5V12V16.5C6 17.3284 6.67157 18 7.5 18ZM11 7.5V11H13V9.5C13 7.567 14.567 6 16.5 6C18.433 6 20 7.567 20 9.5V11H21C21.5523 11 22 11.4477 22 12C22 12.5523 21.5523 13 21 13H20V14.5C20 16.433 18.433 18 16.5 18C14.567 18 13 16.433 13 14.5V13H11V16.5C11 18.433 9.433 20 7.5 20C5.567 20 4 18.433 4 16.5V13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11H4V7.5C4 5.567 5.567 4 7.5 4C9.433 4 11 5.567 11 7.5ZM18 12V9.5C18 8.67157 17.3284 8 16.5 8C15.6716 8 15 8.67157 15 9.5V12V14.5C15 15.3284 15.6716 16 16.5 16C17.3284 16 18 15.3284 18 14.5V12Z"
    />,
    { width: 24, mirror: true },
  ),
);

export const CenterHorizontallyIcon = React.memo(
  ({ theme }: { theme: Theme }) =>
    createIcon(
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C11.4477 2 11 2.44772 11 3V4H7.5C5.567 4 4 5.567 4 7.5C4 9.433 5.567 11 7.5 11H11V13H9.5C7.567 13 6 14.567 6 16.5C6 18.433 7.567 20 9.5 20H11V21C11 21.5523 11.4477 22 12 22C12.5523 22 13 21.5523 13 21V20H14.5C16.433 20 18 18.433 18 16.5C18 14.567 16.433 13 14.5 13H13V11H16.5C18.433 11 20 9.433 20 7.5C20 5.567 18.433 4 16.5 4H13V3C13 2.44772 12.5523 2 12 2ZM12 18H14.5C15.3284 18 16 17.3284 16 16.5C16 15.6716 15.3284 15 14.5 15H12H9.5C8.67157 15 8 15.6716 8 16.5C8 17.3284 8.67157 18 9.5 18H12ZM16.5 9H12H7.5C6.67157 9 6 8.32843 6 7.5C6 6.67157 6.67157 6 7.5 6H12H16.5C17.3284 6 18 6.67157 18 7.5C18 8.32843 17.3284 9 16.5 9Z"
      />,
      { width: 24 },
    ),
);

export const users = createIcon(
  "M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z",
  { width: 640, height: 512, mirror: true },
);

// not mirrored because it's inspired by a playback control, which is always RTL
export const start = createIcon(
  "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm115.7 272l-176 101c-15.8 8.8-35.7-2.5-35.7-21V152c0-18.4 19.8-29.8 35.7-21l176 107c16.4 9.2 16.4 32.9 0 42z",
);

export const stop = createIcon(
  "M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm96 328c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h160c8.8 0 16 7.2 16 16v160z",
);

export const close = createIcon(
  "M242.72 256l100.07-100.07c12.28-12.28 12.28-32.19 0-44.48l-22.24-22.24c-12.28-12.28-32.19-12.28-44.48 0L176 189.28 75.93 89.21c-12.28-12.28-32.19-12.28-44.48 0L9.21 111.45c-12.28 12.28-12.28 32.19 0 44.48L109.28 256 9.21 356.07c-12.28 12.28-12.28 32.19 0 44.48l22.24 22.24c12.28 12.28 32.2 12.28 44.48 0L176 322.72l100.07 100.07c12.28 12.28 32.2 12.28 44.48 0l22.24-22.24c12.28-12.28 12.28-32.19 0-44.48L242.72 256z",
  { width: 352, height: 512 },
);

export const back = createIcon(
  "M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z",
  { width: 320, height: 512, style: { marginLeft: "-0.2rem" }, mirror: true },
);

export const clone = createIcon(
  "M464 0c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48H176c-26.51 0-48-21.49-48-48V48c0-26.51 21.49-48 48-48h288M176 416c-44.112 0-80-35.888-80-80V128H48c-26.51 0-48 21.49-48 48v288c0 26.51 21.49 48 48 48h288c26.51 0 48-21.49 48-48v-48H176z",
  { mirror: true },
);

// modified https://feathericons.com/?query=shield
export const shield = createIcon(
  "M11.553 22.894a.998.998 0 00.894 0s3.037-1.516 5.465-4.097C19.616 16.987 21 14.663 21 12V5a1 1 0 00-.649-.936l-8-3a.998.998 0 00-.702 0l-8 3A1 1 0 003 5v7c0 2.663 1.384 4.987 3.088 6.797 2.428 2.581 5.465 4.097 5.465 4.097zm-1.303-8.481l6.644-6.644a.856.856 0 111.212 1.212l-7.25 7.25a.856.856 0 01-1.212 0l-3.75-3.75a.856.856 0 111.212-1.212l3.144 3.144z",
  { width: 24 },
);

export const file = createIcon(
  "M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48zm32-48h224V288l-23.5-23.5c-4.7-4.7-12.3-4.7-17 0L176 352l-39.5-39.5c-4.7-4.7-12.3-4.7-17 0L80 352v64zm48-240c-26.5 0-48 21.5-48 48s21.5 48 48 48 48-21.5 48-48-21.5-48-48-48z",
  { width: 384, height: 512 },
);

export const GroupIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <>
      <path d="M25 26H111V111H25" fill={iconFillColor(theme)} />
      <path
        d="M25 111C25 80.2068 25 49.4135 25 26M25 26C48.6174 26 72.2348 26 111 26H25ZM25 26C53.3671 26 81.7343 26 111 26H25ZM111 26C111 52.303 111 78.606 111 111V26ZM111 26C111 51.2947 111 76.5893 111 111V26ZM111 111C87.0792 111 63.1585 111 25 111H111ZM111 111C87.4646 111 63.9293 111 25 111H111ZM25 111C25 81.1514 25 51.3028 25 26V111Z"
        stroke={iconFillColor(theme)}
        strokeWidth="2"
      />
      <path d="M100 100H160V160H100" fill={iconFillColor(theme)} />
      <path
        d="M100 160C100 144.106 100 128.211 100 100M100 100C117.706 100 135.412 100 160 100H100ZM100 100C114.214 100 128.428 100 160 100H100ZM160 100C160 120.184 160 140.369 160 160V100ZM160 100C160 113.219 160 126.437 160 160V100ZM160 160C145.534 160 131.068 160 100 160H160ZM160 160C143.467 160 126.934 160 100 160H160ZM100 160C100 143.661 100 127.321 100 100V160Z"
        stroke={iconFillColor(theme)}
        strokeWidth="2"
      />
      <g
        fill={handlerColor(theme)}
        stroke={iconFillColor(theme)}
        strokeWidth="6"
      >
        <rect x="2.5" y="2.5" width="30" height="30" />
        <rect x="2.5" y="149.5" width="30" height="30" />
        <rect x="147.5" y="149.5" width="30" height="30" />
        <rect x="147.5" y="2.5" width="30" height="30" />
      </g>
    </>,
    { width: 182, height: 182, mirror: true },
  ),
);

export const UngroupIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <>
      <path d="M25 26H111V111H25" fill={iconFillColor(theme)} />
      <path
        d="M25 111C25 80.2068 25 49.4135 25 26M25 26C48.6174 26 72.2348 26 111 26H25ZM25 26C53.3671 26 81.7343 26 111 26H25ZM111 26C111 52.303 111 78.606 111 111V26ZM111 26C111 51.2947 111 76.5893 111 111V26ZM111 111C87.0792 111 63.1585 111 25 111H111ZM111 111C87.4646 111 63.9293 111 25 111H111ZM25 111C25 81.1514 25 51.3028 25 26V111Z"
        stroke={iconFillColor(theme)}
        strokeWidth="2"
      />
      <path d="M100 100H160V160H100" fill={iconFillColor(theme)} />
      <path
        d="M100 160C100 144.106 100 128.211 100 100M100 100C117.706 100 135.412 100 160 100H100ZM100 100C114.214 100 128.428 100 160 100H100ZM160 100C160 120.184 160 140.369 160 160V100ZM160 100C160 113.219 160 126.437 160 160V100ZM160 160C145.534 160 131.068 160 100 160H160ZM160 160C143.467 160 126.934 160 100 160H160ZM100 160C100 143.661 100 127.321 100 100V160Z"
        stroke={iconFillColor(theme)}
        strokeWidth="2"
      />
      <g
        fill={handlerColor(theme)}
        stroke={iconFillColor(theme)}
        strokeWidth="6"
      >
        <rect x="2.5" y="2.5" width="30" height="30" />
        <rect x="78.5" y="149.5" width="30" height="30" />
        <rect x="147.5" y="149.5" width="30" height="30" />
        <rect x="147.5" y="78.5" width="30" height="30" />
        <rect x="105.5" y="2.5" width="30" height="30" />
        <rect x="2.5" y="102.5" width="30" height="30" />
      </g>
    </>,
    { width: 182, height: 182, mirror: true },
  ),
);

export const FillHachureIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M20.101 16H28.0934L36 8.95989V4H33.5779L20.101 16ZM30.5704 4L17.0935 16H9.10101L22.5779 4H30.5704ZM19.5704 4L6.09349 16H4V10.7475L11.5779 4H19.5704ZM8.57036 4H4V8.06952L8.57036 4ZM36 11.6378L31.101 16H36V11.6378ZM2 2V18H38V2H2Z"
      fill={iconFillColor(theme)}
    />,
    { width: 40, height: 20 },
  ),
);

export const FillCrossHatchIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <g fill={iconFillColor(theme)} fillRule="evenodd" clipRule="evenodd">
      <path d="M20.101 16H28.0934L36 8.95989V4H33.5779L20.101 16ZM30.5704 4L17.0935 16H9.10101L22.5779 4H30.5704ZM19.5704 4L6.09349 16H4V10.7475L11.5779 4H19.5704ZM8.57036 4H4V8.06952L8.57036 4ZM36 11.6378L31.101 16H36V11.6378ZM2 2V18H38V2H2Z" />
      <path d="M14.0001 18L3.00006 4.00002L4.5727 2.76438L15.5727 16.7644L14.0001 18ZM25.0001 18L14.0001 4.00002L15.5727 2.76438L26.5727 16.7644L25.0001 18ZM36.0001 18L25.0001 4.00002L26.5727 2.76438L37.5727 16.7644L36.0001 18Z" />
    </g>,
    { width: 40, height: 20 },
  ),
);

export const FillSolidIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(<path d="M2 2H38V18H2V2Z" fill={iconFillColor(theme)} />, {
    width: 40,
    height: 20,
  }),
);

export const StrokeWidthIcon = React.memo(
  ({ theme, strokeWidth }: { theme: Theme; strokeWidth: number }) =>
    createIcon(
      <rect
        y={11 - (strokeWidth / 2 - 1)}
        width="24"
        height={strokeWidth}
        rx={1 + (strokeWidth / 2 - 1)}
      />,
      { width: 24, height: 24 },
    ),
);

export const StrokeStyleSolidIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(<rect y="11" width="24" height="2" rx="1" />, {
    width: 24,
    height: 24,
  }),
);

export const StrokeStyleDashedIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path d="M1 11C0.447715 11 0 11.4477 0 12C0 12.5523 0.447716 13 1 13H9C9.55229 13 10 12.5523 10 12C10 11.4477 9.55228 11 9 11H1ZM15 11C14.4477 11 14 11.4477 14 12C14 12.5523 14.4477 13 15 13H23C23.5523 13 24 12.5523 24 12C24 11.4477 23.5523 11 23 11H15Z" />,
    { width: 24, height: 24 },
  ),
);

export const StrokeStyleDottedIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path d="M0 12C0 11.4477 0.447715 11 1 11H3C3.55228 11 4 11.4477 4 12C4 12.5523 3.55228 13 3 13H1C0.447715 13 0 12.5523 0 12ZM15 12C15 11.4477 15.4477 11 16 11H18C18.5523 11 19 11.4477 19 12C19 12.5523 18.5523 13 18 13H16C15.4477 13 15 12.5523 15 12ZM21 11C20.4477 11 20 11.4477 20 12C20 12.5523 20.4477 13 21 13H23C23.5523 13 24 12.5523 24 12C24 11.4477 23.5523 11 23 11H21ZM10 12C10 11.4477 10.4477 11 11 11H13C13.5523 11 14 11.4477 14 12C14 12.5523 13.5523 13 13 13H11C10.4477 13 10 12.5523 10 12ZM6 11C5.44772 11 5 11.4477 5 12C5 12.5523 5.44772 13 6 13H8C8.55229 13 9 12.5523 9 12C9 11.4477 8.55229 11 8 11H6Z" />,
    { width: 24, height: 24 },
  ),
);

export const SloppinessArchitectIcon = React.memo(
  ({ theme }: { theme: Theme }) =>
    createIcon(
      <path
        d="M3.00098 16.1691C6.28774 13.9744 19.6399 2.8905 22.7215 3.00082C25.8041 3.11113 19.1158 15.5488 21.4962 16.8309C23.8757 18.1131 34.4155 11.7148 37.0001 10.6919"
        stroke={iconFillColor(theme)}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />,
      { width: 40, height: 20, mirror: true },
    ),
);

export const SloppinessArtistIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      d="M3 17C6.68158 14.8752 16.1296 9.09849 22.0648 6.54922C28 3.99995 22.2896 13.3209 25 14C27.7104 14.6791 36.3757 9.6471 36.3757 9.6471M6.40706 15C13 11.1918 20.0468 1.51045 23.0234 3.0052C26 4.49995 20.457 12.8659 22.7285 16.4329C25 20 36.3757 13 36.3757 13"
      stroke={iconFillColor(theme)}
      strokeWidth={2}
      strokeLinecap="round"
      fill="none"
    />,
    { width: 40, height: 20, mirror: true },
  ),
);

export const SloppinessCartoonistIcon = React.memo(
  ({ theme }: { theme: Theme }) =>
    createIcon(
      <path
        d="M3 15.6468C6.93692 13.5378 22.5544 2.81528 26.6206 3.00242C30.6877 3.18956 25.6708 15.3346 27.4009 16.7705C29.1309 18.2055 35.4001 12.4762 37 11.6177M3.97143 10.4917C6.61158 9.24563 16.3706 2.61886 19.8104 3.01724C23.2522 3.41472 22.0773 12.2013 24.6181 12.8783C27.1598 13.5536 33.3179 8.04068 35.0571 7.07244"
        stroke={iconFillColor(theme)}
        strokeWidth={2}
        strokeLinecap="round"
        fill="none"
      />,
      { width: 40, height: 20, mirror: true },
    ),
);

export const EdgeSharpIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      d="M10 17L10 5L35 5"
      stroke={iconFillColor(theme)}
      strokeWidth={2}
      strokeLinecap="round"
      fill="none"
    />,
    { width: 40, height: 20, mirror: true },
  ),
);

export const EdgeRoundIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      d="M10 17V15C10 8 13 5 21 5L33.5 5"
      stroke={iconFillColor(theme)}
      strokeWidth={2}
      strokeLinecap="round"
      fill="none"
    />,
    { width: 40, height: 20, mirror: true },
  ),
);

export const ArrowheadNoneIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      d="M6 10H34"
      stroke={iconFillColor(theme)}
      strokeWidth={2}
      fill="none"
    />,
    {
      width: 40,
      height: 20,
    },
  ),
);

export const ArrowheadArrowIcon = React.memo(
  ({ theme, flip = false }: { theme: Theme; flip?: boolean }) =>
    createIcon(
      <g
        transform={flip ? "translate(40, 0) scale(-1, 1)" : ""}
        stroke={iconFillColor(theme)}
        strokeWidth={2}
        fill="none"
      >
        <path d="M34 10H6M34 10L27 5M34 10L27 15" />
        <path d="M27.5 5L34.5 10L27.5 15" />
      </g>,
      { width: 40, height: 20 },
    ),
);

export const ArrowheadDotIcon = React.memo(
  ({ theme, flip = false }: { theme: Theme; flip?: boolean }) =>
    createIcon(
      <g
        stroke={iconFillColor(theme)}
        fill={iconFillColor(theme)}
        transform={flip ? "translate(40, 0) scale(-1, 1)" : ""}
      >
        <path d="M32 10L6 10" strokeWidth={2} />
        <circle r="4" transform="matrix(-1 0 0 1 30 10)" />
      </g>,
      { width: 40, height: 20 },
    ),
);

export const ArrowheadBarIcon = React.memo(
  ({ theme, flip = false }: { theme: Theme; flip?: boolean }) =>
    createIcon(
      <g transform={flip ? "translate(40, 0) scale(-1, 1)" : ""}>
        <path
          d="M34 10H5.99996M34 10L34 5M34 10L34 15"
          stroke={iconFillColor(theme)}
          strokeWidth={2}
          fill="none"
        />
      </g>,
      { width: 40, height: 20 },
    ),
);

export const ArrowheadTriangleIcon = React.memo(
  ({ theme, flip = false }: { theme: Theme; flip?: boolean }) =>
    createIcon(
      <g
        stroke={iconFillColor(theme)}
        fill={iconFillColor(theme)}
        transform={flip ? "translate(40, 0) scale(-1, 1)" : ""}
      >
        <path d="M32 10L6 10" strokeWidth={2} />
        <path d="M27.5 5.5L34.5 10L27.5 14.5L27.5 5.5" />
      </g>,
      { width: 40, height: 20 },
    ),
);

export const FontSizeSmallIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path d="M7 8.5C7 6.01472 9.01472 4 11.5 4H13C15.2091 4 17 5.79086 17 8C17 8.55228 16.5523 9 16 9C15.4477 9 15 8.55228 15 8C15 6.89543 14.1046 6 13 6H11.5C10.1193 6 9 7.11929 9 8.5C9 9.88071 10.1193 11 11.5 11H12.5C14.9853 11 17 13.0147 17 15.5C17 17.9853 14.9853 20 12.5 20H11C8.79086 20 7 18.2091 7 16C7 15.4477 7.44772 15 8 15C8.55228 15 9 15.4477 9 16C9 17.1046 9.89543 18 11 18H12.5C13.8807 18 15 16.8807 15 15.5C15 14.1193 13.8807 13 12.5 13H11.5C9.01472 13 7 10.9853 7 8.5Z" />,
    { width: 24, height: 24 },
  ),
);

export const FontSizeMediumIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path d="M16.9107 4.62031C17.4211 3.57099 19 3.93424 19 5.10102V19.0005C19 19.5525 18.5523 20 18 20C17.4477 20 17 19.5525 17 19.0005V9.00852L12.9893 17.2537C12.588 18.0787 11.412 18.0787 11.0107 17.2537L7 9.00852V19.0005C7 19.5525 6.55228 20 6 20C5.44772 20 5 19.5525 5 19.0005V5.10102C5 3.93422 6.57886 3.571 7.08928 4.62031L12 14.7157L16.9107 4.62031Z" />,
    { width: 24, height: 24 },
  ),
);

export const FontSizeLargeIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path d="M9 4C9.55228 4 10 4.44772 10 5V18H16C16.5523 18 17 18.4477 17 19C17 19.5523 16.5523 20 16 20H10C8.89543 20 8 19.1046 8 18V5C8 4.44772 8.44772 4 9 4Z" />,
    { width: 24, height: 24 },
  ),
);

export const FontSizeExtraLargeIcon = React.memo(
  ({ theme }: { theme: Theme }) =>
    createIcon(
      <path d="M4.89465 4.55301C4.64766 4.05903 4.04698 3.8588 3.55301 4.10579C3.05903 4.35278 2.8588 4.95345 3.10579 5.44743L6.38219 12.0002L3.10579 18.553C2.8588 19.047 3.05903 19.6477 3.55301 19.8946C4.04698 20.1416 4.64766 19.9414 4.89465 19.4474L7.50022 14.2363L10.1058 19.4474C10.3528 19.9414 10.9535 20.1416 11.4474 19.8946C11.9414 19.6477 12.1416 19.047 11.8946 18.553L8.61825 12.0002L11.8946 5.44743C12.1416 4.95345 11.9414 4.35278 11.4474 4.10579C10.9535 3.8588 10.3528 4.05903 10.1058 4.55301L7.50022 9.76415L4.89465 4.55301ZM15.0002 5.00022C15.0002 4.44793 14.5525 4.00022 14.0002 4.00022C13.4479 4.00022 13.0002 4.44793 13.0002 5.00022V18.0002C13.0002 19.1048 13.8956 20.0002 15.0002 20.0002H21.0002C21.5525 20.0002 22.0002 19.5525 22.0002 19.0002C22.0002 18.4479 21.5525 18.0002 21.0002 18.0002H15.0002V5.00022Z" />,
      { width: 24, height: 24 },
    ),
);

export const FontFamilyHandDrawnIcon = React.memo(
  ({ theme }: { theme: Theme }) =>
    createIcon(
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.4528 3.12425C16.9499 1.62915 19.3772 1.62916 20.8743 3.12425C22.3714 4.61934 22.3714 7.04337 20.8743 8.53846L9.54676 19.8508C8.84781 20.5488 7.95762 21.0246 6.98837 21.2182L3.31811 21.9513C2.54738 22.1052 1.86786 21.4266 2.022 20.6569L2.75605 16.9916C2.94991 16.0236 3.42632 15.1346 4.12526 14.4366L15.4528 3.12425ZM19.4582 4.53847C18.7432 3.82442 17.584 3.82442 16.869 4.53846L7.89522 13.5002L10.4845 16.0859L19.4582 7.12425C20.1732 6.41021 20.1732 5.25251 19.4582 4.53847ZM5.54138 15.8508L6.47911 14.9144L9.06837 17.5002L8.13064 18.4366C7.71127 18.8554 7.17716 19.1409 6.59561 19.2571L4.25091 19.7254L4.71985 17.3838C4.83616 16.803 5.12201 16.2696 5.54138 15.8508ZM11.9865 20.0001C11.4335 20.0001 10.9852 20.4478 10.9852 21.0001C10.9852 21.5524 11.4335 22.0001 11.9865 22.0001H20.9986C21.5517 22.0001 22 21.5524 22 21.0001C22 20.4478 21.5517 20.0001 20.9986 20.0001H11.9865Z"
      />,
      { width: 24, height: 24 },
    ),
);

export const FontFamilyNormalIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      d="M12 7.57365L13.3512 11H10.6488L12 7.57365ZM15.0714 15.3621L14.1399 13H9.86014L8.92864 15.3621C8.72354 15.8823 8.1416 16.1352 7.62884 15.9272C7.11609 15.7191 6.86668 15.1289 7.07179 14.6088L10.9787 4.70135C11.3475 3.76623 12.6525 3.76621 13.0213 4.70135L16.9282 14.6088C17.1333 15.1289 16.8839 15.7191 16.3712 15.9272C15.8584 16.1352 15.2765 15.8823 15.0714 15.3621ZM7 18C6.44772 18 6 18.4477 6 19C6 19.5523 6.44772 20 7 20H17C17.5523 20 18 19.5523 18 19C18 18.4477 17.5523 18 17 18H7Z"
    />,
    { width: 24, height: 24 },
  ),
);

export const FontFamilyCodeIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M13.7602 2.01731C13.2163 1.92141 12.6976 2.28458 12.6017 2.82847L9.42773 20.8292C9.33183 21.3731 9.695 21.8917 10.2389 21.9876C10.7828 22.0835 11.3014 21.7204 11.3974 21.1765L14.5714 3.17577C14.6673 2.63187 14.3041 2.11322 13.7602 2.01731ZM8.70711 7.70702C9.09763 7.3165 9.09763 6.68333 8.70711 6.29281C8.31658 5.90228 7.68342 5.90228 7.29289 6.29281L2.29289 11.2928C1.90237 11.6833 1.90237 12.3165 2.29289 12.707L7.29289 17.707C7.68342 18.0975 8.31658 18.0975 8.70711 17.707C9.09763 17.3165 9.09763 16.6833 8.70711 16.2928L4.41421 11.9999L8.70711 7.70702ZM16.7071 6.29281C16.3166 5.90228 15.6834 5.90228 15.2929 6.29281C14.9024 6.68333 14.9024 7.3165 15.2929 7.70702L19.5858 11.9999L15.2929 16.2928C14.9024 16.6833 14.9024 17.3165 15.2929 17.707C15.6834 18.0975 16.3166 18.0975 16.7071 17.707L21.7071 12.707C22.0976 12.3165 22.0976 11.6833 21.7071 11.2928L16.7071 6.29281Z"
    />,
    { width: 24, height: 24 },
  ),
);

export const TextAlignLeftIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM4 13C3.44772 13 3 13.4477 3 14C3 14.5523 3.44772 15 4 15H18C18.5523 15 19 14.5523 19 14C19 13.4477 18.5523 13 18 13H4ZM3 10C3 9.44771 3.44772 9 4 9H10C10.5523 9 11 9.44771 11 10C11 10.5523 10.5523 11 10 11H4C3.44772 11 3 10.5523 3 10ZM4 17C3.44772 17 3 17.4477 3 18C3 18.5523 3.44772 19 4 19H14C14.5523 19 15 18.5523 15 18C15 17.4477 14.5523 17 14 17H4Z"
    />,
    { width: 24, height: 24 },
  ),
);

export const TextAlignCenterIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM5 13C4.44772 13 4 13.4477 4 14C4 14.5523 4.44772 15 5 15H19C19.5523 15 20 14.5523 20 14C20 13.4477 19.5523 13 19 13H5ZM8 10C8 9.44771 8.44772 9 9 9H15C15.5523 9 16 9.44771 16 10C16 10.5523 15.5523 11 15 11H9C8.44772 11 8 10.5523 8 10ZM7 17C6.44772 17 6 17.4477 6 18C6 18.5523 6.44772 19 7 19H17C17.5523 19 18 18.5523 18 18C18 17.4477 17.5523 17 17 17H7Z"
    />,
    { width: 24, height: 24 },
  ),
);

export const TextAlignRightIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM6 13C5.44772 13 5 13.4477 5 14C5 14.5523 5.44772 15 6 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H6ZM13 10C13 9.44771 13.4477 9 14 9H20C20.5523 9 21 9.44771 21 10C21 10.5523 20.5523 11 20 11H14C13.4477 11 13 10.5523 13 10ZM10 17C9.44772 17 9 17.4477 9 18C9 18.5523 9.44771 19 10 19H20C20.5523 19 21 18.5523 21 18C21 17.4477 20.5523 17 20 17H10Z"
    />,
    { width: 24, height: 24 },
  ),
);

export const TextAlignTopIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4C3.44772 4 3 4.44772 3 5C3 5.55228 3.44772 6 4 6H20C20.5523 6 21 5.55228 21 5C21 4.44772 20.5523 4 20 4H4ZM3 9C3 8.44772 3.44772 8 4 8H20C20.5523 8 21 8.44772 21 9C21 9.55228 20.5523 10 20 10H4C3.44772 10 3 9.55228 3 9Z"
    />,
    { width: 24, height: 24 },
  ),
);

export const TextAlignBottomIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 14C3.44772 14 3 14.4477 3 15C3 15.5523 3.44772 16 4 16H20C20.5523 16 21 15.5523 21 15C21 14.4477 20.5523 14 20 14H4ZM3 19C3 18.4477 3.44772 18 4 18H20C20.5523 18 21 18.4477 21 19C21 19.5523 20.5523 20 20 20H4C3.44772 20 3 19.5523 3 19Z"
    />,
    { width: 24, height: 24 },
  ),
);

export const TextAlignMiddleIcon = React.memo(({ theme }: { theme: Theme }) =>
  createIcon(
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 13C3.44772 13 3 13.4477 3 14C3 14.5523 3.44772 15 4 15H20C20.5523 15 21 14.5523 21 14C21 13.4477 20.5523 13 20 13H4ZM3 10C3 9.44772 3.44772 9 4 9H20C20.5523 9 21 9.44772 21 10C21 10.5523 20.5523 11 20 11H4C3.44772 11 3 10.5523 3 10Z"
    />,
    { width: 24, height: 24 },
  ),
);

export const publishIcon = createIcon(
  <path
    d="M537.6 226.6c4.1-10.7 6.4-22.4 6.4-34.6 0-53-43-96-96-96-19.7 0-38.1 6-53.3 16.2C367 64.2 315.3 32 256 32c-88.4 0-160 71.6-160 160 0 2.7.1 5.4.2 8.1C40.2 219.8 0 273.2 0 336c0 79.5 64.5 144 144 144h368c70.7 0 128-57.3 128-128 0-61.9-44-113.6-102.4-125.4zM393.4 288H328v112c0 8.8-7.2 16-16 16h-48c-8.8 0-16-7.2-16-16V288h-65.4c-14.3 0-21.4-17.2-11.3-27.3l105.4-105.4c6.2-6.2 16.4-6.2 22.6 0l105.4 105.4c10.1 10.1 2.9 27.3-11.3 27.3z"
    fill="currentColor"
  />,
  { width: 640, height: 512 },
);

export const editIcon = createIcon(
  <path
    fill="currentColor"
    d="M402.3 344.9l32-32c5-5 13.7-1.5 13.7 5.7V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V112c0-26.5 21.5-48 48-48h273.5c7.1 0 10.7 8.6 5.7 13.7l-32 32c-1.5 1.5-3.5 2.3-5.7 2.3H48v352h352V350.5c0-2.1.8-4.1 2.3-5.6zm156.6-201.8L296.3 405.7l-90.4 10c-26.2 2.9-48.5-19.2-45.6-45.6l10-90.4L432.9 17.1c22.9-22.9 59.9-22.9 82.7 0l43.2 43.2c22.9 22.9 22.9 60 .1 82.8zM460.1 174L402 115.9 216.2 301.8l-7.3 65.3 65.3-7.3L460.1 174zm64.8-79.7l-43.2-43.2c-4.1-4.1-10.8-4.1-14.8 0L436 82l58.1 58.1 30.9-30.9c4-4.2 4-10.8-.1-14.9z"
  ></path>,
  { width: 640, height: 512 },
);

export const eraser = createIcon(
  <path
    fillRule="evenodd"
    d="M16.5765 4.58692C15.7955 3.80553 14.5292 3.80553 13.7482 4.58692L12.1294 6.20646L17.7861 11.8658L19.4048 10.2462C20.1859 9.46485 20.1859 8.19797 19.4048 7.41658L16.5765 4.58692ZM16.3719 13.2806L10.7153 7.62129L4.58569 13.7538C3.80467 14.5351 3.80467 15.802 4.58569 16.5834L7.41402 19.4131C8.19503 20.1945 9.46132 20.1945 10.2423 19.4131L16.3719 13.2806ZM17.9907 3.17208C16.4286 1.6093 13.8961 1.60931 12.334 3.17209L3.17153 12.3389C1.60949 13.9017 1.60949 16.4355 3.17153 17.9983L5.99985 20.8279C6.81368 21.6421 7.89094 22.0321 8.95713 21.9979C8.9715 21.9985 8.98595 21.9989 9.00047 21.9989H21C21.5523 21.9989 22 21.5509 22 20.9984C22 20.4459 21.5523 19.998 21 19.998H12.486L20.819 11.6611C22.381 10.0983 22.381 7.56453 20.819 6.00175L17.9907 3.17208Z"
  />,
  { width: 24 },
);
