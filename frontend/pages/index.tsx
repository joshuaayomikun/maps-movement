import { Box, Container, List, ListItem, Typography } from "@mui/material";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

const DailyROute = dynamic(() => import('../src/components/daily-routes'), { ssr: false })

const Home: NextPage = () => {
  return (
    <Container >
      <Typography variant="h3" component={"h2"} sx={{
        textAlign:"center",
        padding:"20px"
      }}>Popeye's Daily route</Typography>
      <Box sx={{
        height:"800px",
        display: "flex",
        gridGap:"30px",
        justifyContent:"conter",
        margin: "auto",

      }}>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            gridGap:"20px"
          }}>
          <Typography variant={"h4"} component={"h4"}>About the Application</Typography>
          <Typography>
            This Application is an implementation of the assessment from <Link href={"/Javascript_Technical_Assessment.pdf"}>Here</Link>
          </Typography>
          <Typography>
            It conains the following routes:
          </Typography>
            <List>
              <ListItem>Movement from Popeye's house to Popeye's office which is represented in green</ListItem>
              <ListItem>Popeye's route lunch which is represented in red</ListItem>
              <ListItem>Popeye's movement back home</ListItem>
            </List>
        </Box>
        <DailyROute />
      </Box>
    </Container>
  );
}

export default Home