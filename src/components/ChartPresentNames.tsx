import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authService } from "../services/auth";
import classNames from "classnames";
import styles from "../styles/general.module.scss";

type dataType = {
    name: string;
    absensi: string;
}

export default function ChartPresentNames() {
    const navigate = useNavigate();
    const [data, setData] = useState<dataType[]>([]);
    let { year } = useParams();

    useEffect(() => {
        authService.queryPresentionNames(year).then(
            (recs) => {
                // console.log(recs);
                let result: dataType[] = [];
                for (let i = 0; i < recs.length; i++) {
                    const rec = recs[i];
                    result.push({
                        name: rec.Name,
                        absensi: rec.AttendanceAt
                    });
                }
                setData(result);
                // console.log(result);
            }, (error) => {
                console.log(error);
            }
        )
    }, [year]);


    function onBackClick(e: any) {
        navigate(-1)
    }

    return (
        <Box className={styles.containerWhite} sx={{ marginTop: 2 }} maxWidth={300}>
            <h4 className={styles.center}>Kehadiran Angkatan {year}</h4>
            <TableContainer sx={{ marginTop: 6, maxWidth: 600 }} >
                <Table sx={{ maxWidth: 300, mb: 2, fontSize: 8, margin: "auto" }} size="small" className="performance-table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" className="tinypad">Nama</TableCell>
                            <TableCell align="right" className="tinypad">Tibo Jam</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((rec, i) => (
                            <TableRow key={i}>
                                <TableCell align="left" className="tinypad">{rec.name} </TableCell>
                                <TableCell align="right" className="tinypad">{rec.absensi}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className={classNames(styles.btnContainer, "mt-3")}>
                <button type="button" className={classNames(styles.btn)} onClick={onBackClick}>
                    Kembali
                </button>
            </div>
        </Box>
    )
}