// @ts-check

import { classNames, createElement } from "../../utils/helpers.js";

/**
 * @param {Object} props
 * @param {string} props.content
 * @param {"text" | "primary"} [props.color]
 * @param {"button" | "submit"} [props.type]
 * @returns {HTMLButtonElement}
 */
export const createButtonComponent = (props = {
  content: "",
  color: "text",
  type: "button"
}) => createElement("button", {
  type: props.type ?? "button",
  class: classNames(
    "border hover:font-medium px-4 py-2 hover:scale-105 transition-[transform,background]",
    props.color === "text" && "border-[#4C4F69] text-[#4C4F69] hover:bg-[#4C4F69] hover:text-[#EFF1F5]",
    props.color === "primary" && "border-[#7287fd] text-[#7287fd] hover:bg-[#7287fd] hover:text-[#EFF1F5]"
  )
}, props.content ?? "")
