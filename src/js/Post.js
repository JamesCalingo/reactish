function Post(props) {
  return (
    <div className="post">
      <h1 className="post-title">{props.title}</h1>
      <h2 className="post-date">{props.date}</h2>
      <div className="post-body">{props.body}</div>
    </div>
  );
}
