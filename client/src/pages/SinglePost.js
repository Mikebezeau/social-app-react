import React, { useState, useContext } from "react";
import { AuthContext } from "../context/auth";

import { useQuery, useMutation } from "@apollo/react-hooks";
import { FETCH_POST_QUERY } from "../util/graphql";
import { CREATE_COMMENT_MUTATION } from "../util/graphql";

import {
  Grid,
  Card,
  Icon,
  Label,
  Image,
  Form,
  TextArea,
  Button,
} from "semantic-ui-react";
import moment from "moment";
import LikeButton from "../components/LikeButton";
import DeleteButton from "../components/DeleteButton";

function SinglePost(props) {
  const { user } = useContext(AuthContext);
  const postId = props.match.params.postId;

  const [comment, setComment] = useState("");

  const [createPost] = useMutation(CREATE_COMMENT_MUTATION, {
    update() {
      setComment("");
    },
    variables: {
      postId,
      body: comment,
    },
    onError(error) {
      console.log(error);
    },
  });

  const { data: { getPost } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: {
      postId,
    },
    onError(error) {
      console.log(error);
    },
  });

  //return to home page after user deletes thier post
  function deletePostCallback() {
    props.history.push("/");
  }

  let postMarkup;

  if (!getPost) {
    postMarkup = <h1>Loading post...</h1>;
  } else {
    const {
      id,
      body,
      createdAt,
      username,
      comments,
      likes,
      likeCount,
      commentCount,
    } = getPost;

    postMarkup = (
      <Grid>
        <Grid.Row>
          <Grid.Column width="3">
            <Image
              circular
              floated="right"
              size="medium"
              src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            />
          </Grid.Column>
          <Grid.Column width="9">
            <Card fluid>
              <Card.Content>
                <Card.Header>{username}</Card.Header>
                <Card.Meta>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
              </Card.Content>
              <hr />
              <Card.Content extra>
                <LikeButton user={user} post={{ id, likes, likeCount }} />
                <Button
                  as="div"
                  labelPosition="right"
                  onClick={() => {
                    console.log("Comment...");
                  }}
                >
                  <Button color="blue" basic>
                    <Icon name="comments" />
                  </Button>
                  <Label as="a" basic color="blue" pointing="left">
                    {commentCount}
                  </Label>
                </Button>
                {user && user.username === username && (
                  <DeleteButton postId={id} callback={deletePostCallback} />
                )}
              </Card.Content>
            </Card>
            {user && (
              <Card fluid style={{ padding: 15 }}>
                <Form
                  onSubmit={() => {
                    console.log("comment", comment);
                    createPost();
                  }}
                >
                  <h3>Leave a comment:</h3>
                  <Form.Field>
                    <TextArea
                      onChange={(event) => setComment(event.target.value)}
                      placeholder="Leave a comment!"
                      name="body"
                      value={comment}
                      style={{ marginBottom: 15 }}
                    />
                    <Button type="submit" color="blue">
                      Submit
                    </Button>
                  </Form.Field>
                </Form>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={postId} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>
                    {moment(comment.createdAt).fromNow(true)}
                  </Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

  return postMarkup;
}

export default SinglePost;
