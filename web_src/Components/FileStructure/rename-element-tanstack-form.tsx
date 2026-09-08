import { useForm } from "@tanstack/react-form";
import axios from "axios";
import React from "react";
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";
import useBoundStore from "../../lib/zustand-store.ts";
import Spinner from "../spinner.tsx";
import type { DirElement } from "../types.d.ts";
import styles from "./rename-element.module.scss";

const InteractiveTsRenameComponent = (props: DirElement) => {
  const { currentPath, name } = props;
  const { setRenameElem, unSetRenameElem, mutate } = useBoundStore(
    (state) => state,
  );

  const form = useForm({
    defaultValues: {
      name: name,
    },
    onSubmit: async ({ value }) => {
      const newName = value.name;
      unSetRenameElem();
      newName !== name &&
        void axios
          .post("/api/rename", { ...props, newName })
          .then(() => {
            void mutate!(`/api/${currentPath}`);
          })
          .catch(() => {
            return;
          });
    },
  });

  const handleCancelRename: React.MouseEventHandler = () => {
    unSetRenameElem();
  };

  return (
    <form
      className={styles.form}
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <form.Field
        name="name"
        children={(field) => {
          return (
            <>
              <label htmlFor={field.name} />
              <input
                autoFocus
                id={field.name}
                name={field.name}
                placeholder={name}
                defaultValue={form.state.values.name}
                required
                style={{ width: `${Math.min(name.length * 10 + 30, 135)}px` }}
                type="text"
                onChange={(e) => field.handleChange(e.target.value)}
                onFocus={(e) => e.target.select()}
              />
            </>
          );
        }}
      />
      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <button
            title="确认重命名"
            type="submit"
            disabled={!canSubmit}
            className="check"
          >
            {!isSubmitting ? <IoCheckmarkSharp /> : <Spinner fontSize={19} />}
          </button>
        )}
      />
      <button onClick={handleCancelRename} title="取消重命名" className="close">
        <IoCloseSharp />
      </button>
    </form>
  );
};

export default InteractiveTsRenameComponent;
