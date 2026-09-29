import "./index.css";

import {
  computePosition,
  shift,
  detectOverflow,
  getOverflowAncestors,
  autoUpdate,
} from "@floating-ui/dom";

const anchor = document.getElementById("anchor")!;
const anchorEnd = document.getElementById("anchorEnd")!;
const sidePanel = document.getElementById("sidePanelContent")!;
const side = document.getElementById("side")!;
// detectOverflow()

const pos = await computePosition(anchor, sidePanel);
console.log(`🚀 // DEBUG 🍔  ~ file: index.ts:10 ~ `, pos);

/* Runs when window resize and scroll */
autoUpdate(
  anchor,
  sidePanel,
  async () => {
    // const pos = await computePosition(anchor, sidePanel, {
    //   middleware: [shift({ crossAxis: true })],
    // });
    // const posEnd = await computePosition(anchorEnd, sidePanel, {
    //   middleware: [shift({ crossAxis: true })],
    //   placement: "top",
    // });

    const sidePos = await computePosition(side, side, {
      middleware: [
        {
          name: "overflow",
          async fn(state) {
            console.log(`🚀 // DEBUG 🍔  ~ file: index.ts:39 ~ `, state);

            const overflow = await detectOverflow(state, {
              // boundary: {
              //   x: state.x,
              //   y: state.y,
              //   width: window.innerWidth,
              //   height: window.innerHeight,
              // },
              altBoundary: true,
              elementContext: "reference",
            });
            console.log(`🚀 // DEBUG 🍔  ~ file: index.ts:40 ~ `, overflow);
            const { rects } = state;

            return { data: { ...overflow, rects } };
          },
        },
      ],
    });

    console.log(
      `🚀 // DEBUG 🍔  ~ file: index.ts:57 ~ `,
      sidePos,
      sidePos.middlewareData.overflow,
    );

    const panelHeight =
      sidePos.middlewareData.overflow.rects.reference.height -
      Math.max(0, sidePos.middlewareData.overflow.top) -
      Math.max(0, sidePos.middlewareData.overflow.bottom);
    console.log(`🚀 // DEBUG 🍔  ~ file: index.ts:58 ~ `, panelHeight);

    Object.assign(sidePanel.style, {
      // transform: `translate(${0}px, ${pos.y}px)`,
      height: `${panelHeight}px`,
      // -----
      position: "absolute",
      top: `0`,
      left: `0`,
      transform: `translate(${0}px, ${Math.max(0, sidePos.middlewareData.overflow.top)}px)`,
      willChange: "transform",
    });
  },
  {},
);
