import axios from "axios";
import React, { useContext } from "react";
import { FcCancel, FcCheckmark } from "react-icons/fc";

import styles from "./rename-element.module.scss";

import { Context, DirElement } from ".";

interface RenameElements extends HTMLFormControlsCollection {
  name: HTMLInputElement;
}

interface RenameForm extends HTMLFormElement {
  readonly elements: RenameElements;
}

const RenameComponent: React.FC<{
  elem: DirElement;
  handleSubmit: React.FormEventHandler<RenameForm>;
  handleCancelRename: React.MouseEventHandler;
}> = (props) => {
  const { elem, handleSubmit, handleCancelRename } = props;
  return (
    <form method="post" onSubmit={handleSubmit} className={styles.form}>
      <input
        type="text"
        name="name"
        id="name"
        placeholder={elem.name}
        defaultValue={elem.name}
        style={{ width: `${Math.min(elem.name.length * 10 + 30, 135)}px` }}
        required
        autoFocus
        onFocus={(e) => e.target.select()}
      />
      <button type="submit" title="确认重命名">
        <FcCheckmark />
      </button>
      <button onClick={handleCancelRename} title="取消重命名">
        <FcCancel />
      </button>
    </form>
  );
};

export const InteractiveRenameComponent: React.FC<DirElement> = (props) => {
  const { name } = props;
  const { setRenameElement, mutateFunc } = useContext(Context);
  const handleSubmit: React.FormEventHandler<RenameForm> = (e) => {
    e.preventDefault();
    const newName = e.currentTarget.elements.name.value;
    setRenameElement!(undefined);
    newName !== name &&
      void axios
        .post("/api/rename", { ...props, newName })
        .then(() => {
          void mutateFunc!();
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
      handleSubmit={handleSubmit}
      elem={props}
      handleCancelRename={handleCancelRename}
    />
  );
};
