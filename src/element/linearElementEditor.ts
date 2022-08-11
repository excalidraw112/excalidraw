import {
  NonDeleted,
  ExcalidrawLinearElement,
  ExcalidrawElement,
  PointBinding,
  ExcalidrawBindableElement,
} from "./types";
import {
  distance2d,
  rotate,
  isPathALoop,
  getGridPoint,
  rotatePoint,
  centerPoint,
} from "../math";
import { getElementAbsoluteCoords, getLockedLinearCursorAlignSize } from ".";
import { getElementPointsCoords } from "./bounds";
import { Point, AppState } from "../types";
import { mutateElement } from "./mutateElement";
import History from "../history";

import Scene from "../scene/Scene";
import {
  bindOrUnbindLinearElement,
  getHoveredElementForBinding,
  isBindingEnabled,
} from "./binding";
import { tupleToCoors } from "../utils";
import { isBindingElement } from "./typeChecks";
import { shouldRotateWithDiscreteAngle } from "../keys";

export class LinearElementEditor {
  public readonly elementId: ExcalidrawElement["id"] & {
    _brand: "excalidrawLinearElementId";
  };
  /** indices */
  public readonly selectedPointsIndices: readonly number[] | null;

  public readonly pointerDownState: Readonly<{
    prevSelectedPointsIndices: readonly number[] | null;
    /** index */
    lastClickedPoint: number;
  }>;

  /** whether you're dragging a point */
  public readonly isDragging: boolean;
  public readonly lastUncommittedPoint: Point | null;
  public readonly pointerOffset: Readonly<{ x: number; y: number }>;
  public readonly startBindingElement:
    | ExcalidrawBindableElement
    | null
    | "keep";
  public readonly endBindingElement: ExcalidrawBindableElement | null | "keep";
  public readonly hoverPointIndex: number;
  public readonly midPointHovered: boolean;

  constructor(element: NonDeleted<ExcalidrawLinearElement>, scene: Scene) {
    this.elementId = element.id as string & {
      _brand: "excalidrawLinearElementId";
    };
    Scene.mapElementToScene(this.elementId, scene);
    LinearElementEditor.normalizePoints(element);

    this.selectedPointsIndices = null;
    this.lastUncommittedPoint = null;
    this.isDragging = false;
    this.pointerOffset = { x: 0, y: 0 };
    this.startBindingElement = "keep";
    this.endBindingElement = "keep";
    this.pointerDownState = {
      prevSelectedPointsIndices: null,
      lastClickedPoint: -1,
    };
    this.hoverPointIndex = -1;
    this.midPointHovered = false;
  }

  // ---------------------------------------------------------------------------
  // static methods
  // ---------------------------------------------------------------------------

  static POINT_HANDLE_SIZE = 10;

  /**
   * @param id the `elementId` from the instance of this class (so that we can
   *  statically guarantee this method returns an ExcalidrawLinearElement)
   */
  static getElement(id: InstanceType<typeof LinearElementEditor>["elementId"]) {
    const element = Scene.getScene(id)?.getNonDeletedElement(id);
    if (element) {
      return element as NonDeleted<ExcalidrawLinearElement>;
    }
    return null;
  }

  static handleBoxSelection(
    event: PointerEvent,
    appState: AppState,
    setState: React.Component<any, AppState>["setState"],
  ) {
    if (
      !appState.editingLinearElement ||
      appState.draggingElement?.type !== "selection"
    ) {
      return false;
    }
    const { editingLinearElement } = appState;
    const { selectedPointsIndices, elementId } = editingLinearElement;

    const element = LinearElementEditor.getElement(elementId);
    if (!element) {
      return false;
    }

    const [selectionX1, selectionY1, selectionX2, selectionY2] =
      getElementAbsoluteCoords(appState.draggingElement);

    const pointsSceneCoords =
      LinearElementEditor.getPointsGlobalCoordinates(element);

    const nextSelectedPoints = pointsSceneCoords.reduce(
      (acc: number[], point, index) => {
        if (
          (point[0] >= selectionX1 &&
            point[0] <= selectionX2 &&
            point[1] >= selectionY1 &&
            point[1] <= selectionY2) ||
          (event.shiftKey && selectedPointsIndices?.includes(index))
        ) {
          acc.push(index);
        }

        return acc;
      },
      [],
    );

    setState({
      editingLinearElement: {
        ...editingLinearElement,
        selectedPointsIndices: nextSelectedPoints.length
          ? nextSelectedPoints
          : null,
      },
    });
  }

  /** @returns whether point was dragged */
  static handlePointDragging(
    event: PointerEvent,
    appState: AppState,
    scenePointerX: number,
    scenePointerY: number,
    maybeSuggestBinding: (
      element: NonDeleted<ExcalidrawLinearElement>,
      pointSceneCoords: { x: number; y: number }[],
    ) => void,
    linearElementEditor: LinearElementEditor,
  ): boolean {
    if (!linearElementEditor) {
      return false;
    }
    const { selectedPointsIndices, elementId } = linearElementEditor;
    const element = LinearElementEditor.getElement(elementId);
    if (!element) {
      return false;
    }

    // point that's being dragged (out of all selected points)
    const draggingPoint = element.points[
      linearElementEditor.pointerDownState.lastClickedPoint
    ] as [number, number] | undefined;
    if (selectedPointsIndices && draggingPoint) {
      if (
        shouldRotateWithDiscreteAngle(event) &&
        selectedPointsIndices.length === 1 &&
        element.points.length > 1
      ) {
        const selectedIndex = selectedPointsIndices[0];
        const referencePoint =
          element.points[selectedIndex === 0 ? 1 : selectedIndex - 1];

        const [width, height] = LinearElementEditor._getShiftLockedDelta(
          element,
          referencePoint,
          [scenePointerX, scenePointerY],
          appState.gridSize,
        );

        LinearElementEditor.movePoints(element, [
          {
            index: selectedIndex,
            point: [width + referencePoint[0], height + referencePoint[1]],
            isDragging:
              selectedIndex ===
              linearElementEditor.pointerDownState.lastClickedPoint,
          },
        ]);
      } else {
        const newDraggingPointPosition = LinearElementEditor.createPointAt(
          element,
          scenePointerX - linearElementEditor.pointerOffset.x,
          scenePointerY - linearElementEditor.pointerOffset.y,
          appState.gridSize,
        );

        const deltaX = newDraggingPointPosition[0] - draggingPoint[0];
        const deltaY = newDraggingPointPosition[1] - draggingPoint[1];

        LinearElementEditor.movePoints(
          element,
          selectedPointsIndices.map((pointIndex) => {
            const newPointPosition =
              pointIndex ===
              linearElementEditor.pointerDownState.lastClickedPoint
                ? LinearElementEditor.createPointAt(
                    element,
                    scenePointerX - linearElementEditor.pointerOffset.x,
                    scenePointerY - linearElementEditor.pointerOffset.y,
                    appState.gridSize,
                  )
                : ([
                    element.points[pointIndex][0] + deltaX,
                    element.points[pointIndex][1] + deltaY,
                  ] as const);
            return {
              index: pointIndex,
              point: newPointPosition,
              isDragging:
                pointIndex ===
                linearElementEditor.pointerDownState.lastClickedPoint,
            };
          }),
        );
      }

      // suggest bindings for first and last point if selected
      if (isBindingElement(element, false)) {
        const coords: { x: number; y: number }[] = [];

        const firstSelectedIndex = selectedPointsIndices[0];
        if (firstSelectedIndex === 0) {
          coords.push(
            tupleToCoors(
              LinearElementEditor.getPointGlobalCoordinates(
                element,
                element.points[0],
              ),
            ),
          );
        }

        const lastSelectedIndex =
          selectedPointsIndices[selectedPointsIndices.length - 1];
        if (lastSelectedIndex === element.points.length - 1) {
          coords.push(
            tupleToCoors(
              LinearElementEditor.getPointGlobalCoordinates(
                element,
                element.points[lastSelectedIndex],
              ),
            ),
          );
        }

        if (coords.length) {
          maybeSuggestBinding(element, coords);
        }
      }

      return true;
    }

    return false;
  }

  static handlePointerUp(
    event: PointerEvent,
    editingLinearElement: LinearElementEditor,
    appState: AppState,
  ): LinearElementEditor {
    const { elementId, selectedPointsIndices, isDragging, pointerDownState } =
      editingLinearElement;
    const element = LinearElementEditor.getElement(elementId);
    if (!element) {
      return editingLinearElement;
    }

    const bindings: Mutable<
      Partial<
        Pick<
          InstanceType<typeof LinearElementEditor>,
          "startBindingElement" | "endBindingElement"
        >
      >
    > = {};

    if (isDragging && selectedPointsIndices) {
      for (const selectedPoint of selectedPointsIndices) {
        if (
          selectedPoint === 0 ||
          selectedPoint === element.points.length - 1
        ) {
          if (isPathALoop(element.points, appState.zoom.value)) {
            LinearElementEditor.movePoints(element, [
              {
                index: selectedPoint,
                point:
                  selectedPoint === 0
                    ? element.points[element.points.length - 1]
                    : element.points[0],
              },
            ]);
          }

          const bindingElement = isBindingEnabled(appState)
            ? getHoveredElementForBinding(
                tupleToCoors(
                  LinearElementEditor.getPointAtIndexGlobalCoordinates(
                    element,
                    selectedPoint!,
                  ),
                ),
                Scene.getScene(element)!,
              )
            : null;

          bindings[
            selectedPoint === 0 ? "startBindingElement" : "endBindingElement"
          ] = bindingElement;
        }
      }
    }

    return {
      ...editingLinearElement,
      ...bindings,
      // if clicking without previously dragging a point(s), and not holding
      // shift, deselect all points except the one clicked. If holding shift,
      // toggle the point.
      selectedPointsIndices:
        isDragging || event.shiftKey
          ? !isDragging &&
            event.shiftKey &&
            pointerDownState.prevSelectedPointsIndices?.includes(
              pointerDownState.lastClickedPoint,
            )
            ? selectedPointsIndices &&
              selectedPointsIndices.filter(
                (pointIndex) =>
                  pointIndex !== pointerDownState.lastClickedPoint,
              )
            : selectedPointsIndices
          : selectedPointsIndices?.includes(pointerDownState.lastClickedPoint)
          ? [pointerDownState.lastClickedPoint]
          : selectedPointsIndices,
      isDragging: false,
      pointerOffset: { x: 0, y: 0 },
    };
  }

  static isHittingMidPoint = (
    linearElementEditor: LinearElementEditor,
    scenePointer: { x: number; y: number },
    appState: AppState,
  ) => {
    if (appState.editingLinearElement) {
      return false;
    }
    const { elementId } = linearElementEditor;
    const element = LinearElementEditor.getElement(elementId);
    if (!element) {
      return false;
    }
    const clickedPointIndex = LinearElementEditor.getPointIndexUnderCursor(
      element,
      appState.zoom,
      scenePointer.x,
      scenePointer.y,
    );
    if (clickedPointIndex >= 0) {
      return false;
    }
    const points = LinearElementEditor.getPointsGlobalCoordinates(element);
    if (points.length >= 3) {
      return false;
    }

    const midPoint = LinearElementEditor.getMidPoint(linearElementEditor);
    if (midPoint) {
      const threshold =
        LinearElementEditor.POINT_HANDLE_SIZE / appState.zoom.value;
      const distance = distance2d(
        midPoint[0],
        midPoint[1],
        scenePointer.x,
        scenePointer.y,
      );
      return distance <= threshold;
    }
    return false;
  };

  static getMidPoint(linearElementEditor: LinearElementEditor) {
    const { elementId } = linearElementEditor;
    const element = LinearElementEditor.getElement(elementId);
    if (!element) {
      return null;
    }
    const points = LinearElementEditor.getPointsGlobalCoordinates(element);

    return centerPoint(points[0], points.at(-1)!);
  }

  static handlePointerDown(
    event: React.PointerEvent<HTMLCanvasElement>,
    appState: AppState,
    history: History,
    scenePointer: { x: number; y: number },
    linearElementEditor: LinearElementEditor,
  ): {
    didAddPoint: boolean;
    hitElement: NonDeleted<ExcalidrawElement> | null;
    linearElementEditor: LinearElementEditor | null;
    isMidPoint: boolean;
  } {
    const ret: ReturnType<typeof LinearElementEditor["handlePointerDown"]> = {
      didAddPoint: false,
      hitElement: null,
      linearElementEditor: null,
      isMidPoint: false,
    };

    if (!linearElementEditor) {
      return ret;
    }

    const { elementId } = linearElementEditor;
    const element = LinearElementEditor.getElement(elementId);

    if (!element) {
      return ret;
    }
    const hittingMidPoint = LinearElementEditor.isHittingMidPoint(
      linearElementEditor,
      scenePointer,
      appState,
    );
    if (
      LinearElementEditor.isHittingMidPoint(
        linearElementEditor,
        scenePointer,
        appState,
      )
    ) {
      const midPoint = LinearElementEditor.getMidPoint(linearElementEditor);
      if (midPoint) {
        mutateElement(element, {
          points: [
            element.points[0],
            LinearElementEditor.createPointAt(
              element,
              midPoint[0],
              midPoint[1],
              appState.gridSize,
            ),
            ...element.points.slice(1),
          ],
        });
      }
      ret.didAddPoint = true;
      ret.isMidPoint = true;
      ret.linearElementEditor = {
        ...linearElementEditor,
        selectedPointsIndices: element.points[1],
        pointerDownState: {
          prevSelectedPointsIndices: linearElementEditor.selectedPointsIndices,
          lastClickedPoint: -1,
        },
        lastUncommittedPoint: null,
      };
    }
    if (event.altKey && appState.editingLinearElement) {
      if (linearElementEditor.lastUncommittedPoint == null) {
        mutateElement(element, {
          points: [
            ...element.points,
            LinearElementEditor.createPointAt(
              element,
              scenePointer.x,
              scenePointer.y,
              appState.gridSize,
            ),
          ],
        });
        ret.didAddPoint = true;
      }
      history.resumeRecording();
      ret.linearElementEditor = {
        ...linearElementEditor,
        pointerDownState: {
          prevSelectedPointsIndices: linearElementEditor.selectedPointsIndices,
          lastClickedPoint: -1,
        },
        selectedPointsIndices: [element.points.length - 1],
        lastUncommittedPoint: null,
        endBindingElement: getHoveredElementForBinding(
          scenePointer,
          Scene.getScene(element)!,
        ),
      };

      ret.didAddPoint = true;
      return ret;
    }

    const clickedPointIndex = LinearElementEditor.getPointIndexUnderCursor(
      element,
      appState.zoom,
      scenePointer.x,
      scenePointer.y,
    );

    // if we clicked on a point, set the element as hitElement otherwise
    // it would get deselected if the point is outside the hitbox area
    if (clickedPointIndex >= 0 || hittingMidPoint) {
      ret.hitElement = element;
    } else {
      // You might be wandering why we are storing the binding elements on
      // LinearElementEditor and passing them in, instead of calculating them
      // from the end points of the `linearElement` - this is to allow disabling
      // binding (which needs to happen at the point the user finishes moving
      // the point).
      const { startBindingElement, endBindingElement } = linearElementEditor;
      if (isBindingEnabled(appState) && isBindingElement(element)) {
        bindOrUnbindLinearElement(
          element,
          startBindingElement,
          endBindingElement,
        );
      }
    }

    const [x1, y1, x2, y2] = getElementAbsoluteCoords(element);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const targetPoint =
      clickedPointIndex > -1 &&
      rotate(
        element.x + element.points[clickedPointIndex][0],
        element.y + element.points[clickedPointIndex][1],
        cx,
        cy,
        element.angle,
      );

    const nextSelectedPointsIndices =
      clickedPointIndex > -1 || event.shiftKey
        ? event.shiftKey ||
          linearElementEditor.selectedPointsIndices?.includes(clickedPointIndex)
          ? normalizeSelectedPoints([
              ...(linearElementEditor.selectedPointsIndices || []),
              clickedPointIndex,
            ])
          : [clickedPointIndex]
        : null;
    ret.linearElementEditor = {
      ...linearElementEditor,
      pointerDownState: {
        prevSelectedPointsIndices: linearElementEditor.selectedPointsIndices,
        lastClickedPoint: clickedPointIndex,
      },
      selectedPointsIndices: nextSelectedPointsIndices,
      pointerOffset: targetPoint
        ? {
            x: scenePointer.x - targetPoint[0],
            y: scenePointer.y - targetPoint[1],
          }
        : { x: 0, y: 0 },
    };

    return ret;
  }

  static handlePointerMove(
    event: React.PointerEvent<HTMLCanvasElement>,
    scenePointerX: number,
    scenePointerY: number,
    linearElementEditor: LinearElementEditor,
    gridSize: number | null,
  ): LinearElementEditor {
    const { elementId, lastUncommittedPoint } = linearElementEditor;
    const element = LinearElementEditor.getElement(elementId);
    if (!element) {
      return linearElementEditor;
    }

    const { points } = element;
    const lastPoint = points[points.length - 1];

    if (!event.altKey) {
      if (lastPoint === lastUncommittedPoint) {
        LinearElementEditor.deletePoints(element, [points.length - 1]);
      }
      return { ...linearElementEditor, lastUncommittedPoint: null };
    }

    let newPoint: Point;

    if (shouldRotateWithDiscreteAngle(event) && points.length >= 2) {
      const lastCommittedPoint = points[points.length - 2];

      const [width, height] = LinearElementEditor._getShiftLockedDelta(
        element,
        lastCommittedPoint,
        [scenePointerX, scenePointerY],
        gridSize,
      );

      newPoint = [
        width + lastCommittedPoint[0],
        height + lastCommittedPoint[1],
      ];
    } else {
      newPoint = LinearElementEditor.createPointAt(
        element,
        scenePointerX - linearElementEditor.pointerOffset.x,
        scenePointerY - linearElementEditor.pointerOffset.y,
        gridSize,
      );
    }

    if (lastPoint === lastUncommittedPoint) {
      LinearElementEditor.movePoints(element, [
        {
          index: element.points.length - 1,
          point: newPoint,
        },
      ]);
    } else {
      LinearElementEditor.addPoints(element, [{ point: newPoint }]);
    }

    return {
      ...linearElementEditor,
      lastUncommittedPoint: element.points[element.points.length - 1],
    };
  }

  /** scene coords */
  static getPointGlobalCoordinates(
    element: NonDeleted<ExcalidrawLinearElement>,
    point: Point,
  ) {
    const [x1, y1, x2, y2] = getElementAbsoluteCoords(element);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;

    let { x, y } = element;
    [x, y] = rotate(x + point[0], y + point[1], cx, cy, element.angle);
    return [x, y] as const;
  }

  /** scene coords */
  static getPointsGlobalCoordinates(
    element: NonDeleted<ExcalidrawLinearElement>,
  ): Point[] {
    const [x1, y1, x2, y2] = getElementAbsoluteCoords(element);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    return element.points.map((point) => {
      let { x, y } = element;
      [x, y] = rotate(x + point[0], y + point[1], cx, cy, element.angle);
      return [x, y] as const;
    });
  }

  static getPointAtIndexGlobalCoordinates(
    element: NonDeleted<ExcalidrawLinearElement>,
    indexMaybeFromEnd: number, // -1 for last element
  ): Point {
    const index =
      indexMaybeFromEnd < 0
        ? element.points.length + indexMaybeFromEnd
        : indexMaybeFromEnd;
    const [x1, y1, x2, y2] = getElementAbsoluteCoords(element);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;

    const point = element.points[index];
    const { x, y } = element;
    return rotate(x + point[0], y + point[1], cx, cy, element.angle);
  }

  static pointFromAbsoluteCoords(
    element: NonDeleted<ExcalidrawLinearElement>,
    absoluteCoords: Point,
  ): Point {
    const [x1, y1, x2, y2] = getElementAbsoluteCoords(element);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const [x, y] = rotate(
      absoluteCoords[0],
      absoluteCoords[1],
      cx,
      cy,
      -element.angle,
    );
    return [x - element.x, y - element.y];
  }

  static getPointIndexUnderCursor(
    element: NonDeleted<ExcalidrawLinearElement>,
    zoom: AppState["zoom"],
    x: number,
    y: number,
  ) {
    const pointHandles = this.getPointsGlobalCoordinates(element);
    let idx = pointHandles.length;
    // loop from right to left because points on the right are rendered over
    // points on the left, thus should take precedence when clicking, if they
    // overlap
    while (--idx > -1) {
      const point = pointHandles[idx];
      if (
        distance2d(x, y, point[0], point[1]) * zoom.value <
        // +1px to account for outline stroke
        this.POINT_HANDLE_SIZE + 1
      ) {
        return idx;
      }
    }
    return -1;
  }

  static createPointAt(
    element: NonDeleted<ExcalidrawLinearElement>,
    scenePointerX: number,
    scenePointerY: number,
    gridSize: number | null,
  ): Point {
    const pointerOnGrid = getGridPoint(scenePointerX, scenePointerY, gridSize);
    const [x1, y1, x2, y2] = getElementAbsoluteCoords(element);
    const cx = (x1 + x2) / 2;
    const cy = (y1 + y2) / 2;
    const [rotatedX, rotatedY] = rotate(
      pointerOnGrid[0],
      pointerOnGrid[1],
      cx,
      cy,
      -element.angle,
    );

    return [rotatedX - element.x, rotatedY - element.y];
  }

  /**
   * Normalizes line points so that the start point is at [0,0]. This is
   * expected in various parts of the codebase. Also returns new x/y to account
   * for the potential normalization.
   */
  static getNormalizedPoints(element: ExcalidrawLinearElement) {
    const { points } = element;

    const offsetX = points[0][0];
    const offsetY = points[0][1];

    return {
      points: points.map((point, _idx) => {
        return [point[0] - offsetX, point[1] - offsetY] as const;
      }),
      x: element.x + offsetX,
      y: element.y + offsetY,
    };
  }

  // element-mutating methods
  // ---------------------------------------------------------------------------

  static normalizePoints(element: NonDeleted<ExcalidrawLinearElement>) {
    mutateElement(element, LinearElementEditor.getNormalizedPoints(element));
  }

  static duplicateSelectedPoints(appState: AppState) {
    if (!appState.editingLinearElement) {
      return false;
    }

    const { selectedPointsIndices, elementId } = appState.editingLinearElement;

    const element = LinearElementEditor.getElement(elementId);

    if (!element || selectedPointsIndices === null) {
      return false;
    }

    const { points } = element;

    const nextSelectedIndices: number[] = [];

    let pointAddedToEnd = false;
    let indexCursor = -1;
    const nextPoints = points.reduce((acc: Point[], point, index) => {
      ++indexCursor;
      acc.push(point);

      const isSelected = selectedPointsIndices.includes(index);
      if (isSelected) {
        const nextPoint = points[index + 1];

        if (!nextPoint) {
          pointAddedToEnd = true;
        }
        acc.push(
          nextPoint
            ? [(point[0] + nextPoint[0]) / 2, (point[1] + nextPoint[1]) / 2]
            : [point[0], point[1]],
        );

        nextSelectedIndices.push(indexCursor + 1);
        ++indexCursor;
      }

      return acc;
    }, []);

    mutateElement(element, { points: nextPoints });

    // temp hack to ensure the line doesn't move when adding point to the end,
    // potentially expanding the bounding box
    if (pointAddedToEnd) {
      const lastPoint = element.points[element.points.length - 1];
      LinearElementEditor.movePoints(element, [
        {
          index: element.points.length - 1,
          point: [lastPoint[0] + 30, lastPoint[1] + 30],
        },
      ]);
    }

    return {
      appState: {
        ...appState,
        editingLinearElement: {
          ...appState.editingLinearElement,
          selectedPointsIndices: nextSelectedIndices,
        },
      },
    };
  }

  static deletePoints(
    element: NonDeleted<ExcalidrawLinearElement>,
    pointIndices: readonly number[],
  ) {
    let offsetX = 0;
    let offsetY = 0;

    const isDeletingOriginPoint = pointIndices.includes(0);

    // if deleting first point, make the next to be [0,0] and recalculate
    // positions of the rest with respect to it
    if (isDeletingOriginPoint) {
      const firstNonDeletedPoint = element.points.find((point, idx) => {
        return !pointIndices.includes(idx);
      });
      if (firstNonDeletedPoint) {
        offsetX = firstNonDeletedPoint[0];
        offsetY = firstNonDeletedPoint[1];
      }
    }

    const nextPoints = element.points.reduce((acc: Point[], point, idx) => {
      if (!pointIndices.includes(idx)) {
        acc.push(
          !acc.length ? [0, 0] : [point[0] - offsetX, point[1] - offsetY],
        );
      }
      return acc;
    }, []);

    LinearElementEditor._updatePoints(element, nextPoints, offsetX, offsetY);
  }

  static addPoints(
    element: NonDeleted<ExcalidrawLinearElement>,
    targetPoints: { point: Point }[],
  ) {
    const offsetX = 0;
    const offsetY = 0;

    const nextPoints = [...element.points, ...targetPoints.map((x) => x.point)];

    LinearElementEditor._updatePoints(element, nextPoints, offsetX, offsetY);
  }

  static movePoints(
    element: NonDeleted<ExcalidrawLinearElement>,
    targetPoints: { index: number; point: Point; isDragging?: boolean }[],
    otherUpdates?: { startBinding?: PointBinding; endBinding?: PointBinding },
  ) {
    const { points } = element;

    // in case we're moving start point, instead of modifying its position
    // which would break the invariant of it being at [0,0], we move
    // all the other points in the opposite direction by delta to
    // offset it. We do the same with actual element.x/y position, so
    // this hacks are completely transparent to the user.
    let offsetX = 0;
    let offsetY = 0;

    const selectedOriginPoint = targetPoints.find(({ index }) => index === 0);

    if (selectedOriginPoint) {
      offsetX =
        selectedOriginPoint.point[0] + points[selectedOriginPoint.index][0];
      offsetY =
        selectedOriginPoint.point[1] + points[selectedOriginPoint.index][1];
    }

    const nextPoints = points.map((point, idx) => {
      const selectedPointData = targetPoints.find((p) => p.index === idx);
      if (selectedPointData) {
        if (selectedOriginPoint) {
          return point;
        }

        const deltaX =
          selectedPointData.point[0] - points[selectedPointData.index][0];
        const deltaY =
          selectedPointData.point[1] - points[selectedPointData.index][1];

        return [point[0] + deltaX, point[1] + deltaY] as const;
      }
      return offsetX || offsetY
        ? ([point[0] - offsetX, point[1] - offsetY] as const)
        : point;
    });

    LinearElementEditor._updatePoints(
      element,
      nextPoints,
      offsetX,
      offsetY,
      otherUpdates,
    );
  }

  private static _updatePoints(
    element: NonDeleted<ExcalidrawLinearElement>,
    nextPoints: readonly Point[],
    offsetX: number,
    offsetY: number,
    otherUpdates?: { startBinding?: PointBinding; endBinding?: PointBinding },
  ) {
    const nextCoords = getElementPointsCoords(
      element,
      nextPoints,
      element.strokeSharpness || "round",
    );
    const prevCoords = getElementPointsCoords(
      element,
      element.points,
      element.strokeSharpness || "round",
    );
    const nextCenterX = (nextCoords[0] + nextCoords[2]) / 2;
    const nextCenterY = (nextCoords[1] + nextCoords[3]) / 2;
    const prevCenterX = (prevCoords[0] + prevCoords[2]) / 2;
    const prevCenterY = (prevCoords[1] + prevCoords[3]) / 2;
    const dX = prevCenterX - nextCenterX;
    const dY = prevCenterY - nextCenterY;
    const rotated = rotate(offsetX, offsetY, dX, dY, element.angle);

    mutateElement(element, {
      ...otherUpdates,
      points: nextPoints,
      x: element.x + rotated[0],
      y: element.y + rotated[1],
    });
  }

  private static _getShiftLockedDelta(
    element: NonDeleted<ExcalidrawLinearElement>,
    referencePoint: Point,
    scenePointer: Point,
    gridSize: number | null,
  ) {
    const referencePointCoords = LinearElementEditor.getPointGlobalCoordinates(
      element,
      referencePoint,
    );

    const [gridX, gridY] = getGridPoint(
      scenePointer[0],
      scenePointer[1],
      gridSize,
    );

    const { width, height } = getLockedLinearCursorAlignSize(
      referencePointCoords[0],
      referencePointCoords[1],
      gridX,
      gridY,
    );

    return rotatePoint([width, height], [0, 0], -element.angle);
  }
}

const normalizeSelectedPoints = (
  points: (number | null)[],
): number[] | null => {
  let nextPoints = [
    ...new Set(points.filter((p) => p !== null && p !== -1)),
  ] as number[];
  nextPoints = nextPoints.sort((a, b) => a - b);
  return nextPoints.length ? nextPoints : null;
};
