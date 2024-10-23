import {
  HEADING_DOWN,
  HEADING_LEFT,
  HEADING_RIGHT,
  HEADING_UP,
  compareHeading,
  headingForPointFromElement,
  type Heading,
} from "./heading";
import { bindLinearElement } from "./binding";
import { LinearElementEditor } from "./linearElementEditor";
import { newArrowElement, newElement } from "./newElement";
import type {
  ElementsMap,
  ExcalidrawBindableElement,
  ExcalidrawElement,
  ExcalidrawFlowchartNodeElement,
  NonDeletedSceneElementsMap,
  OrderedExcalidrawElement,
} from "./types";
import { KEYS } from "../keys";
import type { AppState, PendingExcalidrawElements } from "../types";
import { mutateElement } from "./mutateElement";
import { elementOverlapsWithFrame, elementsAreInFrameBounds } from "../frame";
import {
  isBindableElement,
  isElbowArrow,
  isFrameElement,
  isFlowchartNodeElement,
} from "./typeChecks";
import { invariant } from "../utils";
import { pointFrom, type LocalPoint } from "../../math";
import { aabbForElement } from "../shapes";
import { getCommonBounds } from "./bounds";

type LinkDirection = "up" | "right" | "down" | "left";

const VERTICAL_OFFSET = 100;
const HORIZONTAL_OFFSET = 100;

export const getLinkDirectionFromKey = (key: string): LinkDirection => {
  switch (key) {
    case KEYS.ARROW_UP:
      return "up";
    case KEYS.ARROW_DOWN:
      return "down";
    case KEYS.ARROW_RIGHT:
      return "right";
    case KEYS.ARROW_LEFT:
      return "left";
    default:
      return "right";
  }
};

const getNodeRelatives = (
  type: "predecessors" | "successors",
  node: ExcalidrawBindableElement,
  elementsMap: ElementsMap,
  direction: LinkDirection,
) => {
  const items = [...elementsMap.values()].reduce(
    (acc: { relative: ExcalidrawBindableElement; heading: Heading }[], el) => {
      let oppositeBinding;
      if (
        isElbowArrow(el) &&
        // we want check existence of the opposite binding, in the direction
        // we're interested in
        (oppositeBinding =
          el[type === "predecessors" ? "startBinding" : "endBinding"]) &&
        // similarly, we need to filter only arrows bound to target node
        el[type === "predecessors" ? "endBinding" : "startBinding"]
          ?.elementId === node.id
      ) {
        const relative = elementsMap.get(oppositeBinding.elementId);

        if (!relative) {
          return acc;
        }

        invariant(
          isBindableElement(relative),
          "not an ExcalidrawBindableElement",
        );

        const edgePoint = (
          type === "predecessors" ? el.points[el.points.length - 1] : [0, 0]
        ) as Readonly<LocalPoint>;

        const heading = headingForPointFromElement(node, aabbForElement(node), [
          edgePoint[0] + el.x,
          edgePoint[1] + el.y,
        ] as Readonly<LocalPoint>);

        acc.push({
          relative,
          heading,
        });
      }
      return acc;
    },
    [],
  );

  switch (direction) {
    case "up":
      return items
        .filter((item) => compareHeading(item.heading, HEADING_UP))
        .map((item) => item.relative);
    case "down":
      return items
        .filter((item) => compareHeading(item.heading, HEADING_DOWN))
        .map((item) => item.relative);
    case "right":
      return items
        .filter((item) => compareHeading(item.heading, HEADING_RIGHT))
        .map((item) => item.relative);
    case "left":
      return items
        .filter((item) => compareHeading(item.heading, HEADING_LEFT))
        .map((item) => item.relative);
  }
};

const getSuccessors = (
  node: ExcalidrawBindableElement,
  elementsMap: ElementsMap,
  direction: LinkDirection,
) => {
  return getNodeRelatives("successors", node, elementsMap, direction);
};

function getMinMaxY(nodes: ExcalidrawElement[]): {
  minY: number;
  maxY: number;
} {
  if (nodes.length === 0) {
    return { minY: 0, maxY: 0 };
  }

  let minY = Infinity;
  let maxY = -Infinity;

  for (const node of nodes) {
    if (node.y < minY) {
      minY = node.y;
    }

    const bottomY = node.y + node.height;
    if (bottomY > maxY) {
      maxY = bottomY;
    }
  }

  return { minY, maxY };
}

function getMinMaxX(nodes: ExcalidrawElement[]): {
  minX: number;
  maxX: number;
} {
  if (nodes.length === 0) {
    return { minX: 0, maxX: 0 };
  }

  let minX = Infinity;
  let maxX = -Infinity;

  for (const node of nodes) {
    // Update minX if the current node's left position is smaller
    if (node.x < minX) {
      minX = node.x;
    }

    // Calculate the right edge of the current node
    const rightX = node.x + node.width;
    // Update maxX if the right edge is larger than current maxX
    if (rightX > maxX) {
      maxX = rightX;
    }
  }

  return { minX, maxX };
}

export const getPredecessors = (
  node: ExcalidrawBindableElement,
  elementsMap: ElementsMap,
  direction: LinkDirection,
) => {
  return getNodeRelatives("predecessors", node, elementsMap, direction);
};

function getIndividualYOffset(nodes: ExcalidrawElement[]): number[] {
  const offsets = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    const nodeA = nodes[i];
    const nodeB = nodes[i + 1];

    const offset = nodeB.y - (nodeA.y + nodeA.height);
    offsets.push(offset);
  }

  return offsets;
}
function getIndividualXOffset(nodes: ExcalidrawElement[]): number[] {
  const offsets = [];

  for (let i = 0; i < nodes.length - 1; i++) {
    const nodeA = nodes[i];
    const nodeB = nodes[i + 1];

    const offset = nodeB.y - (nodeA.y + nodeA.height);
    offsets.push(offset);
  }

  return offsets;
}

const getOffsets = (
  element: ExcalidrawFlowchartNodeElement,
  linkedNodes: ExcalidrawElement[],
  direction: LinkDirection,
) => {
  console.log("code0")
  if (direction === "up" || direction === "down") {
    const _VERTICAL_OFFSET = VERTICAL_OFFSET + element.height;
    // check vertical space
    const minX = element.x;
    const maxX = element.x + element.width;

    // vertical space is available
    if (
      linkedNodes.every(
        (linkedNode) =>
          linkedNode.x + linkedNode.width < minX || linkedNode.x > maxX,
      )
    ) {
      return {
        x: 0,
        y: _VERTICAL_OFFSET * (direction === "up" ? -1 : 1),
      };
    }
  } else if (direction === "right" || direction === "left") {
    console.log("code1")
    const minY = element.y;
    const maxY = element.y + element.height;

    if (
      linkedNodes.every(
        (linkedNode) =>
          linkedNode.y + linkedNode.height < minY || linkedNode.y > maxY,
      )
    ) {
      return {
        x:
          (HORIZONTAL_OFFSET + element.width) * (direction === "left" ? -1 : 1),
        y: 0,
      };
    }
  }
  console.log("code2")
  const { minX, maxX } = getMinMaxX(linkedNodes);
  if (direction === "up" || direction === "down") {
    const _VERTICAL_OFFSET = VERTICAL_OFFSET + element.height;
    const y = linkedNodes.length === 0 ? _VERTICAL_OFFSET : _VERTICAL_OFFSET;

    const x =
      linkedNodes.length === 0
        ? 0
        : (linkedNodes.length + 1) % 2 === 0
        ? Math.abs(maxX - minX) / 2 + element.width
        : (Math.abs(maxX - minX) / 2 + element.width) * -1;

    if (direction === "up") {
      return {
        x,
        y: y * -1,
      };
    }

    return {
      x,
      y,
    };
  }
  console.log("code3")
  const { minY, maxY } = getMinMaxY(linkedNodes);
  const offsets = getIndividualYOffset(linkedNodes);
  const absoluteOffsets = offsets.map((offset) => Math.abs(offset));
  const minAbsoluteOffset = Math.min(...absoluteOffsets, 0); // it's because the nodes can be offseted away from each outher with a large number which we dont want

  const x =
    (linkedNodes.length === 0 ? HORIZONTAL_OFFSET : HORIZONTAL_OFFSET) +
    element.width;

  const y =
    linkedNodes.length === 0
      ? 0
      : (linkedNodes.length + 1) % 2 === 0
      ? Math.abs(maxY - minY) / 2 + element.height + minAbsoluteOffset
      : (Math.abs(maxY - minY) / 2 + element.height + minAbsoluteOffset) * -1;
    
  if (direction === "left") {
    return {
      x: x * -1,
      y,
    };
  }
  return {
    x,
    y,
  };
};

// const getOffsets = (
//   element: ExcalidrawFlowchartNodeElement,
//   linkedNodes: ExcalidrawElement[],
//   direction: LinkDirection,
// ) => {
//   if (direction === "up" || direction === "down") {
//     const _VERTICAL_OFFSET = VERTICAL_OFFSET + element.height;
//     // check vertical space
//     const minX = element.x;
//     const maxX = element.x + element.width;

//     // vertical space is available
//     if (
//       linkedNodes.every(
//         (linkedNode) =>
//           linkedNode.x + linkedNode.width < minX || linkedNode.x > maxX,
//       )
//     ) {
//       return {
//         x: 0,
//         y: _VERTICAL_OFFSET * (direction === "up" ? -1 : 1),
//       };
//     }
//   } else if (direction === "right" || direction === "left") {
//     const minY = element.y;
//     const maxY = element.y + element.height;

//     if (
//       linkedNodes.every(
//         (linkedNode) =>
//           linkedNode.y + linkedNode.height < minY || linkedNode.y > maxY,
//       )
//     ) {
//       return {
//         x:
//           (HORIZONTAL_OFFSET + element.width) * (direction === "left" ? -1 : 1),
//         y: 0,
//       };
//     }
//   }

//   const { minX, maxX } = getMinMaxX(linkedNodes);
//   if (direction === "up" || direction === "down") {
//     const _VERTICAL_OFFSET = VERTICAL_OFFSET + element.height;
//     const y = linkedNodes.length === 0 ? _VERTICAL_OFFSET : _VERTICAL_OFFSET;

//     const x =
//       linkedNodes.length === 0
//         ? 0
//         : (linkedNodes.length + 1) % 2 === 0
//         ? Math.abs(maxX - minX) / 2 + element.width
//         : (Math.abs(maxX - minX) / 2 + element.width) * -1;

//     if (direction === "up") {
//       return {
//         x,
//         y: y * -1,
//       };
//     }

//     return {
//       x,
//       y,
//     };
//   }

//   const { minY, maxY } = getMinMaxY(linkedNodes);

//   const x =
//     (linkedNodes.length === 0 ? HORIZONTAL_OFFSET : HORIZONTAL_OFFSET) +
//     element.width;

//   const y =
//     linkedNodes.length === 0
//       ? 0
//       : (linkedNodes.length + 1) % 2 === 0
//       ? Math.abs(maxY - minY) / 2 + element.height
//       : (Math.abs(maxY - minY) / 2 + element.height) * -1;

//   if (direction === "left") {
//     return {
//       x: x * -1,
//       y,
//     };
//   }
//   return {
//     x,
//     y,
//   };
// };

const addNewNode = (
  element: ExcalidrawFlowchartNodeElement,
  elementsMap: ElementsMap,
  appState: AppState,
  direction: LinkDirection,
) => {
  const successors = getSuccessors(element, elementsMap, direction);
  const predeccessors = getPredecessors(element, elementsMap, direction);

  const offsets = getOffsets(
    element,
    [...successors, ...predeccessors],
    direction,
  );

  const nextNode = newElement({
    type: element.type,
    x: element.x + offsets.x,
    y: element.y + offsets.y,
    // TODO: extract this to a util
    width: element.width,
    height: element.height,
    roundness: element.roundness,
    roughness: element.roughness,
    backgroundColor: element.backgroundColor,
    strokeColor: element.strokeColor,
    strokeWidth: element.strokeWidth,
  });

  invariant(
    isFlowchartNodeElement(nextNode),
    "not an ExcalidrawFlowchartNodeElement",
  );

  const bindingArrow = createBindingArrow(
    element,
    nextNode,
    elementsMap,
    direction,
    appState,
  );

  return {
    nextNode,
    bindingArrow,
  };
};

// const resolveOverlap = (
//   nodeA: ExcalidrawBindableElement,
//   nodeB: ExcalidrawBindableElement,
//   direction: LinkDirection,
// ) => {
//   const margin = 5;

//   if (direction === "left" || direction === "right") {
//     const overlapY = Math.min(
//       nodeA.y + nodeA.height - nodeB.y,
//       nodeB.y + nodeB.height - nodeA.y,
//     );

//     if (overlapY > 0) {
//       const shiftAmount = overlapY + margin;

//       if (nodeA.y < nodeB.y) {
//         const newAY = nodeA.y - shiftAmount;
//         const newBY = nodeB.y + shiftAmount;
//         mutateElement(nodeA, { y: newAY });
//         mutateElement(nodeB, { y: newBY });
//       } else {
//         const newAY = nodeA.y + shiftAmount;
//         const newBY = nodeB.y - shiftAmount;
//         mutateElement(nodeA, { y: newAY });
//         mutateElement(nodeB, { y: newBY });
//       }
//     }
//   } else {
//     const overlapX = Math.min(
//       nodeA.x + nodeA.width - nodeB.x,
//       nodeB.x + nodeB.width - nodeA.x,
//     );

//     if (overlapX > 0) {
//       const shiftAmount = overlapX + margin;

//       if (nodeA.x < nodeB.x) {
//         const newAX = nodeA.y - shiftAmount;
//         const newBX = nodeB.y + shiftAmount;
//         mutateElement(nodeA, { y: newAX });
//         mutateElement(nodeB, { y: newBX });
//       } else {
//         const newAX = nodeA.y + shiftAmount;
//         const newBX = nodeB.y - shiftAmount;
//         mutateElement(nodeA, { y: newAX });
//         mutateElement(nodeB, { y: newBX });
//       }
//     }
//   }
// };

// const nodesOverlap = (
//   nodeA: ExcalidrawBindableElement,
//   nodeB: ExcalidrawBindableElement,
// ): boolean => {
//   const horizontallyOverlapping =
//     nodeA.x < nodeB.x + nodeB.width && nodeA.x + nodeA.width > nodeB.x;
//   const verticallyOverlapping =
//     nodeA.y < nodeB.y + nodeB.height && nodeA.y + nodeA.height > nodeB.y;

//   return horizontallyOverlapping && verticallyOverlapping;
// };

// export const addNewNodes = (
//   startNode: ExcalidrawFlowchartNodeElement,
//   elementsMap: ElementsMap,
//   appState: AppState,
//   direction: LinkDirection,
//   numberOfNodes: number,
// ) => {
//   // always start from 0 and distribute evenly
//   const newNodes: ExcalidrawElement[] = [];
//   const nextNodelist: ExcalidrawElement[] = [];
//   const nextbindigArrawlist: ExcalidrawElement[] = [];

//   const successors = getSuccessors(startNode, elementsMap, direction);
//   const predeccessors = getPredecessors(startNode, elementsMap, direction);

//   for (let i = 0; i < numberOfNodes; i++) {
//     let nextX: number;
//     let nextY: number;
//     if (direction === "left" || direction === "right") {
//       const totalHeight =
//         VERTICAL_OFFSET * (numberOfNodes - 1) +
//         numberOfNodes * startNode.height;

//       const startY = startNode.y + startNode.height / 2 - totalHeight / 2;

//       let offsetX = HORIZONTAL_OFFSET + startNode.width;
//       if (direction === "left") {
//         offsetX *= -1;
//       }
//       nextX = startNode.x + offsetX;
//       const offsetY = (VERTICAL_OFFSET + startNode.height) * i;
//       nextY = startY + offsetY;
//     } else {
//       const totalWidth =
//         HORIZONTAL_OFFSET * (numberOfNodes - 1) +
//         numberOfNodes * startNode.width;
//       const startX = startNode.x + startNode.width / 2 - totalWidth / 2;
//       let offsetY = VERTICAL_OFFSET + startNode.height;

//       if (direction === "up") {
//         offsetY *= -1;
//       }
//       nextY = startNode.y + offsetY;
//       const offsetX = (HORIZONTAL_OFFSET + startNode.width) * i;
//       nextX = startX + offsetX;
//     }

//     const nextNode = newElement({
//       type: startNode.type,
//       x: nextX,
//       y: nextY,
//       // TODO: extract this to a util
//       width: startNode.width,
//       height: startNode.height,
//       roundness: startNode.roundness,
//       roughness: startNode.roughness,
//       backgroundColor: startNode.backgroundColor,
//       strokeColor: startNode.strokeColor,
//       strokeWidth: startNode.strokeWidth,
//     });

//     invariant(
//       isFlowchartNodeElement(nextNode),
//       "not an ExcalidrawFlowchartNodeElement",
//     );

//     const bindingArrow = createBindingArrow(
//       startNode,
//       nextNode,
//       elementsMap,
//       direction,
//       appState,
//     );
//     nextNodelist.push(nextNode);
//     nextbindigArrawlist.push(bindingArrow);
//   }

//   let allNodes = [];
//   if (direction === "right" || direction === "down") {
//     allNodes = [...successors, ...nextNodelist];
//   } else {
//     allNodes = [...predeccessors, ...nextNodelist];
//   }

//   for (let i = 0; i < allNodes.length; i++) {
//     for (let j = i + 1; j < allNodes.length; j++) {
//       const nodeA = allNodes[i] as ExcalidrawFlowchartNodeElement;
//       const nodeB = allNodes[j] as ExcalidrawFlowchartNodeElement;
//       if (nodesOverlap(nodeA, nodeB)) {
//         resolveOverlap(nodeA, nodeB, direction);
//       }
//     }
//   }
//   for (let i = 0; i < nextNodelist.length; i++) {
//     newNodes.push(nextNodelist[i]);
//     newNodes.push(nextbindigArrawlist[i]);
//   }
//   return newNodes;
// };

// export const addNewNodes = (
//   startNode: ExcalidrawFlowchartNodeElement,
//   elementsMap: ElementsMap,
//   appState: AppState,
//   direction: LinkDirection,
//   numberOfNodes: number,
// ) => {
//   const newNodes: ExcalidrawElement[] = [];

//   const successors = getSuccessors(startNode, elementsMap, direction);
//   const predeccessors = getPredecessors(startNode, elementsMap, direction);

//   let existingNodes: ExcalidrawElement[] = [];

//   if (direction === "right" || direction === "down") {
//     existingNodes = successors;
//   } else {
//     existingNodes = predeccessors;
//   }

//   const totalNodes = existingNodes.length + numberOfNodes;

//   for (let i = 0; i < totalNodes; i++) {
//     let nextX: number;
//     let nextY: number;

//     if (direction === "left" || direction === "right") {
//       const totalHeight =
//         (VERTICAL_OFFSET + startNode.height) * (totalNodes - 1);

//       const middleOffset =
//         totalNodes % 2 === 0
//           ? totalHeight / 2
//           : Math.floor(totalNodes / 2) * (VERTICAL_OFFSET + startNode.height);

//       const startY = startNode.y + startNode.height / 2 - middleOffset;

//       let offsetX = HORIZONTAL_OFFSET + startNode.width;
//       if (direction === "left") {
//         offsetX *= -1;
//       }
//       nextX = startNode.x + offsetX;

//       const offsetY = (VERTICAL_OFFSET + startNode.height) * i;
//       nextY = startY + offsetY;
//     } else {
//       const totalWidth =
//         (HORIZONTAL_OFFSET + startNode.width) * (totalNodes - 1);

//       const middleOffset =
//         totalNodes % 2 === 0
//           ? totalWidth / 2
//           : Math.floor(totalNodes / 2) * (HORIZONTAL_OFFSET + startNode.width);

//       const startX = startNode.x + startNode.width / 2 - middleOffset;

//       let offsetY = VERTICAL_OFFSET + startNode.height;
//       if (direction === "up") {
//         offsetY *= -1;
//       }
//       nextY = startNode.y + offsetY;

//       const offsetX = (HORIZONTAL_OFFSET + startNode.width) * i;
//       nextX = startX + offsetX;
//     }

//     let nextNode: ExcalidrawElement;
//     if (i < existingNodes.length) {
//       nextNode = existingNodes[i];
//       const arrow = existingNodes[i+1];
//       console.log(arrow)
//       mutateElement(nextNode, { x: nextX, y: nextY });
//     } else {
//       nextNode = newElement({
//         type: startNode.type,
//         x: nextX,
//         y: nextY,
//         width: startNode.width,
//         height: startNode.height,
//         roundness: startNode.roundness,
//         roughness: startNode.roughness,
//         backgroundColor: startNode.backgroundColor,
//         strokeColor: startNode.strokeColor,
//         strokeWidth: startNode.strokeWidth,
//       });

//       invariant(
//         isFlowchartNodeElement(nextNode),
//         "not an ExcalidrawFlowchartNodeElement",
//       );
//     }

//     if (
//       i >= existingNodes.length &&
//       (nextNode.type === "rectangle" ||
//         nextNode.type === "diamond" ||
//         nextNode.type === "ellipse")
//     ) {
//       const bindingArrow = createBindingArrow(
//         startNode,
//         nextNode,
//         elementsMap,
//         direction,
//         appState,
//       );

//       newNodes.push(nextNode);
//       newNodes.push(bindingArrow);
//     }
//   }

//   return newNodes;
// };

export const addNewNodes = (
  startNode: ExcalidrawFlowchartNodeElement,
  elementsMap: ElementsMap,
  appState: AppState,
  direction: LinkDirection,
  numberOfNodes: number,
) => {
  // always start from 0 and distribute evenly
  const newNodes: ExcalidrawElement[] = [];

  for (let i = 0; i < numberOfNodes; i++) {
    let nextX: number;
    let nextY: number;
    if (direction === "left" || direction === "right") {
      const totalHeight =
        VERTICAL_OFFSET * (numberOfNodes - 1) +
        numberOfNodes * startNode.height;

      const startY = startNode.y + startNode.height / 2 - totalHeight / 2;

      let offsetX = HORIZONTAL_OFFSET + startNode.width;
      if (direction === "left") {
        offsetX *= -1;
      }
      nextX = startNode.x + offsetX;
      const offsetY = (VERTICAL_OFFSET + startNode.height) * i;
      nextY = startY + offsetY;
    } else {
      const totalWidth =
        HORIZONTAL_OFFSET * (numberOfNodes - 1) +
        numberOfNodes * startNode.width;
      const startX = startNode.x + startNode.width / 2 - totalWidth / 2;
      let offsetY = VERTICAL_OFFSET + startNode.height;

      if (direction === "up") {
        offsetY *= -1;
      }
      nextY = startNode.y + offsetY;
      const offsetX = (HORIZONTAL_OFFSET + startNode.width) * i;
      nextX = startX + offsetX;
    }

    const nextNode = newElement({
      type: startNode.type,
      x: nextX,
      y: nextY,
      // TODO: extract this to a util
      width: startNode.width,
      height: startNode.height,
      roundness: startNode.roundness,
      roughness: startNode.roughness,
      backgroundColor: startNode.backgroundColor,
      strokeColor: startNode.strokeColor,
      strokeWidth: startNode.strokeWidth,
    });

    invariant(
      isFlowchartNodeElement(nextNode),
      "not an ExcalidrawFlowchartNodeElement",
    );

    const bindingArrow = createBindingArrow(
      startNode,
      nextNode,
      elementsMap,
      direction,
      appState,
    );

    newNodes.push(nextNode);
    newNodes.push(bindingArrow);
  }

  return newNodes;
};

// export const addNewNodes = (
//   startNode: ExcalidrawFlowchartNodeElement,
//   elementsMap: ElementsMap,
//   appState: AppState,
//   direction: LinkDirection,
//   numberOfNodes: number,
// ) => {
//   const newNodes: ExcalidrawElement[] = [];
//   let newElementMap = elementsMap; // Initialize with existing elements map

//   for (let i = 0; i < numberOfNodes; i++) {
//     const { nextNode, bindingArrow } = addNewNode(
//       startNode,
//       newElementMap,
//       appState,
//       direction,
//     );
//     newNodes.push(nextNode);
//     newNodes.push(bindingArrow);

//     // Update newElementMap to include new nodes
//     newElementMap = {
//       ...newElementMap,
//       ...newNodes.reduce((acc, node) => ({ ...acc, [node.id]: node }), {}),
//     };
//   }

//   return newNodes;
// };

// const addNewNodes = (
//   startNode: ExcalidrawFlowchartNodeElement,
//   elementsMap: ElementsMap,
//   appState: AppState,
//   direction: LinkDirection,
//   numberOfNodes: number,
// ) => {
//   const newNodes: ExcalidrawElement[] = [];

//   const successors = getSuccessors(startNode, elementsMap, direction);
//   const predeccessors = getPredecessors(startNode, elementsMap, direction);
//   const linkedNodes = [...successors, ...predeccessors];

//   for (let i = 0; i < numberOfNodes; i++) {
//     const offsets = getOffsets(startNode, linkedNodes, direction);

//     const nextNode = newElement({
//       type: startNode.type,
//       x: startNode.x + offsets.x,
//       y: startNode.y + offsets.y,
//       width: startNode.width,
//       height: startNode.height,
//       roundness: startNode.roundness,
//       roughness: startNode.roughness,
//       backgroundColor: startNode.backgroundColor,
//       strokeColor: startNode.strokeColor,
//       strokeWidth: startNode.strokeWidth,
//     });

//     // Invariant check for node type (optional)
//     invariant(
//       isFlowchartNodeElement(nextNode),
//       "not an ExcalidrawFlowchartNodeElement",
//     );

//     // Create the binding arrow to connect nodes
//     const bindingArrow = createBindingArrow(
//       startNode,
//       nextNode,
//       elementsMap,
//       direction,
//       appState,
//     );

//     newNodes.push(nextNode);
//     newNodes.push(bindingArrow);

//     linkedNodes.push(nextNode);
//   }

//   return newNodes;
// };

const createBindingArrow = (
  startBindingElement: ExcalidrawFlowchartNodeElement,
  endBindingElement: ExcalidrawFlowchartNodeElement,
  elementsMap: ElementsMap,
  direction: LinkDirection,
  appState: AppState,
) => {
  let startX: number;
  let startY: number;

  const PADDING = 6;

  switch (direction) {
    case "up": {
      startX = startBindingElement.x + startBindingElement.width / 2;
      startY = startBindingElement.y - PADDING;
      break;
    }
    case "down": {
      startX = startBindingElement.x + startBindingElement.width / 2;
      startY = startBindingElement.y + startBindingElement.height + PADDING;
      break;
    }
    case "right": {
      startX = startBindingElement.x + startBindingElement.width + PADDING;
      startY = startBindingElement.y + startBindingElement.height / 2;
      break;
    }
    case "left": {
      startX = startBindingElement.x - PADDING;
      startY = startBindingElement.y + startBindingElement.height / 2;
      break;
    }
  }

  let endX: number;
  let endY: number;

  switch (direction) {
    case "up": {
      endX = endBindingElement.x + endBindingElement.width / 2 - startX;
      endY = endBindingElement.y + endBindingElement.height - startY + PADDING;
      break;
    }
    case "down": {
      endX = endBindingElement.x + endBindingElement.width / 2 - startX;
      endY = endBindingElement.y - startY - PADDING;
      break;
    }
    case "right": {
      endX = endBindingElement.x - startX - PADDING;
      endY = endBindingElement.y - startY + endBindingElement.height / 2;
      break;
    }
    case "left": {
      endX = endBindingElement.x + endBindingElement.width - startX + PADDING;
      endY = endBindingElement.y - startY + endBindingElement.height / 2;
      break;
    }
  }

  const bindingArrow = newArrowElement({
    type: "arrow",
    x: startX,
    y: startY,
    startArrowhead: appState.currentItemStartArrowhead,
    endArrowhead: appState.currentItemEndArrowhead,
    strokeColor: appState.currentItemStrokeColor,
    strokeStyle: appState.currentItemStrokeStyle,
    strokeWidth: appState.currentItemStrokeWidth,
    points: [pointFrom(0, 0), pointFrom(endX, endY)],
    elbowed: true,
  });

  bindLinearElement(
    bindingArrow,
    startBindingElement,
    "start",
    elementsMap as NonDeletedSceneElementsMap,
  );
  bindLinearElement(
    bindingArrow,
    endBindingElement,
    "end",
    elementsMap as NonDeletedSceneElementsMap,
  );

  const changedElements = new Map<string, OrderedExcalidrawElement>();
  changedElements.set(
    startBindingElement.id,
    startBindingElement as OrderedExcalidrawElement,
  );
  changedElements.set(
    endBindingElement.id,
    endBindingElement as OrderedExcalidrawElement,
  );
  changedElements.set(
    bindingArrow.id,
    bindingArrow as OrderedExcalidrawElement,
  );

  LinearElementEditor.movePoints(
    bindingArrow,
    [
      {
        index: 1,
        point: bindingArrow.points[1],
      },
    ],
    elementsMap as NonDeletedSceneElementsMap,
    undefined,
    {
      changedElements,
    },
  );

  return bindingArrow;
};

export class FlowChartNavigator {
  isExploring: boolean = false;
  // nodes that are ONE link away (successor and predecessor both included)
  private sameLevelNodes: ExcalidrawElement[] = [];
  private sameLevelIndex: number = 0;
  // set it to the opposite of the defalut creation direction
  private direction: LinkDirection | null = null;
  // for speedier navigation
  private visitedNodes: Set<ExcalidrawElement["id"]> = new Set();

  clear() {
    this.isExploring = false;
    this.sameLevelNodes = [];
    this.sameLevelIndex = 0;
    this.direction = null;
    this.visitedNodes.clear();
  }

  exploreByDirection(
    element: ExcalidrawElement,
    elementsMap: ElementsMap,
    direction: LinkDirection,
  ): ExcalidrawElement["id"] | null {
    if (!isBindableElement(element)) {
      return null;
    }

    // clear if going at a different direction
    if (direction !== this.direction) {
      this.clear();
    }

    // add the current node to the visited
    if (!this.visitedNodes.has(element.id)) {
      this.visitedNodes.add(element.id);
    }

    /**
     * CASE:
     * - already started exploring, AND
     * - there are multiple nodes at the same level, AND
     * - still going at the same direction, AND
     *
     * RESULT:
     * - loop through nodes at the same level
     *
     * WHY:
     * - provides user the capability to loop through nodes at the same level
     */
    if (
      this.isExploring &&
      direction === this.direction &&
      this.sameLevelNodes.length > 1
    ) {
      this.sameLevelIndex =
        (this.sameLevelIndex + 1) % this.sameLevelNodes.length;

      return this.sameLevelNodes[this.sameLevelIndex].id;
    }

    const nodes = [
      ...getSuccessors(element, elementsMap, direction),
      ...getPredecessors(element, elementsMap, direction),
    ];

    /**
     * CASE:
     * - just started exploring at the given direction
     *
     * RESULT:
     * - go to the first node in the given direction
     */
    if (nodes.length > 0) {
      this.sameLevelIndex = 0;
      this.isExploring = true;
      this.sameLevelNodes = nodes;
      this.direction = direction;
      this.visitedNodes.add(nodes[0].id);

      return nodes[0].id;
    }

    /**
     * CASE:
     * - (just started exploring or still going at the same direction) OR
     * - there're no nodes at the given direction
     *
     * RESULT:
     * - go to some other unvisited linked node
     *
     * WHY:
     * - provide a speedier navigation from a given node to some predecessor
     *   without the user having to change arrow key
     */
    if (direction === this.direction || !this.isExploring) {
      if (!this.isExploring) {
        // just started and no other nodes at the given direction
        // so the current node is technically the first visited node
        // (this is needed so that we don't get stuck between looping through )
        this.visitedNodes.add(element.id);
      }

      const otherDirections: LinkDirection[] = [
        "up",
        "right",
        "down",
        "left",
      ].filter((dir): dir is LinkDirection => dir !== direction);

      const otherLinkedNodes = otherDirections
        .map((dir) => [
          ...getSuccessors(element, elementsMap, dir),
          ...getPredecessors(element, elementsMap, dir),
        ])
        .flat()
        .filter((linkedNode) => !this.visitedNodes.has(linkedNode.id));

      for (const linkedNode of otherLinkedNodes) {
        if (!this.visitedNodes.has(linkedNode.id)) {
          this.visitedNodes.add(linkedNode.id);
          this.isExploring = true;
          this.direction = direction;
          return linkedNode.id;
        }
      }
    }

    return null;
  }
}

export class FlowChartCreator {
  isCreatingChart: boolean = false;
  private numberOfNodes: number = 0;
  private direction: LinkDirection | null = "right";
  pendingNodes: PendingExcalidrawElements | null = null;

  createNodes(
    startNode: ExcalidrawFlowchartNodeElement,
    elementsMap: ElementsMap,
    appState: AppState,
    direction: LinkDirection,
  ) {
    if (direction !== this.direction) {
      const { nextNode, bindingArrow } = addNewNode(
        startNode,
        elementsMap,
        appState,
        direction,
      );

      this.numberOfNodes = 1;
      this.isCreatingChart = true;
      this.direction = direction;
      this.pendingNodes = [nextNode, bindingArrow];
    } else {
      this.numberOfNodes += 1;
      const newNodes = addNewNodes(
        startNode,
        elementsMap,
        appState,
        direction,
        this.numberOfNodes,
      );

      this.isCreatingChart = true;
      this.direction = direction;
      this.pendingNodes = newNodes;
    }

    // add pending nodes to the same frame as the start node
    // if every pending node is at least intersecting with the frame
    if (startNode.frameId) {
      const frame = elementsMap.get(startNode.frameId);

      invariant(
        frame && isFrameElement(frame),
        "not an ExcalidrawFrameElement",
      );

      if (
        frame &&
        this.pendingNodes.every(
          (node) =>
            elementsAreInFrameBounds([node], frame, elementsMap) ||
            elementOverlapsWithFrame(node, frame, elementsMap),
        )
      ) {
        this.pendingNodes = this.pendingNodes.map((node) =>
          mutateElement(
            node,
            {
              frameId: startNode.frameId,
            },
            false,
          ),
        );
      }
    }
  }

  clear() {
    this.isCreatingChart = false;
    this.pendingNodes = null;
    this.direction = null;
    this.numberOfNodes = 0;
  }
}

export const isNodeInFlowchart = (
  element: ExcalidrawFlowchartNodeElement,
  elementsMap: ElementsMap,
) => {
  for (const [, el] of elementsMap) {
    if (
      el.type === "arrow" &&
      (el.startBinding?.elementId === element.id ||
        el.endBinding?.elementId === element.id)
    ) {
      return true;
    }
  }

  return false;
};
