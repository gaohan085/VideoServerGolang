import React, { createRef, lazy } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import sortElements from "../lib/sort-elements-by-name";
import "./container.module.css";
import FileElement from "./file-element";
import type { DirectoryProp } from "./types";

const LazyFolderElement = lazy(() => import("./folder-element"));

// const OpenFolderContainer = forwardRef(function Container(
//   props: { data: DirectoryProp }, ref: Ref<HTMLDivElement>
// ) {
//   const { data } = props;
//   return (
//     <div id="open-folder-container" ref={ref}>
//       {data.childElements
//         .sort((a, b) => sortElements(a, b))
//         .map((elem, index) => {
//           return elem.isFile ? (
//             <FileElement elem={elem} key={index} />
//           ) : (
//             <LazyFolderElement elem={elem} key={index} />
//           );
//         })}
//     </div>);
// });

const Container: React.FC<DirectoryProp> = (props) => {
  const data = props;
  const list = data.childElements.map(e => {
    return { ...e, nodeRef: createRef<HTMLDivElement>() };
  });
  return (
    <TransitionGroup>
      {list.sort((a, b) => sortElements(a, b))
        .map((elem, index) => {
          if (elem.isFile) return (
            <CSSTransition
              key={index}
              classNames={"container"}
              nodeRef={elem.nodeRef}
              timeout={300}
              onEnter={() => { console.log("ENTER"); }}>
              <FileElement elem={elem} key={index} nodeRef={elem.nodeRef} />
            </CSSTransition>
          );
          if (elem.isFolder) return (
            <CSSTransition
              key={index}
              classNames="container"
              nodeRef={elem.nodeRef}
              onEnter={() => { console.log("ENTER"); }}
              timeout={300}>
              <LazyFolderElement elem={elem} key={index} nodeRef={elem.nodeRef} />
            </CSSTransition>
          );
        })}
    </TransitionGroup>
  );
};




export default Container;