import { Box, Button, Container, List, ListItem, Typography } from "@mui/material";
import { NextPage } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { movement } from "../src/constants/default-values";
import { Movement } from "../src/models/default-values";

const DailyRoute = dynamic(() => import('../src/components/daily-routes'), { ssr: false })

const Home: NextPage = () => {
  const [st, setST] = useState<Movement>(movement)
  const [refresh, setRefresh] = useState(false)
  const getStatus =  (stat:Movement) => {
    setST((prev) => {
      const newData = prev?{...prev, ...stat}:{...stat}
      return newData
    })
  }

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
          <Box>
            Click <Button>here</Button> to refresh 
          </Box>
            <List>
              { st?.starting && <ListItem>Starting</ListItem>}
              { st?.goingToOffice && <ListItem>Going to the office</ListItem>}
              { st?.goingToLunch && <ListItem>Going for lunch</ListItem>}
              { st?.goingHome && <ListItem>Going back home</ListItem>}
              { st?.completed && <ListItem>Completed</ListItem>}
            </List>
        </Box>
        <DailyRoute getStatus={getStatus} refresh={refresh} />
      </Box>
    </Container>
  );
}

export default Home