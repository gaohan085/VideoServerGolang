import axios from "axios";
import React, { useContext } from "react";
import { FcCancel, FcCheckmark } from "react-icons/fc";
import Context from "./file-sys-context.ts";
import styles from "./rename-element.module.scss";
import type { DirElement } from "./types.d.ts";

interface RenameElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
}

interface RenameForm extends HTMLFormElement {
  readonly elements: RenameElements;
}

const RenameComponent: React.FC<{
  readonly elem: DirElement;
  readonly handleSubmit: React.FormEventHandler<RenameForm>;
  readonly handleCancelRename: React.MouseEventHandler;
}> = (props) => {
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

const InteractiveRenameComponent: React.FC<DirElement> = (props) => {
  const { currentPath, name } = props;
  const { setRenameElement, mutateFunc } = useContext(Context);
  const handleSubmit: React.FormEventHandler<RenameForm> = (e) => {
    e.preventDefault();
    const newName = e.currentTarget.elements.name.value;
    setRenameElement!(undefined);
    newName !== name &&
      void axios
        .post("/api/rename", { ...props, newName })
        .then(() => {
          void mutateFunc!(currentPath === "" ? "/api" : `/api/${currentPath}`);
        })
        .catch(() => {
          return;
        });
  };

  const handleCancelRename: React.MouseEventHandler = () => {
    setRenameElement!(undefined);
  };

  return (
    <RenameComponent
      elem={props}
      handleCancelRename={handleCancelRename}
      handleSubmit={handleSubmit}
    />
  );
};

export default InteractiveRenameComponent;