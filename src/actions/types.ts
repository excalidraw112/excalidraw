import React from "react";
import { ExcalidrawElement } from "../element/types";
import {
  AppClassProperties,
  AppState,
  ExcalidrawProps,
  BinaryFiles,
} from "../types";

export type ActionSource = "ui" | "keyboard" | "contextMenu" | "api";

/** if false, the action should be prevented */
export type ActionResult =
  | {
      elements?: readonly ExcalidrawElement[] | null;
      appState?: MarkOptional<
        AppState,
        "offsetTop" | "offsetLeft" | "width" | "height"
      > | null;
      files?: BinaryFiles | null;
      commitToHistory: boolean;
      syncHistory?: boolean;
      replaceFiles?: boolean;
    }
  | false;

type ActionFn = (
  elements: readonly ExcalidrawElement[],
  appState: Readonly<AppState>,
  formData: any,
  app: AppClassProperties,
) => ActionResult | Promise<ActionResult>;

// Return `true` to indicate the standard Action with name `actionName`
// should be disabled given `elements` and `appState`.
export type DisableFn = (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  actionName: ActionName,
) => boolean;

// Return `true` to indicate the custom Action with name `actionName`
// should be enabled given `elements` and `appState`.
export type EnableFn = (
  elements: readonly ExcalidrawElement[],
  appState: AppState,
  actionName: Action["name"],
) => boolean;

export type UpdaterFn = (res: ActionResult) => void;
export type ActionFilterFn = (action: Action) => void;

const actionNames = [
  "copy",
  "cut",
  "paste",
  "copyAsPng",
  "copyAsSvg",
  "copyText",
  "sendBackward",
  "bringForward",
  "sendToBack",
  "bringToFront",
  "copyStyles",
  "selectAll",
  "pasteStyles",
  "gridMode",
  "zenMode",
  "stats",
  "changeStrokeColor",
  "changeBackgroundColor",
  "changeFillStyle",
  "changeStrokeWidth",
  "changeStrokeShape",
  "changeSloppiness",
  "changeStrokeStyle",
  "changeArrowhead",
  "changeOpacity",
  "changeFontSize",
  "toggleCanvasMenu",
  "toggleEditMenu",
  "undo",
  "redo",
  "finalize",
  "changeProjectName",
  "changeExportBackground",
  "changeExportEmbedScene",
  "changeExportScale",
  "saveToActiveFile",
  "saveFileToDisk",
  "loadScene",
  "duplicateSelection",
  "deleteSelectedElements",
  "changeViewBackgroundColor",
  "clearCanvas",
  "zoomIn",
  "zoomOut",
  "resetZoom",
  "zoomToFit",
  "zoomToSelection",
  "changeFontFamily",
  "changeTextAlign",
  "changeVerticalAlign",
  "toggleFullScreen",
  "toggleShortcuts",
  "group",
  "ungroup",
  "goToCollaborator",
  "addToLibrary",
  "changeSharpness",
  "alignTop",
  "alignBottom",
  "alignLeft",
  "alignRight",
  "alignVerticallyCentered",
  "alignHorizontallyCentered",
  "distributeHorizontally",
  "distributeVertically",
  "flipHorizontal",
  "flipVertical",
  "viewMode",
  "exportWithDarkMode",
  "toggleTheme",
  "increaseFontSize",
  "decreaseFontSize",
  "unbindText",
  "hyperlink",
  "eraser",
  "bindText",
  "toggleLock",
] as const;

// So we can have the `isActionName` type guard
export type ActionName = typeof actionNames[number];
export const isActionName = (n: any): n is ActionName =>
  actionNames.includes(n);

export type PanelComponentProps = {
  elements: readonly ExcalidrawElement[];
  appState: AppState;
  updateData: (formData?: any) => void;
  appProps: ExcalidrawProps;
  data?: Record<string, any>;
};

export interface Action {
  name: string;
  PanelComponent?: React.FC<PanelComponentProps>;
  panelComponentPredicate?: (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
  ) => boolean;
  perform: ActionFn;
  keyPriority?: number;
  keyTest?: (
    event: React.KeyboardEvent | KeyboardEvent,
    appState: AppState,
    elements: readonly ExcalidrawElement[],
  ) => boolean;
  contextItemLabel?:
    | string
    | ((
        elements: readonly ExcalidrawElement[],
        appState: Readonly<AppState>,
      ) => string);
  contextItemPredicate?: (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
  ) => boolean;
  checked?: (appState: Readonly<AppState>) => boolean;
  trackEvent:
    | false
    | {
        category:
          | "toolbar"
          | "element"
          | "canvas"
          | "export"
          | "history"
          | "menu"
          | "collab"
          | "hyperlink";
        action?: string;
        predicate?: (
          appState: Readonly<AppState>,
          elements: readonly ExcalidrawElement[],
          value: any,
        ) => boolean;
      };
}
