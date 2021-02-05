import { ValuesOfCorrectTypeRule } from "graphql";
import React from "react";
import { Form, Button, TextArea } from "semantic-ui-react";

import { useForm } from "../util/hooks";
import { useMutation } from "@apollo/react-hooks";
import { FETCH_POSTS_QUERY } from "../util/graphql";
import { CREATE_POST_MUTATION } from "../util/graphql";

function PostForm() {
  const { onChange, values, onSubmit } = useForm(createPostCallback, {
    body: "",
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });

      //DID NOT WORK THIS WAY
      //data.getPosts = [result.data.createPost, ...data.getPosts];
      //proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });

      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: {
          //WORKS HERE: immutability issue
          getPosts: [result.data.createPost, ...data.getPosts],
        },
      });
      values.body = "";
    },
    onError(error) {
      console.log(error.toString());
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h1>Create a post:</h1>
        <Form.Field>
          <TextArea
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={error ? true : false}
            style={{ marginBottom: 15 }}
          />
          <Button type="submit" color="blue">
            Submit
          </Button>
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message">
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default PostForm;
