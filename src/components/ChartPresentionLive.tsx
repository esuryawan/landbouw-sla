import { useEffect, useState } from "react";
import { authService } from "../services/auth";
import { UserSLA } from "ababil-landbouw";
import { WebSocketMessage } from "ababil-websocket";
import { Box, Button, Card, CardActions, CardContent, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material";
import styles from "./ChartPresentionLive.module.scss";
export default function ChartPresentionLive() {

   const [total, setTotal] = useState(0);
   const [websock, setWebsock] = useState<WebSocket | undefined>(undefined);
   let topten: any[] = [];
   let lastcoming = [];
   const user: UserSLA = authService.getLogin() as UserSLA;

   useEffect(() => {
      let token = "";
      if (user && user.AccessToken)
         token = user.AccessToken;
      const ws: WebSocket = new WebSocket("ws://localhost:7000/ws/presention");
      ws.onopen = (event) => {
         if (websock) websock.close();
         console.log("ws.onopen");
         let req: WebSocketMessage = { event: "subscribe", data: token }
         ws.send(JSON.stringify(req));
         setWebsock(ws);
      };

      ws.onmessage = function (event) {
         console.log("ws.onmessage", event.data);
         const msg: WebSocketMessage = JSON.parse(event.data);
         console.log("ws.onmessage", msg);
         try {
            if ((msg.event === "refresh")) {
               setTotal(msg.data.total);
               topten = [];
               lastcoming = [];
               for (let i = 0; i < msg.data.top10angkatan.length; i++) {
                  const element = msg.data.top10angkatan[i];
                  topten.push(element)
               }
               for (let i = 0; i < msg.data.latest.length; i++) {
                  const element = msg.data.latest[i];
                  lastcoming.push(element)
               }
            }
         } catch (error) {
            console.log(error);
         }
      };

      ws.onclose = function (event) {
         console.log("ws.onclose", event);
         if (event.wasClean) {
            console.log(`ws.onclose, Close cleanly, code=${event.code} reason=${event.reason}`);
         } else {
            console.log(`ws.onclose, Connection died, code=${event.code} reason=${event.reason}`);
            // alert("WebSocket Connection died");
         }
      }

      ws.onerror = function (event) {
         console.log("ws.onerror", event);
         console.log("WebSocket Error", event);
         // alert("WebSocket Error");
      }

   }, []);

   const YourCard = () => {
      const classes = {};
      return (
         <Card
            //  className={classes.root}
            variant="outlined"
            style={{ height: "100%" }}
         >
            <CardContent>
               <Typography
                  //   className={classes.title}
                  color="textSecondary"
                  gutterBottom
               >
                  Customer Profile
               </Typography>
               <Typography variant="h5" component="h2">
                  Sarah Doria
               </Typography>
               <Typography
                  // className={classes.pos} 
                  color="textSecondary">
                  Position
               </Typography>
               <Typography variant="body2" component="p">
                  Company
                  <br />
                  {'"a benevolent smile"'}
               </Typography>
            </CardContent>

         </Card>
      );
   };

   let tableMaxHeight = window.innerHeight - 250;
   return (<Container>
      <Box>
         <Typography>Test</Typography>
      </Box>
      <Grid
         container
         //   direction="row"
         //   justify="center"
         //   alignItems="stretch"
         className={styles.transparentBG}
      >
         <Grid item xs={12}>
            <Paper>xs=12</Paper>
         </Grid>
         <Grid item xs={9}>
            <Grid style={{ height: "100%" }}><YourCard /></Grid>
         </Grid>
         <Grid item xs={3}>
            <Grid container>
               <Grid item xs={12} className={styles.transparentBG}><Paper className={styles.total}><span className={styles.totalText}>{total}</span><br /><span>kehadiran</span></Paper></Grid>
               <Grid item xs={12}>
                  <TableContainer sx={{ maxHeight: tableMaxHeight, marginTop: 1, maxWidth: 300 }} >
                     <Table stickyHeader sx={{ maxWidth: 200, mb: 2, fontSize: 8, margin: "auto" }} size="small" className="performance-table">
                        <thead className={styles.stickyHeader}>
                           <TableRow>
                              <TableCell align="left">Angkatan</TableCell>
                              <TableCell align="right">Hadir</TableCell>
                           </TableRow>
                        </thead>
                        <TableBody>
                           {topten.map((rec, i) => (
                              <TableRow key={i}>
                                 <TableCell align="left">{rec.Angkatan}</TableCell>
                                 <TableCell align="right">{rec.Hadir}</TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  </TableContainer>
               </Grid>
               <Grid item xs={12}><YourCard /></Grid>
            </Grid>
         </Grid>
         <Grid item xs={12}>
            {/* <ScrollText>
               this'a a very long text...
            </ScrollText> */}
         </Grid>
      </Grid>
   </Container>)
}