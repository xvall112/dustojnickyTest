import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import Layout from "../components/layout";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const ADD_QUESTION = gql`
  # Increments a back-end counter and gets its resulting value
  mutation addQuestion($question: String!, $answer: String!) {
    addQuestion(question: $question, answer: $answer) {
      question
      answer
    }
  }
`;

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Add = () => {
  const [addQuestion, { data, loading, error }] = useMutation(ADD_QUESTION, {
    onError: () => {
      handleClick("error", "Otazka jiz existuje");
    },
    onCompleted: () => {
      handleClick("success", "Pridano");
    },
  });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [open, setOpen] = React.useState(false);
  const [text, setText] = React.useState("");
  const [severity, setSeverity] = useState("success");

  const handleClick = async (severity, text) => {
    await setText(text);
    await setSeverity(severity);
    await setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  const handleChangeQuestion = (e) => {
    setQuestion(e.target.value);
    console.log(question);
  };

  const handleChangeAnswer = (e) => {
    setAnswer(e.target.value);
    console.log(answer);
  };

  return (
    <Layout>
      <div>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {text}
          </Alert>
        </Snackbar>
        <h1>Přidat otázku</h1>
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
