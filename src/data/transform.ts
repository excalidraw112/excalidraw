import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_FONT_SIZE,
  TEXT_ALIGN,
  VERTICAL_ALIGN,
} from "../constants";
import {
  newElement,
  newLinearElement,
  redrawTextBoundingBox,
} from "../element";
import { bindLinearElement } from "../element/binding";
import { mutateElement } from "../element/mutateElement";
import {
  ElementConstructorOpts,
  newTextElement,
  regenerateId,
} from "../element/newElement";
import {
  VALID_CONTAINER_TYPES,
  getDefaultLineHeight,
  measureText,
  normalizeText,
} from "../element/textElement";
import {
  ExcalidrawBindableElement,
  ExcalidrawElement,
  ExcalidrawGenericElement,
  ExcalidrawLinearElement,
  ExcalidrawTextElement,
  FontFamilyValues,
  TextAlign,
  VerticalAlign,
} from "../element/types";
import { MarkOptional } from "../utility-types";
import { getFontString } from "../utils";
import { ImportedDataState } from "./types";

export const ELEMENTS_SUPPORTING_PROGRAMMATIC_API = [
  "rectangle",
  "ellipse",
  "diamond",
  "text",
  "arrow",
  "line",
];

const bindTextToContainer = (
  containerProps:
    | {
        type:
          | Exclude<ExcalidrawGenericElement["type"], "selection">
          | ExcalidrawLinearElement["type"];
      } & MarkOptional<ElementConstructorOpts, "x" | "y">,
  textProps: { text: string } & MarkOptional<ElementConstructorOpts, "x" | "y">,
) => {
  let container;
  if (containerProps.type === "arrow") {
    const width = containerProps.width || 300;
    const height = containerProps.height || 0;
    container = newLinearElement({
      width,
      height,
      //@ts-ignore
      type: containerProps.type,
      //@ts-ignore,
      endArrowhead: containerProps.type === "arrow" ? "arrow" : null,
      //@ts-ignore
      points: [
        [0, 0],
        [width, height],
      ],
      ...containerProps,
    });
  } else {
    //@ts-ignore
    container = newElement({
      ...containerProps,
    });
  }
  const textElement: ExcalidrawTextElement = newTextElement({
    x: 0,
    y: 0,
    textAlign: TEXT_ALIGN.CENTER,
    verticalAlign: VERTICAL_ALIGN.MIDDLE,
    ...textProps,
    containerId: container.id,
  });

  mutateElement(container, {
    boundElements: (container.boundElements || []).concat({
      type: "text",
      id: textElement.id,
    }),
  });

  redrawTextBoundingBox(textElement, container);

  return [container, textElement];
};

const bindLinearElementToElement = (
  linearElement: {
    type: ExcalidrawLinearElement["type"];
    x: number;
    y: number;
    label?: {
      text: string;
      fontSize?: number;
      fontFamily?: FontFamilyValues;
      textAlign?: TextAlign;
      verticalAlign?: VerticalAlign;
    } & MarkOptional<ElementConstructorOpts, "x" | "y">;
    start?:
      | (
          | {
              type: Exclude<
                ExcalidrawBindableElement["type"],
                "image" | "selection" | "text"
              >;
              id?: ExcalidrawGenericElement["id"];
            }
          | ({
              type: "text";
              text: string;
              id?: ExcalidrawTextElement["id"];
            } & Partial<ExcalidrawTextElement>)
        ) &
          MarkOptional<ElementConstructorOpts, "x" | "y">;
    end?:
      | (
          | {
              type: Exclude<
                ExcalidrawBindableElement["type"],
                "image" | "selection" | "text"
              >;
              id?: ExcalidrawGenericElement["id"];
            }
          | ({
              type: "text";
              text: string;
              id?: ExcalidrawTextElement["id"];
            } & Partial<ExcalidrawTextElement>)
        ) &
          MarkOptional<ElementConstructorOpts, "x" | "y">;
  } & Partial<ExcalidrawLinearElement>,
): {
  linearElement: ExcalidrawLinearElement;
  startBoundElement?: ExcalidrawElement;
  endBoundElement?: ExcalidrawElement;
} => {
  const {
    start,
    end,
    type,
    endArrowhead = linearElement.type === "arrow" ? "arrow" : null,
    ...rest
  } = linearElement;
  const width = linearElement.width || 300;
  const height = linearElement.height || 24;
  const excliadrawLinearElement = newLinearElement({
    type,
    width,
    height,
    points: [
      [0, 0],
      [width, height],
    ],
    endArrowhead,
    ...rest,
  });

  let startBoundElement;
  let endBoundElement;

  mutateElement(excliadrawLinearElement, {
    startBinding: linearElement?.startBinding || null,
    endBinding: linearElement.endBinding || null,
  });

  if (start) {
    const width = start?.width ?? 100;
    const height = start?.height ?? 100;
    const existingElement = start.id
      ? excalidrawElements.get().find((ele) => ele?.id === start.id)
      : undefined;
    const startX = start.x || excliadrawLinearElement.x - width;
    const startY = start.y || excliadrawLinearElement.y - height / 2;

    if (start.type === "text") {
      startBoundElement = newTextElement({
        x: startX,
        y: startY,
        ...existingElement,
        ...start,
      });
      // to position the text correctly when coordinates not provided
      mutateElement(startBoundElement, {
        x: start.x || excliadrawLinearElement.x - startBoundElement.width,
        y: start.y || excliadrawLinearElement.y - startBoundElement.height / 2,
      });
    } else {
      startBoundElement = newElement({
        x: startX,
        y: startY,
        width,
        height,
        ...existingElement,
        ...start,
      });
    }

    bindLinearElement(
      excliadrawLinearElement,
      startBoundElement as ExcalidrawBindableElement,
      "start",
    );
  }
  if (end) {
    const height = end?.height ?? 100;
    const width = end?.width ?? 100;

    const existingElement = end.id
      ? excalidrawElements.get().find((ele) => ele?.id === end.id)
      : undefined;
    const endX =
      end.x || excliadrawLinearElement.x + excliadrawLinearElement.width;
    const endY = end.y || excliadrawLinearElement.y - height / 2;

    if (end.type === "text") {
      endBoundElement = newTextElement({
        x: endX,
        y: endY,
        ...existingElement,
        ...end,
      });
      // to position the text correctly when coordinates not provided
      mutateElement(endBoundElement, {
        y: end.y || excliadrawLinearElement.y - endBoundElement.height / 2,
      });
    } else {
      endBoundElement = newElement({
        x: endX,
        y: endY,
        width,
        height,
        ...existingElement,
        ...end,
      }) as ExcalidrawBindableElement;
    }
    bindLinearElement(
      excliadrawLinearElement,
      endBoundElement as ExcalidrawBindableElement,
      "end",
    );
  }
  return {
    linearElement: excliadrawLinearElement,
    //@ts-ignore
    startBoundElement,
    //@ts-ignore
    endBoundElement,
  };
};

const excalidrawElements = (() => {
  const res: ExcalidrawElement[] = [];
  const elementMap = new Map<string, number>();

  const push = (ele?: ExcalidrawElement) => {
    if (!ele) {
      return;
    }
    const index = elementMap.get(ele.id);
    if (index !== undefined && index >= 0) {
      res[index] = ele;
    } else {
      res.push(ele);
      const index = res.length - 1;
      elementMap.set(ele.id, index);
    }
  };
  const clear = () => {
    res.length = 0;
    elementMap.clear();
  };
  const get = () => {
    return res;
  };
  const hasElementWithId = (id: string) => {
    const index = elementMap.get(id);
    return index !== undefined && index >= 0;
  };
  return {
    push,
    clear,
    get,
    hasElementWithId,
  };
})();

export const convertToExcalidrawElements = (
  elements: ImportedDataState["elements"],
): ExcalidrawElement[] => {
  excalidrawElements.clear();
  if (!elements) {
    return [];
  }
  elements.forEach((element) => {
    if (!element) {
      return;
    }

    let elementId = element.id || regenerateId(null);

    // To make sure every element has a unique id
    while (excalidrawElements.hasElementWithId(elementId)) {
      elementId = regenerateId(elementId);
    }
    const elementWithid = { ...element, id: elementId };

    if (!ELEMENTS_SUPPORTING_PROGRAMMATIC_API.includes(element.type)) {
      excalidrawElements.push(element as ExcalidrawElement);

      return;
    }
    //@ts-ignore
    if (VALID_CONTAINER_TYPES.has(element.type) && element?.label?.text) {
      //@ts-ignore
      let [container, text] = bindTextToContainer(elementWithid, element.label);
      excalidrawElements.push(container);
      excalidrawElements.push(text);

      if (container.type === "arrow") {
        const { linearElement, startBoundElement, endBoundElement } =
          bindLinearElementToElement({
            ...container,
            //@ts-ignore
            start: element?.start,
            //@ts-ignore
            end: element?.end,
          });
        container = linearElement;
        excalidrawElements.push(linearElement);
        excalidrawElements.push(startBoundElement);
        excalidrawElements.push(endBoundElement);
      }
    } else {
      let excalidrawElement;
      if (element.type === "text") {
        const fontFamily = element?.fontFamily || DEFAULT_FONT_FAMILY;
        const fontSize = element?.fontSize || DEFAULT_FONT_SIZE;
        const lineHeight =
          element?.lineHeight || getDefaultLineHeight(fontFamily);
        const text = element.text ?? "";
        const normalizedText = normalizeText(text);
        const metrics = measureText(
          normalizedText,
          getFontString({ fontFamily, fontSize }),
          lineHeight,
        );
        excalidrawElement = {
          width: metrics.width,
          height: metrics.height,
          fontFamily,
          fontSize,
          ...elementWithid,
        };

        excalidrawElements.push(excalidrawElement as ExcalidrawTextElement);
      } else if (element.type === "arrow" || element.type === "line") {
        const { linearElement, startBoundElement, endBoundElement } =
          //@ts-ignore
          bindLinearElementToElement(elementWithid);
        excalidrawElements.push(linearElement);
        excalidrawElements.push(startBoundElement);
        excalidrawElements.push(endBoundElement);
        //@ts-ignore
        if (startBoundElement && !element.start.id) {
          //@ts-ignore
          excalidrawElements.push(startBoundElement);
        }
        //@ts-ignore
        if (endBoundElement && !element.end.id) {
          //@ts-ignore
          excalidrawElements.push(endBoundElement);
        }
      } else {
        excalidrawElement = {
          ...elementWithid,
          width:
            element?.width ||
            (ELEMENTS_SUPPORTING_PROGRAMMATIC_API.includes(element.type)
              ? 100
              : 0),
          height:
            element?.height ||
            (ELEMENTS_SUPPORTING_PROGRAMMATIC_API.includes(element.type)
              ? 100
              : 0),
        } as ExcalidrawGenericElement;
        excalidrawElements.push(excalidrawElement);
      }
    }
  });
  return excalidrawElements.get();
};
