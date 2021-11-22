import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Layout from "../components/layout";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

const ADD_QUESTION = gql`
  # Increments a back-end counter and gets its resulting value
  mutation addQuestion($question: String!, $answer: String!) {
    addQuestion(question: $question, answer: $answer) {
      question
      answer
    }
  }
`;

const Add = () => {
  const [addQuestion, { data, loading, error }] = useMutation(ADD_QUESTION);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleChangeQuestion = (e) => {
    setQuestion(e.target.value);
    console.log(question);
  };

  const handleChangeAnswer = (e) => {
    setAnswer(e.target.value);
    console.log(answer);
  };
  if (error) return `Submission error! ${error.message}`;
  return (
    <Layout>
      <div>
        <h1>Pridani otazek</h1>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setQuestion("");
          setAnswer("");
          addQuestion({ variables: { question: question, answer: answer } });
        }}
      >
        <Grid container direction="column" spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="outlined-textarea"
              label="Otázka"
              placeholder="Otázka"
              multiline
              fullWidth
              value={question}
              onChange={handleChangeQuestion}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="outlined-textarea"
              label="Odpověď"
              placeholder="Odpověď"
              multiline
              fullWidth
              value={answer}
              onChange={handleChangeAnswer}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Pridavam..." : "Přidat"}
            </Button>
          </Grid>
        </Grid>
      </form>
    </Layout>
  );
};

export default Add;
