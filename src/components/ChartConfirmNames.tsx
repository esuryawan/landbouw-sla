import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { authService } from "../services/auth";
import classNames from "classnames";
import styles from "../styles/general.module.scss";

type dataType = {
    id: number;
    year: number;
    name: string;
    classes: string;
    status: number;
}

export default function ChartConfirmNames() {
    const navigate = useNavigate();
    const [data, setData] = useState<dataType[]>([]);
    let { year } = useParams();

    useEffect(() => {
        authService.queryConfirmationNames(year).then(
            (recs) => {
                // console.log(recs);
                let result: dataType[] = [];
                for (let i = 0; i < recs.length; i++) {
                    const rec = recs[i];
                    result.push({
                        id: rec.Id,
                        year: rec.GraduationYear,
                        name: rec.Name,
                        classes: rec.Classes,
                        status: rec.Status
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

    function statusIcon(status: number) {
        switch (status) {
            case 0: return <i className="fa-regular fa-face-rolling-eyes"></i>;
            case 1: return <i className="fa fa-check"></i>;
            case 2: return <i className="fa fa-xmark"></i>;
            case 3: return <i className="fa-regular fa-face-grin-squint-tears"></i>;
            case 4: return <i className="fa-solid fa-user-secret fa-beat"></i>;
            case 5: return <i className="fa-solid fa-motorcycle"></i>;
            case 6: return <i className="fa-solid fa-skull"></i>;
            case 7: return <i className="fa-solid fa-people-pulling"></i>;
            case 8: return <i className="fa-solid fa-mosque"></i>;
            default: return;
        }
    }
    
    return (
        <Box className={styles.containerWhite} sx={{ marginTop: 2 }} maxWidth={300}>
            <h4 className={styles.center}>Konfirmasi Kehadiran Angkatan {year}</h4>
            <TableContainer sx={{ marginTop: 6, maxWidth: 600 }} >
                <Table sx={{ maxWidth: 300, mb: 2, fontSize: 8, margin: "auto" }} size="small" className="performance-table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="left" className="tinypad">Nama</TableCell>
                            <TableCell align="right" className="tinypad">Konfirmasi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((rec, i) => (
                            <TableRow key={i}>
                                <TableCell align="left" className="tinypad">{rec.name} </TableCell>
                                <TableCell align="center" className="tinypad">{statusIcon(rec.status)}</TableCell>
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