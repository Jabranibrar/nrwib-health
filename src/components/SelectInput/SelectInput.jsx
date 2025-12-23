import React from "react";
import clsx from "clsx";
import { Listbox } from "@headlessui/react";
import Icon from "../Icon/Icon";

import styles from "./selectInput.module.scss";
import { Fragment } from "react";
import {decode} from "html-entities";

export const SelectInput = ({
  otherClasses,
  defaultValue,
  selectedOption,
  rootClasses,
  options,
  onChange,
  placeholder,
  variant = "transparent",
}) => {
  const selectInputClasses = clsx(
    otherClasses,
    "overflow-hidden relative whitespace-nowrap flex justify-between text-left w-full border rounded-lg px-3 py-4",
    variant === "transparent"
      ? "border-white text-white"
      : "bg-white text-black"
  );

  return (
    <div data-testid="select-input" className={clsx(rootClasses, "relative")}>
      <Listbox value={selectedOption} onChange={(e) => onChange(e)}>
        {({ open }) => (
          <>
            <Listbox.Button
              tabIndex="0"
              className={clsx(selectInputClasses)}
              data-testid="select-input"
            >
              <p className={clsx(styles.buttonText, "text-xl")}>
                <span className="!truncate block max-w-[170px]">
                {selectedOption?.label
                  ? decode(selectedOption.label)
                  : decode(defaultValue || placeholder)}
                  </span>
              </p>
              <span
                className={clsx(
                  "transition duration-200 absolute right-2 translate-y-[-50%] top-2/4",
                  open && " rotate-180"
                )}
              >
                <Icon icon="chevron" iconHeight={24} iconWidth={24} />
              </span>
            </Listbox.Button>

            <Listbox.Options
              className={clsx(
                styles.scrollSelectDropdown,
                styles.dropdownStyles,
                " max-h-[350px] overflow-auto absolute z-[5] left-0 w-full bg-white rounded-[10px] list-none"
              )}
            >
              {options?.length > 0 &&
                options.map((option) => (
                  /* Use the `active` state to conditionally style the active option. */
                  /* Use the `selected` state to conditionally style the selected option. */
                  <Listbox.Option
                    key={option.value}
                    value={option}
                    as={Fragment}
                  >
                    {({ selected }) => (
                      <li
                        className={clsx(
                          selected
                            ? "text-brand-blue-light  "
                            : "text-brand-black",
                          "px-6 cursor-pointer py-3 font-normal leading-6 text-base hover:bg-[#F5F6F6] list-none"
                        )}
                      >
                        {decode(option.label)}
                      </li>
                    )}
                  </Listbox.Option>
                ))}
            </Listbox.Options>
          </>
        )}
      </Listbox>
    </div>
  );
};

export default SelectInput;
