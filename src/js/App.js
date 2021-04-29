
function App(props) {
  return(
    <div>
      {props.forEach(post => {
        <h1><a href={props.link}>{post.title}</a></h1>
      })}
    </div>
  )
}

