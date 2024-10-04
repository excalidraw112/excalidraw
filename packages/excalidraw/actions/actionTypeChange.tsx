import { ButtonIconSelect } from "../components/ButtonIconSelect";

import { DiamondIcon, EllipseIcon, RectangleIcon } from "../components/icons";

import { newElement, redrawTextBoundingBox } from "../element";

import { isFlowchartNodeElement } from "../element/typeChecks";
import type { ExcalidrawElement } from "../element/types";
import { t } from "../i18n";

import { randomInteger } from "../random";
import { StoreAction } from "../store";
import type { AppClassProperties, AppState } from "../types";
import { changeProperty, getFormValue } from "./actionProperties";
import { register } from "./register";

export const actionChangeShapeType = register({
  name: "changeShapeType",
  label: "labels.shapeType",
  trackEvent: { category: "element", action: "changeShapeForAllSelected" },
  perform: (
    elements: readonly ExcalidrawElement[],
    appState: AppState,
    value: "rectangle" | "diamond" | "ellipse",
    app: AppClassProperties,
  ) => {
    const newElements = changeProperty(elements, appState, (el) => {
      if (el.type !== value && isFlowchartNodeElement(el)) {
        const side = el.width > el.height ? el.width : el.height;
        const newShape = newElement({
          ...el,
          width: side,
          height: side,
          type: value,
          versionNonce: randomInteger(),
        });
        return newShape;
      }
      return el;
    });
    newElements.forEach((ele) => {
      if (ele.type === "text" && ele.containerId) {
        const container = newElements.find((e) => e.id === ele.containerId);
        if (container === undefined) {
          return;
        }
        redrawTextBoundingBox(
          ele,
          container,
          app.scene.getNonDeletedElementsMap(),
        );
      }
    });

    return {
      elements: newElements,
      storeAction: StoreAction.CAPTURE,
    };
  },
  PanelComponent: ({ elements, appState, updateData, app }) => (
    <fieldset>
      <legend>{t("labels.changeShapesTypes")}</legend>
      <ButtonIconSelect
        group="shapeType"
        options={[
          {
            value: "rectangle",
            text: t("labels.changeToRectangle"),
            icon: RectangleIcon,
            testId: "sharp-rectangle",
          },
          {
            value: "diamond",
            text: t("labels.changeToDiamond"),
            icon: DiamondIcon,
            testId: "sharp-rectangle",
          },
          {
            value: "ellipse",
            text: t("labels.changeToEllipse"),
            icon: EllipseIcon,
            testId: "elbow-arrow",
          },
        ]}
        aria-label={t("labels.changeToRectangle")}
        value={getFormValue(
          elements,
          appState,
          (element) => {
            if (isFlowchartNodeElement(element)) {
              return element.type;
            }
            return null;
          },
          (element) => isFlowchartNodeElement(element),
          (hasSelection) =>
            hasSelection ? null : appState.currentItemArrowType,
        )}
        onChange={(value) => updateData(value)}
      />
    </fieldset>
  ),
});
