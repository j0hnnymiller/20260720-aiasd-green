import { Provider } from "react-redux";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import {
  calculatorReducer,
  seedEvaluatedResult,
} from "../features/calculator/slice";
import { App } from "./App";

const renderApp = () => {
  const store = configureStore({ reducer: { calculator: calculatorReducer } });

  const user = userEvent.setup();

  render(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  return { user, store };
};

describe("App number entry behavior", () => {
  it("updates display with pointer input", async () => {
    const { user } = renderApp();

    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "3" }));

    expect(screen.getByLabelText("Display")).toHaveTextContent("123");
  });

  it("applies deterministic leading-zero behavior", async () => {
    const { user } = renderApp();

    await user.click(screen.getByRole("button", { name: "0" }));
    await user.click(screen.getByRole("button", { name: "0" }));
    await user.click(screen.getByRole("button", { name: "7" }));

    expect(screen.getByLabelText("Display")).toHaveTextContent("7");
  });

  it("starts fresh entry after evaluated result when typing a digit", async () => {
    const { store, user } = renderApp();

    store.dispatch(seedEvaluatedResult("5"));
    await user.click(screen.getByRole("button", { name: "4" }));

    expect(screen.getByLabelText("Display")).toHaveTextContent("4");
  });

  it("computes 2 + 3 = 5", async () => {
    const { user } = renderApp();

    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "=" }));

    expect(screen.getByLabelText("Display")).toHaveTextContent("5");
  });

  it("computes 9 - 12 = -3", async () => {
    const { user } = renderApp();

    await user.click(screen.getByRole("button", { name: "9" }));
    await user.click(screen.getByRole("button", { name: "-" }));
    await user.click(screen.getByRole("button", { name: "1" }));
    await user.click(screen.getByRole("button", { name: "2" }));
    await user.click(screen.getByRole("button", { name: "=" }));

    expect(screen.getByLabelText("Display")).toHaveTextContent("-3");
  });

  it("computes 7 x 6 = 42", async () => {
    const { user } = renderApp();

    await user.click(screen.getByRole("button", { name: "7" }));
    await user.click(screen.getByRole("button", { name: "x" }));
    await user.click(screen.getByRole("button", { name: "6" }));
    await user.click(screen.getByRole("button", { name: "=" }));

    expect(screen.getByLabelText("Display")).toHaveTextContent("42");
  });

  it("computes 8 / 4 = 2", async () => {
    const { user } = renderApp();

    await user.click(screen.getByRole("button", { name: "8" }));
    await user.click(screen.getByRole("button", { name: "/" }));
    await user.click(screen.getByRole("button", { name: "4" }));
    await user.click(screen.getByRole("button", { name: "=" }));

    expect(screen.getByLabelText("Display")).toHaveTextContent("2");
  });

  it("replaces operator when pressed repeatedly before next operand", async () => {
    const { user } = renderApp();

    await user.click(screen.getByRole("button", { name: "9" }));
    await user.click(screen.getByRole("button", { name: "+" }));
    await user.click(screen.getByRole("button", { name: "-" }));
    await user.click(screen.getByRole("button", { name: "x" }));
    await user.click(screen.getByRole("button", { name: "3" }));
    await user.click(screen.getByRole("button", { name: "=" }));

    expect(screen.getByLabelText("Display")).toHaveTextContent("27");
  });
});

describe("App keyboard interaction behavior", () => {
  it("enters digits via keyboard", async () => {
    const { user } = renderApp();

    await user.keyboard("123");

    expect(screen.getByLabelText("Display")).toHaveTextContent("123");
  });

  it("computes 2 + 3 = 5 via keyboard using Enter", async () => {
    const { user } = renderApp();

    await user.keyboard("2+3{Enter}");

    expect(screen.getByLabelText("Display")).toHaveTextContent("5");
  });

  it("computes 2 + 3 = 5 via keyboard using =", async () => {
    const { user } = renderApp();

    await user.keyboard("2+3=");

    expect(screen.getByLabelText("Display")).toHaveTextContent("5");
  });

  it("maps * key to multiplication operator", async () => {
    const { user } = renderApp();

    await user.keyboard("7*6{Enter}");

    expect(screen.getByLabelText("Display")).toHaveTextContent("42");
  });

  it("maps / key to division operator", async () => {
    const { user } = renderApp();

    await user.keyboard("8/4{Enter}");

    expect(screen.getByLabelText("Display")).toHaveTextContent("2");
  });

  it("keyboard flow matches button flow for subtraction", async () => {
    const { user } = renderApp();

    await user.keyboard("9-12{Enter}");

    expect(screen.getByLabelText("Display")).toHaveTextContent("-3");
  });
});
