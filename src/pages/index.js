import * as React from "react";
import { debounce } from "debounce";
import { useQuery, gql } from "@apollo/client";
import { Alert, Skeleton, Stack } from "@mui/material";
import AlertTitle from "@mui/material/AlertTitle";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import Layout from "../components/layout";
// styles

// data
/* const GET_QUESTIONS = gql`
  query GetCustomers {
    getQuestion {
      question
      answer
    }
  }
`; */

const FIND_QUESTION = gql`
  query findQuestion($input: String!) {
    findQuestion(input: $input) {
      question
      answer
    }
  }
`;
const IndexPage = () => {
  const [search, setSearch] = React.useState("");

  const handleChange = debounce((event) => {
    setSearch(event.target.value);
  }, 500);

  const handleClear = () => {
    setSearch("");
  };

  const { data, loading, error } = useQuery(FIND_QUESTION, {
    variables: { input: search.toLowerCase() },
    onCompleted: () => {
      console.log("search");
    },
  });
  console.log(data);
  if (error) return <p>Error :{error.message} </p>;

  return (
    <Layout>
      <main>
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={3}
        >
          <h1>Vyhledat</h1>
          <Chip label={!loading && data.findQuestion.length} />
        </Stack>
        <FormControl fullWidth sx={{ m: 1 }}>
          <InputLabel htmlFor="outlined-adornment-amount">Vyhledat</InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            onChange={handleChange}
            startAdornment={
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            }
            /* endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="delete"
                  onClick={() => {
                    handleClear();
                  }}
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            } */
            label="Amount"
          />
        </FormControl>
        {loading ? (
          <Stack spacing={2}>
            <Skeleton variant="rectangular" width={"100%"} height={50} />
            <Skeleton variant="rectangular" width={"100%"} height={50} />
            <Skeleton variant="rectangular" width={"100%"} height={50} />
          </Stack>
        ) : (
          data.findQuestion.map((question, index) => {
            return (
              <Alert severity="info" sx={{ m: 2 }} key={index}>
                <AlertTitle>{question.question}</AlertTitle>
                {question.answer}
              </Alert>
            );
          })
        )}
      </main>
    </Layout>
  );
};

export default IndexPage;
