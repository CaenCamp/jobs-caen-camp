import { render } from "@testing-library/svelte";

import App from "./app";

describe("app component", () => {
    it("shows proper heading when rendered", () => {
        expect.assertions(1);

        const { getByText } = render(App);

        expect(getByText("Hello Test!")).toBeInTheDocument();
    });
});
