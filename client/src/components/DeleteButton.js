import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import produce from "immer";
import { DELETE_POST_MUTATION } from "../util/graphql";
import { DELETE_COMMENT_MUTATION } from "../util/graphql";
import { FETCH_POSTS_QUERY } from "../util/graphql";

import { Icon, Button, Confirm } from "semantic-ui-react";
import MyPopup from "../util/MyPopup";

function DeleteButton({ postId, commentId, callback }) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  //delete a comment or a post?
  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrComment] = useMutation(mutation, {
    update(proxy) {
      setConfirmOpen(false);

      //if deleting a post
      if (!commentId) {
        //remove post from cache (proxy)
        //create new data object with immer produce
        const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
        const deletedPostsArray = produce(data.getPosts, (posts) => {
          posts.splice(
            posts.findIndex((post) => post.id === postId),
            1
          );
        });

        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: deletedPostsArray },
        });
      }
      //callback used to redirect user to home page after delete post on single post view page
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
  });

  return (
    <>
      <MyPopup content={commentId ? "Delete Comment" : "Delete Post"}>
        <Button
          as="div"
          color="red"
          floated="right"
          onClick={() => {
            setConfirmOpen(true);
          }}
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      </MyPopup>
      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
}

export default DeleteButton;
