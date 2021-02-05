import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/react-hooks";
import { LIKE_POST_MUTATION } from "../util/graphql";

import { Icon, Label, Button } from "semantic-ui-react";
import MyPopup from "../util/MyPopup";

function LikeButton({ post: { id, likes, likeCount } }) {
  const { user } = useContext(AuthContext);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (
      user &&
      likes &&
      likes.find((like) => like.username === user.username)
    ) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables: {
      postId: id,
    },
  });

  const likeButton = user ? (
    liked ? (
      <Button color="blue">
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="blue" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button color="blue" basic as={Link} to="/login">
      <Icon name="heart" />
    </Button>
  );

  return (
    <MyPopup content={user && liked ? "Unlike post" : "Like post"}>
      <Button as="div" labelPosition="right" onClick={likePost}>
        {likeButton}
        <Label as="a" basic color="blue" pointing="left">
          {likeCount}
        </Label>
      </Button>
    </MyPopup>
  );
}

export default LikeButton;
