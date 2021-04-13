const Reactish = require("./Reactish")

it("returns object", () => {
  const element = Reactish.createElement()
  expect(typeof element).toBe("function")
})