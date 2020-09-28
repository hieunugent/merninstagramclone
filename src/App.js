import React, { useEffect, useState } from "react";

import "./App.css";
import Post from "./Post";
import { db } from "./firebase";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input, Modal } from "@material-ui/core";
import { auth } from "./firebase";
import ImageUpload from "./ImageUpload";
import InstagramEmbed from "react-instagram-embed";
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}
const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function App() {
  const classes = useStyles();
  const [posts, setPosts] = useState([]);
  const [openSignin, setOpenSignIn] = useState(false);
  const [openRegister, setopenRegister]=useState(false)
  const [modalStyle] = useState(getModalStyle);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // useEffect run a action on sepecific condition
  const [user, setUser] = useState(null);

  useEffect(() => {
    // it where the code runn for signin
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
        // if (authUser.displayName) {
        // } else {
        //   return authUser.updateProfile({
        //     displayName: username,
        //   });
        // }
      } else {
        setUser(null);
      }
    });
    return () => {
      // clean up actiond
      unsubscribe();
    };
  }, [user, username]);

  useEffect(() => {
    // it where the code run

    db.collection("posts").orderBy('timestamp','desc').onSnapshot((snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ id: doc.id, post: doc.data() })));
    });
  }, []);
  const signUp = (event) => {
    event.preventDefault();
    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username,
        });
      })
      .catch((error) => alert(error.message));

      setopenRegister(false);
  };
 const signIn=(event)=>{
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password).catch((error)=> alert(error.message))

    setOpenSignIn(false);
 }


  return (
    <div className="app">
      <Modal open={openSignin} onClose={() => setOpenSignIn(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
              />
            </center>

            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signIn}>
              {" "}
              SIGN IN
            </Button>
          </form>
        </div>
      </Modal>
      <Modal open={openRegister} onClose={() => setopenRegister(false)}>
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img
                className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
                alt=""
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" onClick={signUp}>
              {" "}
              SIGN UP
            </Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img
          className="app__headerImage"
          src="https://www.instagram.com/static/images/web/mobile_nav_type_logo-2x.png/1b47f9d0e595.png"
          alt=""
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>logOut</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>Sign In</Button>

            <Button onClick={() => setopenRegister(true)}>Sign Up</Button>
          </div>
        )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {/* Posts */}
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              user={user}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}

          {/* Posts */}
        </div>
        <div className="app__postsRight">
          {/* React instagram embed */}

          <InstagramEmbed
            url="https://www.instagram.com/p/CFmVYmNnUaz/"
            maxWidth={320}
            hideCaption={false}
            containerTagName="div"
            protocol=""
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ) : (
        <h3>You need to login to upload </h3>
      )}
    </div>
  );
}

export default App;
