

function Counter() {
  const[state, useState] = Reactish.useState(1)
  return(
    <h1 onClick = {() => setState (count => count + 1)}>
      Count: {state}
    </h1>
  )
}