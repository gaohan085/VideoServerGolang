import axios from "axios";
import React  from "react";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import useBoundStore from "../../lib/zustand-store.ts";
import type { FolderElementClass } from "../types.d.ts";
import styles from "./rename-element.module.scss";
import { useSWRConfig } from "swr";

interface RenameElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
}

interface RenameForm extends HTMLFormElement {
  readonly elements: RenameElements;
}

const RenameComponent  = (props: {
  readonly elem: FolderElementClass;
  readonly handleSubmit: React.SubmitEventHandler<RenameForm>;
  readonly handleCancelRename: React.MouseEventHandler;
}) => {
  const { elem, handleSubmit, handleCancelRename } = props;
  return (
    <form className={styles.form} method="post" onSubmit={handleSubmit}>
      <input
        autoFocus
        defaultValue={elem.name}
        id="name"
        name="name"
        onFocus={(e) => e.target.select()}
        placeholder={elem.name}
        required
        style={{ width: `${Math.min(elem.name.length * 10 + 30, 135)}px` }}
        type="text"
      />

      <button title="确认重命名" type="submit">
        <FcCheckmark />
      </button>

      <button onClick={handleCancelRename} title="取消重命名">
        <FcCancel />
      </button>
    </form>
  );
};

const InteractiveRenameComponent  = ({elem}: Readonly<{elem: FolderElementClass}>) => {
  const { cwd, name } = elem;
  const { unSetRenameElem } = useBoundStore(state => state);
  const { mutate } = useSWRConfig();
  const handleSubmit: React.SubmitEventHandler<RenameForm> = (e) => {
    e.preventDefault();
    const newName = e.currentTarget.elements.name.value;
    unSetRenameElem();
    newName !== name &&
      void axios
        .post("/api/rename", {currentPath: cwd, name, newName})
        .then(() => {
          void mutate!(`/api/${cwd}`);
        })
        .catch(() => {
          return;
        });
  };

  const handleCancelRename: React.MouseEventHandler = () => {
    unSetRenameElem();
  };

  return (
    <RenameComponent
      elem={elem}
      handleCancelRename={handleCancelRename}
      handleSubmit={handleSubmit}
    />
  );
};

export default InteractiveRenameComponent;
