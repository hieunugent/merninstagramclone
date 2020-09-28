import { Avatar } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import "./Post.css";
import firebase from "firebase";
function Post({ user, postId, username, caption, imageUrl }) {
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  useEffect(() => {
    let unsubscribe;
    if (postId) {
      unsubscribe = db
        .collection("posts")
        .doc(postId)
        .collection("comments")
        .orderBy("timestamp", "desc")
        .onSnapshot((snapshot) => {
          setComments(snapshot.docs.map((doc) => doc.data()));
        });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = (event) => {
    event.preventDefault();

    db.collection("posts").doc(postId).collection("comments").add({
      text: comment,
      username: user.displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    });
    setComment("");
  };
  return (
    <div className="post">
      <div className="post__header">
        <Avatar
          className="post__avatar"
          alt={username}
          src="/static/images/1.jpg"
        />

        <h3> {username}</h3>
      </div>
      {/* Header -> avatar + username */}
      <img
        className="post__image"
        // src="https://media.wired.com/photos/5eb4b22ec8897781bab6e220/master/w_1600%2Cc_limit/Bakchannel-Life-Worth-Columns_3-2.jpg"
        src={imageUrl}
        alt=""
      />
      {/* image */}
      <h4 className="post__text">
        <strong>{username}</strong> {caption}
      </h4>
      {/* username _ caption */}
      {/* posts comments */}
      <div className="post__comments">
        {comments.map((comment) => (
          <p>
            <b>{comment.username}</b> {comment.text}
          </p>
        ))}
      </div>

     { user && (
      <form className="post__commentBox">
        <input
          className="post__input"
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          disabled={!comment}
          className="post__button"
          type="submit"
          onClick={postComment}
        >
          Post
        </button>
      </form>
      )}
    </div>
  );
}

export default Post;
